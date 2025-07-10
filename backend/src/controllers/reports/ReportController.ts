import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { ApiError } from '../../utils/apiError'
import { ExternalApiService } from '@services/ExternalApiService'

export class ReportController {
  private prisma = new PrismaClient()
  private external = new ExternalApiService()

  async financial(req: Request, res: Response): Promise<void> {
    const totalPayments = await this.prisma.pagamento.aggregate({
      _sum: { valor: true }
    })
    res.json({ success: true, data: { total: totalPayments._sum.valor || 0 } })
  }

  async externalExample(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.external.fetchExample()
      res.json({ success: true, data })
    } catch {
      throw ApiError.internal('Falha na integração externa')
    }
  }
}
