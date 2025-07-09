import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Schema de validação para curso
const courseSchema = z.object({
  code: z.string().min(3, 'Código deve ter pelo menos 3 caracteres'),
  name: z.string().min(5, 'Nome deve ter pelo menos 5 caracteres'),
  description: z.string().optional(),
  credits: z.number().min(1, 'Créditos deve ser pelo menos 1'),
  duration: z.number().min(1, 'Duração deve ser pelo menos 1 semestre'),
  level: z.enum(['BACHELOR', 'MASTER', 'DOCTORATE', 'CERTIFICATE']),
  maxStudents: z.number().optional(),
  teacherId: z.string().optional(),
})

// GET /api/courses - Listar cursos
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
    const status = searchParams.get('status')
    const level = searchParams.get('level')
    const teacherId = searchParams.get('teacherId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (level) {
      where.level = level
    }
    
    if (teacherId) {
      where.teacherId = teacherId
    }

    // Buscar cursos com paginação
    const [courses, total] = await Promise.all([
      prisma.curso.findMany({
        where,
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
            select: {
              id: true,
              name: true,
              credits: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              subjects: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.curso.count({ where })
    ])

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('[COURSES_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Criar curso
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário é admin ou professor
    if (!session?.user?.id || !['ADMIN', 'PROFESSOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = courseSchema.parse(body)

    // Verificar se o código do curso já existe
    const existingCourse = await prisma.curso.findUnique({
      where: { codigo: validatedData.code }
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Código do curso já existe' },
        { status: 400 }
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

    // Criar curso
    const course = await prisma.curso.create({
      data: {
        codigo: validatedData.code,
        nome: validatedData.name,
        descricao: validatedData.description,
        creditosMinimos: validatedData.credits,
        duracaoSemestres: validatedData.duration,
        nivel: validatedData.level,
        maxEstudantes: validatedData.maxStudents,
        coordenadorId: validatedData.teacherId
      },
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

    return NextResponse.json(course, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[COURSES_POST]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 