import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { ApiError } from '../../utils/apiError'

export class DocumentController {
  private prisma = new PrismaClient()

  async list(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id
    const docs = await this.prisma.documento.findMany({
      where: { usuarioId: userId },
      orderBy: { dataUpload: 'desc' }
    })

    res.json({ success: true, data: docs })
  }

  async upload(req: Request, res: Response): Promise<void> {
    const file = req.file as Express.Multer.File | undefined

    if (!file) {
      throw ApiError.badRequest('Arquivo não enviado')
    }

    const userId = req.user!.id
    const { tipo = 'OUTRO', descricao } = req.body

    const doc = await this.prisma.documento.create({
      data: {
        usuarioId: userId,
        tipo,
        nome: file.originalname,
        descricao,
        arquivo: file.filename,
        tamanho: file.size,
        mimeType: file.mimetype
      }
    })

    res.status(201).json({ success: true, data: doc })
  }

  async remove(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const userId = req.user!.id

    const doc = await this.prisma.documento.findFirst({ where: { id, usuarioId: userId } })
    if (!doc) {
      throw ApiError.notFound('Documento não encontrado')
    }

    await this.prisma.documento.delete({ where: { id } })

    res.json({ success: true })
  }
}
