import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@config/environment';
import { ApiError } from '@utils/apiError';
import { UserService } from '@services/UserService';

interface JwtPayload {
  userId: string;
  email: string;
  tipoUsuario: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        tipoUsuario: string;
        nome: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new ApiError(401, 'Token de acesso requerido', 'UNAUTHORIZED');
    }

    // Verificar token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    // Buscar usuário para verificar se ainda existe e está ativo
    const userService = new UserService();
    const user = await userService.findById(decoded.userId);
    
    if (!user) {
      throw new ApiError(401, 'Usuário não encontrado', 'USER_NOT_FOUND');
    }

    if (user.estado !== 'ATIVO') {
      throw new ApiError(401, 'Usuário inativo', 'USER_INACTIVE');
    }

    // Adicionar dados do usuário à requisição
    req.user = {
      id: user.id,
      email: user.email,
      tipoUsuario: user.tipoUsuario,
      nome: user.nome
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Token inválido', 'INVALID_TOKEN');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Token expirado', 'EXPIRED_TOKEN');
    }
    throw error;
  }
};

// Middleware para verificar se o usuário é Admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new ApiError(401, 'Usuário não autenticado', 'UNAUTHORIZED');
  }

  if (req.user.tipoUsuario !== 'ADMIN') {
    throw new ApiError(403, 'Acesso negado. Apenas administradores podem realizar esta operação', 'FORBIDDEN');
  }

  next();
};

// Middleware para verificar se o usuário é Professor ou Admin
export const requireTeacherOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new ApiError(401, 'Usuário não autenticado', 'UNAUTHORIZED');
  }

  if (!['ADMIN', 'PROFESSOR'].includes(req.user.tipoUsuario)) {
    throw new ApiError(403, 'Acesso negado. Apenas administradores e professores podem realizar esta operação', 'FORBIDDEN');
  }

  next();
};

// Middleware para verificar se o usuário é Professor
export const requireTeacher = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new ApiError(401, 'Usuário não autenticado', 'UNAUTHORIZED');
  }

  if (req.user.tipoUsuario !== 'PROFESSOR') {
    throw new ApiError(403, 'Acesso negado. Apenas professores podem realizar esta operação', 'FORBIDDEN');
  }

  next();
};

// Middleware para verificar se o usuário é Estudante
export const requireStudent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new ApiError(401, 'Usuário não autenticado', 'UNAUTHORIZED');
  }

  if (req.user.tipoUsuario !== 'ESTUDANTE') {
    throw new ApiError(403, 'Acesso negado. Apenas estudantes podem realizar esta operação', 'FORBIDDEN');
  }

  next();
};

// Middleware para verificar se o usuário é funcionário ou admin
export const requireStaffOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new ApiError(401, 'Usuário não autenticado', 'UNAUTHORIZED');
  }

  if (!['ADMIN', 'FUNCIONARIO'].includes(req.user.tipoUsuario)) {
    throw new ApiError(403, 'Acesso negado. Apenas administradores e funcionários podem realizar esta operação', 'FORBIDDEN');
  }

  next();
};

// Middleware para verificar se o usuário pode acessar os próprios dados ou é admin
export const requireOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new ApiError(401, 'Usuário não autenticado', 'UNAUTHORIZED');
  }

  const targetUserId = req.params.id || req.params.userId;
  
  if (req.user.id !== targetUserId && req.user.tipoUsuario !== 'ADMIN') {
    throw new ApiError(403, 'Acesso negado. Você só pode acessar seus próprios dados', 'FORBIDDEN');
  }

  next();
};

// Middleware para verificar roles específicas
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(401, 'Usuário não autenticado', 'NOT_AUTHENTICATED');
    }

    if (!allowedRoles.includes(req.user.tipoUsuario)) {
      throw new ApiError(403, 'Acesso negado. Permissões insuficientes', 'INSUFFICIENT_PERMISSIONS');
    }

    next();
  };
};

// Middleware para verificar se é estudante, professor ou admin
export const requireAnyRole = requireRole('ADMIN', 'PROFESSOR', 'ESTUDANTE');

// Middleware opcional de autenticação (não lança erro se não autenticado)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      const userService = new UserService();
      const user = await userService.findById(decoded.userId);
      
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          tipoUsuario: user.tipoUsuario,
          nome: user.nome
        };
      }
    }
  } catch (error) {
    // Ignorar erros na autenticação opcional
  }

  next();
}; 