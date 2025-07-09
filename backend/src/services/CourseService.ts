import { PrismaClient } from '@prisma/client';
import { CourseRepository } from '../repositories/CourseRepository';
import { 
  CourseCreateData, 
  CourseUpdateData, 
  CourseFilters, 
  CourseListResponse, 
  CourseStatsResponse 
} from '../types/course';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export class CourseService {
  private courseRepository: CourseRepository;

  constructor(private prisma: PrismaClient) {
    this.courseRepository = new CourseRepository(prisma);
  }

  async create(courseData: CourseCreateData) {
    // Verificar se o código já existe
    const existingCourse = await this.courseRepository.findByCode(courseData.codigo);
    if (existingCourse) {
      throw ApiError.conflict('Código do curso já existe');
    }

    // Verificar se o departamento existe
    const department = await this.prisma.departamento.findUnique({
      where: { id: courseData.departamentoId }
    });
    if (!department) {
      throw ApiError.notFound('Departamento não encontrado');
    }

    // Verificar se o coordenador existe (se fornecido)
    if (courseData.coordenadorId) {
      const coordinator = await this.prisma.user.findUnique({
        where: { id: courseData.coordenadorId }
      });
      if (!coordinator) {
        throw ApiError.notFound('Coordenador não encontrado');
      }
      if (coordinator.tipoUsuario !== 'PROFESSOR' && coordinator.tipoUsuario !== 'ADMIN') {
        throw ApiError.badRequest('Coordenador deve ser um professor ou administrador');
      }
    }

    // Definir ativo como true por padrão
    if (courseData.ativo === undefined) {
      courseData.ativo = true;
    }

    const course = await this.courseRepository.create(courseData);

    logger.info('Curso criado com sucesso', { courseId: course.id, codigo: course.codigo });

    return course;
  }

  async findById(id: string) {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw ApiError.notFound('Curso não encontrado');
    }
    return course;
  }

  async findByCode(codigo: string) {
    const course = await this.courseRepository.findByCode(codigo);
    if (!course) {
      throw ApiError.notFound('Curso não encontrado');
    }
    return course;
  }

  async update(id: string, courseData: CourseUpdateData) {
    // Verificar se o curso existe
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      throw ApiError.notFound('Curso não encontrado');
    }

    // Verificar se o código já existe (se estiver sendo alterado)
    if (courseData.codigo && courseData.codigo !== existingCourse.codigo) {
      const courseWithCode = await this.courseRepository.findByCode(courseData.codigo);
      if (courseWithCode) {
        throw ApiError.conflict('Código do curso já existe');
      }
    }

    // Verificar se o departamento existe (se estiver sendo alterado)
    if (courseData.departamentoId) {
      const department = await this.prisma.departamento.findUnique({
        where: { id: courseData.departamentoId }
      });
      if (!department) {
        throw ApiError.notFound('Departamento não encontrado');
      }
    }

    // Verificar se o coordenador existe (se estiver sendo alterado)
    if (courseData.coordenadorId) {
      const coordinator = await this.prisma.user.findUnique({
        where: { id: courseData.coordenadorId }
      });
      if (!coordinator) {
        throw ApiError.notFound('Coordenador não encontrado');
      }
      if (coordinator.tipoUsuario !== 'PROFESSOR' && coordinator.tipoUsuario !== 'ADMIN') {
        throw ApiError.badRequest('Coordenador deve ser um professor ou administrador');
      }
    }

    const course = await this.courseRepository.update(id, courseData);

    logger.info('Curso atualizado com sucesso', { courseId: id });

    return course;
  }

  async delete(id: string) {
    // Verificar se o curso existe
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      throw ApiError.notFound('Curso não encontrado');
    }

    // Verificar se há matrículas ativas
    const activeEnrollments = await this.prisma.matricula.count({
      where: { cursoId: id, status: 'ATIVA' }
    });

    if (activeEnrollments > 0) {
      throw ApiError.conflict('Não é possível deletar um curso com matrículas ativas');
    }

    await this.courseRepository.delete(id);

    logger.info('Curso deletado com sucesso', { courseId: id });
  }

  async updateStatus(id: string, ativo: boolean) {
    // Verificar se o curso existe
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      throw ApiError.notFound('Curso não encontrado');
    }

    const course = await this.courseRepository.update(id, { ativo });

    logger.info('Status do curso atualizado', { courseId: id, ativo });

    return course;
  }

  async updateCoordinator(id: string, coordenadorId: string) {
    // Verificar se o curso existe
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      throw ApiError.notFound('Curso não encontrado');
    }

    // Verificar se o coordenador existe
    const coordinator = await this.prisma.user.findUnique({
      where: { id: coordenadorId }
    });
    if (!coordinator) {
      throw ApiError.notFound('Coordenador não encontrado');
    }
    if (coordinator.tipoUsuario !== 'PROFESSOR' && coordinator.tipoUsuario !== 'ADMIN') {
      throw ApiError.badRequest('Coordenador deve ser um professor ou administrador');
    }

    const course = await this.courseRepository.update(id, { coordenadorId });

    logger.info('Coordenador do curso atualizado', { courseId: id, coordenadorId });

    return course;
  }

  async removeCoordinator(id: string) {
    // Verificar se o curso existe
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      throw ApiError.notFound('Curso não encontrado');
    }

    const course = await this.courseRepository.update(id, { coordenadorId: null as any });

    logger.info('Coordenador removido do curso', { courseId: id });

    return course;
  }

  async list(filters: CourseFilters, pagination: any): Promise<CourseListResponse> {
    return await this.courseRepository.list(filters, pagination);
  }

  async getStats(): Promise<CourseStatsResponse> {
    return await this.courseRepository.getStats();
  }

  async search(searchTerm: string, limit: number = 10) {
    if (!searchTerm || searchTerm.length < 2) {
      throw ApiError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    const courses = await this.courseRepository.list(
      { search: searchTerm },
      { page: 1, limit, sortBy: 'nome', sortOrder: 'asc' }
    );

    return courses.cursos;
  }

  async findByDepartment(departamentoId: string) {
    // Verificar se o departamento existe
    const department = await this.prisma.departamento.findUnique({
      where: { id: departamentoId }
    });
    if (!department) {
      throw ApiError.notFound('Departamento não encontrado');
    }

    return await this.courseRepository.findByDepartment(departamentoId);
  }

  async findByCoordinator(coordenadorId: string) {
    // Verificar se o coordenador existe
    const coordinator = await this.prisma.user.findUnique({
      where: { id: coordenadorId }
    });
    if (!coordinator) {
      throw ApiError.notFound('Coordenador não encontrado');
    }

    return await this.courseRepository.findByCoordinator(coordenadorId);
  }
} 