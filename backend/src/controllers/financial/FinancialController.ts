import { Request, Response } from 'express'

export class FinancialController {
  async summary(req: Request, res: Response): Promise<void> {
    res.json({ success: true, data: { balance: 0 } })
  }
}
