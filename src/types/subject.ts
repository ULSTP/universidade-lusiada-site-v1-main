export interface CreateSubjectData {
  codigo: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  creditos: number;
  semestre: number;
  tipo: string;
  status?: string;
  preRequisitos?: string[];
  competencias?: string[];
  objetivos?: string;
  programa?: string;
  metodologia?: string;
  avaliacao?: string;
  bibliografia?: string[];
  departamentoId?: string;
  cursoId: string;
  professorId?: string;
}

export interface UpdateSubjectData {
  codigo?: string;
  nome?: string;
  descricao?: string;
  cargaHoraria?: number;
  creditos?: number;
  semestre?: number;
  tipo?: string;
  status?: string;
  preRequisitos?: string[];
  competencias?: string[];
  objetivos?: string;
  programa?: string;
  metodologia?: string;
  avaliacao?: string;
  bibliografia?: string[];
  departamentoId?: string;
  cursoId?: string;
  professorId?: string;
}

export interface SubjectFilters {
  search?: string;
  cursoId?: string;
  departamentoId?: string;
  semestre?: number;
  tipo?: string;
  status?: string;
  creditos?: number;
  skip?: number;
  take?: number;
  ordenacao?: any;
}

export interface SubjectResponse {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  cargaHoraria: number;
  creditos: number;
  semestre: number;
  tipo: string;
  status: string;
  preRequisitos: string[];
  competencias: string[];
  objetivos: string;
  programa: string;
  metodologia: string;
  avaliacao: string;
  bibliografia: string[];
  departamentoId?: string;
  cursoId: string;
  professorId?: string;
  curso?: {
    id: string;
    nome: string;
    codigo: string;
  };
  departamento?: {
    id: string;
    nome: string;
  };
  professor?: {
    id: string;
    nome: string;
    email: string;
  };
  _count?: {
    inscricoes: number;
  };
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface SubjectListResponse {
  subjects: SubjectResponse[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface SubjectStatsResponse {
  total: number;
  porStatus: Record<string, number>;
  porTipo: Record<string, number>;
  porSemestre: Record<string, number>;
  porCreditos: Record<string, number>;
  comMaisInscricoes: SubjectResponse[];
  semTurmas: number;
} 