import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Schema de validação para notificação
const notificationSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  message: z.string().min(5, 'Mensagem deve ter pelo menos 5 caracteres'),
  type: z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  targetRole: z.enum(['ALL', 'STUDENT', 'TEACHER', 'ADMIN']).optional(),
  targetUserId: z.string().optional(),
  link: z.string().url().optional(),
  expiresAt: z.string().optional(),
})

// GET /api/notifications - Listar notificações
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
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    const read = searchParams.get('read')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      OR: [
        { targetUserId: session.user.id },
        { targetRole: 'ALL' },
        { targetRole: session.user.role }
      ]
    }
    
    if (type) {
      where.type = type
    }
    
    if (priority) {
      where.priority = priority
    }
    
    if (read !== null) {
      where.read = read === 'true'
    }

    // Buscar notificações com paginação
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.notification.count({ where })
    ])

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('[NOTIFICATIONS_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Criar notificação
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
    const validatedData = notificationSchema.parse(body)

    // Verificar se o usuário alvo existe (se fornecido)
    if (validatedData.targetUserId) {
      const targetUser = await prisma.user.findUnique({
        where: { id: validatedData.targetUserId }
      })

      if (!targetUser) {
        return NextResponse.json(
          { error: 'Usuário alvo não encontrado' },
          { status: 404 }
        )
      }
    }

    // Criar notificação
    const notification = await prisma.notification.create({
      data: {
        title: validatedData.title,
        message: validatedData.message,
        type: validatedData.type,
        priority: validatedData.priority,
        targetRole: validatedData.targetRole || 'ALL',
        targetUserId: validatedData.targetUserId,
        link: validatedData.link,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        read: false,
        createdAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(notification, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[NOTIFICATIONS_POST]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 