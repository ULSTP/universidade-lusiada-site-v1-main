import { PrismaClient } from '@prisma/client';
import { SubjectRepository } from '../repositories/SubjectRepository';
import { 
  CreateSubjectData, 
  UpdateSubjectData, 
  SubjectFilters, 
  SubjectListResponse,
  SubjectStatsResponse,
  SubjectResponse
} from '../types/subject';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export class SubjectService {
  private subjectRepository: SubjectRepository;

  constructor(private prisma: PrismaClient) {
    this.subjectRepository = new SubjectRepository(prisma);
  }

  async createSubject(data: CreateSubjectData): Promise<SubjectResponse> {
    try {
      // Verificar se o código já existe
      const existingSubject = await this.subjectRepository.findByCode(data.codigo);
      if (existingSubject) {
        throw new ApiError(400, `Disciplina com código ${data.codigo} já existe`);
      }

      // Verificar se o curso existe
      const curso = await this.prisma.curso.findUnique({
        where: { id: data.cursoId }
      });
      if (!curso) {
        throw new ApiError(404, 'Curso não encontrado');
      }

      // Verificar se o departamento existe
      const departamento = await this.prisma.departamento.findUnique({
        where: { id: data.departamentoId }
      });
      if (!departamento) {
        throw new ApiError(404, 'Departamento não encontrado');
      }

      // Verificar se o professor existe (se fornecido)
      if (data.professorId) {
        const professor = await this.prisma.user.findUnique({
          where: { 
            id: data.professorId,
            tipo: 'PROFESSOR'
          }
        });
        if (!professor) {
          throw new ApiError(404, 'Professor não encontrado');
        }
      }

      // Validar semestre
      if (data.semestre < 1 || data.semestre > 12) {
        throw new ApiError(400, 'Semestre deve estar entre 1 e 12');
      }

      // Validar carga horária
      if (data.cargaHoraria < 1) {
        throw new ApiError(400, 'Carga horária deve ser maior que 0');
      }

      // Validar créditos
      if (data.creditos < 1) {
        throw new ApiError(400, 'Créditos devem ser maior que 0');
      }

      const subject = await this.subjectRepository.create(data);
      
      logger.info('Disciplina criada com sucesso', {
        subjectId: subject.id,
        codigo: subject.codigo,
        nome: subject.nome
      });

      return subject;
    } catch (error) {
      logger.error('Erro ao criar disciplina', { error, data });
      throw error;
    }
  }

  async getSubjects(filters: SubjectFilters): Promise<SubjectListResponse> {
    try {
      const pagina = Math.floor((filters.skip || 0) / (filters.take || 10)) + 1;
      const limite = filters.take || 10;

      const { subjects, total } = await this.subjectRepository.findMany({
        ...filters,
        skip: (pagina - 1) * limite,
        take: limite,
      });

      const totalPaginas = Math.ceil(total / limite);

      return {
        subjects,
        total,
        pagina,
        totalPaginas,
      };
    } catch (error) {
      logger.error('Erro ao buscar disciplinas', { error, filters });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getSubjectById(id: string): Promise<SubjectResponse> {
    try {
      const subject = await this.subjectRepository.findById(id);
      if (!subject) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }

      return subject;
    } catch (error) {
      logger.error('Erro ao buscar disciplina por ID', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async updateSubject(id: string, data: UpdateSubjectData): Promise<SubjectResponse> {
    try {
      // Verificar se a disciplina existe
      const existingSubject = await this.subjectRepository.findById(id);
      if (!existingSubject) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }

      // Verificar se o código já existe (se estiver sendo alterado)
      if (data.codigo && data.codigo !== existingSubject.codigo) {
        const subjectWithCode = await this.subjectRepository.findByCode(data.codigo);
        if (subjectWithCode) {
          throw new ApiError(400, `Disciplina com código ${data.codigo} já existe`);
        }
      }

      // Verificar se o curso existe (se estiver sendo alterado)
      if (data.cursoId) {
        const curso = await this.prisma.curso.findUnique({
          where: { id: data.cursoId }
        });
        if (!curso) {
          throw new ApiError(404, 'Curso não encontrado');
        }
      }

      // Verificar se o departamento existe (se estiver sendo alterado)
      if (data.departamentoId) {
        const departamento = await this.prisma.departamento.findUnique({
          where: { id: data.departamentoId }
        });
        if (!departamento) {
          throw new ApiError(404, 'Departamento não encontrado');
        }
      }

      // Verificar se o professor existe (se estiver sendo alterado)
      if (data.professorId) {
        const professor = await this.prisma.user.findUnique({
          where: { 
            id: data.professorId,
            tipo: 'PROFESSOR'
          }
        });
        if (!professor) {
          throw new ApiError(404, 'Professor não encontrado');
        }
      }

      // Validações
      if (data.semestre && (data.semestre < 1 || data.semestre > 12)) {
        throw new ApiError(400, 'Semestre deve estar entre 1 e 12');
      }

      if (data.cargaHoraria && data.cargaHoraria < 1) {
        throw new ApiError(400, 'Carga horária deve ser maior que 0');
      }

      if (data.creditos && data.creditos < 1) {
        throw new ApiError(400, 'Créditos devem ser maior que 0');
      }

      const subject = await this.subjectRepository.update(id, data);
      
      logger.info('Disciplina atualizada com sucesso', {
        subjectId: id,
        changes: Object.keys(data)
      });

      return subject;
    } catch (error) {
      logger.error('Erro ao atualizar disciplina', { error, id, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async deleteSubject(id: string): Promise<void> {
    try {
      const subject = await this.subjectRepository.findById(id);
      if (!subject) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }

      // Verificar se há inscrições ativas
      if (subject._count && subject._count.inscricoes > 0) {
        throw new ApiError(400, 'Não é possível excluir disciplina com inscrições ativas');
      }

      // Verificar se há turmas associadas
      if (subject._count && subject._count.turmas > 0) {
        throw new ApiError(400, 'Não é possível excluir disciplina com turmas associadas');
      }

      await this.subjectRepository.delete(id);
      
      logger.info('Disciplina excluída com sucesso', {
        subjectId: id,
        codigo: subject.codigo,
        nome: subject.nome
      });
    } catch (error) {
      logger.error('Erro ao excluir disciplina', { error, id });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async updateSubjectStatus(id: string, status: 'ATIVA' | 'INATIVA' | 'SUSPENSA'): Promise<SubjectResponse> {
    try {
      const subject = await this.subjectRepository.findById(id);
      if (!subject) {
        throw new ApiError(404, 'Disciplina não encontrada');
      }

      const updatedSubject = await this.subjectRepository.updateStatus(id, status);
      
      logger.info('Status da disciplina atualizado', {
        subjectId: id,
        oldStatus: subject.status,
        newStatus: status
      });

      return updatedSubject;
    } catch (error) {
      logger.error('Erro ao atualizar status da disciplina', { error, id, status });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getSubjectStats(): Promise<SubjectStatsResponse> {
    try {
      const stats = await this.subjectRepository.getStats();
      return stats;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas das disciplinas', { error });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getSubjectsByCourse(cursoId: string): Promise<SubjectResponse[]> {
    try {
      // Verificar se o curso existe
      const curso = await this.prisma.curso.findUnique({
        where: { id: cursoId }
      });
      if (!curso) {
        throw new ApiError(404, 'Curso não encontrado');
      }

      const subjects = await this.subjectRepository.findByCourse(cursoId);
      return subjects;
    } catch (error) {
      logger.error('Erro ao buscar disciplinas por curso', { error, cursoId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async getSubjectsByProfessor(professorId: string): Promise<SubjectResponse[]> {
    try {
      // Verificar se o professor existe
      const professor = await this.prisma.user.findUnique({
        where: { 
          id: professorId,
          tipo: 'PROFESSOR'
        }
      });
      if (!professor) {
        throw new ApiError(404, 'Professor não encontrado');
      }

      const subjects = await this.subjectRepository.findByProfessor(professorId);
      return subjects;
    } catch (error) {
      logger.error('Erro ao buscar disciplinas por professor', { error, professorId });
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }

  async searchSubjects(searchTerm: string): Promise<SubjectResponse[]> {
    try {
      const { subjects } = await this.subjectRepository.findMany({
        search: searchTerm,
        take: 50,
      });

      return subjects;
    } catch (error) {
      logger.error('Erro ao pesquisar disciplinas', { error, searchTerm });
      throw new ApiError(500, 'Erro interno do servidor');
    }
  }
} 