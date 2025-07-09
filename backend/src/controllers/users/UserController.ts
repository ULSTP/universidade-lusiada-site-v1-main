import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UserService } from '../../services/UserService';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';
import { PrismaClient } from '@prisma/client';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(new PrismaClient());
  }

  list = async (req: Request, res: Response): Promise<void> => {
    const {
      page = '1',
      limit = '20',
      tipoUsuario,
      estado,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {
      ...(tipoUsuario && { tipoUsuario: tipoUsuario as string }),
      ...(estado && { estado: estado as string }),
      ...(search && { search: search as string })
    };

    const pagination = {
      page: parseInt(page as string, 10),
      limit: Math.min(parseInt(limit as string, 10), 100), // Máximo 100 por página
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const result = await this.userService.list(filters, pagination);

    const response = {
      success: true,
      data: result.users,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: result.total,
        pages: result.pages
      }
    };

    res.status(200).json(response);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação na criação de usuário', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const userData = req.body;
    const user = await this.userService.create(userData);

    const response = {
      success: true,
      data: { user },
      message: 'Usuário criado com sucesso'
    };

    res.status(201).json(response);
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await this.userService.findById(id);

    if (!user) {
      throw ApiError.notFound('Usuário não encontrado');
    }

    const response = {
      success: true,
      data: { user }
    };

    res.status(200).json(response);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação na atualização de usuário', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const { id } = req.params;
    const userData = req.body;

    const user = await this.userService.update(id, userData);

    const response = {
      success: true,
      data: { user },
      message: 'Usuário atualizado com sucesso'
    };

    res.status(200).json(response);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await this.userService.delete(id);

    const response = {
      success: true,
      data: null,
      message: 'Usuário deletado com sucesso'
    };

    res.status(200).json(response);
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação na atualização de status', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const { id } = req.params;
    const { estado } = req.body;

    const user = await this.userService.updateStatus(id, estado);

    const response = {
      success: true,
      data: { user },
      message: 'Status do usuário atualizado com sucesso'
    };

    res.status(200).json(response);
  };

  getStats = async (req: Request, res: Response): Promise<void> => {
    const stats = await this.userService.getStats();

    const response = {
      success: true,
      data: stats
    };

    res.status(200).json(response);
  };

  search = async (req: Request, res: Response): Promise<void> => {
    const { q, limit = '10' } = req.query;

    if (!q) {
      throw ApiError.badRequest('Termo de busca é obrigatório');
    }

    const users = await this.userService.search(q as string, parseInt(limit as string, 10));

    const response = {
      success: true,
      data: { users }
    };

    res.status(200).json(response);
  };
} 