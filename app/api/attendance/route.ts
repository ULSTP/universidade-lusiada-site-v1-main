import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Schema de validação para frequência
const attendanceSchema = z.object({
  enrollmentId: z.string().min(1, 'ID da matrícula é obrigatório'),
  subjectId: z.string().min(1, 'ID da disciplina é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED']),
  description: z.string().optional(),
})

// GET /api/attendance - Listar frequência
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
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
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
    
    if (status) {
      where.status = status
    }
    
    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    // Buscar frequência com paginação
    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
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
          { date: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.attendance.count({ where })
    ])

    return NextResponse.json({
      attendance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('[ATTENDANCE_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/attendance - Criar registro de frequência
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
    const validatedData = attendanceSchema.parse(body)

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

    // Verificar se o professor tem permissão para lançar frequência nesta disciplina
    if (session.user.role === 'TEACHER' && subject.teacher?.user.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado para lançar frequência nesta disciplina' },
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

    // Verificar se já existe um registro de frequência para esta data, matrícula e disciplina
    const attendanceDate = new Date(validatedData.date)
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        enrollmentId: validatedData.enrollmentId,
        subjectId: validatedData.subjectId,
        date: {
          gte: new Date(attendanceDate.getFullYear(), attendanceDate.getMonth(), attendanceDate.getDate()),
          lt: new Date(attendanceDate.getFullYear(), attendanceDate.getMonth(), attendanceDate.getDate() + 1)
        }
      }
    })

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Já existe um registro de frequência para esta data' },
        { status: 400 }
      )
    }

    // Criar registro de frequência
    const attendance = await prisma.attendance.create({
      data: {
        enrollmentId: validatedData.enrollmentId,
        subjectId: validatedData.subjectId,
        date: attendanceDate,
        status: validatedData.status,
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

    return NextResponse.json(attendance, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[ATTENDANCE_POST]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 