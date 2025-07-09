export interface CourseCreateData {
  nome: string;
  descricao?: string;
  codigo: string;
  nivel: string;
  duracaoAnos: number;
  duracaoSemestres: number;
  creditosMinimos: number;
  coordenadorId?: string;
  departamentoId: string;
  ativo?: boolean;
}

export interface CourseUpdateData {
  nome?: string;
  descricao?: string;
  codigo?: string;
  nivel?: string;
  duracaoAnos?: number;
  duracaoSemestres?: number;
  creditosMinimos?: number;
  coordenadorId?: string;
  departamentoId?: string;
  ativo?: boolean;
}

export interface CourseFilters {
  nivel?: string;
  departamentoId?: string;
  coordenadorId?: string;
  ativo?: boolean;
  search?: string;
}

export interface CourseListResponse {
  cursos: any[];
  total: number;
  pages: number;
}

export interface CourseStatsResponse {
  total: number;
  porNivel: Array<{
    nivel: string;
    quantidade: number;
  }>;
  porDepartamento: Array<{
    departamentoId: string;
    quantidade: number;
  }>;
  ativos: number;
  inativos: number;
  totalMatriculas: number;
  totalDisciplinas: number;
} 