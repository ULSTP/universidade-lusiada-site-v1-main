import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ScheduleService } from '../../services/ScheduleService';
import { validationResult } from 'express-validator';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';

export class ScheduleController {
  private scheduleService: ScheduleService;

  constructor(prisma: PrismaClient) {
    this.scheduleService = new ScheduleService(prisma);
  }

  // ==================== SCHEDULE ENDPOINTS ====================

  async createSchedule(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const schedule = await this.scheduleService.createSchedule(req.body);

      res.status(201).json({
        success: true,
        message: 'Horário criado com sucesso',
        data: schedule
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro inesperado ao criar horário', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async getSchedules(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        disciplinaId: req.query.disciplinaId as string,
        professorId: req.query.professorId as string,
        salaId: req.query.salaId as string,
        diaSemana: req.query.diaSemana as any,
        periodo: req.query.periodo as string,
        ativo: req.query.ativo ? req.query.ativo === 'true' : undefined,
        horaInicio: req.query.horaInicio as string,
        horaFim: req.query.horaFim as string,
        search: req.query.search as string,
        skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
        take: req.query.take ? parseInt(req.query.take as string) : undefined,
      };

      const result = await this.scheduleService.getSchedules(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Erro ao buscar horários', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getScheduleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const schedule = await this.scheduleService.getScheduleById(id);

      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar horário', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async updateSchedule(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const schedule = await this.scheduleService.updateSchedule(id, req.body);

      res.json({
        success: true,
        message: 'Horário atualizado com sucesso',
        data: schedule
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao atualizar horário', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.scheduleService.deleteSchedule(id);

      res.json({
        success: true,
        message: 'Horário excluído com sucesso'
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao excluir horário', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async createBulkSchedules(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const result = await this.scheduleService.createBulkSchedules(req.body);

      res.status(201).json({
        success: true,
        message: `${result.success} horários criados com sucesso`,
        data: result
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao criar horários em lote', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async searchSchedules(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Termo de busca é obrigatório'
        });
        return;
      }

      const schedules = await this.scheduleService.searchSchedules(q as string);

      res.json({
        success: true,
        data: schedules
      });
    } catch (error) {
      logger.error('Erro ao pesquisar horários', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getWeeklySchedule(req: Request, res: Response): Promise<void> {
    try {
      const { professorId, salaId, periodo } = req.query;

      const weeklySchedule = await this.scheduleService.getWeeklySchedule(
        professorId as string,
        salaId as string,
        periodo as string
      );

      res.json({
        success: true,
        data: weeklySchedule
      });
    } catch (error) {
      logger.error('Erro ao buscar grade semanal', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getProfessorSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { professorId } = req.params;
      const { periodo } = req.query;

      if (!periodo) {
        res.status(400).json({
          success: false,
          message: 'Período é obrigatório'
        });
        return;
      }

      const professorSchedule = await this.scheduleService.getProfessorSchedule(
        professorId,
        periodo as string
      );

      res.json({
        success: true,
        data: professorSchedule
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar agenda do professor', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async getScheduleStats(req: Request, res: Response): Promise<void> {
    try {
      const { periodo } = req.query;

      const stats = await this.scheduleService.getScheduleStats(periodo as string);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Erro ao buscar estatísticas dos horários', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getScheduleDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { periodo } = req.query;

      const dashboard = await this.scheduleService.getScheduleDashboard(periodo as string);

      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      logger.error('Erro ao buscar dashboard dos horários', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async detectConflicts(req: Request, res: Response): Promise<void> {
    try {
      const { periodo } = req.query;

      if (!periodo) {
        res.status(400).json({
          success: false,
          message: 'Período é obrigatório'
        });
        return;
      }

      const conflicts = await this.scheduleService.detectConflicts(periodo as string);

      res.json({
        success: true,
        message: `${conflicts.length} conflitos detectados`,
        data: conflicts
      });
    } catch (error) {
      logger.error('Erro ao detectar conflitos', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ==================== CLASSROOM ENDPOINTS ====================

  async createClassroom(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const classroom = await this.scheduleService.createClassroom(req.body);

      res.status(201).json({
        success: true,
        message: 'Sala criada com sucesso',
        data: classroom
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro inesperado ao criar sala', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async getClassrooms(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        tipo: req.query.tipo as any,
        capacidadeMinima: req.query.capacidadeMinima ? parseInt(req.query.capacidadeMinima as string) : undefined,
        disponivel: req.query.disponivel ? req.query.disponivel === 'true' : undefined,
        search: req.query.search as string,
        skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
        take: req.query.take ? parseInt(req.query.take as string) : undefined,
      };

      const result = await this.scheduleService.getClassrooms(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Erro ao buscar salas', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async getClassroomById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const classroom = await this.scheduleService.getClassroomById(id);

      res.json({
        success: true,
        data: classroom
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar sala', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async updateClassroom(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const classroom = await this.scheduleService.updateClassroom(id, req.body);

      res.json({
        success: true,
        message: 'Sala atualizada com sucesso',
        data: classroom
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao atualizar sala', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async deleteClassroom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.scheduleService.deleteClassroom(id);

      res.json({
        success: true,
        message: 'Sala excluída com sucesso'
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao excluir sala', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async getClassroomSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { salaId } = req.params;
      const { periodo } = req.query;

      if (!periodo) {
        res.status(400).json({
          success: false,
          message: 'Período é obrigatório'
        });
        return;
      }

      const classroomSchedule = await this.scheduleService.getClassroomSchedule(
        salaId,
        periodo as string
      );

      res.json({
        success: true,
        data: classroomSchedule
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar agenda da sala', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async getClassroomAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { salaId } = req.params;
      const { data, periodo } = req.query;

      if (!data || !periodo) {
        res.status(400).json({
          success: false,
          message: 'Data e período são obrigatórios'
        });
        return;
      }

      const availability = await this.scheduleService.getClassroomAvailability(
        salaId,
        new Date(data as string),
        periodo as string
      );

      res.json({
        success: true,
        data: availability
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar disponibilidade da sala', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  // ==================== CALENDAR ENDPOINTS ====================

  async createCalendarEvent(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const event = await this.scheduleService.createCalendarEvent(req.body);

      res.status(201).json({
        success: true,
        message: 'Evento do calendário criado com sucesso',
        data: event
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro inesperado ao criar evento do calendário', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  async getCalendarEvents(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        periodo: req.query.periodo as string,
        tipo: req.query.tipo as any,
        ativo: req.query.ativo ? req.query.ativo === 'true' : undefined,
        dataInicio: req.query.dataInicio ? new Date(req.query.dataInicio as string) : undefined,
        dataFim: req.query.dataFim ? new Date(req.query.dataFim as string) : undefined,
        search: req.query.search as string,
        skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
        take: req.query.take ? parseInt(req.query.take as string) : undefined,
      };

      const result = await this.scheduleService.getCalendarEvents(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Erro ao buscar eventos do calendário', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async updateCalendarEvent(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const event = await this.scheduleService.updateCalendarEvent(id, req.body);

      res.json({
        success: true,
        message: 'Evento do calendário atualizado com sucesso',
        data: event
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao atualizar evento do calendário', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  // ==================== CONFLICT ENDPOINTS ====================

  async getConflicts(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        tipo: req.query.tipo as any,
        resolvido: req.query.resolvido ? req.query.resolvido === 'true' : undefined,
        professorId: req.query.professorId as string,
        salaId: req.query.salaId as string,
        periodo: req.query.periodo as string,
        skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
        take: req.query.take ? parseInt(req.query.take as string) : undefined,
      };

      const result = await this.scheduleService.getConflicts(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Erro ao buscar conflitos', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async resolveConflict(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const conflict = await this.scheduleService.resolveConflict(id);

      res.json({
        success: true,
        message: 'Conflito resolvido com sucesso',
        data: conflict
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao resolver conflito', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }
} 