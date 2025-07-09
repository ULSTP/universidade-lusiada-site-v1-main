import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint não encontrado',
      code: 'NOT_FOUND',
      path: req.originalUrl,
      method: req.method
    },
    timestamp: new Date().toISOString()
  });
}; 