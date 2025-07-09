import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export interface LoginData {
  email: string;
  senha: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult {
  user: {
    id: string;
    nome: string;
    email: string;
    tipoUsuario: string;
    estado: string;
    avatar?: string | null;
  };
  tokens: AuthTokens;
}

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async login(loginData: LoginData): Promise<AuthResult> {
    const { email, senha } = loginData;

    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw ApiError.unauthorized('Email ou senha inválidos');
    }

    if (!user.senha) {
      throw ApiError.unauthorized('Conta não possui senha configurada');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Email ou senha inválidos');
    }

    // Verificar se o usuário está ativo
    if (user.estado !== 'ATIVO') {
      throw ApiError.forbidden('Conta não está ativa');
    }

    // Gerar tokens
    const tokens = await this.generateTokens(user.id);

    // Retornar dados do usuário (sem senha)
    const userData = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipoUsuario: user.tipoUsuario,
      estado: user.estado,
      avatar: user.avatar
    };

    logger.info('Login realizado com sucesso', { userId: user.id, email });

    return {
      user: userData,
      tokens
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verificar refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      
      if (!decoded.userId) {
        throw ApiError.unauthorized('Token inválido');
      }

      // Verificar se o usuário ainda existe e está ativo
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || user.estado !== 'ATIVO') {
        throw ApiError.unauthorized('Usuário não encontrado ou inativo');
      }

      // Gerar novos tokens
      const tokens = await this.generateTokens(user.id);

      logger.info('Token renovado com sucesso', { userId: user.id });

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.unauthorized('Token inválido');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized('Token expirado');
      }
      throw error;
    }
  }

  async logout(userId: string): Promise<void> {
    // Em uma implementação mais robusta, você poderia invalidar o token
    // adicionando-o a uma blacklist ou usando Redis
    logger.info('Logout realizado', { userId });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.senha) {
      throw ApiError.notFound('Usuário não encontrado');
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.senha);
    if (!isCurrentPasswordValid) {
      throw ApiError.badRequest('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);

    // Atualizar senha
    await this.prisma.user.update({
      where: { id: userId },
      data: { senha: hashedNewPassword }
    });

    logger.info('Senha alterada com sucesso', { userId });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      logger.info('Solicitação de recuperação de senha', { email });
      return;
    }

    // Gerar token de reset
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    // Em uma implementação real, enviar email com o token
    logger.info('Token de reset gerado', { userId: user.id, email });

    // Por enquanto, apenas logar o token (em produção, enviar por email)
    console.log('Reset token:', resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Verificar token
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      if (!decoded.userId || decoded.type !== 'password_reset') {
        throw ApiError.unauthorized('Token inválido');
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);

      // Atualizar senha
      await this.prisma.user.update({
        where: { id: decoded.userId },
        data: { senha: hashedPassword }
      });

      logger.info('Senha resetada com sucesso', { userId: decoded.userId });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.unauthorized('Token inválido');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized('Token expirado');
      }
      throw error;
    }
  }

  private async generateTokens(userId: string): Promise<AuthTokens> {
    const payload = { userId };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn
    } as jwt.SignOptions);

    // Calcular tempo de expiração em segundos
    const expiresIn = this.parseExpirationTime(config.jwt.expiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn
    };
  }

  private parseExpirationTime(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 7 * 24 * 60 * 60; // 7 dias por padrão
    }
  }
} 