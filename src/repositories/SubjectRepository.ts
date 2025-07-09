import { PrismaClient } from '@prisma/client';
import { CreateSubjectData, UpdateSubjectData, SubjectFilters, SubjectResponse, SubjectListResponse, SubjectStatsResponse } from '../types/subject';
import { ApiError } from '../utils/apiError';

export class SubjectRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateSubjectData): Promise<SubjectResponse> {
    const subject = await this.prisma.disciplina.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        descricao: data.descricao,
        cargaHoraria: data.cargaHoraria,
        creditos: data.creditos,
        semestre: data.semestre,
        tipo: data.tipo,
        status: data.status || 'ATIVA',
        preRequisitos: data.preRequisitos ? JSON.stringify(data.preRequisitos) : null,
        departamentoId: data.departamentoId,
        cursoId: data.cursoId,
        anoLetivo: new Date().getFullYear(),
        obrigatoria: data.tipo === 'OBRIGATORIA'
      },
      include: {
        curso: true,
        departamento: true
      }
    });

    return this.mapToSubjectResponse(subject);
  }

  async findAll(filters: SubjectFilters = {}): Promise<SubjectListResponse> {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { nome: { contains: filters.search, mode: 'insensitive' } },
        { codigo: { contains: filters.search, mode: 'insensitive' } },
        { descricao: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.cursoId) where.cursoId = filters.cursoId;
    if (filters.departamentoId) where.departamentoId = filters.departamentoId;
    if (filters.semestre) where.semestre = filters.semestre;
    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.status) where.status = filters.status;
    if (filters.creditos) where.creditos = filters.creditos;

    const [subjects, total] = await Promise.all([
      this.prisma.disciplina.findMany({
        where,
        include: {
          curso: true,
          departamento: true
        },
        skip: filters.skip || 0,
        take: filters.take || 10,
        orderBy: filters.ordenacao || { nome: 'asc' }
      }),
      this.prisma.disciplina.count({ where })
    ]);

    return {
      subjects: subjects.map(subject => this.mapToSubjectResponse(subject)),
      total,
      pagina: Math.floor((filters.skip || 0) / (filters.take || 10)) + 1,
      totalPaginas: Math.ceil(total / (filters.take || 10))
    };
  }

  async findById(id: string): Promise<SubjectResponse | null> {
    const subject = await this.prisma.disciplina.findUnique({
      where: { id },
      include: {
        curso: true,
        departamento: true
      }
    });

    return subject ? this.mapToSubjectResponse(subject) : null;
  }

  async findByCode(codigo: string): Promise<SubjectResponse | null> {
    const subject = await this.prisma.disciplina.findUnique({
      where: { codigo },
      include: {
        curso: true,
        departamento: true
      }
    });

    return subject ? this.mapToSubjectResponse(subject) : null;
  }

  async update(id: string, data: UpdateSubjectData): Promise<SubjectResponse> {
    const updateData: any = {};

    if (data.codigo) updateData.codigo = data.codigo;
    if (data.nome) updateData.nome = data.nome;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.cargaHoraria) updateData.cargaHoraria = data.cargaHoraria;
    if (data.creditos) updateData.creditos = data.creditos;
    if (data.semestre) updateData.semestre = data.semestre;
    if (data.tipo) updateData.tipo = data.tipo;
    if (data.status) updateData.status = data.status;
    if (data.preRequisitos) updateData.preRequisitos = JSON.stringify(data.preRequisitos);
    if (data.departamentoId) updateData.departamentoId = data.departamentoId;
    if (data.cursoId) updateData.cursoId = data.cursoId;

    const subject = await this.prisma.disciplina.update({
      where: { id },
      data: updateData,
      include: {
        curso: true,
        departamento: true
      }
    });

    return this.mapToSubjectResponse(subject);
  }

  async delete(id: string): Promise<void> {
    const subject = await this.prisma.disciplina.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            inscricoes: true
          }
        }
      }
    });

    if (!subject) {
      throw new ApiError(404, 'Disciplina não encontrada');
    }

    if (subject._count && subject._count.inscricoes > 0) {
      throw new ApiError(400, 'Não é possível excluir uma disciplina com inscrições ativas');
    }

    await this.prisma.disciplina.delete({
      where: { id }
    });
  }

  async updateStatus(id: string, status: string): Promise<SubjectResponse> {
    const subject = await this.prisma.disciplina.update({
      where: { id },
      data: { status },
      include: {
        curso: true,
        departamento: true
      }
    });

    return this.mapToSubjectResponse(subject);
  }

  async getStats(): Promise<SubjectStatsResponse> {
    const total = await this.prisma.disciplina.count();
    
    return {
      total,
      porStatus: {},
      porTipo: {},
      porSemestre: {},
      porCreditos: {},
      comMaisInscricoes: [],
      semTurmas: 0
    };
  }

  async findByCourse(cursoId: string): Promise<SubjectResponse[]> {
    const subjects = await this.prisma.disciplina.findMany({
      where: { cursoId },
      include: {
        curso: true,
        departamento: true,
        _count: {
          select: {
            inscricoes: true
          }
        }
      },
      orderBy: { semestre: 'asc' }
    });

    return subjects.map(subject => this.mapToSubjectResponse(subject));
  }

  async findByDepartment(departamentoId: string): Promise<SubjectResponse[]> {
    const subjects = await this.prisma.disciplina.findMany({
      where: { departamentoId },
      include: {
        curso: true,
        departamento: true,
        _count: {
          select: {
            inscricoes: true
          }
        }
      },
      orderBy: { nome: 'asc' }
    });

    return subjects.map(subject => this.mapToSubjectResponse(subject));
  }

  async findByProfessor(professorId: string): Promise<SubjectResponse[]> {
    const subjects = await this.prisma.disciplina.findMany({
      where: { 
        turmaDisciplinas: {
          some: {
            professorId
          }
        }
      },
      include: {
        curso: true,
        departamento: true,
        _count: {
          select: {
            inscricoes: true
          }
        }
      },
      orderBy: { nome: 'asc' }
    });

    return subjects.map(subject => this.mapToSubjectResponse(subject));
  }

  private mapToSubjectResponse(subject: any): SubjectResponse {
    return {
      id: subject.id,
      codigo: subject.codigo,
      nome: subject.nome,
      descricao: subject.descricao,
      cargaHoraria: subject.cargaHoraria,
      creditos: subject.creditos,
      semestre: subject.semestre,
      tipo: subject.tipo,
      status: subject.status,
      preRequisitos: subject.preRequisitos ? JSON.parse(subject.preRequisitos) : [],
      competencias: [],
      objetivos: '',
      programa: '',
      metodologia: '',
      avaliacao: '',
      bibliografia: [],
      departamentoId: subject.departamentoId,
      cursoId: subject.cursoId,
      professorId: undefined,
      curso: subject.curso ? {
        id: subject.curso.id,
        nome: subject.curso.nome,
        codigo: subject.curso.codigo
      } : undefined,
      departamento: subject.departamento ? {
        id: subject.departamento.id,
        nome: subject.departamento.nome
      } : undefined,
      professor: undefined,
      _count: undefined,
      criadoEm: subject.createdAt,
      atualizadoEm: subject.updatedAt
    };
  }
} 