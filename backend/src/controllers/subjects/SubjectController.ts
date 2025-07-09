import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { SubjectService } from '../../services/SubjectService';
import { prisma } from '../../database/connection';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';

export class SubjectController {
  private subjectService: SubjectService;

  constructor() {
    this.subjectService = new SubjectService(prisma);
  }

  async createSubject(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          errors: errors.array(),
        });
      }

      const subject = await this.subjectService.createSubject(req.body);

      logger.info('Disciplina criada via API', {
        userId: req.user?.id,
        subjectId: subject.id,
        codigo: subject.codigo,
      });

      res.status(201).json({
        success: true,
        message: 'Disciplina criada com sucesso',
        data: subject,
      });
    } catch (error) {
      logger.error('Erro no controller ao criar disciplina', { 
        error, 
        userId: req.user?.id,
        body: req.body 
      });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async getSubjects(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros de consulta inválidos',
          errors: errors.array(),
        });
      }

      const {
        search,
        cursoId,
        departamentoId,
        professorId,
        semestre,
        tipo,
        status,
        creditos,
        pagina = 1,
        limite = 10,
        ordenacao = 'nome',
        direcao = 'asc',
      } = req.query;

      const filters = {
        search: search as string,
        cursoId: cursoId as string,
        departamentoId: departamentoId as string,
        professorId: professorId as string,
        semestre: semestre ? parseInt(semestre as string) : undefined,
        tipo: tipo as any,
        status: status as any,
        creditos: creditos ? parseInt(creditos as string) : undefined,
        skip: (parseInt(pagina as string) - 1) * parseInt(limite as string),
        take: parseInt(limite as string),
        ordenacao: { [ordenacao as string]: direcao },
      };

      const result = await this.subjectService.getSubjects(filters);

      res.json({
        success: true,
        message: 'Disciplinas recuperadas com sucesso',
        data: result,
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar disciplinas', { 
        error, 
        userId: req.user?.id,
        query: req.query 
      });

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async getSubjectById(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'ID da disciplina inválido',
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const subject = await this.subjectService.getSubjectById(id);

      res.json({
        success: true,
        message: 'Disciplina recuperada com sucesso',
        data: subject,
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar disciplina por ID', { 
        error, 
        userId: req.user?.id,
        subjectId: req.params.id 
      });

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async updateSubject(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const subject = await this.subjectService.updateSubject(id, req.body);

      logger.info('Disciplina atualizada via API', {
        userId: req.user?.id,
        subjectId: id,
        changes: Object.keys(req.body),
      });

      res.json({
        success: true,
        message: 'Disciplina atualizada com sucesso',
        data: subject,
      });
    } catch (error) {
      logger.error('Erro no controller ao atualizar disciplina', { 
        error, 
        userId: req.user?.id,
        subjectId: req.params.id,
        body: req.body 
      });

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async deleteSubject(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'ID da disciplina inválido',
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      await this.subjectService.deleteSubject(id);

      logger.info('Disciplina excluída via API', {
        userId: req.user?.id,
        subjectId: id,
      });

      res.json({
        success: true,
        message: 'Disciplina excluída com sucesso',
      });
    } catch (error) {
      logger.error('Erro no controller ao excluir disciplina', { 
        error, 
        userId: req.user?.id,
        subjectId: req.params.id 
      });

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async updateSubjectStatus(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      const subject = await this.subjectService.updateSubjectStatus(id, status);

      logger.info('Status da disciplina atualizado via API', {
        userId: req.user?.id,
        subjectId: id,
        newStatus: status,
      });

      res.json({
        success: true,
        message: 'Status da disciplina atualizado com sucesso',
        data: subject,
      });
    } catch (error) {
      logger.error('Erro no controller ao atualizar status da disciplina', { 
        error, 
        userId: req.user?.id,
        subjectId: req.params.id,
        status: req.body.status 
      });

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async getSubjectStats(req: Request, res: Response) {
    try {
      const stats = await this.subjectService.getSubjectStats();

      res.json({
        success: true,
        message: 'Estatísticas das disciplinas recuperadas com sucesso',
        data: stats,
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar estatísticas das disciplinas', { 
        error, 
        userId: req.user?.id 
      });

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async getSubjectsByCourse(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'ID do curso inválido',
          errors: errors.array(),
        });
      }

      const { cursoId } = req.params;
      const subjects = await this.subjectService.getSubjectsByCourse(cursoId);

      res.json({
        success: true,
        message: 'Disciplinas do curso recuperadas com sucesso',
        data: subjects,
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar disciplinas por curso', { 
        error, 
        userId: req.user?.id,
        cursoId: req.params.cursoId 
      });

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async getSubjectsByProfessor(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'ID do professor inválido',
          errors: errors.array(),
        });
      }

      const { professorId } = req.params;
      const subjects = await this.subjectService.getSubjectsByProfessor(professorId);

      res.json({
        success: true,
        message: 'Disciplinas do professor recuperadas com sucesso',
        data: subjects,
      });
    } catch (error) {
      logger.error('Erro no controller ao buscar disciplinas por professor', { 
        error, 
        userId: req.user?.id,
        professorId: req.params.professorId 
      });

      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async searchSubjects(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca inválido',
          errors: errors.array(),
        });
      }

      const { q } = req.query;
      const subjects = await this.subjectService.searchSubjects(q as string);

      res.json({
        success: true,
        message: 'Busca de disciplinas concluída com sucesso',
        data: subjects,
      });
    } catch (error) {
      logger.error('Erro no controller ao pesquisar disciplinas', { 
        error, 
        userId: req.user?.id,
        searchTerm: req.query.q 
      });

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }
} 