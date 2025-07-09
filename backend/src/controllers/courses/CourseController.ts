import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CourseService } from '../../services/CourseService';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';
import { PrismaClient } from '@prisma/client';

export class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService(new PrismaClient());
  }

  list = async (req: Request, res: Response): Promise<void> => {
    const {
      page = '1',
      limit = '20',
      nivel,
      departamentoId,
      coordenadorId,
      ativo,
      search,
      sortBy = 'nome',
      sortOrder = 'asc'
    } = req.query;

    const filters = {
      ...(nivel && { nivel: nivel as string }),
      ...(departamentoId && { departamentoId: departamentoId as string }),
      ...(coordenadorId && { coordenadorId: coordenadorId as string }),
      ...(ativo !== undefined && { ativo: ativo === 'true' }),
      ...(search && { search: search as string })
    };

    const pagination = {
      page: parseInt(page as string, 10),
      limit: Math.min(parseInt(limit as string, 10), 100),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const result = await this.courseService.list(filters, pagination);

    const response = {
      success: true,
      data: result.cursos,
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
      logger.warn('Erros de validação na criação de curso', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const courseData = req.body;
    const course = await this.courseService.create(courseData);

    const response = {
      success: true,
      data: { course },
      message: 'Curso criado com sucesso'
    };

    res.status(201).json(response);
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const course = await this.courseService.findById(id);

    if (!course) {
      throw ApiError.notFound('Curso não encontrado');
    }

    const response = {
      success: true,
      data: { course }
    };

    res.status(200).json(response);
  };

  findByCode = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;

    const course = await this.courseService.findByCode(code);

    if (!course) {
      throw ApiError.notFound('Curso não encontrado');
    }

    const response = {
      success: true,
      data: { course }
    };

    res.status(200).json(response);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação na atualização de curso', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const { id } = req.params;
    const courseData = req.body;

    const course = await this.courseService.update(id, courseData);

    const response = {
      success: true,
      data: { course },
      message: 'Curso atualizado com sucesso'
    };

    res.status(200).json(response);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await this.courseService.delete(id);

    const response = {
      success: true,
      data: null,
      message: 'Curso deletado com sucesso'
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
    const { ativo } = req.body;

    const course = await this.courseService.updateStatus(id, ativo);

    const response = {
      success: true,
      data: { course },
      message: 'Status do curso atualizado com sucesso'
    };

    res.status(200).json(response);
  };

  updateCoordinator = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Erros de validação na atualização de coordenador', { errors: errors.array() });
      throw ApiError.badRequest('Dados de entrada inválidos', errors.array());
    }

    const { id } = req.params;
    const { coordenadorId } = req.body;

    const course = await this.courseService.updateCoordinator(id, coordenadorId);

    const response = {
      success: true,
      data: { course },
      message: 'Coordenador do curso atualizado com sucesso'
    };

    res.status(200).json(response);
  };

  removeCoordinator = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const course = await this.courseService.removeCoordinator(id);

    const response = {
      success: true,
      data: { course },
      message: 'Coordenador removido do curso com sucesso'
    };

    res.status(200).json(response);
  };

  getStats = async (req: Request, res: Response): Promise<void> => {
    const stats = await this.courseService.getStats();

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

    const courses = await this.courseService.search(q as string, parseInt(limit as string, 10));

    const response = {
      success: true,
      data: { courses }
    };

    res.status(200).json(response);
  };

  findByDepartment = async (req: Request, res: Response): Promise<void> => {
    const { departmentId } = req.params;

    const courses = await this.courseService.findByDepartment(departmentId);

    const response = {
      success: true,
      data: { courses }
    };

    res.status(200).json(response);
  };

  findByCoordinator = async (req: Request, res: Response): Promise<void> => {
    const { coordinatorId } = req.params;

    const courses = await this.courseService.findByCoordinator(coordinatorId);

    const response = {
      success: true,
      data: { courses }
    };

    res.status(200).json(response);
  };
} 