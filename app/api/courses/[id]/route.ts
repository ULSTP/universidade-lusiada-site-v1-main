import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Schema de validação para atualização de curso
const updateCourseSchema = z.object({
  name: z.string().min(5, 'Nome deve ter pelo menos 5 caracteres').optional(),
  description: z.string().optional(),
  credits: z.number().min(1, 'Créditos deve ser pelo menos 1').optional(),
  duration: z.number().min(1, 'Duração deve ser pelo menos 1 semestre').optional(),
  level: z.enum(['BACHELOR', 'MASTER', 'DOCTORATE', 'CERTIFICATE']).optional(),
  maxStudents: z.number().optional(),
  teacherId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
})

// GET /api/courses/[id] - Obter curso específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário está autenticado
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
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
        },
        subjects: {
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
          },
          orderBy: {
            semester: 'asc'
          }
        },
        enrollments: {
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
            }
          },
          orderBy: {
            enrollmentDate: 'desc'
          }
        },
        _count: {
          select: {
            enrollments: true,
            subjects: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)

  } catch (error) {
    console.error('[COURSE_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/courses/[id] - Atualizar curso
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = updateCourseSchema.parse(body)

    // Verificar se o curso existe
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id }
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o professor existe (se fornecido)
    if (validatedData.teacherId) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: validatedData.teacherId }
      })

      if (!teacher) {
        return NextResponse.json(
          { error: 'Professor não encontrado' },
          { status: 404 }
        )
      }
    }

    // Atualizar curso
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: validatedData,
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
    })

    return NextResponse.json(updatedCourse)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[COURSE_PUT]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id] - Deletar curso
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário é admin
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o curso existe
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            subjects: true
          }
        }
      }
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há matrículas ativas
    if (existingCourse._count.enrollments > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar um curso com matrículas ativas' },
        { status: 400 }
      )
    }

    // Verificar se há disciplinas
    if (existingCourse._count.subjects > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar um curso com disciplinas cadastradas' },
        { status: 400 }
      )
    }

    // Deletar curso
    await prisma.course.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Curso deletado com sucesso' },
      { status: 200 }
    )

  } catch (error) {
    console.error('[COURSE_DELETE]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 