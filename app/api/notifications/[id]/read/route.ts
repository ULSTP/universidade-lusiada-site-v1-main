import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/notifications/[id]/read - Marcar notificação como lida
export async function PUT(
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

    // Verificar se a notificação existe e se o usuário tem acesso a ela
    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        OR: [
          { targetUserId: session.user.id },
          { targetRole: 'ALL' },
          { targetRole: session.user.role }
        ]
      }
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      )
    }

    // Marcar como lida
    const updatedNotification = await prisma.notification.update({
      where: { id: params.id },
      data: {
        read: true,
        readAt: new Date()
      }
    })

    return NextResponse.json(updatedNotification)

  } catch (error) {
    console.error('[NOTIFICATION_READ]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 