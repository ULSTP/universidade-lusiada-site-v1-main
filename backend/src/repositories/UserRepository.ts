import { PrismaClient } from '@prisma/client';
import { UserCreateData, UserUpdateData, UserFilters, UserListResponse, UserStatsResponse } from '../types/user';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userData: UserCreateData) {
    return await this.prisma.user.create({
      data: userData
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findByStudentNumber(numeroEstudante: string) {
    return await this.prisma.user.findUnique({
      where: { numeroEstudante }
    });
  }

  async findByEmployeeNumber(numeroFuncionario: string) {
    return await this.prisma.user.findUnique({
      where: { numeroFuncionario }
    });
  }

  async update(id: string, userData: UserUpdateData) {
    return await this.prisma.user.update({
      where: { id },
      data: userData
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: { id }
    });
  }

  async list(filters: UserFilters, pagination: any) {
    const where: any = {};

    if (filters.tipoUsuario) {
      where.tipoUsuario = filters.tipoUsuario;
    }

    if (filters.estado) {
      where.estado = filters.estado;
    }

    if (filters.search) {
      where.OR = [
        { nome: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { numeroEstudante: { contains: filters.search, mode: 'insensitive' } },
        { numeroFuncionario: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: {
          [pagination.sortBy]: pagination.sortOrder
        },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / pagination.limit)
    };
  }

  async getStats(): Promise<UserStatsResponse> {
    const [total, porTipo, porEstado, ativos, inativos] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({
        by: ['tipoUsuario'],
        _count: {
          tipoUsuario: true
        }
      }),
      this.prisma.user.groupBy({
        by: ['estado'],
        _count: {
          estado: true
        }
      }),
      this.prisma.user.count({
        where: { estado: 'ATIVO' }
      }),
      this.prisma.user.count({
        where: { estado: 'INATIVO' }
      })
    ]);

    return {
      total,
      porTipo: porTipo.map(item => ({
        tipo: item.tipoUsuario,
        quantidade: item._count.tipoUsuario
      })),
      porEstado: porEstado.map(item => ({
        estado: item.estado,
        quantidade: item._count.estado
      })),
      ativos,
      inativos
    };
  }

  async findByRole(role: string) {
    return await this.prisma.user.findMany({
      where: { tipoUsuario: role }
    });
  }

  async findActiveUsers() {
    return await this.prisma.user.findMany({
      where: { estado: 'ATIVO' }
    });
  }

  async findInactiveUsers() {
    return await this.prisma.user.findMany({
      where: { estado: 'INATIVO' }
    });
  }

  async findUsersByDepartment(departmentId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByCourse(courseId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersBySubject(subjectId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByNotification(notificationId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByDocument(documentId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByPayment(paymentId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByAttendance(attendanceId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByGrade(gradeId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByEnrollment(enrollmentId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByMatricula(matriculaId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByInscricao(inscricaoId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByNota(notaId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByPresenca(presencaId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByPropina(propinaId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByPagamento(pagamentoId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByNotificacao(notificacaoId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByDocumento(documentoId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersBySchedule(scheduleId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByTurmaDisciplina(turmaDisciplinaId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByTurma(turmaId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByDisciplina(disciplinaId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByCurso(cursoId: string) {
    // Implementar quando necessário
    return [];
  }

  async findUsersByDepartamento(departamentoId: string) {
    // Implementar quando necessário
    return [];
  }
} 