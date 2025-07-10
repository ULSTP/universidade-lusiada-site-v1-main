import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export class FinancialController {
  private prisma = new PrismaClient()

  async summary(req: Request, res: Response): Promise<void> {
    const pending = await this.prisma.propina.aggregate({
      _sum: { valorTotal: true },
      where: { status: { not: 'PAGO' } },
    })
    const paid = await this.prisma.pagamento.aggregate({ _sum: { valorPago: true } })

    res.json({
      success: true,
      data: {
        totalDue: pending._sum.valorTotal ?? 0,
        totalPaid: paid._sum.valorPago ?? 0,
      },
    })
  }
}
