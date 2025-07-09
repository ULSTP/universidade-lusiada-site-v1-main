import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Schema de validação para documento
const documentSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['CERTIFICATE', 'TRANSCRIPT', 'DIPLOMA', 'ID_CARD', 'OTHER']),
  studentId: z.string().optional(),
  teacherId: z.string().optional(),
  adminId: z.string().optional(),
  fileUrl: z.string().url('URL do arquivo deve ser válida'),
  fileSize: z.number().min(1, 'Tamanho do arquivo deve ser maior que 0'),
  mimeType: z.string().min(1, 'Tipo MIME é obrigatório'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
})

// GET /api/documents - Listar documentos
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
    const teacherId = searchParams.get('teacherId')
    const adminId = searchParams.get('adminId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (studentId) {
      where.studentId = studentId
    }
    
    if (teacherId) {
      where.teacherId = teacherId
    }
    
    if (adminId) {
      where.adminId = adminId
    }
    
    if (type) {
      where.type = type
    }
    
    if (status) {
      where.status = status
    }

    // Verificar permissões baseadas no papel do usuário
    if (session.user.role === 'STUDENT') {
      where.studentId = session.user.id
    } else if (session.user.role === 'TEACHER') {
      where.teacherId = session.user.id
    } else if (session.user.role === 'ADMIN') {
      // Admin pode ver todos os documentos
    } else {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar documentos com paginação
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
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
          admin: {
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
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.document.count({ where })
    ])

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('[DOCUMENTS_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Criar documento
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário está autenticado
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = documentSchema.parse(body)

    // Verificar se pelo menos um ID de usuário foi fornecido
    if (!validatedData.studentId && !validatedData.teacherId && !validatedData.adminId) {
      return NextResponse.json(
        { error: 'Pelo menos um ID de usuário (estudante, professor ou admin) deve ser fornecido' },
        { status: 400 }
      )
    }

    // Verificar se o estudante existe (se fornecido)
    if (validatedData.studentId) {
      const student = await prisma.student.findUnique({
        where: { id: validatedData.studentId }
      })

      if (!student) {
        return NextResponse.json(
          { error: 'Estudante não encontrado' },
          { status: 404 }
        )
      }
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

    // Verificar se o admin existe (se fornecido)
    if (validatedData.adminId) {
      const admin = await prisma.admin.findUnique({
        where: { id: validatedData.adminId }
      })

      if (!admin) {
        return NextResponse.json(
          { error: 'Administrador não encontrado' },
          { status: 404 }
        )
      }
    }

    // Verificar permissões baseadas no papel do usuário
    const isAdmin = session.user.role === 'ADMIN'
    const isSelfDocument = (
      (session.user.role === 'STUDENT' && validatedData.studentId === session.user.id) ||
      (session.user.role === 'TEACHER' && validatedData.teacherId === session.user.id) ||
      (session.user.role === 'ADMIN' && validatedData.adminId === session.user.id)
    )

    if (!isAdmin && !isSelfDocument) {
      return NextResponse.json(
        { error: 'Não autorizado para criar documento para outro usuário' },
        { status: 401 }
      )
    }

    // Criar documento
    const document = await prisma.document.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        studentId: validatedData.studentId,
        teacherId: validatedData.teacherId,
        adminId: validatedData.adminId,
        fileUrl: validatedData.fileUrl,
        fileSize: validatedData.fileSize,
        mimeType: validatedData.mimeType,
        status: validatedData.status || 'PENDING',
        createdAt: new Date()
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
        admin: {
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

    return NextResponse.json(document, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[DOCUMENTS_POST]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 