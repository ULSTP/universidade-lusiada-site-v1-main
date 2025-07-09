export interface UserCreateData {
  nome: string;
  email: string;
  senha?: string | null;
  tipoUsuario: string;
  estado?: string;
  genero?: string;
  dataNascimento?: Date;
  telefone?: string;
  avatar?: string;
  numeroEstudante?: string;
  numeroFuncionario?: string;
}

export interface UserUpdateData {
  nome?: string;
  email?: string;
  senha?: string | null;
  tipoUsuario?: string;
  estado?: string;
  genero?: string;
  dataNascimento?: Date;
  telefone?: string;
  avatar?: string;
  numeroEstudante?: string;
  numeroFuncionario?: string;
}

export interface UserFilters {
  tipoUsuario?: string;
  estado?: string;
  search?: string;
}

export interface UserListResponse {
  users: any[];
  total: number;
  pages: number;
}

export interface UserStatsResponse {
  total: number;
  porTipo: Array<{
    tipo: string;
    quantidade: number;
  }>;
  porEstado: Array<{
    estado: string;
    quantidade: number;
  }>;
  ativos: number;
  inativos: number;
} 