import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { ApiError } from '../../utils/apiError'

export class NotificationController {
  private prisma = new PrismaClient()

  async list(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id
    const notifications = await this.prisma.notificacao.findMany({
      where: { usuarioId: userId },
      orderBy: { dataEnvio: 'desc' }
    })

    res.json({ success: true, data: notifications })
  }

  async create(req: Request, res: Response): Promise<void> {
    const { title, message, type = 'SISTEMA' } = req.body
    const userId = req.user!.id

    if (!title || !message) {
      throw ApiError.badRequest('Título e mensagem são obrigatórios')
    }

    const notification = await this.prisma.notificacao.create({
      data: {
        usuarioId: userId,
        titulo: title,
        mensagem: message,
        tipo: type
      }
    })

    res.status(201).json({ success: true, data: notification })
  }

  async markRead(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    await this.prisma.notificacao.update({
      where: { id },
      data: { lida: true, dataLeitura: new Date() }
    })

    res.json({ success: true })
  }
}
