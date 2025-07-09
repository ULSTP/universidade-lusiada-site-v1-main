import { PrismaClient } from '@prisma/client';
import { GradeRepository } from '../repositories/GradeRepository';
import { 
  CreateGradeData, 
  UpdateGradeData, 
  GradeFilters, 
  GradeListResponse,
  GradeStatsResponse,
  GradeResponse,
  CreateBulkGradesData,
  StudentGradesSummary,
  SubjectGradesReport,
  StudentTranscript,
  TeacherGradesDashboard
} from '../types/grade';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export class GradeService {
  private gradeRepository: GradeRepository;

  constructor(private prisma: PrismaClient) {
    this.gradeRepository = new GradeRepository(prisma);
  }

  async createGrade(data: CreateGradeData): Promise<GradeResponse> {
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
        throw new ApiError(400, 'Disciplina não está ativa');
      }

      // Verificar se o estudante está inscrito na disciplina para o período
      const inscricao = await this.prisma.inscricao.findFirst({
        where: {
          estudanteId: data.estudanteId,
          disciplinaId: data.disciplinaId,
          periodo: data.periodo,
          status: 'APROVADA'
        }
      });
      if (!inscricao) {
        throw new ApiError(400, 'Estudante não está inscrito nesta disciplina para este período');
      }

      // Validar nota (0-20)
      if (data.nota < 0 || data.nota > 20) {
        throw new ApiError(400, 'Nota deve estar entre 0 e 20');
      }

      // Validar peso (0-1)
      if (data.peso <= 0 || data.peso > 1) {
        throw new ApiError(400, 'Peso deve estar entre 0.01 e 1.0');
      }

      // Verificar se não existe avaliação duplicada
      const existingGrade = await this.prisma.nota.findFirst({
        where: {
          estudanteId: data.estudanteId,
          disciplinaId: data.disciplinaId,
          nome: data.nome,
          periodo: data.periodo,
          status: 'ATIVO'
        }
      });
      if (existingGrade) {
        throw new ApiError(400, 'Já existe uma avaliação com este nome para este estudante nesta disciplina');
      }

      // Verificar se o peso total não excede 1.0
      const existingGrades = await this.prisma.nota.findMany({
        where: {
          estudanteId: data.estudanteId,
          disciplinaId: data.disciplinaId,
          periodo: data.periodo,
          status: 'ATIVO'
        }
      });

      const totalPesoExistente = existingGrades.reduce((sum, grade) => sum + grade.peso, 0);
      if (totalPesoExistente + data.peso > 1.0) {
        throw new ApiError(400, `Peso total excederia 1.0. Peso disponível: ${1.0 - totalPesoExistente}`);
      }

      // Validar data da avaliação
      const dataAvaliacao = new Date(data.dataAvaliacao);
      const hoje = new Date();
      if (dataAvaliacao > hoje) {
        throw new ApiError(400, 'Data da avaliação não pode ser futura');
      }

      const grade = await this.gradeRepository.create(data);
      
      logger.info('Nota criada com sucesso', {
        gradeId: grade.id,
        estudanteId: data.estudanteId,
        disciplinaId: data.disciplinaId,
        nota: data.nota,
        tipo: data.tipoAvaliacao
      });

      return grade;
    } catch (error) {
      logger.error('Erro ao criar nota', { error, data });
      throw error;
    }
  }

  async getGrades(filters: GradeFilters): Promise<GradeListResponse> {
    try {
      const pagina = Math.floor((filters.skip || 0) / (filters.take || 10)) + 1;
      const limite = filters.take || 10;

      const { grades, total } = await this.gradeRepository.findMany({
        ...filters,
        skip: (pagina - 1) * limite,
        take: limite,
      });

      const totalPaginas = Math.ceil(total / limite);

      return {
        grades,
        total,
        pagina,
        totalPaginas,
      };
    } catch (error) {
      logger.error('Erro ao buscar notas', { error, filters });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getGradeById(id: string): Promise<GradeResponse> {
    try {
      const grade = await this.gradeRepository.findById(id);
      if (!grade) {
        throw new ApiError(404, 'Nota não encontrada');
      }

      return grade;
    } catch (error) {
      logger.error('Erro ao buscar nota por ID', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async updateGrade(id: string, data: UpdateGradeData): Promise<GradeResponse> {
    try {
      const existingGrade = await this.gradeRepository.findById(id);
      if (!existingGrade) {
        throw new ApiError(404, 'Nota não encontrada');
      }

      // Validar nota se fornecida
      if (data.nota !== undefined && (data.nota < 0 || data.nota > 20)) {
        throw new ApiError(400, 'Nota deve estar entre 0 e 20');
      }

      // Validar peso se fornecido
      if (data.peso !== undefined) {
        if (data.peso <= 0 || data.peso > 1) {
          throw new ApiError(400, 'Peso deve estar entre 0.01 e 1.0');
        }

        // Verificar se o novo peso não excede 1.0
        const otherGrades = await this.prisma.nota.findMany({
          where: {
            estudanteId: existingGrade.estudanteId,
            disciplinaId: existingGrade.disciplinaId,
            periodo: existingGrade.periodo,
            status: 'ATIVO',
            id: { not: id }
          }
        });

        const totalPesoOutros = otherGrades.reduce((sum, grade) => sum + grade.peso, 0);
        if (totalPesoOutros + data.peso > 1.0) {
          throw new ApiError(400, `Peso total excederia 1.0. Peso disponível: ${1.0 - totalPesoOutros}`);
        }
      }

      // Validar data da avaliação se fornecida
      if (data.dataAvaliacao) {
        const dataAvaliacao = new Date(data.dataAvaliacao);
        const hoje = new Date();
        if (dataAvaliacao > hoje) {
          throw new ApiError(400, 'Data da avaliação não pode ser futura');
        }
      }

      const grade = await this.gradeRepository.update(id, data);
      
      logger.info('Nota atualizada com sucesso', {
        gradeId: id,
        changes: Object.keys(data)
      });

      return grade;
    } catch (error) {
      logger.error('Erro ao atualizar nota', { error, id, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async deleteGrade(id: string): Promise<void> {
    try {
      const grade = await this.gradeRepository.findById(id);
      if (!grade) {
        throw new ApiError(404, 'Nota não encontrada');
      }

      await this.gradeRepository.delete(id);
      
      logger.info('Nota excluída com sucesso', {
        gradeId: id,
        estudanteId: grade.estudanteId,
        disciplinaId: grade.disciplinaId
      });
    } catch (error) {
      logger.error('Erro ao excluir nota', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async createBulkGrades(data: CreateBulkGradesData): Promise<{ success: number; errors: any[] }> {
    try {
      // Verificar se a disciplina existe
      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id: data.disciplinaId }
      });
      if (!disciplina) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }

      // Validar peso
      if (data.peso <= 0 || data.peso > 1) {
        throw new ApiError(400, 'Peso deve estar entre 0.01 e 1.0');
      }

      // Validar todas as notas
      const invalidGrades = data.notas.filter(nota => nota.nota < 0 || nota.nota > 20);
      if (invalidGrades.length > 0) {
        throw new ApiError(400, 'Todas as notas devem estar entre 0 e 20');
      }

      // Verificar se todos os estudantes existem e estão inscritos
      const estudantesIds = data.notas.map(n => n.estudanteId);
      const estudantes = await this.prisma.user.findMany({
        where: { 
          id: { in: estudantesIds },
          tipoUsuario: 'ESTUDANTE'
        }
      });

      if (estudantes.length !== estudantesIds.length) {
        throw new ApiError(400, 'Alguns estudantes não foram encontrados ou não são do tipo ESTUDANTE');
      }

      // Verificar inscrições
      const inscricoes = await this.prisma.inscricao.findMany({
        where: {
          estudanteId: { in: estudantesIds },
          disciplinaId: data.disciplinaId,
          periodo: data.periodo,
          status: 'APROVADA'
        }
      });

      const estudantesInscritos = inscricoes.map(i => i.estudanteId);
      const estudantesNaoInscritos = estudantesIds.filter(id => !estudantesInscritos.includes(id));
      
      if (estudantesNaoInscritos.length > 0) {
        throw new ApiError(400, `${estudantesNaoInscritos.length} estudantes não estão inscritos na disciplina para este período`);
      }

      // Verificar se não existem avaliações duplicadas
      const existingGrades = await this.prisma.nota.findMany({
        where: {
          estudanteId: { in: estudantesIds },
          disciplinaId: data.disciplinaId,
          nome: data.nome,
          periodo: data.periodo,
          status: 'ATIVO'
        }
      });

      if (existingGrades.length > 0) {
        throw new ApiError(400, `Já existem avaliações com o nome "${data.nome}" para alguns estudantes`);
      }

      // Verificar peso total para cada estudante
      for (const estudanteId of estudantesIds) {
        const existingStudentGrades = await this.prisma.nota.findMany({
          where: {
            estudanteId,
            disciplinaId: data.disciplinaId,
            periodo: data.periodo,
            status: 'ATIVO'
          }
        });

        const totalPesoExistente = existingStudentGrades.reduce((sum, grade) => sum + grade.peso, 0);
        if (totalPesoExistente + data.peso > 1.0) {
          const estudante = estudantes.find(e => e.id === estudanteId);
          throw new ApiError(400, `Peso total excederia 1.0 para o estudante ${estudante?.nome || estudanteId}`);
        }
      }

      const result = await this.gradeRepository.createBulk(data);
      
      logger.info('Notas em lote criadas', {
        disciplinaId: data.disciplinaId,
        totalEstudantes: data.notas.length,
        periodo: data.periodo,
        success: result.count
      });

      return {
        success: result.count,
        errors: []
      };
    } catch (error) {
      logger.error('Erro ao criar notas em lote', { error, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getGradeStats(): Promise<GradeStatsResponse> {
    try {
      const stats = await this.gradeRepository.getStats();
      return stats;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas das notas', { error });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getStudentGrades(estudanteId: string, disciplinaId: string, periodo: string): Promise<StudentGradesSummary> {
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

      const summary = await this.gradeRepository.getStudentGrades(estudanteId, disciplinaId, periodo);
      return summary;
    } catch (error) {
      logger.error('Erro ao buscar notas do estudante', { error, estudanteId, disciplinaId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getSubjectGradesReport(disciplinaId: string, periodo: string): Promise<SubjectGradesReport> {
    try {
      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id: disciplinaId }
      });
      if (!disciplina) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }

      const report = await this.gradeRepository.getSubjectGradesReport(disciplinaId, periodo);
      return report;
    } catch (error) {
      logger.error('Erro ao buscar relatório de notas da disciplina', { error, disciplinaId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getStudentTranscript(estudanteId: string): Promise<StudentTranscript> {
    try {
      const transcript = await this.gradeRepository.getStudentTranscript(estudanteId);
      if (!transcript) {
        throw new ApiError(404, 'Estudante não encontrado');
      }

      return transcript;
    } catch (error) {
      logger.error('Erro ao buscar histórico acadêmico', { error, estudanteId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getTeacherDashboard(professorId: string, periodo: string): Promise<TeacherGradesDashboard> {
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

      const dashboard = await this.gradeRepository.getTeacherDashboard(professorId, periodo);
      return dashboard;
    } catch (error) {
      logger.error('Erro ao buscar dashboard do professor', { error, professorId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async searchGrades(searchTerm: string): Promise<GradeResponse[]> {
    try {
      const { grades } = await this.gradeRepository.findMany({
        search: searchTerm,
        take: 50,
      });

      return grades;
    } catch (error) {
      logger.error('Erro ao pesquisar notas', { error, searchTerm });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async calculateFinalGrade(estudanteId: string, disciplinaId: string, periodo: string): Promise<number | null> {
    try {
      const summary = await this.gradeRepository.getStudentGrades(estudanteId, disciplinaId, periodo);
      return summary.notaFinal || null;
    } catch (error) {
      logger.error('Erro ao calcular nota final', { error, estudanteId, disciplinaId });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async updateGradeStatus(id: string, status: 'ATIVO' | 'CANCELADO' | 'REVISAO'): Promise<GradeResponse> {
    try {
      const grade = await this.gradeRepository.findById(id);
      if (!grade) {
        throw new ApiError(404, 'Nota não encontrada');
      }

      const updatedGrade = await this.gradeRepository.update(id, { status });
      
      logger.info('Status da nota atualizado', {
        gradeId: id,
        oldStatus: grade.status,
        newStatus: status
      });

      return updatedGrade;
    } catch (error) {
      logger.error('Erro ao atualizar status da nota', { error, id, status });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }
} 