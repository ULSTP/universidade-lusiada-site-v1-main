import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';
import { ApiError } from '@utils/apiError';

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
    stack?: string;
  };
  timestamp: string;
  path: string;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Erro interno do servidor';
  let code = 'INTERNAL_SERVER_ERROR';
  let details: any = undefined;

  // ApiError personalizado
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    details = err.details;
  }
  // Erros do Prisma
  else if (err.code?.startsWith('P')) {
    const prismaError = handlePrismaError(err);
    statusCode = prismaError.statusCode;
    message = prismaError.message;
    code = prismaError.code;
  }
  // Erros de validação do express-validator
  else if (err.array) {
    statusCode = 400;
    message = 'Dados de entrada inválidos';
    code = 'VALIDATION_ERROR';
    details = err.array();
  }
  // Erros do JWT
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
    code = 'INVALID_TOKEN';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
    code = 'TOKEN_EXPIRED';
  }
  // Erro de sintaxe JSON
  else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'JSON inválido no corpo da requisição';
    code = 'INVALID_JSON';
  }
  // Outros erros conhecidos
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
    code = 'INVALID_ID';
  }

  // Log do erro
  if (statusCode >= 500) {
    logger.error('Server Error', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      userId: req.user?.id
    });
  } else {
    logger.warn('Client Error', {
      error: err.message,
      url: req.originalUrl,
      method: req.method,
      statusCode,
      userId: req.user?.id
    });
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      code,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  };

  res.status(statusCode).json(errorResponse);
};

// Tratamento específico para erros do Prisma
function handlePrismaError(err: any): { statusCode: number; message: string; code: string } {
  switch (err.code) {
    case 'P2002':
      return {
        statusCode: 409,
        message: 'Dados duplicados. Um registro com essas informações já existe.',
        code: 'DUPLICATE_ENTRY'
      };
    case 'P2025':
      return {
        statusCode: 404,
        message: 'Registro não encontrado.',
        code: 'NOT_FOUND'
      };
    case 'P2003':
      return {
        statusCode: 400,
        message: 'Violação de chave estrangeira.',
        code: 'FOREIGN_KEY_CONSTRAINT'
      };
    case 'P2014':
      return {
        statusCode: 400,
        message: 'A mudança violaria uma relação obrigatória.',
        code: 'REQUIRED_RELATION_VIOLATION'
      };
    default:
      return {
        statusCode: 500,
        message: 'Erro na base de dados.',
        code: 'DATABASE_ERROR'
      };
  }
} 