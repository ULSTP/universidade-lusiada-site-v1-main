import { Request, Response } from 'express'

export class DocumentController {
  async list(req: Request, res: Response): Promise<void> {
    res.json({ success: true, data: [], message: 'Lista de documentos' })
  }

  async upload(req: Request, res: Response): Promise<void> {
    const { originalname } = req.file as Express.Multer.File
    res.status(201).json({ success: true, data: { file: originalname } })
  }
}
