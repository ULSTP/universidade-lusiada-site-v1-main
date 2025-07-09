import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Schema de validação para disciplina
const subjectSchema = z.object({
  code: z.string().min(3, 'Código deve ter pelo menos 3 caracteres'),
  name: z.string().min(5, 'Nome deve ter pelo menos 5 caracteres'),
  description: z.string().optional(),
  credits: z.number().min(1, 'Créditos deve ser pelo menos 1'),
  semester: z.number().min(1, 'Semestre deve ser pelo menos 1'),
  courseId: z.string().min(1, 'ID do curso é obrigatório'),
  teacherId: z.string().optional(),
  workload: z.number().min(1, 'Carga horária deve ser pelo menos 1'),
  prerequisites: z.array(z.string()).optional(),
})

// GET /api/subjects - Listar disciplinas
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
    const courseId = searchParams.get('courseId')
    const teacherId = searchParams.get('teacherId')
    const semester = searchParams.get('semester')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (courseId) {
      where.courseId = courseId
    }
    
    if (teacherId) {
      where.teacherId = teacherId
    }
    
    if (semester) {
      where.semester = parseInt(semester)
    }
    
    if (status) {
      where.status = status
    }

    // Buscar disciplinas com paginação
    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
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
          enrollments: {
            select: {
              id: true,
              student: {
                select: {
                  id: true,
                  user: {
                    select: {
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              enrollments: true,
              grades: true
            }
          }
        },
        orderBy: [
          { semester: 'asc' },
          { name: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.subject.count({ where })
    ])

    return NextResponse.json({
      subjects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('[SUBJECTS_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/subjects - Criar disciplina
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
    const validatedData = subjectSchema.parse(body)

    // Verificar se o código da disciplina já existe
    const existingSubject = await prisma.subject.findUnique({
      where: { code: validatedData.code }
    })

    if (existingSubject) {
      return NextResponse.json(
        { error: 'Código da disciplina já existe' },
        { status: 400 }
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

    // Verificar se os pré-requisitos existem (se fornecidos)
    if (validatedData.prerequisites && validatedData.prerequisites.length > 0) {
      const prerequisites = await prisma.subject.findMany({
        where: {
          id: {
            in: validatedData.prerequisites
          }
        }
      })

      if (prerequisites.length !== validatedData.prerequisites.length) {
        return NextResponse.json(
          { error: 'Um ou mais pré-requisitos não encontrados' },
          { status: 404 }
        )
      }
    }

    // Criar disciplina
    const subject = await prisma.subject.create({
      data: {
        code: validatedData.code,
        name: validatedData.name,
        description: validatedData.description,
        credits: validatedData.credits,
        semester: validatedData.semester,
        courseId: validatedData.courseId,
        teacherId: validatedData.teacherId,
        workload: validatedData.workload,
        prerequisites: validatedData.prerequisites || [],
        currentStudents: 0
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
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

    return NextResponse.json(subject, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[SUBJECTS_POST]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 