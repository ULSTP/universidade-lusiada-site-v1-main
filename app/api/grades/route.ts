import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Schema de validação para nota
const gradeSchema = z.object({
  enrollmentId: z.string().min(1, 'ID da matrícula é obrigatório'),
  subjectId: z.string().min(1, 'ID da disciplina é obrigatório'),
  grade: z.number().min(0).max(20, 'Nota deve estar entre 0 e 20'),
  semester: z.number().min(1).max(2, 'Semestre deve ser 1 ou 2'),
  academicYear: z.string().min(4, 'Ano acadêmico deve ter pelo menos 4 caracteres'),
  type: z.enum(['EXAM', 'TEST', 'ASSIGNMENT', 'FINAL']),
  description: z.string().optional(),
})

// GET /api/grades - Listar notas
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
    const enrollmentId = searchParams.get('enrollmentId')
    const subjectId = searchParams.get('subjectId')
    const studentId = searchParams.get('studentId')
    const teacherId = searchParams.get('teacherId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (enrollmentId) {
      where.enrollmentId = enrollmentId
    }
    
    if (subjectId) {
      where.subjectId = subjectId
    }
    
    if (studentId) {
      where.enrollment = {
        studentId: studentId
      }
    }
    
    if (teacherId) {
      where.subject = {
        teacherId: teacherId
      }
    }
    
    if (semester) {
      where.semester = parseInt(semester)
    }
    
    if (academicYear) {
      where.academicYear = academicYear
    }
    
    if (type) {
      where.type = type
    }

    // Buscar notas com paginação
    const [grades, total] = await Promise.all([
      prisma.grade.findMany({
        where,
        include: {
          enrollment: {
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
                  code: true
                }
              }
            }
          },
          subject: {
            include: {
              teacher: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: [
          { academicYear: 'desc' },
          { semester: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.grade.count({ where })
    ])

    return NextResponse.json({
      grades,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('[GRADES_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/grades - Criar nota
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário é admin ou professor
    if (!session?.user?.id || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = gradeSchema.parse(body)

    // Verificar se a matrícula existe
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: validatedData.enrollmentId },
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
            code: true
          }
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Matrícula não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se a disciplina existe
    const subject = await prisma.subject.findUnique({
      where: { id: validatedData.subjectId },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Disciplina não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o professor tem permissão para lançar notas nesta disciplina
    if (session.user.role === 'TEACHER' && subject.teacher?.user.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado para lançar notas nesta disciplina' },
        { status: 401 }
      )
    }

    // Verificar se a disciplina pertence ao curso da matrícula
    if (subject.courseId !== enrollment.courseId) {
      return NextResponse.json(
        { error: 'Disciplina não pertence ao curso da matrícula' },
        { status: 400 }
      )
    }

    // Verificar se já existe uma nota do mesmo tipo para esta matrícula e disciplina
    const existingGrade = await prisma.grade.findFirst({
      where: {
        enrollmentId: validatedData.enrollmentId,
        subjectId: validatedData.subjectId,
        type: validatedData.type,
        semester: validatedData.semester,
        academicYear: validatedData.academicYear
      }
    })

    if (existingGrade) {
      return NextResponse.json(
        { error: 'Já existe uma nota deste tipo para esta disciplina' },
        { status: 400 }
      )
    }

    // Criar nota
    const grade = await prisma.grade.create({
      data: {
        enrollmentId: validatedData.enrollmentId,
        subjectId: validatedData.subjectId,
        grade: validatedData.grade,
        semester: validatedData.semester,
        academicYear: validatedData.academicYear,
        type: validatedData.type,
        description: validatedData.description,
        createdAt: new Date()
      },
      include: {
        enrollment: {
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
                code: true
              }
            }
          }
        },
        subject: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json(grade, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[GRADES_POST]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 