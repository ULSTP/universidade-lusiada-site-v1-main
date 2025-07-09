import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

class DatabaseConnection {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Configurar listeners de log
    this.prisma.$on('query', (e) => {
      logger.debug('Query executada', {
        query: e.query,
        params: e.params,
        duration: e.duration,
      });
    });

    this.prisma.$on('error', (e) => {
      logger.error('Erro do Prisma', {
        message: e.message,
        target: e.target,
      });
    });

    this.prisma.$on('info', (e) => {
      logger.info('Info do Prisma', {
        message: e.message,
        target: e.target,
      });
    });

    this.prisma.$on('warn', (e) => {
      logger.warn('Aviso do Prisma', {
        message: e.message,
        target: e.target,
      });
    });
  }

  async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('✅ Conectado ao banco de dados');
    } catch (error) {
      logger.error('❌ Erro ao conectar ao banco de dados', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('✅ Desconectado do banco de dados');
    } catch (error) {
      logger.error('❌ Erro ao desconectar do banco de dados', { error });
      throw error;
    }
  }

  getClient(): PrismaClient {
    return this.prisma;
  }

  async transaction<T>(operation: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(operation);
  }
}

const databaseConnection = new DatabaseConnection();

export default databaseConnection;
export const prisma = databaseConnection.getClient();

// Graceful shutdown
process.on('beforeExit', async () => {
  await databaseConnection.disconnect();
});

process.on('SIGINT', async () => {
  await databaseConnection.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await databaseConnection.disconnect();
  process.exit(0);
}); 