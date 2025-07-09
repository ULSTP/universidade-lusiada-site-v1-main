import { PrismaClient } from '@prisma/client';
import { ScheduleCreateData, ScheduleUpdateData, ScheduleFilters, ScheduleResponse, ScheduleListResponse, ScheduleStats, ConflictResponse } from '../types/schedule';
import { ClassroomResponse } from '../types/classroom';
import { ApiError } from '../utils/apiError';

export class ScheduleRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: ScheduleCreateData): Promise<ScheduleResponse> {
    const schedule = await this.prisma.schedule.create({
      data: {
        disciplinaId: data.disciplinaId,
        professorId: data.professorId,
        salaId: data.salaId,
        diaSemana: data.diaSemana,
        horarioInicio: data.horarioInicio,
        horarioFim: data.horarioFim,
        anoLetivo: data.anoLetivo,
        semestre: data.semestre,
        status: data.status || 'ATIVO',
        observacoes: data.observacoes
      },
      include: {
        disciplina: {
          include: {
            curso: true
          }
        },
        professor: true,
        sala: true
      }
    });

    return this.mapToScheduleResponse(schedule);
  }

  async findAll(filters: ScheduleFilters = {}): Promise<ScheduleListResponse> {
    const where: any = {};

    if (filters.disciplinaId) where.disciplinaId = filters.disciplinaId;
    if (filters.professorId) where.professorId = filters.professorId;
    if (filters.salaId) where.salaId = filters.salaId;
    if (filters.diaSemana) where.diaSemana = filters.diaSemana;
    if (filters.anoLetivo) where.anoLetivo = filters.anoLetivo;
    if (filters.semestre) where.semestre = filters.semestre;
    if (filters.status) where.status = filters.status;

    const [schedules, total] = await Promise.all([
      this.prisma.schedule.findMany({
        where,
        include: {
          disciplina: {
            include: {
              curso: true
            }
          },
          professor: true,
          sala: true
        },
        skip: filters.skip || 0,
        take: filters.take || 10,
        orderBy: filters.ordenacao || { createdAt: 'desc' }
      }),
      this.prisma.schedule.count({ where })
    ]);

    return {
      schedules: schedules.map(schedule => this.mapToScheduleResponse(schedule)),
      total,
      pagina: Math.floor((filters.skip || 0) / (filters.take || 10)) + 1,
      totalPaginas: Math.ceil(total / (filters.take || 10))
    };
  }

  async findById(id: string): Promise<ScheduleResponse | null> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        disciplina: {
          include: {
            curso: true
          }
        },
        professor: true,
        sala: true
      }
    });

    return schedule ? this.mapToScheduleResponse(schedule) : null;
  }

  async update(id: string, data: ScheduleUpdateData): Promise<ScheduleResponse> {
    const schedule = await this.prisma.schedule.update({
      where: { id },
      data: {
        ...(data.disciplinaId && { disciplinaId: data.disciplinaId }),
        ...(data.professorId && { professorId: data.professorId }),
        ...(data.salaId !== undefined && { salaId: data.salaId }),
        ...(data.diaSemana && { diaSemana: data.diaSemana }),
        ...(data.horarioInicio && { horarioInicio: data.horarioInicio }),
        ...(data.horarioFim && { horarioFim: data.horarioFim }),
        ...(data.anoLetivo && { anoLetivo: data.anoLetivo }),
        ...(data.semestre && { semestre: data.semestre }),
        ...(data.status && { status: data.status }),
        ...(data.observacoes !== undefined && { observacoes: data.observacoes })
      },
      include: {
        disciplina: {
          include: {
            curso: true
          }
        },
        professor: true,
        sala: true
      }
    });

    return this.mapToScheduleResponse(schedule);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.schedule.delete({
      where: { id }
    });
  }

  async createMany(schedules: ScheduleCreateData[]): Promise<number> {
    const result = await this.prisma.schedule.createMany({
      data: schedules.map(schedule => ({
        disciplinaId: schedule.disciplinaId,
        professorId: schedule.professorId,
        salaId: schedule.salaId,
        diaSemana: schedule.diaSemana,
        horarioInicio: schedule.horarioInicio,
        horarioFim: schedule.horarioFim,
        anoLetivo: schedule.anoLetivo,
        semestre: schedule.semestre,
        status: schedule.status || 'ATIVO',
        observacoes: schedule.observacoes
      }))
    });

    return result.count;
  }

  async findConflicts(scheduleId: string): Promise<ConflictResponse[]> {
    const schedule = await this.findById(scheduleId);
    if (!schedule) {
      throw new ApiError(404, 'Horário não encontrado');
    }

    const conflictingSchedules = await this.prisma.schedule.findMany({
      where: {
        AND: [
          { id: { not: scheduleId } },
          { diaSemana: schedule.diaSemana },
          {
            OR: [
              {
                AND: [
                  { horarioInicio: { lte: schedule.horarioInicio } },
                  { horarioFim: { gt: schedule.horarioInicio } }
                ]
              },
              {
                AND: [
                  { horarioInicio: { lt: schedule.horarioFim } },
                  { horarioFim: { gte: schedule.horarioFim } }
                ]
              },
              {
                AND: [
                  { horarioInicio: { gte: schedule.horarioInicio } },
                  { horarioFim: { lte: schedule.horarioFim } }
                ]
              }
            ]
          }
        ]
      },
      include: {
        disciplina: true,
        professor: true,
        sala: true
      }
    });

    return conflictingSchedules.map(conflict => ({
      id: conflict.id,
      tipo: 'HORARIO',
      descricao: `Conflito com ${conflict.disciplina.nome}`,
      scheduleId1: scheduleId,
      scheduleId2: conflict.id,
      professorId: conflict.professorId,
      salaId: conflict.salaId,
      detectadoEm: new Date(),
      resolvido: false,
      resolvidoEm: null,
      schedule1: schedule,
      schedule2: this.mapToScheduleResponse(conflict)
    }));
  }

  async getStats(): Promise<ScheduleStats> {
    const [
      totalSchedules,
      schedules,
      totalSalas
    ] = await Promise.all([
      this.prisma.schedule.count(),
      this.prisma.schedule.findMany({
        include: {
          disciplina: true,
          professor: true,
          sala: true
        }
      }),
      this.prisma.sala.count()
    ]);

    const distribuicaoPorDia = schedules.reduce((acc, schedule) => {
      const dia = this.getDiaSemana(schedule.diaSemana);
      acc[dia] = (acc[dia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const distribuicaoPorHorario: Array<{ hora: string; quantidade: number }> = [];
    const horariosMap = schedules.reduce((acc, schedule) => {
      const hora = schedule.horarioInicio.split(':')[0];
      acc[hora] = (acc[hora] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    for (let hora = 8; hora <= 22; hora++) {
      const quantidade = horariosMap[hora.toString()] || 0;
      distribuicaoPorHorario.push({ hora: `${hora}:00`, quantidade });
    }

    const salasPopularesMap = schedules.reduce((acc, schedule) => {
      if (schedule.sala) {
        const salaNome = schedule.sala.nome;
        acc[salaNome] = (acc[salaNome] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const salasPopulares = Object.entries(salasPopularesMap)
      .map(([nome, agendamentos]) => ({
        sala: { id: '', nome, capacidade: 0, tipo: 'SALA_AULA', ativo: true },
        agendamentos,
        taxaOcupacao: (agendamentos / totalSchedules) * 100
      }))
      .sort((a, b) => b.agendamentos - a.agendamentos)
      .slice(0, 10);

    return {
      total: totalSchedules,
      distribuicaoPorDia,
      distribuicaoPorHorario,
      salasPopulares,
      totalSalas,
      taxaOcupacaoGeral: totalSchedules > 0 ? (totalSchedules / (totalSalas * 40)) * 100 : 0 // 40 horários por sala por semana
    };
  }

  private mapToScheduleResponse(schedule: any): ScheduleResponse {
    return {
      id: schedule.id,
      disciplinaId: schedule.disciplinaId,
      professorId: schedule.professorId,
      salaId: schedule.salaId,
      diaSemana: schedule.diaSemana,
      horaInicio: schedule.horarioInicio,
      horaFim: schedule.horarioFim,
      periodo: `${schedule.anoLetivo}/${schedule.semestre}`,
      ativo: schedule.status === 'ATIVO',
      criadoEm: schedule.createdAt,
      atualizadoEm: schedule.updatedAt,
      disciplina: {
        id: schedule.disciplina.id,
        nome: schedule.disciplina.nome,
        codigo: schedule.disciplina.codigo,
        curso: schedule.disciplina.curso
      },
      professor: {
        id: schedule.professor.id,
        nome: schedule.professor.nome,
        email: schedule.professor.email
      },
      sala: schedule.sala ? {
        id: schedule.sala.id,
        nome: schedule.sala.nome,
        capacidade: schedule.sala.capacidade,
        tipo: schedule.sala.tipo,
        ativo: schedule.sala.ativo
      } : undefined,
      conflitos: []
    };
  }

  private getDiaSemana(dia: number): string {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dia - 1] || 'Desconhecido';
  }
} 