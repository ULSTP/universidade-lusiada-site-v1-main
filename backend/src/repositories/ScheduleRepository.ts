import { PrismaClient } from '@prisma/client';
import {
  Schedule,
  Classroom,
  AcademicCalendar,
  ScheduleConflict,
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
  ScheduleResponse,
  ClassroomResponse,
  CalendarResponse,
  ConflictResponse,
  WeeklySchedule,
  ProfessorSchedule,
  ClassroomSchedule,
  ScheduleStats,
  ClassroomAvailability,
  BulkScheduleData,
  ScheduleRecommendation,
  DiaSemana,
  TipoConflito,
  TipoSala,
  TipoEvento
} from '../types/schedule';

export class ScheduleRepository {
  constructor(private prisma: PrismaClient) {}

  // ==================== SCHEDULE OPERATIONS ====================

  async createSchedule(data: CreateScheduleData): Promise<ScheduleResponse> {
    const schedule = await this.prisma.horario.create({
      data: {
        disciplinaId: data.disciplinaId,
        professorId: data.professorId,
        salaId: data.salaId,
        diaSemana: data.diaSemana,
        horaInicio: data.horaInicio,
        horaFim: data.horaFim,
        periodo: data.periodo,
        ativo: true
      },
      include: {
        disciplina: true,
        professor: true,
        sala: true
      }
    });

    return this.formatScheduleResponse(schedule);
  }

  async findSchedules(filters: ScheduleFilters): Promise<{ schedules: ScheduleResponse[]; total: number }> {
    const where: any = {};

    if (filters.disciplinaId) where.disciplinaId = filters.disciplinaId;
    if (filters.professorId) where.professorId = filters.professorId;
    if (filters.salaId) where.salaId = filters.salaId;
    if (filters.diaSemana) where.diaSemana = filters.diaSemana;
    if (filters.periodo) where.periodo = filters.periodo;
    if (filters.ativo !== undefined) where.ativo = filters.ativo;
    if (filters.horaInicio) where.horaInicio = { gte: filters.horaInicio };
    if (filters.horaFim) where.horaFim = { lte: filters.horaFim };

    if (filters.search) {
      where.OR = [
        { disciplina: { nome: { contains: filters.search, mode: 'insensitive' } } },
        { disciplina: { codigo: { contains: filters.search, mode: 'insensitive' } } },
        { professor: { nome: { contains: filters.search, mode: 'insensitive' } } },
        { sala: { nome: { contains: filters.search, mode: 'insensitive' } } }
      ];
    }

    const [schedules, total] = await Promise.all([
      this.prisma.horario.findMany({
        where,
        include: {
          disciplina: true,
          professor: true,
          sala: true,
          conflitos: {
            where: { resolvido: false }
          }
        },
        skip: filters.skip,
        take: filters.take,
        orderBy: [
          { diaSemana: 'asc' },
          { horaInicio: 'asc' }
        ]
      }),
      this.prisma.horario.count({ where })
    ]);

    return {
      schedules: schedules.map(this.formatScheduleResponse),
      total
    };
  }

  async findScheduleById(id: string): Promise<ScheduleResponse | null> {
    const schedule = await this.prisma.horario.findUnique({
      where: { id },
      include: {
        disciplina: true,
        professor: true,
        sala: true,
        conflitos: true
      }
    });

    return schedule ? this.formatScheduleResponse(schedule) : null;
  }

  async updateSchedule(id: string, data: UpdateScheduleData): Promise<ScheduleResponse> {
    const schedule = await this.prisma.horario.update({
      where: { id },
      data: {
        ...data,
        atualizadoEm: new Date()
      },
      include: {
        disciplina: true,
        professor: true,
        sala: true,
        conflitos: true
      }
    });

    return this.formatScheduleResponse(schedule);
  }

  async deleteSchedule(id: string): Promise<void> {
    await this.prisma.horario.delete({
      where: { id }
    });
  }

  async createBulkSchedules(data: BulkScheduleData): Promise<{ count: number }> {
    const scheduleData = data.horarios.map(horario => ({
      disciplinaId: data.disciplinaId,
      professorId: data.professorId,
      salaId: data.salaId,
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFim: horario.horaFim,
      periodo: data.periodo,
      ativo: true
    }));

    const result = await this.prisma.horario.createMany({
      data: scheduleData
    });

    return { count: result.count };
  }

  // ==================== CLASSROOM OPERATIONS ====================

  async createClassroom(data: CreateClassroomData): Promise<ClassroomResponse> {
    const classroom = await this.prisma.sala.create({
      data: {
        nome: data.nome,
        capacidade: data.capacidade,
        tipo: data.tipo,
        equipamentos: data.equipamentos || [],
        localizacao: data.localizacao,
        disponivel: true
      }
    });

    return this.formatClassroomResponse(classroom);
  }

  async findClassrooms(filters: ClassroomFilters): Promise<{ classrooms: ClassroomResponse[]; total: number }> {
    const where: any = {};

    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.capacidadeMinima) where.capacidade = { gte: filters.capacidadeMinima };
    if (filters.disponivel !== undefined) where.disponivel = filters.disponivel;

    if (filters.search) {
      where.OR = [
        { nome: { contains: filters.search, mode: 'insensitive' } },
        { localizacao: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [classrooms, total] = await Promise.all([
      this.prisma.sala.findMany({
        where,
        include: {
          agendamentos: {
            where: { ativo: true },
            include: {
              disciplina: true,
              professor: true
            }
          }
        },
        skip: filters.skip,
        take: filters.take,
        orderBy: { nome: 'asc' }
      }),
      this.prisma.sala.count({ where })
    ]);

    return {
      classrooms: classrooms.map(this.formatClassroomResponse),
      total
    };
  }

  async findClassroomById(id: string): Promise<ClassroomResponse | null> {
    const classroom = await this.prisma.sala.findUnique({
      where: { id },
      include: {
        agendamentos: {
          where: { ativo: true },
          include: {
            disciplina: true,
            professor: true
          }
        }
      }
    });

    return classroom ? this.formatClassroomResponse(classroom) : null;
  }

  async updateClassroom(id: string, data: UpdateClassroomData): Promise<ClassroomResponse> {
    const classroom = await this.prisma.sala.update({
      where: { id },
      data: {
        ...data,
        atualizadoEm: new Date()
      },
      include: {
        agendamentos: {
          where: { ativo: true },
          include: {
            disciplina: true,
            professor: true
          }
        }
      }
    });

    return this.formatClassroomResponse(classroom);
  }

  async deleteClassroom(id: string): Promise<void> {
    await this.prisma.sala.delete({
      where: { id }
    });
  }

  // ==================== CALENDAR OPERATIONS ====================

  async createCalendarEvent(data: CreateAcademicCalendarData): Promise<CalendarResponse> {
    const event = await this.prisma.calendarioAcademico.create({
      data: {
        nome: data.nome,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        periodo: data.periodo,
        tipo: data.tipo,
        descricao: data.descricao,
        ativo: true
      }
    });

    return this.formatCalendarResponse(event);
  }

  async findCalendarEvents(filters: CalendarFilters): Promise<{ events: CalendarResponse[]; total: number }> {
    const where: any = {};

    if (filters.periodo) where.periodo = filters.periodo;
    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.ativo !== undefined) where.ativo = filters.ativo;
    if (filters.dataInicio) where.dataInicio = { gte: filters.dataInicio };
    if (filters.dataFim) where.dataFim = { lte: filters.dataFim };

    if (filters.search) {
      where.OR = [
        { nome: { contains: filters.search, mode: 'insensitive' } },
        { descricao: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [events, total] = await Promise.all([
      this.prisma.calendarioAcademico.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy: { dataInicio: 'asc' }
      }),
      this.prisma.calendarioAcademico.count({ where })
    ]);

    return {
      events: events.map(this.formatCalendarResponse),
      total
    };
  }

  async findCalendarEventById(id: string): Promise<CalendarResponse | null> {
    const event = await this.prisma.calendarioAcademico.findUnique({
      where: { id }
    });

    return event ? this.formatCalendarResponse(event) : null;
  }

  async updateCalendarEvent(id: string, data: UpdateAcademicCalendarData): Promise<CalendarResponse> {
    const event = await this.prisma.calendarioAcademico.update({
      where: { id },
      data: {
        ...data,
        atualizadoEm: new Date()
      }
    });

    return this.formatCalendarResponse(event);
  }

  async deleteCalendarEvent(id: string): Promise<void> {
    await this.prisma.calendarioAcademico.delete({
      where: { id }
    });
  }

  // ==================== CONFLICT OPERATIONS ====================

  async createConflict(data: {
    tipo: TipoConflito;
    descricao: string;
    scheduleId1: string;
    scheduleId2?: string;
    professorId?: string;
    salaId?: string;
  }): Promise<ConflictResponse> {
    const conflict = await this.prisma.conflitoHorario.create({
      data: {
        tipo: data.tipo,
        descricao: data.descricao,
        scheduleId1: data.scheduleId1,
        scheduleId2: data.scheduleId2,
        professorId: data.professorId,
        salaId: data.salaId,
        resolvido: false
      },
      include: {
        schedule1: {
          include: {
            disciplina: true,
            professor: true,
            sala: true
          }
        },
        schedule2: {
          include: {
            disciplina: true,
            professor: true,
            sala: true
          }
        }
      }
    });

    return this.formatConflictResponse(conflict);
  }

  async findConflicts(filters: ConflictFilters): Promise<{ conflicts: ConflictResponse[]; total: number }> {
    const where: any = {};

    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.resolvido !== undefined) where.resolvido = filters.resolvido;
    if (filters.professorId) where.professorId = filters.professorId;
    if (filters.salaId) where.salaId = filters.salaId;
    if (filters.periodo) {
      where.OR = [
        { schedule1: { periodo: filters.periodo } },
        { schedule2: { periodo: filters.periodo } }
      ];
    }

    const [conflicts, total] = await Promise.all([
      this.prisma.conflitoHorario.findMany({
        where,
        include: {
          schedule1: {
            include: {
              disciplina: true,
              professor: true,
              sala: true
            }
          },
          schedule2: {
            include: {
              disciplina: true,
              professor: true,
              sala: true
            }
          }
        },
        skip: filters.skip,
        take: filters.take,
        orderBy: { detectadoEm: 'desc' }
      }),
      this.prisma.conflitoHorario.count({ where })
    ]);

    return {
      conflicts: conflicts.map(this.formatConflictResponse),
      total
    };
  }

  async resolveConflict(id: string): Promise<ConflictResponse> {
    const conflict = await this.prisma.conflitoHorario.update({
      where: { id },
      data: {
        resolvido: true,
        resolvidoEm: new Date()
      },
      include: {
        schedule1: {
          include: {
            disciplina: true,
            professor: true,
            sala: true
          }
        },
        schedule2: {
          include: {
            disciplina: true,
            professor: true,
            sala: true
          }
        }
      }
    });

    return this.formatConflictResponse(conflict);
  }

  // ==================== COMPLEX QUERIES ====================

  async getWeeklySchedule(professorId?: string, salaId?: string, periodo?: string): Promise<WeeklySchedule> {
    const where: any = { ativo: true };
    if (professorId) where.professorId = professorId;
    if (salaId) where.salaId = salaId;
    if (periodo) where.periodo = periodo;

    const schedules = await this.prisma.horario.findMany({
      where,
      include: {
        disciplina: true,
        professor: true,
        sala: true
      },
      orderBy: [
        { diaSemana: 'asc' },
        { horaInicio: 'asc' }
      ]
    });

    const weeklySchedule: WeeklySchedule = {
      periodo: periodo || 'Atual',
      semana: {
        DOMINGO: { dia: DiaSemana.DOMINGO, horarios: [] },
        SEGUNDA: { dia: DiaSemana.SEGUNDA, horarios: [] },
        TERCA: { dia: DiaSemana.TERCA, horarios: [] },
        QUARTA: { dia: DiaSemana.QUARTA, horarios: [] },
        QUINTA: { dia: DiaSemana.QUINTA, horarios: [] },
        SEXTA: { dia: DiaSemana.SEXTA, horarios: [] },
        SABADO: { dia: DiaSemana.SABADO, horarios: [] }
      }
    };

    schedules.forEach(schedule => {
      weeklySchedule.semana[schedule.diaSemana].horarios.push({
        horaInicio: schedule.horaInicio,
        horaFim: schedule.horaFim,
        disponivel: false,
        agendamento: this.formatScheduleResponse(schedule)
      });
    });

    return weeklySchedule;
  }

  async getProfessorSchedule(professorId: string, periodo: string): Promise<ProfessorSchedule> {
    const professor = await this.prisma.user.findUnique({
      where: { id: professorId }
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    const schedules = await this.prisma.horario.findMany({
      where: {
        professorId,
        periodo,
        ativo: true
      },
      include: {
        disciplina: true,
        sala: true
      }
    });

    const conflitos = await this.prisma.conflitoHorario.findMany({
      where: {
        professorId,
        resolvido: false
      },
      include: {
        schedule1: true,
        schedule2: true
      }
    });

    const disciplinasMap = new Map();
    let totalHoras = 0;

    schedules.forEach(schedule => {
      const disciplinaId = schedule.disciplina.id;
      const horaInicioFloat = this.timeToFloat(schedule.horaInicio);
      const horaFimFloat = this.timeToFloat(schedule.horaFim);
      const horasAula = horaFimFloat - horaInicioFloat;

      totalHoras += horasAula;

      if (!disciplinasMap.has(disciplinaId)) {
        disciplinasMap.set(disciplinaId, {
          disciplina: schedule.disciplina,
          horarios: [],
          horasSemanais: 0
        });
      }

      const disciplinaData = disciplinasMap.get(disciplinaId);
      disciplinaData.horarios.push(this.formatScheduleResponse(schedule));
      disciplinaData.horasSemanais += horasAula;
    });

    const disponibilidade = await this.getWeeklySchedule(professorId, undefined, periodo);

    return {
      professor,
      periodo,
      totalHoras,
      disciplinas: Array.from(disciplinasMap.values()),
      conflitos: conflitos.map(this.formatConflictResponse),
      disponibilidade
    };
  }

  async getClassroomSchedule(salaId: string, periodo: string): Promise<ClassroomSchedule> {
    const sala = await this.prisma.sala.findUnique({
      where: { id: salaId }
    });

    if (!sala) {
      throw new Error('Sala não encontrada');
    }

    const agendamentos = await this.prisma.horario.findMany({
      where: {
        salaId,
        periodo,
        ativo: true
      },
      include: {
        disciplina: true,
        professor: true
      }
    });

    const conflitos = await this.prisma.conflitoHorario.findMany({
      where: {
        salaId,
        resolvido: false
      },
      include: {
        schedule1: true,
        schedule2: true
      }
    });

    const totalHorasSemanais = 5 * 12; // 5 dias × 12 horas de funcionamento
    const horasOcupadas = agendamentos.reduce((total, agendamento) => {
      const horaInicioFloat = this.timeToFloat(agendamento.horaInicio);
      const horaFimFloat = this.timeToFloat(agendamento.horaFim);
      return total + (horaFimFloat - horaInicioFloat);
    }, 0);

    const taxaOcupacao = (horasOcupadas / totalHorasSemanais) * 100;

    return {
      sala: this.formatClassroomResponse(sala),
      periodo,
      taxaOcupacao,
      agendamentos: agendamentos.map(this.formatScheduleResponse),
      horariosDisponiveis: [],
      conflitos: conflitos.map(this.formatConflictResponse)
    };
  }

  async getScheduleStats(periodo?: string): Promise<ScheduleStats> {
    const where: any = { ativo: true };
    if (periodo) where.periodo = periodo;

    const [
      totalAgendamentos,
      salasUtilizadas,
      professoresAtivos,
      disciplinasAgendadas,
      conflitosAtivos,
      conflitosResolvidos,
      schedules
    ] = await Promise.all([
      this.prisma.horario.count({ where }),
      this.prisma.horario.findMany({
        where,
        select: { salaId: true },
        distinct: ['salaId']
      }).then(result => result.filter(r => r.salaId).length),
      this.prisma.horario.findMany({
        where,
        select: { professorId: true },
        distinct: ['professorId']
      }).then(result => result.length),
      this.prisma.horario.findMany({
        where,
        select: { disciplinaId: true },
        distinct: ['disciplinaId']
      }).then(result => result.length),
      this.prisma.conflitoHorario.count({ where: { resolvido: false } }),
      this.prisma.conflitoHorario.count({ where: { resolvido: true } }),
      this.prisma.horario.findMany({
        where,
        include: { sala: true }
      })
    ]);

    const distribuicaoPorDia = schedules.reduce((acc, schedule) => {
      acc[schedule.diaSemana] = (acc[schedule.diaSemana] || 0) + 1;
      return acc;
    }, {} as { [key in DiaSemana]: number });

    const distribuicaoPorHorario: Array<{ hora: string; quantidade: number }> = [];
    const horariosMap = schedules.reduce((acc, schedule) => {
      const hora = schedule.horaInicio.substring(0, 2);
      acc[hora] = (acc[hora] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    Object.entries(horariosMap).forEach(([hora, quantidade]) => {
      distribuicaoPorHorario.push({ hora: `${hora}:00`, quantidade });
    });

    const salasPopularesMap = schedules.reduce((acc, schedule) => {
      if (schedule.sala) {
        const salaId = schedule.sala.id;
        if (!acc[salaId]) {
          acc[salaId] = {
            sala: this.formatClassroomResponse(schedule.sala),
            agendamentos: 0,
            taxaOcupacao: 0
          };
        }
        acc[salaId].agendamentos += 1;
      }
      return acc;
    }, {} as { [key: string]: any });

    const salasPopulares = Object.values(salasPopularesMap).sort((a: any, b: any) => 
      b.agendamentos - a.agendamentos
    ).slice(0, 5);

    const totalSalas = await this.prisma.sala.count();
    const taxaOcupacaoMedia = totalSalas > 0 ? (salasUtilizadas / totalSalas) * 100 : 0;

    return {
      totalAgendamentos,
      salasUtilizadas,
      professoresAtivos,
      disciplinasAgendadas,
      conflitosAtivos,
      conflitosResolvidos,
      taxaOcupacaoMedia,
      distribuicaoPorDia,
      distribuicaoPorHorario,
      salasPopulares
    };
  }

  async checkTimeConflicts(
    professorId: string,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFim: string,
    periodo: string,
    excludeScheduleId?: string
  ): Promise<ScheduleConflict[]> {
    const where: any = {
      professorId,
      diaSemana,
      periodo,
      ativo: true,
      OR: [
        {
          AND: [
            { horaInicio: { lte: horaInicio } },
            { horaFim: { gt: horaInicio } }
          ]
        },
        {
          AND: [
            { horaInicio: { lt: horaFim } },
            { horaFim: { gte: horaFim } }
          ]
        },
        {
          AND: [
            { horaInicio: { gte: horaInicio } },
            { horaFim: { lte: horaFim } }
          ]
        }
      ]
    };

    if (excludeScheduleId) {
      where.id = { not: excludeScheduleId };
    }

    const conflictingSchedules = await this.prisma.horario.findMany({
      where,
      include: {
        disciplina: true,
        professor: true,
        sala: true
      }
    });

    return conflictingSchedules.map(schedule => ({
      id: `temp-${Date.now()}`,
      tipo: TipoConflito.PROFESSOR_SOBREPOSICAO,
      descricao: `Conflito de horário do professor ${schedule.professor.nome}`,
      scheduleId1: schedule.id,
      professorId: schedule.professorId,
      detectadoEm: new Date(),
      resolvido: false,
      schedule1: this.formatScheduleResponse(schedule)
    }));
  }

  async checkClassroomConflicts(
    salaId: string,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFim: string,
    periodo: string,
    excludeScheduleId?: string
  ): Promise<ScheduleConflict[]> {
    const where: any = {
      salaId,
      diaSemana,
      periodo,
      ativo: true,
      OR: [
        {
          AND: [
            { horaInicio: { lte: horaInicio } },
            { horaFim: { gt: horaInicio } }
          ]
        },
        {
          AND: [
            { horaInicio: { lt: horaFim } },
            { horaFim: { gte: horaFim } }
          ]
        },
        {
          AND: [
            { horaInicio: { gte: horaInicio } },
            { horaFim: { lte: horaFim } }
          ]
        }
      ]
    };

    if (excludeScheduleId) {
      where.id = { not: excludeScheduleId };
    }

    const conflictingSchedules = await this.prisma.horario.findMany({
      where,
      include: {
        disciplina: true,
        professor: true,
        sala: true
      }
    });

    return conflictingSchedules.map(schedule => ({
      id: `temp-${Date.now()}`,
      tipo: TipoConflito.SALA_SOBREPOSICAO,
      descricao: `Conflito de sala ${schedule.sala?.nome}`,
      scheduleId1: schedule.id,
      salaId: schedule.salaId,
      detectadoEm: new Date(),
      resolvido: false,
      schedule1: this.formatScheduleResponse(schedule)
    }));
  }

  async getClassroomAvailability(salaId: string, data: Date, periodo: string): Promise<ClassroomAvailability> {
    const sala = await this.prisma.sala.findUnique({
      where: { id: salaId }
    });

    if (!sala) {
      throw new Error('Sala não encontrada');
    }

    const diaSemana = this.getDayOfWeek(data);
    
    const agendamentos = await this.prisma.horario.findMany({
      where: {
        salaId,
        diaSemana,
        periodo,
        ativo: true
      },
      orderBy: { horaInicio: 'asc' }
    });

    const horariosDisponiveis = [];
    const horaInicioFuncionamento = '07:00';
    const horaFimFuncionamento = '22:00';

    let horaAtual = horaInicioFuncionamento;

    for (const agendamento of agendamentos) {
      if (horaAtual < agendamento.horaInicio) {
        horariosDisponiveis.push({
          horaInicio: horaAtual,
          horaFim: agendamento.horaInicio,
          disponivel: true
        });
      }

      horariosDisponiveis.push({
        horaInicio: agendamento.horaInicio,
        horaFim: agendamento.horaFim,
        disponivel: false,
        motivo: `Ocupado pela disciplina ${agendamento.disciplinaId}`
      });

      horaAtual = agendamento.horaFim;
    }

    if (horaAtual < horaFimFuncionamento) {
      horariosDisponiveis.push({
        horaInicio: horaAtual,
        horaFim: horaFimFuncionamento,
        disponivel: true
      });
    }

    return {
      sala: this.formatClassroomResponse(sala),
      periodo,
      data,
      horariosDisponiveis
    };
  }

  // ==================== HELPER METHODS ====================

  private formatScheduleResponse(schedule: any): ScheduleResponse {
    return {
      id: schedule.id,
      disciplinaId: schedule.disciplinaId,
      professorId: schedule.professorId,
      salaId: schedule.salaId,
      diaSemana: schedule.diaSemana,
      horaInicio: schedule.horaInicio,
      horaFim: schedule.horaFim,
      periodo: schedule.periodo,
      ativo: schedule.ativo,
      criadoEm: schedule.criadoEm,
      atualizadoEm: schedule.atualizadoEm,
      disciplina: schedule.disciplina,
      professor: schedule.professor,
      sala: schedule.sala ? this.formatClassroomResponse(schedule.sala) : undefined,
      conflitos: schedule.conflitos?.map(this.formatConflictResponse) || []
    };
  }

  private formatClassroomResponse(classroom: any): ClassroomResponse {
    return {
      id: classroom.id,
      nome: classroom.nome,
      capacidade: classroom.capacidade,
      tipo: classroom.tipo,
      equipamentos: classroom.equipamentos || [],
      disponivel: classroom.disponivel,
      localizacao: classroom.localizacao,
      criadoEm: classroom.criadoEm,
      atualizadoEm: classroom.atualizadoEm,
      agendamentos: classroom.agendamentos?.map(this.formatScheduleResponse) || []
    };
  }

  private formatCalendarResponse(event: any): CalendarResponse {
    return {
      id: event.id,
      nome: event.nome,
      dataInicio: event.dataInicio,
      dataFim: event.dataFim,
      periodo: event.periodo,
      tipo: event.tipo,
      descricao: event.descricao,
      ativo: event.ativo,
      criadoEm: event.criadoEm,
      atualizadoEm: event.atualizadoEm
    };
  }

  private formatConflictResponse(conflict: any): ConflictResponse {
    return {
      id: conflict.id,
      tipo: conflict.tipo,
      descricao: conflict.descricao,
      scheduleId1: conflict.scheduleId1,
      scheduleId2: conflict.scheduleId2,
      professorId: conflict.professorId,
      salaId: conflict.salaId,
      detectadoEm: conflict.detectadoEm,
      resolvido: conflict.resolvido,
      resolvidoEm: conflict.resolvidoEm,
      schedule1: conflict.schedule1 ? this.formatScheduleResponse(conflict.schedule1) : undefined,
      schedule2: conflict.schedule2 ? this.formatScheduleResponse(conflict.schedule2) : undefined
    };
  }

  private timeToFloat(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }

  private getDayOfWeek(date: Date): DiaSemana {
    const days = [
      DiaSemana.DOMINGO,
      DiaSemana.SEGUNDA,
      DiaSemana.TERCA,
      DiaSemana.QUARTA,
      DiaSemana.QUINTA,
      DiaSemana.SEXTA,
      DiaSemana.SABADO
    ];
    return days[date.getDay()];
  }
} 