import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente
dotenv.config();

interface Config {
  env: string;
  server: {
    port: number;
  };
  api: {
    version: string;
  };
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  upload: {
    directory: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
  security: {
    bcryptSaltRounds: number;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
  };
  cors: {
    allowedOrigins: string[];
  };
  logs: {
    level: string;
    file: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
  },
  
  api: {
    version: process.env.API_VERSION || 'v1',
  },
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  email: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@ulstp.ac.st',
  },
  
  upload: {
    directory: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpg', 'jpeg', 'png', 'pdf'],
  },
  
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
};

// Validação de configurações críticas
const validateConfig = (): void => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(', ')}`
    );
  }

  if (config.jwt.secret === 'fallback_secret_key') {
    console.warn('⚠️ AVISO: Usando chave JWT padrão. Configure JWT_SECRET em produção!');
  }
};

// Validar configurações ao carregar
if (config.env !== 'test') {
  validateConfig();
}

export { config }; 