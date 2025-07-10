import { Request, Response } from 'express'

export class NotificationController {
  async list(req: Request, res: Response): Promise<void> {
    res.json({ success: true, data: [], message: 'Lista de notificações' })
  }

  async create(req: Request, res: Response): Promise<void> {
    const { title, message } = req.body
    res.status(201).json({ success: true, data: { id: '1', title, message } })
  }

  async markRead(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    res.json({ success: true, message: `Notificação ${id} marcada como lida` })
  }
}
