import { Request, Response, NextFunction } from 'express';
import { loggerUtils } from '@utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Override do método end para capturar quando a resposta termina
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): Response {
    const responseTime = Date.now() - startTime;
    
    // Log da requisição
    loggerUtils.logRequest(req, res, responseTime);
    
    // Chamar o método original
    return originalEnd.call(this, chunk, encoding) as Response;
  };

  next();
}; 