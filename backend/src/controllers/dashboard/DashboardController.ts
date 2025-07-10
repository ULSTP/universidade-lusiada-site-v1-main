import { Request, Response } from 'express'

export class DashboardController {
  async stats(req: Request, res: Response): Promise<void> {
    res.json({ success: true, data: { users: 0, courses: 0, enrollments: 0 } })
  }
}
