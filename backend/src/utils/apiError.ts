export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(
    statusCode: number,
    message: string,
    code: string = 'GENERIC_ERROR',
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Manter o stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // Métodos estáticos para erros comuns
  static badRequest(message: string = 'Requisição inválida', details?: any): ApiError {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message: string = 'Não autorizado'): ApiError {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'Acesso negado'): ApiError {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  static notFound(message: string = 'Recurso não encontrado'): ApiError {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  static conflict(message: string = 'Conflito de dados'): ApiError {
    return new ApiError(409, message, 'CONFLICT');
  }

  static unprocessableEntity(message: string = 'Dados não processáveis', details?: any): ApiError {
    return new ApiError(422, message, 'UNPROCESSABLE_ENTITY', details);
  }

  static internal(message: string = 'Erro interno do servidor'): ApiError {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR');
  }

  static tooManyRequests(message: string = 'Muitas tentativas'): ApiError {
    return new ApiError(429, message, 'TOO_MANY_REQUESTS');
  }
} 