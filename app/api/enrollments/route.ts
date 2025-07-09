import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Schema de validação para matrícula
const enrollmentSchema = z.object({
  studentId: z.string().min(1, 'ID do estudante é obrigatório'),
  courseId: z.string().min(1, 'ID do curso é obrigatório'),
  academicYear: z.string().min(4, 'Ano acadêmico deve ter pelo menos 4 caracteres'),
  semester: z.number().min(1).max(2, 'Semestre deve ser 1 ou 2'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'GRADUATED', 'DROPPED']).optional(),
})

// GET /api/enrollments - Listar matrículas
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário está autenticado
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const courseId = searchParams.get('courseId')
    const status = searchParams.get('status')
    const academicYear = searchParams.get('academicYear')
    const semester = searchParams.get('semester')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (studentId) {
      where.studentId = studentId
    }
    
    if (courseId) {
      where.courseId = courseId
    }
    
    if (status) {
      where.status = status
    }
    
    if (academicYear) {
      where.academicYear = academicYear
    }
    
    if (semester) {
      where.semester = parseInt(semester)
    }

    // Buscar matrículas com paginação
    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          course: {
            select: {
              id: true,
              name: true,
              code: true,
              level: true
            }
          },
          grades: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true
                }
              }
            },
            orderBy: {
              semester: 'asc'
            }
          },
          attendance: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true
                }
              }
            },
            orderBy: {
              date: 'desc'
            }
          },
          _count: {
            select: {
              grades: true,
              attendance: true
            }
          }
        },
        orderBy: [
          { academicYear: 'desc' },
          { semester: 'desc' },
          { enrollmentDate: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.enrollment.count({ where })
    ])

    return NextResponse.json({
      enrollments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('[ENROLLMENTS_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/enrollments - Criar matrícula
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário é admin ou estudante (para auto-matrícula)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = enrollmentSchema.parse(body)

    // Verificar se o estudante existe
    const student = await prisma.student.findUnique({
      where: { id: validatedData.studentId },
      include: {
        user: {
          select: {
            id: true,
            role: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o curso existe
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o curso está ativo
    if (course.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Curso não está ativo para matrículas' },
        { status: 400 }
      )
    }

    // Verificar se há vagas disponíveis
    if (course.maxStudents && course.currentStudents >= course.maxStudents) {
      return NextResponse.json(
        { error: 'Curso não possui vagas disponíveis' },
        { status: 400 }
      )
    }

    // Verificar se já existe uma matrícula ativa para este estudante neste curso
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: validatedData.studentId,
        courseId: validatedData.courseId,
        status: {
          in: ['ACTIVE', 'SUSPENDED']
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Estudante já possui matrícula ativa neste curso' },
        { status: 400 }
      )
    }

    // Verificar permissões
    const isAdmin = session.user.role === 'ADMIN'
    const isSelfEnrollment = session.user.id === student.user.id

    if (!isAdmin && !isSelfEnrollment) {
      return NextResponse.json(
        { error: 'Não autorizado para matricular este estudante' },
        { status: 401 }
      )
    }

    // Criar matrícula
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: validatedData.studentId,
        courseId: validatedData.courseId,
        academicYear: validatedData.academicYear,
        semester: validatedData.semester,
        status: validatedData.status || 'ACTIVE',
        enrollmentDate: new Date()
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        course: {
          select: {
            id: true,
            name: true,
            code: true,
            level: true
          }
        }
      }
    })

    // Atualizar contador de estudantes no curso
    await prisma.course.update({
      where: { id: validatedData.courseId },
      data: {
        currentStudents: {
          increment: 1
        }
      }
    })

    return NextResponse.json(enrollment, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[ENROLLMENTS_POST]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 