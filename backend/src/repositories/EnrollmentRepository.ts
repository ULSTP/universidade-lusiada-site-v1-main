import { PrismaClient } from '@prisma/client';
import { CreateEnrollmentData, UpdateEnrollmentData, EnrollmentFilters, BulkEnrollmentData } from '../types/enrollment';

export class EnrollmentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateEnrollmentData) {
    return this.prisma.inscricao.create({
      data: {
        estudanteId: data.estudanteId,
        disciplinaId: data.disciplinaId,
        turmaId: data.turmaId,
        periodo: data.periodo,
        anoLetivo: data.anoLetivo,
        semestre: data.semestre,
        status: data.status || 'PENDENTE',
        observacoes: data.observacoes,
        dataInscricao: new Date(),
      },
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            email: true,
            numeroEstudante: true,
          },
        },
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            creditos: true,
            cargaHoraria: true,
            semestre: true,
            curso: {
              select: {
                id: true,
                nome: true,
                codigo: true,
              },
            },
          },
        },
        turma: {
          select: {
            id: true,
            codigo: true,
            capacidade: true,
            _count: {
              select: {
                inscricoes: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.inscricao.findUnique({
      where: { id },
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            email: true,
            numeroEstudante: true,
          },
        },
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            creditos: true,
            cargaHoraria: true,
            semestre: true,
            curso: {
              select: {
                id: true,
                nome: true,
                codigo: true,
              },
            },
          },
        },
        turma: {
          select: {
            id: true,
            codigo: true,
            capacidade: true,
            _count: {
              select: {
                inscricoes: true,
              },
            },
          },
        },
      },
    });
  }

  async findExisting(estudanteId: string, disciplinaId: string, periodo: string) {
    return this.prisma.inscricao.findFirst({
      where: {
        estudanteId,
        disciplinaId,
        periodo,
      },
    });
  }

  async findMany(filters: EnrollmentFilters) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        {
          estudante: {
            nome: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          estudante: {
            numeroEstudante: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          disciplina: {
            nome: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          disciplina: {
            codigo: { contains: filters.search, mode: 'insensitive' },
          },
        },
      ];
    }

    if (filters.estudanteId) {
      where.estudanteId = filters.estudanteId;
    }

    if (filters.disciplinaId) {
      where.disciplinaId = filters.disciplinaId;
    }

    if (filters.turmaId) {
      where.turmaId = filters.turmaId;
    }

    if (filters.cursoId) {
      where.disciplina = {
        cursoId: filters.cursoId,
      };
    }

    if (filters.departamentoId) {
      where.disciplina = {
        ...where.disciplina,
        departamentoId: filters.departamentoId,
      };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.periodo) {
      where.periodo = filters.periodo;
    }

    if (filters.anoLetivo) {
      where.anoLetivo = filters.anoLetivo;
    }

    if (filters.semestre) {
      where.semestre = filters.semestre;
    }

    const [enrollments, total] = await Promise.all([
      this.prisma.inscricao.findMany({
        where,
        include: {
          estudante: {
            select: {
              id: true,
              nome: true,
              email: true,
              numeroEstudante: true,
            },
          },
          disciplina: {
            select: {
              id: true,
              codigo: true,
              nome: true,
              creditos: true,
              cargaHoraria: true,
              semestre: true,
              curso: {
                select: {
                  id: true,
                  nome: true,
                  codigo: true,
                },
              },
            },
          },
          turma: {
            select: {
              id: true,
              codigo: true,
              capacidade: true,
              _count: {
                select: {
                  inscricoes: true,
                },
              },
            },
          },
        },
        orderBy: filters.ordenacao || { dataInscricao: 'desc' },
        skip: filters.skip,
        take: filters.take,
      }),
      this.prisma.inscricao.count({ where }),
    ]);

    return { enrollments, total };
  }

  async update(id: string, data: UpdateEnrollmentData) {
    return this.prisma.inscricao.update({
      where: { id },
      data: {
        ...(data.turmaId !== undefined && { turmaId: data.turmaId }),
        ...(data.status && { status: data.status }),
        ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
        ...(data.dataAprovacao && { dataAprovacao: data.dataAprovacao }),
        ...(data.dataRejeicao && { dataRejeicao: data.dataRejeicao }),
        ...(data.dataCancelamento && { dataCancelamento: data.dataCancelamento }),
        ...(data.motivo !== undefined && { motivo: data.motivo }),
      },
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            email: true,
            numeroEstudante: true,
          },
        },
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            creditos: true,
            cargaHoraria: true,
            semestre: true,
            curso: {
              select: {
                id: true,
                nome: true,
                codigo: true,
              },
            },
          },
        },
        turma: {
          select: {
            id: true,
            codigo: true,
            capacidade: true,
            _count: {
              select: {
                inscricoes: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.inscricao.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string, additionalData?: any) {
    const updateData: any = { status };

    if (status === 'APROVADA' && !additionalData?.dataAprovacao) {
      updateData.dataAprovacao = new Date();
    }
    if (status === 'REJEITADA' && !additionalData?.dataRejeicao) {
      updateData.dataRejeicao = new Date();
    }
    if (status === 'CANCELADA' && !additionalData?.dataCancelamento) {
      updateData.dataCancelamento = new Date();
    }

    if (additionalData?.motivo) {
      updateData.motivo = additionalData.motivo;
    }

    return this.prisma.inscricao.update({
      where: { id },
      data: updateData,
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            email: true,
            numeroEstudante: true,
          },
        },
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
          },
        },
      },
    });
  }

  async createBulk(data: BulkEnrollmentData) {
    const enrollmentsData = data.estudantesIds.map(estudanteId => ({
      estudanteId,
      disciplinaId: data.disciplinaId,
      turmaId: data.turmaId,
      periodo: data.periodo,
      anoLetivo: data.anoLetivo,
      semestre: data.semestre,
      status: 'PENDENTE' as const,
      observacoes: data.observacoes,
      dataInscricao: new Date(),
    }));

    return this.prisma.inscricao.createMany({
      data: enrollmentsData,
      skipDuplicates: true,
    });
  }

  async getStats() {
    const [
      total,
      porStatus,
      porPeriodo,
      porSemestre,
      aprovacoesPendentes,
      totalEstudantesInscritos,
      disciplinasComMaisInscricoes,
    ] = await Promise.all([
      this.prisma.inscricao.count(),
      this.prisma.inscricao.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.inscricao.groupBy({
        by: ['periodo'],
        _count: { id: true },
        orderBy: { periodo: 'desc' },
      }),
      this.prisma.inscricao.groupBy({
        by: ['semestre'],
        _count: { id: true },
        orderBy: { semestre: 'asc' },
      }),
      this.prisma.inscricao.count({
        where: { status: 'PENDENTE' },
      }),
      this.prisma.inscricao.groupBy({
        by: ['estudanteId'],
        _count: { id: true },
      }).then((result: any[]) => result.length),
      this.prisma.inscricao.groupBy({
        by: ['disciplinaId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    // Buscar detalhes das disciplinas com mais inscrições
    const disciplinasIds = disciplinasComMaisInscricoes.map((item: any) => item.disciplinaId);
    const disciplinasDetalhes = await this.prisma.disciplina.findMany({
      where: { id: { in: disciplinasIds } },
      select: { id: true, codigo: true, nome: true },
    });

    const disciplinasComDetalhes = disciplinasComMaisInscricoes.map((item: any) => ({
      disciplina: disciplinasDetalhes.find((d: any) => d.id === item.disciplinaId)!,
      inscricoes: item._count.id
    }));

    // Calcular média de inscrições por estudante
    const totalInscricoesAprovadas = await this.prisma.inscricao.count({
      where: { status: 'APROVADA' },
    });
    const mediaInscricoesPorEstudante = totalEstudantesInscritos > 0 
      ? Math.round((totalInscricoesAprovadas / totalEstudantesInscritos) * 100) / 100 
      : 0;

    // Buscar por curso
    const porCurso = await this.prisma.inscricao.groupBy({
      by: ['disciplinaId'],
      _count: { id: true },
    });

    const cursosIds = await this.prisma.disciplina.findMany({
      where: { id: { in: porCurso.map(p => p.disciplinaId) } },
      select: { id: true, cursoId: true },
    });

    const porCursoGrouped = cursosIds.reduce((acc, disciplina) => {
      const inscricoes = porCurso.find(p => p.disciplinaId === disciplina.id);
      if (inscricoes && disciplina.cursoId) {
        acc[disciplina.cursoId] = (acc[disciplina.cursoId] || 0) + inscricoes._count.id;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      porStatus: porStatus.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      porPeriodo: porPeriodo.reduce((acc, item) => {
        acc[item.periodo] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      porCurso: porCursoGrouped,
      porSemestre: porSemestre.reduce((acc, item) => {
        acc[`${item.semestre}º Semestre`] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      aprovacoesPendentes,
      totalEstudantesInscritos,
      mediaInscricoesPorEstudante,
      disciplinasComMaisInscricoes: disciplinasComDetalhes,
    };
  }

  async findByStudent(estudanteId: string, periodo?: string) {
    return this.prisma.inscricao.findMany({
      where: {
        estudanteId,
        ...(periodo && { periodo }),
      },
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            creditos: true,
            cargaHoraria: true,
            semestre: true,
            curso: {
              select: {
                id: true,
                nome: true,
                codigo: true,
              },
            },
          },
        },
        turma: {
          select: {
            id: true,
            codigo: true,
          },
        },
      },
      orderBy: { dataInscricao: 'desc' },
    });
  }

  async findBySubject(disciplinaId: string, periodo?: string) {
    return this.prisma.inscricao.findMany({
      where: {
        disciplinaId,
        ...(periodo && { periodo }),
      },
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            email: true,
            numeroEstudante: true,
          },
        },
        turma: {
          select: {
            id: true,
            codigo: true,
          },
        },
      },
      orderBy: { dataInscricao: 'desc' },
    });
  }

  async checkClassCapacity(turmaId: string) {
    const turma = await this.prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        _count: {
          select: {
            inscricoes: {
              where: {
                status: { in: ['APROVADA', 'PENDENTE'] },
              },
            },
          },
        },
      },
    });

    if (!turma) return null;

    return {
      capacidade: turma.capacidade,
      ocupadas: turma._count.inscricoes,
      disponiveis: turma.capacidade - turma._count.inscricoes,
      podeInscrever: turma._count.inscricoes < turma.capacidade,
    };
  }

  async checkPrerequisites(estudanteId: string, disciplinaId: string) {
    // Buscar pré-requisitos da disciplina
    const disciplina = await this.prisma.disciplina.findUnique({
      where: { id: disciplinaId },
      select: { prerequisitos: true },
    });

    if (!disciplina || !disciplina.prerequisitos?.length) {
      return {
        prerequisites: [],
        podeInscrever: true,
        motivos: [],
      };
    }

    // Buscar disciplinas dos pré-requisitos
    const prerequisitesData = await this.prisma.disciplina.findMany({
      where: { codigo: { in: disciplina.prerequisitos } },
      select: { id: true, codigo: true, nome: true },
    });

    // Verificar se o estudante cumpriu os pré-requisitos
    const prerequisites = await Promise.all(
      prerequisitesData.map(async (prereq) => {
        // Buscar nota do estudante nesta disciplina
        const nota = await this.prisma.nota.findFirst({
          where: {
            estudanteId,
            disciplinaId: prereq.id,
          },
          orderBy: { criadoEm: 'desc' },
        });

        // Verificar se tem inscrição aprovada atual
        const inscricaoAtual = await this.prisma.inscricao.findFirst({
          where: {
            estudanteId,
            disciplinaId: prereq.id,
            status: 'APROVADA',
          },
        });

        let status: 'CUMPRIDO' | 'NAO_CUMPRIDO' | 'EM_ANDAMENTO' = 'NAO_CUMPRIDO';

        if (nota && nota.notaFinal && nota.notaFinal >= 10) {
          status = 'CUMPRIDO';
        } else if (inscricaoAtual) {
          status = 'EM_ANDAMENTO';
        }

        return {
          disciplina: prereq,
          status,
          nota: nota?.notaFinal || undefined,
        };
      })
    );

    const naoAtendidos = prerequisites.filter(p => p.status === 'NAO_CUMPRIDO');
    const podeInscrever = naoAtendidos.length === 0;

    return {
      prerequisites,
      podeInscrever,
      motivos: naoAtendidos.length > 0 
        ? [`Pré-requisitos não atendidos: ${naoAtendidos.map(p => p.disciplina.codigo).join(', ')}`]
        : [],
    };
  }
} 