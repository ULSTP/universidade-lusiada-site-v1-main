import { PrismaClient } from '@prisma/client';
import { ScheduleRepository } from '../repositories/ScheduleRepository';
import {
  CreateScheduleData,
  UpdateScheduleData,
  CreateClassroomData,
  UpdateClassroomData,
  CreateAcademicCalendarData,
  UpdateAcademicCalendarData,
  ScheduleFilters,
  ClassroomFilters,
  CalendarFilters,
  ConflictFilters,
  ScheduleListResponse,
  ClassroomListResponse,
  CalendarListResponse,
  ConflictListResponse,
  ScheduleResponse,
  ClassroomResponse,
  CalendarResponse,
  ConflictResponse,
  WeeklySchedule,
  ProfessorSchedule,
  ClassroomSchedule,
  ScheduleStats,
  ScheduleDashboard,
  ClassroomAvailability,
  BulkScheduleData,
  ScheduleRecommendation,
  ConflictResolution,
  DiaSemana,
  TipoConflito,
  TipoSala
} from '../types/schedule';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export class ScheduleService {
  private scheduleRepository: ScheduleRepository;

  constructor(private prisma: PrismaClient) {
    this.scheduleRepository = new ScheduleRepository(prisma);
  }

  // ==================== SCHEDULE OPERATIONS ====================

  async createSchedule(data: CreateScheduleData): Promise<ScheduleResponse> {
    try {
      // Validar se professor existe e é do tipo PROFESSOR
      const professor = await this.prisma.user.findUnique({
        where: { 
          id: data.professorId,
          tipoUsuario: 'PROFESSOR'
        }
      });
      if (!professor) {
        throw new ApiError(404, 'Professor não encontrado');
      }

      // Validar se disciplina existe e está ativa
      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id: data.disciplinaId }
      });
      if (!disciplina) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }
      if (disciplina.status !== 'ATIVA') {
        throw new ApiError(400, 'Disciplina não está ativa');
      }

      // Validar se sala existe e está disponível (se fornecida)
      if (data.salaId) {
        const sala = await this.prisma.sala.findUnique({
          where: { id: data.salaId }
        });
        if (!sala) {
          throw new ApiError(404, 'Sala não encontrada');
        }
        if (!sala.disponivel) {
          throw new ApiError(400, 'Sala não está disponível');
        }
      }

      // Verificar conflitos de horário do professor
      const professorConflicts = await this.scheduleRepository.checkTimeConflicts(
        data.professorId,
        data.diaSemana,
        data.horaInicio,
        data.horaFim,
        data.periodo
      );

      if (professorConflicts.length > 0) {
        throw new ApiError(409, `Professor já possui compromisso neste horário: ${professorConflicts[0].descricao}`);
      }

      // Verificar conflitos de sala (se fornecida)
      if (data.salaId) {
        const salaConflicts = await this.scheduleRepository.checkClassroomConflicts(
          data.salaId,
          data.diaSemana,
          data.horaInicio,
          data.horaFim,
          data.periodo
        );

        if (salaConflicts.length > 0) {
          throw new ApiError(409, `Sala já está ocupada neste horário: ${salaConflicts[0].descricao}`);
        }
      }

      // Validar horário de funcionamento
      if (!this.isValidBusinessHours(data.horaInicio, data.horaFim)) {
        throw new ApiError(400, 'Horário deve estar dentro do funcionamento da instituição (07:00 - 22:00)');
      }

      // Validar duração mínima e máxima
      const duration = this.calculateDuration(data.horaInicio, data.horaFim);
      if (duration < 30) {
        throw new ApiError(400, 'Duração mínima de aula é 30 minutos');
      }
      if (duration > 240) {
        throw new ApiError(400, 'Duração máxima de aula é 4 horas');
      }

      const schedule = await this.scheduleRepository.createSchedule(data);

      logger.info('Horário criado com sucesso', {
        scheduleId: schedule.id,
        professorId: data.professorId,
        disciplinaId: data.disciplinaId,
        diaSemana: data.diaSemana,
        horario: `${data.horaInicio} - ${data.horaFim}`
      });

      return schedule;
    } catch (error) {
      logger.error('Erro ao criar horário', { error, data });
      throw error;
    }
  }

  async getSchedules(filters: ScheduleFilters): Promise<ScheduleListResponse> {
    try {
      const pagina = Math.floor((filters.skip || 0) / (filters.take || 10)) + 1;
      const limite = filters.take || 10;

      const { schedules, total } = await this.scheduleRepository.findSchedules({
        ...filters,
        skip: (pagina - 1) * limite,
        take: limite,
      });

      const totalPaginas = Math.ceil(total / limite);

      return {
        schedules,
        total,
        pagina,
        totalPaginas,
      };
    } catch (error) {
      logger.error('Erro ao buscar horários', { error, filters });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getScheduleById(id: string): Promise<ScheduleResponse> {
    try {
      const schedule = await this.scheduleRepository.findScheduleById(id);
      if (!schedule) {
        throw new ApiError(404, 'Horário não encontrado');
      }
      return schedule;
    } catch (error) {
      logger.error('Erro ao buscar horário por ID', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async updateSchedule(id: string, data: UpdateScheduleData): Promise<ScheduleResponse> {
    try {
      const existingSchedule = await this.scheduleRepository.findScheduleById(id);
      if (!existingSchedule) {
        throw new ApiError(404, 'Horário não encontrado');
      }

      // Validações se professor foi alterado
      if (data.professorId && data.professorId !== existingSchedule.professorId) {
        const professor = await this.prisma.user.findUnique({
          where: { 
            id: data.professorId,
            tipoUsuario: 'PROFESSOR'
          }
        });
        if (!professor) {
          throw new ApiError(404, 'Professor não encontrado');
        }
      }

      // Validações se disciplina foi alterada
      if (data.disciplinaId && data.disciplinaId !== existingSchedule.disciplinaId) {
        const disciplina = await this.prisma.disciplina.findUnique({
          where: { id: data.disciplinaId }
        });
        if (!disciplina || disciplina.status !== 'ATIVA') {
          throw new ApiError(404, 'Disciplina não encontrada ou inativa');
        }
      }

      // Validações se sala foi alterada
      if (data.salaId && data.salaId !== existingSchedule.salaId) {
        const sala = await this.prisma.sala.findUnique({
          where: { id: data.salaId }
        });
        if (!sala || !sala.disponivel) {
          throw new ApiError(404, 'Sala não encontrada ou indisponível');
        }
      }

      // Verificar conflitos se horário foi alterado
      const professorId = data.professorId || existingSchedule.professorId;
      const diaSemana = data.diaSemana || existingSchedule.diaSemana;
      const horaInicio = data.horaInicio || existingSchedule.horaInicio;
      const horaFim = data.horaFim || existingSchedule.horaFim;
      const periodo = data.periodo || existingSchedule.periodo;

      if (data.professorId || data.diaSemana || data.horaInicio || data.horaFim || data.periodo) {
        const professorConflicts = await this.scheduleRepository.checkTimeConflicts(
          professorId,
          diaSemana,
          horaInicio,
          horaFim,
          periodo,
          id
        );

        if (professorConflicts.length > 0) {
          throw new ApiError(409, `Professor já possui compromisso neste horário: ${professorConflicts[0].descricao}`);
        }
      }

      const salaId = data.salaId || existingSchedule.salaId;
      if (salaId && (data.salaId || data.diaSemana || data.horaInicio || data.horaFim || data.periodo)) {
        const salaConflicts = await this.scheduleRepository.checkClassroomConflicts(
          salaId,
          diaSemana,
          horaInicio,
          horaFim,
          periodo,
          id
        );

        if (salaConflicts.length > 0) {
          throw new ApiError(409, `Sala já está ocupada neste horário: ${salaConflicts[0].descricao}`);
        }
      }

      // Validar horário de funcionamento se alterado
      if (data.horaInicio || data.horaFim) {
        if (!this.isValidBusinessHours(horaInicio, horaFim)) {
          throw new ApiError(400, 'Horário deve estar dentro do funcionamento da instituição (07:00 - 22:00)');
        }

        const duration = this.calculateDuration(horaInicio, horaFim);
        if (duration < 30 || duration > 240) {
          throw new ApiError(400, 'Duração deve estar entre 30 minutos e 4 horas');
        }
      }

      const schedule = await this.scheduleRepository.updateSchedule(id, data);

      logger.info('Horário atualizado com sucesso', {
        scheduleId: id,
        changes: Object.keys(data)
      });

      return schedule;
    } catch (error) {
      logger.error('Erro ao atualizar horário', { error, id, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async deleteSchedule(id: string): Promise<void> {
    try {
      const schedule = await this.scheduleRepository.findScheduleById(id);
      if (!schedule) {
        throw new ApiError(404, 'Horário não encontrado');
      }

      await this.scheduleRepository.deleteSchedule(id);

      logger.info('Horário excluído com sucesso', {
        scheduleId: id,
        professorId: schedule.professorId,
        disciplinaId: schedule.disciplinaId
      });
    } catch (error) {
      logger.error('Erro ao excluir horário', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async createBulkSchedules(data: BulkScheduleData): Promise<{ success: number; errors: any[] }> {
    try {
      // Validar professor
      const professor = await this.prisma.user.findUnique({
        where: { 
          id: data.professorId,
          tipoUsuario: 'PROFESSOR'
        }
      });
      if (!professor) {
        throw new ApiError(404, 'Professor não encontrado');
      }

      // Validar disciplina
      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id: data.disciplinaId }
      });
      if (!disciplina || disciplina.status !== 'ATIVA') {
        throw new ApiError(404, 'Disciplina não encontrada ou inativa');
      }

      // Validar sala se fornecida
      if (data.salaId) {
        const sala = await this.prisma.sala.findUnique({
          where: { id: data.salaId }
        });
        if (!sala || !sala.disponivel) {
          throw new ApiError(404, 'Sala não encontrada ou indisponível');
        }
      }

      // Verificar conflitos para todos os horários
      for (const horario of data.horarios) {
        if (!this.isValidBusinessHours(horario.horaInicio, horario.horaFim)) {
          throw new ApiError(400, `Horário ${horario.horaInicio} - ${horario.horaFim} está fora do funcionamento`);
        }

        const duration = this.calculateDuration(horario.horaInicio, horario.horaFim);
        if (duration < 30 || duration > 240) {
          throw new ApiError(400, `Duração inválida para horário ${horario.horaInicio} - ${horario.horaFim}`);
        }

        const professorConflicts = await this.scheduleRepository.checkTimeConflicts(
          data.professorId,
          horario.diaSemana,
          horario.horaInicio,
          horario.horaFim,
          data.periodo
        );

        if (professorConflicts.length > 0) {
          throw new ApiError(409, `Conflito do professor em ${horario.diaSemana} ${horario.horaInicio}-${horario.horaFim}`);
        }

        if (data.salaId) {
          const salaConflicts = await this.scheduleRepository.checkClassroomConflicts(
            data.salaId,
            horario.diaSemana,
            horario.horaInicio,
            horario.horaFim,
            data.periodo
          );

          if (salaConflicts.length > 0) {
            throw new ApiError(409, `Conflito da sala em ${horario.diaSemana} ${horario.horaInicio}-${horario.horaFim}`);
          }
        }
      }

      const result = await this.scheduleRepository.createBulkSchedules(data);

      logger.info('Horários criados em lote', {
        professorId: data.professorId,
        disciplinaId: data.disciplinaId,
        totalHorarios: data.horarios.length,
        success: result.count
      });

      return {
        success: result.count,
        errors: []
      };
    } catch (error) {
      logger.error('Erro ao criar horários em lote', { error, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  // ==================== CLASSROOM OPERATIONS ====================

  async createClassroom(data: CreateClassroomData): Promise<ClassroomResponse> {
    try {
      // Verificar se já existe sala com o mesmo nome
      const existingClassroom = await this.prisma.sala.findFirst({
        where: { nome: data.nome }
      });

      if (existingClassroom) {
        throw new ApiError(409, 'Já existe uma sala com este nome');
      }

      const classroom = await this.scheduleRepository.createClassroom(data);

      logger.info('Sala criada com sucesso', {
        classroomId: classroom.id,
        nome: data.nome,
        tipo: data.tipo,
        capacidade: data.capacidade
      });

      return classroom;
    } catch (error) {
      logger.error('Erro ao criar sala', { error, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getClassrooms(filters: ClassroomFilters): Promise<ClassroomListResponse> {
    try {
      const pagina = Math.floor((filters.skip || 0) / (filters.take || 10)) + 1;
      const limite = filters.take || 10;

      const { classrooms, total } = await this.scheduleRepository.findClassrooms({
        ...filters,
        skip: (pagina - 1) * limite,
        take: limite,
      });

      const totalPaginas = Math.ceil(total / limite);

      return {
        classrooms,
        total,
        pagina,
        totalPaginas,
      };
    } catch (error) {
      logger.error('Erro ao buscar salas', { error, filters });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getClassroomById(id: string): Promise<ClassroomResponse> {
    try {
      const classroom = await this.scheduleRepository.findClassroomById(id);
      if (!classroom) {
        throw new ApiError(404, 'Sala não encontrada');
      }
      return classroom;
    } catch (error) {
      logger.error('Erro ao buscar sala por ID', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async updateClassroom(id: string, data: UpdateClassroomData): Promise<ClassroomResponse> {
    try {
      const existingClassroom = await this.scheduleRepository.findClassroomById(id);
      if (!existingClassroom) {
        throw new ApiError(404, 'Sala não encontrada');
      }

      // Verificar nome duplicado se alterado
      if (data.nome && data.nome !== existingClassroom.nome) {
        const duplicateClassroom = await this.prisma.sala.findFirst({
          where: { 
            nome: data.nome,
            id: { not: id }
          }
        });

        if (duplicateClassroom) {
          throw new ApiError(409, 'Já existe uma sala com este nome');
        }
      }

      const classroom = await this.scheduleRepository.updateClassroom(id, data);

      logger.info('Sala atualizada com sucesso', {
        classroomId: id,
        changes: Object.keys(data)
      });

      return classroom;
    } catch (error) {
      logger.error('Erro ao atualizar sala', { error, id, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async deleteClassroom(id: string): Promise<void> {
    try {
      const classroom = await this.scheduleRepository.findClassroomById(id);
      if (!classroom) {
        throw new ApiError(404, 'Sala não encontrada');
      }

      // Verificar se existem agendamentos ativos
      const activeSchedules = await this.prisma.horario.count({
        where: {
          salaId: id,
          ativo: true
        }
      });

      if (activeSchedules > 0) {
        throw new ApiError(400, `Não é possível excluir a sala. Existem ${activeSchedules} agendamentos ativos.`);
      }

      await this.scheduleRepository.deleteClassroom(id);

      logger.info('Sala excluída com sucesso', {
        classroomId: id,
        nome: classroom.nome
      });
    } catch (error) {
      logger.error('Erro ao excluir sala', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  // ==================== CALENDAR OPERATIONS ====================

  async createCalendarEvent(data: CreateAcademicCalendarData): Promise<CalendarResponse> {
    try {
      // Verificar sobreposição de eventos do mesmo tipo
      const overlappingEvents = await this.prisma.calendarioAcademico.findMany({
        where: {
          tipo: data.tipo,
          periodo: data.periodo,
          ativo: true,
          OR: [
            {
              AND: [
                { dataInicio: { lte: data.dataInicio } },
                { dataFim: { gt: data.dataInicio } }
              ]
            },
            {
              AND: [
                { dataInicio: { lt: data.dataFim } },
                { dataFim: { gte: data.dataFim } }
              ]
            },
            {
              AND: [
                { dataInicio: { gte: data.dataInicio } },
                { dataFim: { lte: data.dataFim } }
              ]
            }
          ]
        }
      });

      if (overlappingEvents.length > 0) {
        throw new ApiError(409, `Evento conflita com: ${overlappingEvents[0].nome}`);
      }

      const event = await this.scheduleRepository.createCalendarEvent(data);

      logger.info('Evento do calendário criado', {
        eventId: event.id,
        nome: data.nome,
        tipo: data.tipo,
        periodo: data.periodo
      });

      return event;
    } catch (error) {
      logger.error('Erro ao criar evento do calendário', { error, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getCalendarEvents(filters: CalendarFilters): Promise<CalendarListResponse> {
    try {
      const pagina = Math.floor((filters.skip || 0) / (filters.take || 10)) + 1;
      const limite = filters.take || 10;

      const { events, total } = await this.scheduleRepository.findCalendarEvents({
        ...filters,
        skip: (pagina - 1) * limite,
        take: limite,
      });

      const totalPaginas = Math.ceil(total / limite);

      return {
        events,
        total,
        pagina,
        totalPaginas,
      };
    } catch (error) {
      logger.error('Erro ao buscar eventos do calendário', { error, filters });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async updateCalendarEvent(id: string, data: UpdateAcademicCalendarData): Promise<CalendarResponse> {
    try {
      const existingEvent = await this.scheduleRepository.findCalendarEventById(id);
      if (!existingEvent) {
        throw new ApiError(404, 'Evento não encontrado');
      }

      const event = await this.scheduleRepository.updateCalendarEvent(id, data);

      logger.info('Evento do calendário atualizado', {
        eventId: id,
        changes: Object.keys(data)
      });

      return event;
    } catch (error) {
      logger.error('Erro ao atualizar evento do calendário', { error, id, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  // ==================== ADVANCED OPERATIONS ====================

  async getWeeklySchedule(professorId?: string, salaId?: string, periodo?: string): Promise<WeeklySchedule> {
    try {
      return await this.scheduleRepository.getWeeklySchedule(professorId, salaId, periodo);
    } catch (error) {
      logger.error('Erro ao buscar grade semanal', { error, professorId, salaId, periodo });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getProfessorSchedule(professorId: string, periodo: string): Promise<ProfessorSchedule> {
    try {
      const professor = await this.prisma.user.findUnique({
        where: { 
          id: professorId,
          tipoUsuario: 'PROFESSOR'
        }
      });
      if (!professor) {
        throw new ApiError(404, 'Professor não encontrado');
      }

      return await this.scheduleRepository.getProfessorSchedule(professorId, periodo);
    } catch (error) {
      logger.error('Erro ao buscar agenda do professor', { error, professorId, periodo });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getClassroomSchedule(salaId: string, periodo: string): Promise<ClassroomSchedule> {
    try {
      const sala = await this.prisma.sala.findUnique({
        where: { id: salaId }
      });
      if (!sala) {
        throw new ApiError(404, 'Sala não encontrada');
      }

      return await this.scheduleRepository.getClassroomSchedule(salaId, periodo);
    } catch (error) {
      logger.error('Erro ao buscar agenda da sala', { error, salaId, periodo });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getScheduleStats(periodo?: string): Promise<ScheduleStats> {
    try {
      return await this.scheduleRepository.getScheduleStats(periodo);
    } catch (error) {
      logger.error('Erro ao buscar estatísticas dos horários', { error, periodo });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getScheduleDashboard(periodo?: string): Promise<ScheduleDashboard> {
    try {
      const stats = await this.scheduleRepository.getScheduleStats(periodo);
      
      const { conflicts: conflitosRecentes } = await this.scheduleRepository.findConflicts({
        resolvido: false,
        take: 10
      });

      const { events: proximosEventos } = await this.scheduleRepository.findCalendarEvents({
        ativo: true,
        dataInicio: new Date(),
        take: 5
      });

      const alertas = [];

      // Gerar alertas baseados nas estatísticas
      if (stats.conflitosAtivos > 0) {
        alertas.push({
          tipo: 'ERROR' as const,
          mensagem: `${stats.conflitosAtivos} conflitos de horário precisam ser resolvidos`,
          data: new Date()
        });
      }

      if (stats.taxaOcupacaoMedia < 50) {
        alertas.push({
          tipo: 'WARNING' as const,
          mensagem: `Taxa de ocupação baixa: ${stats.taxaOcupacaoMedia.toFixed(1)}%`,
          data: new Date()
        });
      }

      if (stats.salasUtilizadas === 0) {
        alertas.push({
          tipo: 'WARNING' as const,
          mensagem: 'Nenhuma sala está sendo utilizada no período',
          data: new Date()
        });
      }

      return {
        stats,
        conflitosRecentes,
        proximosEventos,
        alertas
      };
    } catch (error) {
      logger.error('Erro ao buscar dashboard dos horários', { error, periodo });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getClassroomAvailability(salaId: string, data: Date, periodo: string): Promise<ClassroomAvailability> {
    try {
      const sala = await this.prisma.sala.findUnique({
        where: { id: salaId }
      });
      if (!sala) {
        throw new ApiError(404, 'Sala não encontrada');
      }

      return await this.scheduleRepository.getClassroomAvailability(salaId, data, periodo);
    } catch (error) {
      logger.error('Erro ao buscar disponibilidade da sala', { error, salaId, data, periodo });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getConflicts(filters: ConflictFilters): Promise<ConflictListResponse> {
    try {
      const pagina = Math.floor((filters.skip || 0) / (filters.take || 10)) + 1;
      const limite = filters.take || 10;

      const { conflicts, total } = await this.scheduleRepository.findConflicts({
        ...filters,
        skip: (pagina - 1) * limite,
        take: limite,
      });

      const totalPaginas = Math.ceil(total / limite);

      return {
        conflicts,
        total,
        pagina,
        totalPaginas,
      };
    } catch (error) {
      logger.error('Erro ao buscar conflitos', { error, filters });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async resolveConflict(id: string): Promise<ConflictResponse> {
    try {
      const conflict = await this.scheduleRepository.resolveConflict(id);
      
      logger.info('Conflito resolvido', {
        conflictId: id,
        tipo: conflict.tipo
      });

      return conflict;
    } catch (error) {
      logger.error('Erro ao resolver conflito', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  // ==================== HELPER METHODS ====================

  private isValidBusinessHours(horaInicio: string, horaFim: string): boolean {
    const inicio = this.timeToMinutes(horaInicio);
    const fim = this.timeToMinutes(horaFim);
    const abertura = this.timeToMinutes('07:00');
    const fechamento = this.timeToMinutes('22:00');

    return inicio >= abertura && fim <= fechamento && inicio < fim;
  }

  private calculateDuration(horaInicio: string, horaFim: string): number {
    const inicio = this.timeToMinutes(horaInicio);
    const fim = this.timeToMinutes(horaFim);
    return fim - inicio;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  async searchSchedules(searchTerm: string): Promise<ScheduleResponse[]> {
    try {
      const { schedules } = await this.scheduleRepository.findSchedules({
        search: searchTerm,
        take: 50,
      });

      return schedules;
    } catch (error) {
      logger.error('Erro ao pesquisar horários', { error, searchTerm });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async detectConflicts(periodo: string): Promise<ConflictResponse[]> {
    try {
      // Buscar todos os horários ativos do período
      const { schedules } = await this.scheduleRepository.findSchedules({
        periodo,
        ativo: true,
        take: 1000
      });

      const conflicts: any[] = [];

      // Detectar conflitos de professor
      for (let i = 0; i < schedules.length; i++) {
        for (let j = i + 1; j < schedules.length; j++) {
          const schedule1 = schedules[i];
          const schedule2 = schedules[j];

          // Mesmo professor, mesmo dia, horários sobrepostos
          if (schedule1.professorId === schedule2.professorId &&
              schedule1.diaSemana === schedule2.diaSemana &&
              this.hasTimeOverlap(schedule1, schedule2)) {
            
            const conflict = await this.scheduleRepository.createConflict({
              tipo: TipoConflito.PROFESSOR_SOBREPOSICAO,
              descricao: `Professor ${schedule1.professor?.nome} com conflito de horário`,
              scheduleId1: schedule1.id,
              scheduleId2: schedule2.id,
              professorId: schedule1.professorId
            });

            conflicts.push(conflict);
          }

          // Mesma sala, mesmo dia, horários sobrepostos
          if (schedule1.salaId && schedule2.salaId &&
              schedule1.salaId === schedule2.salaId &&
              schedule1.diaSemana === schedule2.diaSemana &&
              this.hasTimeOverlap(schedule1, schedule2)) {
            
            const conflict = await this.scheduleRepository.createConflict({
              tipo: TipoConflito.SALA_SOBREPOSICAO,
              descricao: `Sala ${schedule1.sala?.nome} com conflito de horário`,
              scheduleId1: schedule1.id,
              scheduleId2: schedule2.id,
              salaId: schedule1.salaId
            });

            conflicts.push(conflict);
          }
        }
      }

      logger.info('Detecção de conflitos concluída', {
        periodo,
        totalHorarios: schedules.length,
        conflitosDetectados: conflicts.length
      });

      return conflicts;
    } catch (error) {
      logger.error('Erro ao detectar conflitos', { error, periodo });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  private hasTimeOverlap(schedule1: ScheduleResponse, schedule2: ScheduleResponse): boolean {
    const inicio1 = this.timeToMinutes(schedule1.horaInicio);
    const fim1 = this.timeToMinutes(schedule1.horaFim);
    const inicio2 = this.timeToMinutes(schedule2.horaInicio);
    const fim2 = this.timeToMinutes(schedule2.horaFim);

    return !(fim1 <= inicio2 || fim2 <= inicio1);
  }
} 