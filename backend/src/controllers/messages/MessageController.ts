import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { ApiError } from '../../utils/apiError'

export class MessageController {
  private prisma = new PrismaClient()

  async list(req: Request, res: Response): Promise<void> {
    const { userId } = req.params
    const current = req.user!.id

    const messages = await this.prisma.mensagem.findMany({
      where: {
        OR: [
          { remetenteId: current, destinatarioId: userId },
          { remetenteId: userId, destinatarioId: current }
        ]
      },
      orderBy: { createdAt: 'asc' }
    })

    res.json({ success: true, data: messages })
  }

  async send(req: Request, res: Response): Promise<void> {
    const current = req.user!.id
    const { userId, content } = req.body

    if (!userId || !content) {
      throw ApiError.badRequest('Parâmetros ausentes')
    }

    const message = await this.prisma.mensagem.create({
      data: {
        remetenteId: current,
        destinatarioId: userId,
        conteudo: content
      }
    })

    res.status(201).json({ success: true, data: message })
  }
}
