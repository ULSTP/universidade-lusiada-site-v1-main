import bcrypt from 'bcryptjs';
import { User, Prisma } from '../generated/prisma';
import { UserRepository } from '@repositories/UserRepository';
import { ApiError } from '@utils/apiError';
import { logger, loggerUtils } from '@utils/logger';
import { config } from '@config/environment';
import { PrismaClient } from '@prisma/client';
import { 
  UserCreateData, 
  UserUpdateData, 
  UserFilters, 
  UserListResponse, 
  UserStatsResponse 
} from '../types/user';

export interface CreateUserData {
  nome: string;
  email: string;
  senha?: string;
  tipoUsuario: string;
  genero?: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  dataNascimento?: Date;
  telefone?: string;
  numeroEstudante?: string;
  numeroFuncionario?: string;
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  telefone?: string;
  avatar?: string;
  genero?: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  dataNascimento?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class UserService {
  private userRepository: UserRepository;

  constructor(private prisma: PrismaClient) {
    this.userRepository = new UserRepository(prisma);
  }

  async create(userData: UserCreateData): Promise<User> {
    try {
      // Verificar se o email já existe
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw ApiError.conflict('Email já está em uso');
      }

      // Verificar se o número de estudante já existe (se fornecido)
      if (userData.numeroEstudante) {
        const existingStudent = await this.userRepository.findByStudentNumber(userData.numeroEstudante);
        if (existingStudent) {
          throw ApiError.conflict('Número de estudante já está em uso');
        }
      }

      // Verificar se o número de funcionário já existe (se fornecido)
      if (userData.numeroFuncionario) {
        const existingEmployee = await this.userRepository.findByEmployeeNumber(userData.numeroFuncionario);
        if (existingEmployee) {
          throw ApiError.conflict('Número de funcionário já está em uso');
        }
      }

      // Hash da senha se fornecida
      let hashedPassword: string | undefined;
      if (userData.senha) {
        hashedPassword = await bcrypt.hash(userData.senha, config.security.bcryptSaltRounds);
      }

      // Definir estado padrão se não fornecido
      if (!userData.estado) {
        userData.estado = 'ATIVO';
      }

      const user = await this.userRepository.create({
        ...userData,
        senha: hashedPassword
      });

      loggerUtils.logAuthOperation('user_created', user.id, user.email);
      logger.info('Usuário criado com sucesso', { userId: user.id, email: user.email });

      return user;
    } catch (error) {
      logger.error('Erro ao criar usuário', { error, userData: { ...userData, senha: '[HIDDEN]' } });
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findByNumeroEstudante(numero: string): Promise<User | null> {
    return await this.userRepository.findByStudentNumber(numero);
  }

  async findByNumeroFuncionario(numero: string): Promise<User | null> {
    return await this.userRepository.findByEmployeeNumber(numero);
  }

  async update(id: string, userData: UserUpdateData): Promise<User> {
    try {
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw ApiError.notFound('Usuário não encontrado');
      }

      // Verificar se o email já existe (se estiver sendo alterado)
      if (userData.email && userData.email !== existingUser.email) {
        const userWithEmail = await this.userRepository.findByEmail(userData.email);
        if (userWithEmail) {
          throw ApiError.conflict('Email já está em uso');
        }
      }

      // Verificar se o número de estudante já existe (se estiver sendo alterado)
      if (userData.numeroEstudante && userData.numeroEstudante !== existingUser.numeroEstudante) {
        const userWithStudentNumber = await this.userRepository.findByStudentNumber(userData.numeroEstudante);
        if (userWithStudentNumber) {
          throw ApiError.conflict('Número de estudante já está em uso');
        }
      }

      // Verificar se o número de funcionário já existe (se estiver sendo alterado)
      if (userData.numeroFuncionario && userData.numeroFuncionario !== existingUser.numeroFuncionario) {
        const userWithEmployeeNumber = await this.userRepository.findByEmployeeNumber(userData.numeroFuncionario);
        if (userWithEmployeeNumber) {
          throw ApiError.conflict('Número de funcionário já está em uso');
        }
      }

      // Hash da senha se fornecida
      let hashedPassword: string | undefined;
      if (userData.senha) {
        hashedPassword = await bcrypt.hash(userData.senha, config.security.bcryptSaltRounds);
      }

      const updatedUser = await this.userRepository.update(id, {
        ...userData,
        senha: hashedPassword
      });
      
      logger.info('Usuário atualizado', { userId: id, changes: Object.keys(userData) });
      
      return updatedUser;
    } catch (error) {
      logger.error('Erro ao atualizar usuário', { error, userId: id, userData });
      throw error;
    }
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.findById(id);
      if (!user || !user.senha) {
        throw ApiError.notFound('Usuário não encontrado');
      }

      // Verificar senha atual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.senha);
      if (!isCurrentPasswordValid) {
        throw ApiError.badRequest('Senha atual incorreta');
      }

      // Hash da nova senha
      const hashedNewPassword = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);

      await this.userRepository.update(id, { senha: hashedNewPassword });
      
      loggerUtils.logAuthOperation('password_changed', id, user.email);
      logger.info('Senha alterada com sucesso', { userId: id });
    } catch (error) {
      logger.error('Erro ao alterar senha', { error, userId: id });
      throw error;
    }
  }

  async changeStatus(id: string, status: string): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw ApiError.notFound('Usuário não encontrado');
      }

      const updatedUser = await this.userRepository.update(id, { estado: status });
      
      logger.info('Status do usuário alterado', { userId: id, oldStatus: user.estado, newStatus: status });
      
      return updatedUser;
    } catch (error) {
      logger.error('Erro ao alterar status do usuário', { error, userId: id, status });
      throw error;
    }
  }

  async list(
    filters: UserFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<UserListResponse> {
    try {
      const result = await this.userRepository.list(filters, pagination);
      
      logger.info('Lista de usuários consultada', { 
        filters, 
        pagination, 
        resultCount: result.users.length,
        total: result.total 
      });
      
      return result;
    } catch (error) {
      logger.error('Erro ao listar usuários', { error, filters, pagination });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw ApiError.notFound('Usuário não encontrado');
      }

      await this.userRepository.delete(id);
      
      logger.info('Usuário excluído', { userId: id, email: user.email });
    } catch (error) {
      logger.error('Erro ao excluir usuário', { error, userId: id });
      throw error;
    }
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user || !user.senha) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.senha);
      if (!isPasswordValid) {
        loggerUtils.logAuthOperation('login_failed', user.id, email, false);
        return null;
      }

      if (user.estado !== 'ATIVO') {
        loggerUtils.logAuthOperation('login_blocked', user.id, email, false);
        return null;
      }

      loggerUtils.logAuthOperation('login_success', user.id, email);
      return user;
    } catch (error) {
      logger.error('Erro ao validar senha', { error, email });
      throw error;
    }
  }

  // Métodos auxiliares privados
  private async generateStudentNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.userRepository.countByType('ESTUDANTE');
    return `${year}${(count + 1).toString().padStart(4, '0')}`;
  }

  private async generateEmployeeNumber(): Promise<string> {
    const count = await this.userRepository.countByType('FUNCIONARIO');
    return `FUNC${(count + 1).toString().padStart(4, '0')}`;
  }

  async getStats(): Promise<UserStatsResponse> {
    try {
      return await this.userRepository.getStats();
    } catch (error) {
      logger.error('Erro ao obter estatísticas de usuários', { error });
      throw error;
    }
  }

  async search(searchTerm: string, limit: number = 10) {
    if (!searchTerm || searchTerm.length < 2) {
      throw ApiError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    const users = await this.userRepository.list(
      { search: searchTerm },
      { page: 1, limit, sortBy: 'nome', sortOrder: 'asc' }
    );

    return users.users;
  }

  async findMany(filters: UserFilters = {}, pagination: any = { page: 1, limit: 20 }) {
    try {
      const result = await this.userRepository.list(filters, pagination);
      
      logger.info('Lista de usuários consultada', { 
        filters, 
        pagination, 
        resultCount: result.users.length, 
        total: result.total 
      });

      return result;
    } catch (error) {
      logger.error('Erro ao listar usuários', { error, filters, pagination });
      throw error;
    }
  }

  async countByType(tipoUsuario: string): Promise<number> {
    const users = await this.userRepository.findByRole(tipoUsuario);
    return users.length;
  }

  async countActiveStudents(): Promise<number> {
    const activeUsers = await this.userRepository.findActiveUsers();
    return activeUsers.filter(user => user.tipoUsuario === 'ESTUDANTE').length;
  }

  async countActiveTeachers(): Promise<number> {
    const activeUsers = await this.userRepository.findActiveUsers();
    return activeUsers.filter(user => user.tipoUsuario === 'PROFESSOR').length;
  }
} 