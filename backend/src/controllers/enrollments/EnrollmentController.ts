import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import { EnrollmentService } from '../../services/EnrollmentService';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';

export class EnrollmentController {
  private enrollmentService: EnrollmentService;

  constructor(private prisma: PrismaClient) {
    this.enrollmentService = new EnrollmentService(prisma);
  }

  async createEnrollment(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Dados inválidos',
          detalhes: errors.array(),
        });
      }

      const enrollment = await this.enrollmentService.createEnrollment(req.body);

      logger.info('Inscrição criada via API', {
        enrollmentId: enrollment.id,
        estudanteId: req.body.estudanteId,
        disciplinaId: req.body.disciplinaId,
        usuario: req.user?.id,
      });

      res.status(201).json({
        sucesso: true,
        dados: enrollment,
        mensagem: 'Inscrição criada com sucesso',
      });
    } catch (error) {
      logger.error('Erro na API de criação de inscrição', { error, body: req.body });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async getEnrollments(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Parâmetros inválidos',
          detalhes: errors.array(),
        });
      }

      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = parseInt(req.query.limite as string) || 10;
      const ordenacao = req.query.ordenacao as string;
      const direcao = req.query.direcao as 'asc' | 'desc' || 'desc';

      const filters = {
        search: req.query.search as string,
        estudanteId: req.query.estudanteId as string,
        disciplinaId: req.query.disciplinaId as string,
        turmaId: req.query.turmaId as string,
        cursoId: req.query.cursoId as string,
        departamentoId: req.query.departamentoId as string,
        status: req.query.status as any,
        periodo: req.query.periodo as string,
        anoLetivo: req.query.anoLetivo ? parseInt(req.query.anoLetivo as string) : undefined,
        semestre: req.query.semestre ? parseInt(req.query.semestre as string) : undefined,
        skip: (pagina - 1) * limite,
        take: limite,
        ordenacao: ordenacao ? { [ordenacao]: direcao } : undefined,
      };

      const result = await this.enrollmentService.getEnrollments(filters);

      res.json({
        sucesso: true,
        dados: result,
      });
    } catch (error) {
      logger.error('Erro na API de listagem de inscrições', { error, query: req.query });
      
      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async getEnrollmentById(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'ID inválido',
          detalhes: errors.array(),
        });
      }

      const enrollment = await this.enrollmentService.getEnrollmentById(req.params.id);

      res.json({
        sucesso: true,
        dados: enrollment,
      });
    } catch (error) {
      logger.error('Erro na API de busca de inscrição por ID', { error, id: req.params.id });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async updateEnrollment(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Dados inválidos',
          detalhes: errors.array(),
        });
      }

      const enrollment = await this.enrollmentService.updateEnrollment(req.params.id, req.body);

      logger.info('Inscrição atualizada via API', {
        enrollmentId: req.params.id,
        changes: Object.keys(req.body),
        usuario: req.user?.id,
      });

      res.json({
        sucesso: true,
        dados: enrollment,
        mensagem: 'Inscrição atualizada com sucesso',
      });
    } catch (error) {
      logger.error('Erro na API de atualização de inscrição', { error, id: req.params.id, body: req.body });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async deleteEnrollment(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'ID inválido',
          detalhes: errors.array(),
        });
      }

      await this.enrollmentService.deleteEnrollment(req.params.id);

      logger.info('Inscrição excluída via API', {
        enrollmentId: req.params.id,
        usuario: req.user?.id,
      });

      res.json({
        sucesso: true,
        mensagem: 'Inscrição excluída com sucesso',
      });
    } catch (error) {
      logger.error('Erro na API de exclusão de inscrição', { error, id: req.params.id });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async updateEnrollmentStatus(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Dados inválidos',
          detalhes: errors.array(),
        });
      }

      const { status, motivo } = req.body;
      const enrollment = await this.enrollmentService.updateEnrollmentStatus(req.params.id, status, motivo);

      logger.info('Status da inscrição atualizado via API', {
        enrollmentId: req.params.id,
        status,
        motivo,
        usuario: req.user?.id,
      });

      res.json({
        sucesso: true,
        dados: enrollment,
        mensagem: 'Status da inscrição atualizado com sucesso',
      });
    } catch (error) {
      logger.error('Erro na API de atualização de status', { error, id: req.params.id, body: req.body });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async createBulkEnrollments(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Dados inválidos',
          detalhes: errors.array(),
        });
      }

      const result = await this.enrollmentService.createBulkEnrollments(req.body);

      logger.info('Inscrições em lote criadas via API', {
        disciplinaId: req.body.disciplinaId,
        totalEstudantes: req.body.estudantesIds.length,
        success: result.success,
        usuario: req.user?.id,
      });

      res.status(201).json({
        sucesso: true,
        dados: result,
        mensagem: `${result.success} inscrições criadas com sucesso`,
      });
    } catch (error) {
      logger.error('Erro na API de inscrições em lote', { error, body: req.body });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async getEnrollmentStats(req: Request, res: Response) {
    try {
      const stats = await this.enrollmentService.getEnrollmentStats();

      res.json({
        sucesso: true,
        dados: stats,
      });
    } catch (error) {
      logger.error('Erro na API de estatísticas de inscrições', { error });
      
      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async getEnrollmentsByStudent(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Parâmetros inválidos',
          detalhes: errors.array(),
        });
      }

      const { estudanteId } = req.params;
      const periodo = req.query.periodo as string;

      const enrollments = await this.enrollmentService.getEnrollmentsByStudent(estudanteId, periodo);

      res.json({
        sucesso: true,
        dados: enrollments,
      });
    } catch (error) {
      logger.error('Erro na API de inscrições por estudante', { error, estudanteId: req.params.estudanteId });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async getEnrollmentsBySubject(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Parâmetros inválidos',
          detalhes: errors.array(),
        });
      }

      const { disciplinaId } = req.params;
      const periodo = req.query.periodo as string;

      const enrollments = await this.enrollmentService.getEnrollmentsBySubject(disciplinaId, periodo);

      res.json({
        sucesso: true,
        dados: enrollments,
      });
    } catch (error) {
      logger.error('Erro na API de inscrições por disciplina', { error, disciplinaId: req.params.disciplinaId });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async checkPrerequisites(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Parâmetros inválidos',
          detalhes: errors.array(),
        });
      }

      const { estudanteId, disciplinaId } = req.query;

      const check = await this.enrollmentService.checkPrerequisites(
        estudanteId as string,
        disciplinaId as string
      );

      res.json({
        sucesso: true,
        dados: check,
      });
    } catch (error) {
      logger.error('Erro na API de verificação de pré-requisitos', { error, query: req.query });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async checkClassCapacity(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'ID inválido',
          detalhes: errors.array(),
        });
      }

      const capacity = await this.enrollmentService.checkClassCapacity(req.params.turmaId);

      res.json({
        sucesso: true,
        dados: capacity,
      });
    } catch (error) {
      logger.error('Erro na API de verificação de capacidade', { error, turmaId: req.params.turmaId });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async searchEnrollments(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Parâmetros inválidos',
          detalhes: errors.array(),
        });
      }

      const searchTerm = req.query.q as string;
      const enrollments = await this.enrollmentService.searchEnrollments(searchTerm);

      res.json({
        sucesso: true,
        dados: enrollments,
      });
    } catch (error) {
      logger.error('Erro na API de busca de inscrições', { error, query: req.query.q });
      
      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }

  async approvePendingEnrollments(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Dados inválidos',
          detalhes: errors.array(),
        });
      }

      const { disciplinaId, periodo } = req.body;
      const approvedCount = await this.enrollmentService.approvePendingEnrollments(disciplinaId, periodo);

      logger.info('Inscrições pendentes aprovadas em lote via API', {
        disciplinaId,
        periodo,
        approvedCount,
        usuario: req.user?.id,
      });

      res.json({
        sucesso: true,
        dados: { totalAprovadas: approvedCount },
        mensagem: `${approvedCount} inscrições aprovadas com sucesso`,
      });
    } catch (error) {
      logger.error('Erro na API de aprovação em lote', { error, body: req.body });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          sucesso: false,
          erro: error.message,
        });
      }

      res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
      });
    }
  }
} 