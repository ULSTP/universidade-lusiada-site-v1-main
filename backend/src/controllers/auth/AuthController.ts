import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../../services/AuthService';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';
import { PrismaClient } from '@prisma/client';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(new PrismaClient());
  }

  login = async (req: Request, res: Response): Promise<void> => {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação no login', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const { email, senha } = req.body;

    const result = await this.authService.login({ email, senha });

    const response = {
      success: true,
      data: result,
      message: 'Login realizado com sucesso'
    };

    res.status(200).json(response);
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação no refresh token', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const { refreshToken } = req.body;

    const tokens = await this.authService.refreshToken(refreshToken);

    const response = {
      success: true,
      data: { tokens },
      message: 'Token renovado com sucesso'
    };

    res.status(200).json(response);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized('Usuário não autenticado');
    }

    await this.authService.logout(req.user.id);

    const response = {
      success: true,
      data: null,
      message: 'Logout realizado com sucesso'
    };

    res.status(200).json(response);
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação na alteração de senha', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    if (!req.user) {
      throw ApiError.unauthorized('Usuário não autenticado');
    }

    const { currentPassword, newPassword } = req.body;

    await this.authService.changePassword(req.user.id, currentPassword, newPassword);

    const response = {
      success: true,
      data: null,
      message: 'Senha alterada com sucesso'
    };

    res.status(200).json(response);
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação na recuperação de senha', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const { email } = req.body;

    await this.authService.forgotPassword(email);

    const response = {
      success: true,
      data: null,
      message: 'Se o email existir, você receberá instruções para redefinir sua senha'
    };

    res.status(200).json(response);
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação no reset de senha', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const { token, newPassword } = req.body;

    await this.authService.resetPassword(token, newPassword);

    const response = {
      success: true,
      data: null,
      message: 'Senha redefinida com sucesso'
    };

    res.status(200).json(response);
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized('Usuário não autenticado');
    }

    const profile = await this.authService.getUserProfile(req.user.id);

    const response = {
      success: true,
      data: { user: profile },
      message: 'Perfil obtido com sucesso'
    };

    res.status(200).json(response);
  };
} 