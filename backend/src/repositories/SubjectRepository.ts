import { PrismaClient } from '@prisma/client';
import { CreateSubjectData, UpdateSubjectData, SubjectFilters } from '../types/subject';

export class SubjectRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateSubjectData) {
    return this.prisma.disciplina.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        descricao: data.descricao,
        cargaHoraria: data.cargaHoraria,
        creditos: data.creditos,
        semestre: data.semestre,
        tipo: data.tipo,
        status: data.status || 'ATIVA',
        prerequisitos: data.prerequisitos,
        competencias: data.competencias,
        objetivos: data.objetivos,
        programa: data.programa,
        metodologia: data.metodologia,
        avaliacao: data.avaliacao,
        bibliografia: data.bibliografia,
        departamentoId: data.departamentoId,
        cursoId: data.cursoId,
        professorId: data.professorId,
      },
      include: {
        curso: {
          select: {
            id: true,
            nome: true,
            codigo: true,
          },
        },
        departamento: {
          select: {
            id: true,
            nome: true,
          },
        },
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        _count: {
          select: {
            inscricoes: true,
            turmas: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.disciplina.findUnique({
      where: { id },
      include: {
        curso: {
          select: {
            id: true,
            nome: true,
            codigo: true,
          },
        },
        departamento: {
          select: {
            id: true,
            nome: true,
          },
        },
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        turmas: {
          include: {
            _count: {
              select: {
                inscricoes: true,
              },
            },
          },
        },
        _count: {
          select: {
            inscricoes: true,
            turmas: true,
          },
        },
      },
    });
  }

  async findByCode(codigo: string) {
    return this.prisma.disciplina.findFirst({
      where: { codigo },
      include: {
        curso: true,
        departamento: true,
        professor: true,
      },
    });
  }

  async findMany(filters: SubjectFilters) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { nome: { contains: filters.search, mode: 'insensitive' } },
        { codigo: { contains: filters.search, mode: 'insensitive' } },
        { descricao: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.cursoId) {
      where.cursoId = filters.cursoId;
    }

    if (filters.departamentoId) {
      where.departamentoId = filters.departamentoId;
    }

    if (filters.professorId) {
      where.professorId = filters.professorId;
    }

    if (filters.semestre) {
      where.semestre = filters.semestre;
    }

    if (filters.tipo) {
      where.tipo = filters.tipo;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.creditos) {
      where.creditos = filters.creditos;
    }

    const [subjects, total] = await Promise.all([
      this.prisma.disciplina.findMany({
        where,
        include: {
          curso: {
            select: {
              id: true,
              nome: true,
              codigo: true,
            },
          },
          departamento: {
            select: {
              id: true,
              nome: true,
            },
          },
          professor: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          _count: {
            select: {
              inscricoes: true,
              turmas: true,
            },
          },
        },
        orderBy: filters.ordenacao || { nome: 'asc' },
        skip: filters.skip,
        take: filters.take,
      }),
      this.prisma.disciplina.count({ where }),
    ]);

    return { subjects, total };
  }

  async update(id: string, data: UpdateSubjectData) {
    return this.prisma.disciplina.update({
      where: { id },
      data: {
        ...(data.codigo && { codigo: data.codigo }),
        ...(data.nome && { nome: data.nome }),
        ...(data.descricao && { descricao: data.descricao }),
        ...(data.cargaHoraria && { cargaHoraria: data.cargaHoraria }),
        ...(data.creditos && { creditos: data.creditos }),
        ...(data.semestre && { semestre: data.semestre }),
        ...(data.tipo && { tipo: data.tipo }),
        ...(data.status && { status: data.status }),
        ...(data.prerequisitos && { prerequisitos: data.prerequisitos }),
        ...(data.competencias && { competencias: data.competencias }),
        ...(data.objetivos && { objetivos: data.objetivos }),
        ...(data.programa && { programa: data.programa }),
        ...(data.metodologia && { metodologia: data.metodologia }),
        ...(data.avaliacao && { avaliacao: data.avaliacao }),
        ...(data.bibliografia && { bibliografia: data.bibliografia }),
        ...(data.departamentoId && { departamentoId: data.departamentoId }),
        ...(data.cursoId && { cursoId: data.cursoId }),
        ...(data.professorId && { professorId: data.professorId }),
      },
      include: {
        curso: {
          select: {
            id: true,
            nome: true,
            codigo: true,
          },
        },
        departamento: {
          select: {
            id: true,
            nome: true,
          },
        },
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        _count: {
          select: {
            inscricoes: true,
            turmas: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.disciplina.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: 'ATIVA' | 'INATIVA' | 'SUSPENSA') {
    return this.prisma.disciplina.update({
      where: { id },
      data: { status },
      include: {
        curso: {
          select: {
            id: true,
            nome: true,
            codigo: true,
          },
        },
        departamento: {
          select: {
            id: true,
            nome: true,
          },
        },
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async getStats() {
    const [
      total,
      porStatus,
      porTipo,
      porSemestre,
      porCreditos,
      comMaisInscricoes,
      semTurmas,
    ] = await Promise.all([
      this.prisma.disciplina.count(),
      this.prisma.disciplina.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.disciplina.groupBy({
        by: ['tipo'],
        _count: { id: true },
      }),
      this.prisma.disciplina.groupBy({
        by: ['semestre'],
        _count: { id: true },
        orderBy: { semestre: 'asc' },
      }),
      this.prisma.disciplina.groupBy({
        by: ['creditos'],
        _count: { id: true },
        orderBy: { creditos: 'asc' },
      }),
      this.prisma.disciplina.findMany({
        include: {
          _count: {
            select: {
              inscricoes: true,
            },
          },
        },
        orderBy: {
          inscricoes: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
      this.prisma.disciplina.count({
        where: {
          turmas: {
            none: {},
          },
        },
      }),
    ]);

    return {
      total,
      porStatus: porStatus.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      porTipo: porTipo.reduce((acc, item) => {
        acc[item.tipo] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      porSemestre: porSemestre.reduce((acc, item) => {
        acc[`${item.semestre}º Semestre`] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      porCreditos: porCreditos.reduce((acc, item) => {
        acc[`${item.creditos} créditos`] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      comMaisInscricoes,
      semTurmas,
    };
  }

  async findByCourse(cursoId: string) {
    return this.prisma.disciplina.findMany({
      where: { cursoId },
      include: {
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        _count: {
          select: {
            inscricoes: true,
            turmas: true,
          },
        },
      },
      orderBy: { semestre: 'asc' },
    });
  }

  async findByProfessor(professorId: string) {
    return this.prisma.disciplina.findMany({
      where: { professorId },
      include: {
        curso: {
          select: {
            id: true,
            nome: true,
            codigo: true,
          },
        },
        departamento: {
          select: {
            id: true,
            nome: true,
          },
        },
        _count: {
          select: {
            inscricoes: true,
            turmas: true,
          },
        },
      },
      orderBy: { nome: 'asc' },
    });
  }
} 