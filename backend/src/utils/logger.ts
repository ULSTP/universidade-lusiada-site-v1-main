import winston from 'winston';
import path from 'path';
import { config } from '../config/environment';

// Formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` | Meta: ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\nStack: ${stack}`;
    }
    
    return log;
  })
);

// Criar diretório de logs se não existir
const logsDir = path.dirname(config.logs.file);

// Configurar transports
const transports: winston.transport[] = [
  // Console (sempre ativo)
  new winston.transports.Console({
    level: config.logs.level,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
];

// Adicionar file transport apenas se não for teste
if (config.env !== 'test') {
  transports.push(
    // Arquivo para logs gerais
    new winston.transports.File({
      filename: config.logs.file,
      level: config.logs.level,
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Arquivo separado para erros
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// Criar logger principal
export const logger = winston.createLogger({
  level: config.logs.level,
  format: logFormat,
  defaultMeta: { service: 'universidade-lusiada-api' },
  transports,
  exceptionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Logger utilities para operações específicas
export const loggerUtils = {
  // Log de operações de autenticação
  logAuthOperation: (
    operation: string, 
    userId?: string, 
    email?: string, 
    success: boolean = true
  ) => {
    const level = success ? 'info' : 'warn';
    logger[level](`Auth Operation: ${operation}`, {
      operation,
      userId,
      email,
      success,
      timestamp: new Date().toISOString()
    });
  },

  // Log de requisições HTTP
  logRequest: (req: any, res: any, responseTime: number) => {
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;
    
    const level = statusCode >= 400 ? 'warn' : 'info';
    
    logger[level](`${method} ${originalUrl}`, {
      method,
      url: originalUrl,
      statusCode,
      responseTime: `${responseTime}ms`,
      ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    });
  },

  // Log de erros de validação
  logValidationError: (errors: any[], endpoint: string) => {
    logger.warn('Validation Error', {
      endpoint,
      errors: errors.map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      })),
      timestamp: new Date().toISOString()
    });
  },

  // Log de operações da base de dados
  logDatabaseOperation: (
    operation: string,
    table: string,
    success: boolean = true,
    details?: any
  ) => {
    const level = success ? 'debug' : 'error';
    logger[level](`DB Operation: ${operation}`, {
      operation,
      table,
      success,
      details,
      timestamp: new Date().toISOString()
    });
  },

  // Log de operações de segurança
  logSecurityEvent: (
    event: string,
    ip: string,
    userAgent?: string,
    details?: any
  ) => {
    logger.warn(`Security Event: ${event}`, {
      event,
      ip,
      userAgent,
      details,
      timestamp: new Date().toISOString()
    });
  },

  // Log de performance
  logPerformance: (
    operation: string,
    duration: number,
    details?: any
  ) => {
    const level = duration > 1000 ? 'warn' : 'debug';
    logger[level](`Performance: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      details,
      timestamp: new Date().toISOString()
    });
  }
};

// Stream para Morgan (se precisar)
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

// Configuração específica para ambiente de desenvolvimento
if (config.env === 'development') {
  logger.debug('Logger configurado para desenvolvimento');
  logger.debug('Logs sendo salvos em:', config.logs.file);
} 