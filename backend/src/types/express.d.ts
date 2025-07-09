import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        tipoUsuario: string;
        nome: string;
      };
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    tipoUsuario: string;
    nome: string;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
  timestamp: string;
  path: string;
} 