import { PrismaClient } from '@prisma/client';
import { EnrollmentRepository } from '../repositories/EnrollmentRepository';
import { 
  CreateEnrollmentData, 
  UpdateEnrollmentData, 
  EnrollmentFilters, 
  EnrollmentListResponse,
  EnrollmentStatsResponse,
  EnrollmentResponse,
  BulkEnrollmentData,
  EnrollmentPrerequisiteCheck
} from '../types/enrollment';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export class EnrollmentService {
  private enrollmentRepository: EnrollmentRepository;

  constructor(private prisma: PrismaClient) {
    this.enrollmentRepository = new EnrollmentRepository(prisma);
  }

  async createEnrollment(data: CreateEnrollmentData): Promise<EnrollmentResponse> {
    try {
      // Verificar se o estudante existe e é do tipo ESTUDANTE
      const estudante = await this.prisma.user.findUnique({
        where: { 
          id: data.estudanteId,
          tipoUsuario: 'ESTUDANTE'
        }
      });
      if (!estudante) {
        throw new ApiError(404, 'Estudante não encontrado');
      }

      // Verificar se a disciplina existe e está ativa
      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id: data.disciplinaId }
      });
      if (!disciplina) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }
      if (disciplina.status !== 'ATIVA') {
        throw new ApiError(400, 'Disciplina não está ativa para inscrições');
      }

      // Verificar se já existe inscrição para este período
      const existingEnrollment = await this.enrollmentRepository.findExisting(
        data.estudanteId, 
        data.disciplinaId, 
        data.periodo
      );
      if (existingEnrollment) {
        throw new ApiError(400, 'Estudante já está inscrito nesta disciplina para este período');
      }

      // Verificar pré-requisitos
      const prerequisiteCheck = await this.enrollmentRepository.checkPrerequisites(
        data.estudanteId, 
        data.disciplinaId
      );
      if (!prerequisiteCheck.podeInscrever) {
        throw new ApiError(400, `Não é possível se inscrever: ${prerequisiteCheck.motivos?.join(', ')}`);
      }

      // Verificar capacidade da turma (se especificada)
      if (data.turmaId) {
        const turma = await this.prisma.turma.findUnique({
          where: { id: data.turmaId }
        });
        if (!turma) {
          throw new ApiError(404, 'Turma não encontrada');
        }

        const capacityCheck = await this.enrollmentRepository.checkClassCapacity(data.turmaId);
        if (capacityCheck && !capacityCheck.podeInscrever) {
          throw new ApiError(400, 'Turma já atingiu a capacidade máxima');
        }
      }

      // Validar período letivo
      if (!this.isValidPeriod(data.periodo)) {
        throw new ApiError(400, 'Formato de período inválido (ex: 2024.1, 2024.2)');
      }

      // Validar ano letivo
      const currentYear = new Date().getFullYear();
      if (data.anoLetivo < currentYear - 1 || data.anoLetivo > currentYear + 1) {
        throw new ApiError(400, 'Ano letivo deve estar entre o ano anterior e o próximo ano');
      }

      // Validar semestre
      if (data.semestre < 1 || data.semestre > 12) {
        throw new ApiError(400, 'Semestre deve estar entre 1 e 12');
      }

      const enrollment = await this.enrollmentRepository.create(data);
      
      logger.info('Inscrição criada com sucesso', {
        enrollmentId: enrollment.id,
        estudanteId: data.estudanteId,
        disciplinaId: data.disciplinaId,
        periodo: data.periodo
      });

      return enrollment;
    } catch (error) {
      logger.error('Erro ao criar inscrição', { error, data });
      throw error;
    }
  }

  async getEnrollments(filters: EnrollmentFilters): Promise<EnrollmentListResponse> {
    try {
      const pagina = Math.floor((filters.skip || 0) / (filters.take || 10)) + 1;
      const limite = filters.take || 10;

      const { enrollments, total } = await this.enrollmentRepository.findMany({
        ...filters,
        skip: (pagina - 1) * limite,
        take: limite,
      });

      const totalPaginas = Math.ceil(total / limite);

      return {
        enrollments,
        total,
        pagina,
        totalPaginas,
      };
    } catch (error) {
      logger.error('Erro ao buscar inscrições', { error, filters });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getEnrollmentById(id: string): Promise<EnrollmentResponse> {
    try {
      const enrollment = await this.enrollmentRepository.findById(id);
      if (!enrollment) {
        throw new ApiError(404, 'Inscrição não encontrada');
      }

      return enrollment;
    } catch (error) {
      logger.error('Erro ao buscar inscrição por ID', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async updateEnrollment(id: string, data: UpdateEnrollmentData): Promise<EnrollmentResponse> {
    try {
      const existingEnrollment = await this.enrollmentRepository.findById(id);
      if (!existingEnrollment) {
        throw new ApiError(404, 'Inscrição não encontrada');
      }

      // Verificar se pode alterar turma
      if (data.turmaId && data.turmaId !== existingEnrollment.turmaId) {
        const turma = await this.prisma.turma.findUnique({
          where: { id: data.turmaId }
        });
        if (!turma) {
          throw new ApiError(404, 'Turma não encontrada');
        }

        const capacityCheck = await this.enrollmentRepository.checkClassCapacity(data.turmaId);
        if (capacityCheck && !capacityCheck.podeInscrever) {
          throw new ApiError(400, 'Nova turma já atingiu a capacidade máxima');
        }
      }

      const enrollment = await this.enrollmentRepository.update(id, data);
      
      logger.info('Inscrição atualizada com sucesso', {
        enrollmentId: id,
        changes: Object.keys(data)
      });

      return enrollment;
    } catch (error) {
      logger.error('Erro ao atualizar inscrição', { error, id, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async deleteEnrollment(id: string): Promise<void> {
    try {
      const enrollment = await this.enrollmentRepository.findById(id);
      if (!enrollment) {
        throw new ApiError(404, 'Inscrição não encontrada');
      }

      // Verificar se há notas associadas
      const hasGrades = await this.prisma.nota.findFirst({
        where: { 
          estudanteId: enrollment.estudanteId,
          disciplinaId: enrollment.disciplinaId 
        }
      });

      if (hasGrades) {
        throw new ApiError(400, 'Não é possível excluir inscrição que já possui notas registradas');
      }

      await this.enrollmentRepository.delete(id);
      
      logger.info('Inscrição excluída com sucesso', {
        enrollmentId: id,
        estudanteId: enrollment.estudanteId,
        disciplinaId: enrollment.disciplinaId
      });
    } catch (error) {
      logger.error('Erro ao excluir inscrição', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async updateEnrollmentStatus(
    id: string, 
    status: 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA', 
    motivo?: string
  ): Promise<EnrollmentResponse> {
    try {
      const enrollment = await this.enrollmentRepository.findById(id);
      if (!enrollment) {
        throw new ApiError(404, 'Inscrição não encontrada');
      }

      const updatedEnrollment = await this.enrollmentRepository.updateStatus(
        id, 
        status, 
        { motivo }
      );
      
      logger.info('Status da inscrição atualizado', {
        enrollmentId: id,
        oldStatus: enrollment.status,
        newStatus: status,
        motivo
      });

      return updatedEnrollment;
    } catch (error) {
      logger.error('Erro ao atualizar status da inscrição', { error, id, status });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async createBulkEnrollments(data: BulkEnrollmentData): Promise<{ success: number; errors: any[] }> {
    try {
      // Verificar se a disciplina existe
      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id: data.disciplinaId }
      });
      if (!disciplina) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }

      // Verificar se todos os estudantes existem
      const estudantes = await this.prisma.user.findMany({
        where: { 
          id: { in: data.estudantesIds },
          tipoUsuario: 'ESTUDANTE'
        }
      });

      if (estudantes.length !== data.estudantesIds.length) {
        throw new ApiError(400, 'Alguns estudantes não foram encontrados ou não são do tipo ESTUDANTE');
      }

      // Verificar capacidade da turma se especificada
      if (data.turmaId) {
        const capacityCheck = await this.enrollmentRepository.checkClassCapacity(data.turmaId);
        if (capacityCheck && capacityCheck.disponiveis < data.estudantesIds.length) {
          throw new ApiError(400, `Turma só tem ${capacityCheck.disponiveis} vagas disponíveis para ${data.estudantesIds.length} estudantes`);
        }
      }

      // Verificar inscrições existentes
      const existingEnrollments = await this.prisma.inscricao.findMany({
        where: {
          estudanteId: { in: data.estudantesIds },
          disciplinaId: data.disciplinaId,
          periodo: data.periodo
        }
      });

      if (existingEnrollments.length > 0) {
        const conflictingStudents = existingEnrollments.map(e => e.estudanteId);
        throw new ApiError(400, `${conflictingStudents.length} estudantes já estão inscritos nesta disciplina para este período`);
      }

      const result = await this.enrollmentRepository.createBulk(data);
      
      logger.info('Inscrições em lote criadas', {
        disciplinaId: data.disciplinaId,
        totalEstudantes: data.estudantesIds.length,
        periodo: data.periodo,
        success: result.count
      });

      return {
        success: result.count,
        errors: []
      };
    } catch (error) {
      logger.error('Erro ao criar inscrições em lote', { error, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getEnrollmentStats(): Promise<EnrollmentStatsResponse> {
    try {
      const stats = await this.enrollmentRepository.getStats();
      return stats;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas das inscrições', { error });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getEnrollmentsByStudent(estudanteId: string, periodo?: string): Promise<EnrollmentResponse[]> {
    try {
      const estudante = await this.prisma.user.findUnique({
        where: { 
          id: estudanteId,
          tipoUsuario: 'ESTUDANTE'
        }
      });
      if (!estudante) {
        throw new ApiError(404, 'Estudante não encontrado');
      }

      const enrollments = await this.enrollmentRepository.findByStudent(estudanteId, periodo);
      return enrollments;
    } catch (error) {
      logger.error('Erro ao buscar inscrições por estudante', { error, estudanteId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getEnrollmentsBySubject(disciplinaId: string, periodo?: string): Promise<EnrollmentResponse[]> {
    try {
      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id: disciplinaId }
      });
      if (!disciplina) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }

      const enrollments = await this.enrollmentRepository.findBySubject(disciplinaId, periodo);
      return enrollments;
    } catch (error) {
      logger.error('Erro ao buscar inscrições por disciplina', { error, disciplinaId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async checkPrerequisites(estudanteId: string, disciplinaId: string): Promise<EnrollmentPrerequisiteCheck> {
    try {
      const estudante = await this.prisma.user.findUnique({
        where: { 
          id: estudanteId,
          tipoUsuario: 'ESTUDANTE'
        }
      });
      if (!estudante) {
        throw new ApiError(404, 'Estudante não encontrado');
      }

      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id: disciplinaId }
      });
      if (!disciplina) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }

      const check = await this.enrollmentRepository.checkPrerequisites(estudanteId, disciplinaId);
      
      return {
        estudanteId,
        disciplinaId,
        ...check
      };
    } catch (error) {
      logger.error('Erro ao verificar pré-requisitos', { error, estudanteId, disciplinaId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async checkClassCapacity(turmaId: string) {
    try {
      const capacity = await this.enrollmentRepository.checkClassCapacity(turmaId);
      if (!capacity) {
        throw new ApiError(404, 'Turma não encontrada');
      }

      return capacity;
    } catch (error) {
      logger.error('Erro ao verificar capacidade da turma', { error, turmaId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async searchEnrollments(searchTerm: string): Promise<EnrollmentResponse[]> {
    try {
      const { enrollments } = await this.enrollmentRepository.findMany({
        search: searchTerm,
        take: 50,
      });

      return enrollments;
    } catch (error) {
      logger.error('Erro ao pesquisar inscrições', { error, searchTerm });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  private isValidPeriod(periodo: string): boolean {
    // Formato esperado: YYYY.S (ex: 2024.1, 2024.2)
    const regex = /^\d{4}\.[12]$/;
    return regex.test(periodo);
  }

  async approvePendingEnrollments(disciplinaId: string, periodo: string): Promise<number> {
    try {
      const pendingEnrollments = await this.prisma.inscricao.findMany({
        where: {
          disciplinaId,
          periodo,
          status: 'PENDENTE'
        }
      });

      if (pendingEnrollments.length === 0) {
        return 0;
      }

      const result = await this.prisma.inscricao.updateMany({
        where: {
          disciplinaId,
          periodo,
          status: 'PENDENTE'
        },
        data: {
          status: 'APROVADA',
          dataAprovacao: new Date()
        }
      });

      logger.info('Inscrições pendentes aprovadas em lote', {
        disciplinaId,
        periodo,
        total: result.count
      });

      return result.count;
    } catch (error) {
      logger.error('Erro ao aprovar inscrições pendentes', { error, disciplinaId, periodo });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }
} 