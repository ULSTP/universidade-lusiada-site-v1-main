import { PrismaClient } from '@prisma/client';
import { CourseCreateData, CourseUpdateData, CourseFilters, CourseListResponse, CourseStatsResponse } from '../types/course';

export class CourseRepository {
  constructor(private prisma: PrismaClient) {}

  async create(courseData: CourseCreateData) {
    return await this.prisma.curso.create({
      data: courseData,
      include: {
        coordenador: true,
        departamento: true,
        disciplinas: true,
        _count: {
          select: {
            matriculas: true,
            disciplinas: true
          }
        }
      }
    });
  }

  async findById(id: string) {
    return await this.prisma.curso.findUnique({
      where: { id },
      include: {
        coordenador: true,
        departamento: true,
        disciplinas: true,
        matriculas: true,
        turmas: true,
        _count: {
          select: {
            matriculas: true,
            disciplinas: true,
            turmas: true
          }
        }
      }
    });
  }

  async findByCode(codigo: string) {
    return await this.prisma.curso.findUnique({
      where: { codigo },
      include: {
        coordenador: true,
        departamento: true,
        disciplinas: true
      }
    });
  }

  async update(id: string, courseData: CourseUpdateData) {
    return await this.prisma.curso.update({
      where: { id },
      data: courseData,
      include: {
        coordenador: true,
        departamento: true,
        disciplinas: true
      }
    });
  }

  async delete(id: string) {
    return await this.prisma.curso.delete({
      where: { id }
    });
  }

  async list(filters: CourseFilters, pagination: any) {
    const where: any = {};

    if (filters.nivel) {
      where.nivel = filters.nivel;
    }

    if (filters.departamentoId) {
      where.departamentoId = filters.departamentoId;
    }

    if (filters.coordenadorId) {
      where.coordenadorId = filters.coordenadorId;
    }

    if (filters.ativo !== undefined) {
      where.ativo = filters.ativo;
    }

    if (filters.search) {
      where.OR = [
        { nome: { contains: filters.search, mode: 'insensitive' } },
        { codigo: { contains: filters.search, mode: 'insensitive' } },
        { descricao: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [cursos, total] = await Promise.all([
      this.prisma.curso.findMany({
        where,
        include: {
          coordenador: true,
          departamento: true,
          disciplinas: true,
          _count: {
            select: {
              matriculas: true,
              disciplinas: true,
              turmas: true
            }
          }
        },
        orderBy: {
          [pagination.sortBy]: pagination.sortOrder
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      this.prisma.curso.count({ where })
    ]);

    return {
      cursos,
      total,
      pages: Math.ceil(total / pagination.limit)
    };
  }

  async getStats(): Promise<CourseStatsResponse> {
    const [total, porNivel, porDepartamento, ativos, inativos, matriculas, disciplinas] = await Promise.all([
      this.prisma.curso.count(),
      this.prisma.curso.groupBy({
        by: ['nivel'],
        _count: {
          nivel: true
        }
      }),
      this.prisma.curso.groupBy({
        by: ['departamentoId'],
        _count: {
          departamentoId: true
        }
      }),
      this.prisma.curso.count({ where: { ativo: true } }),
      this.prisma.curso.count({ where: { ativo: false } }),
      this.prisma.matricula.count(),
      this.prisma.disciplina.count()
    ]);

    return {
      total,
      porNivel: porNivel.map(item => ({
        nivel: item.nivel,
        quantidade: item._count.nivel
      })),
      porDepartamento: porDepartamento.map(item => ({
        departamentoId: item.departamentoId,
        quantidade: item._count.departamentoId
      })),
      ativos,
      inativos,
      totalMatriculas: matriculas,
      totalDisciplinas: disciplinas
    };
  }

  async findByDepartment(departamentoId: string) {
    return await this.prisma.curso.findMany({
      where: { departamentoId },
      include: {
        coordenador: true,
        departamento: true,
        disciplinas: true
      }
    });
  }

  async findByCoordinator(coordenadorId: string) {
    return await this.prisma.curso.findMany({
      where: { coordenadorId },
      include: {
        coordenador: true,
        departamento: true,
        disciplinas: true
      }
    });
  }

  async findActiveCourses() {
    return await this.prisma.curso.findMany({
      where: { ativo: true },
      include: {
        coordenador: true,
        departamento: true,
        disciplinas: true
      }
    });
  }

  async findInactiveCourses() {
    return await this.prisma.curso.findMany({
      where: { ativo: false },
      include: {
        coordenador: true,
        departamento: true,
        disciplinas: true
      }
    });
  }
} 