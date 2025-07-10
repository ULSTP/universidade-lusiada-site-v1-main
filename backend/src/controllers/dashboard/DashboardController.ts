import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export class DashboardController {
  private prisma = new PrismaClient()

  async stats(req: Request, res: Response): Promise<void> {
    const [users, courses, enrollments] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.curso.count(),
      this.prisma.matricula.count(),
    ])

    res.json({ success: true, data: { users, courses, enrollments } })
  }
}
