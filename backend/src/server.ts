import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { config } from '@config/environment';
import { logger } from '@utils/logger';
import { errorHandler } from '@middlewares/errorHandler';
import { requestLogger } from '@middlewares/requestLogger';
import { notFoundHandler } from '@middlewares/notFoundHandler';
import { swaggerSpec } from '@config/swagger';

// Importar rotas
import authRoutes from '@controllers/auth/routes';
import userRoutes from '@controllers/users/routes';
import courseRoutes from '@controllers/courses/routes';
import subjectRoutes from '@controllers/subjects/routes';
import enrollmentRoutes from '@controllers/enrollments/routes';
import gradeRoutes from '@controllers/grades/routes';
import financialRoutes from '@controllers/financial/routes';
import dashboardRoutes from '@controllers/dashboard/routes';
import notificationRoutes from '@controllers/notifications/routes';
import documentRoutes from '@controllers/documents/routes';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.errorHandling();
  }

  private config(): void {
    // Middlewares de segurança
    this.app.use(helmet());
    this.app.use(compression());

    // CORS
    this.app.use(cors({
      origin: config.cors.allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Rate limiting
    this.app.use(rateLimit({
      windowMs: config.security.rateLimitWindowMs,
      max: config.security.rateLimitMaxRequests,
      message: {
        error: 'Muitas tentativas. Tente novamente mais tarde.',
        retryAfter: Math.ceil(config.security.rateLimitWindowMs / 1000 / 60)
      },
      standardHeaders: true,
      legacyHeaders: false
    }));

    // Body parser
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);

    // Arquivos estáticos
    this.app.use('/uploads', express.static(config.upload.directory));
  }

  private routes(): void {
    const apiPrefix = `/api/${config.api.version}`;

    // Documentação da API
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
        version: config.api.version
      });
    });

    // Rotas da API
    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/users`, userRoutes);
    this.app.use(`${apiPrefix}/courses`, courseRoutes);
    this.app.use(`${apiPrefix}/subjects`, subjectRoutes);
    this.app.use(`${apiPrefix}/enrollments`, enrollmentRoutes);
    this.app.use(`${apiPrefix}/grades`, gradeRoutes);
    this.app.use(`${apiPrefix}/financial`, financialRoutes);
    this.app.use(`${apiPrefix}/dashboard`, dashboardRoutes);
    this.app.use(`${apiPrefix}/notifications`, notificationRoutes);
    this.app.use(`${apiPrefix}/documents`, documentRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'API da Universidade Lusíada',
        version: config.api.version,
        documentation: '/api-docs',
        health: '/health'
      });
    });
  }

  private errorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Error handler global
    this.app.use(errorHandler);
  }

  public start(): void {
    const port = config.server.port;
    
    this.app.listen(port, () => {
      logger.info(`🚀 Servidor iniciado na porta ${port}`);
      logger.info(`📚 Documentação disponível em http://localhost:${port}/api-docs`);
      logger.info(`🏥 Health check em http://localhost:${port}/health`);
      logger.info(`🌍 Ambiente: ${config.env}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM recebido. Encerrando servidor...');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT recebido. Encerrando servidor...');
      process.exit(0);
    });
  }
}

// Inicializar servidor
const server = new Server();
server.start();

export default server.app; 