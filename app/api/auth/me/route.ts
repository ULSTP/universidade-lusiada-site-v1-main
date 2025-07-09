import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar usuário com perfil específico
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        student: true,
        teacher: true,
        admin: true,
        notifications: {
          where: { read: false },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('[AUTH_ME]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 