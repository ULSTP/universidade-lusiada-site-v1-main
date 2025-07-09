export interface CreateEnrollmentData {
  estudanteId: string;
  disciplinaId: string;
  turmaId?: string;
  periodo: string; // Ex: "2024.1", "2024.2"
  anoLetivo: number;
  semestre: number;
  status?: 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA';
  observacoes?: string;
}

export interface UpdateEnrollmentData {
  turmaId?: string;
  status?: 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA';
  observacoes?: string;
  dataAprovacao?: Date;
  dataRejeicao?: Date;
  dataCancelamento?: Date;
  motivo?: string;
}

export interface EnrollmentFilters {
  estudanteId?: string;
  disciplinaId?: string;
  turmaId?: string;
  cursoId?: string;
  departamentoId?: string;
  status?: 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA';
  periodo?: string;
  anoLetivo?: number;
  semestre?: number;
  search?: string;
  skip?: number;
  take?: number;
  ordenacao?: {
    [key: string]: 'asc' | 'desc';
  };
}

export interface EnrollmentResponse {
  id: string;
  estudanteId: string;
  disciplinaId: string;
  turmaId?: string;
  periodo: string;
  anoLetivo: number;
  semestre: number;
  status: string;
  observacoes?: string;
  dataInscricao: Date;
  dataAprovacao?: Date;
  dataRejeicao?: Date;
  dataCancelamento?: Date;
  motivo?: string;
  estudante?: {
    id: string;
    nome: string;
    email: string;
    numeroEstudante: string;
  };
  disciplina?: {
    id: string;
    codigo: string;
    nome: string;
    creditos: number;
    cargaHoraria: number;
    semestre: number;
    curso?: {
      id: string;
      nome: string;
      codigo: string;
    };
  };
  turma?: {
    id: string;
    codigo: string;
    capacidade: number;
    totalInscritos: number;
  };
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface EnrollmentListResponse {
  enrollments: EnrollmentResponse[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface EnrollmentStatsResponse {
  total: number;
  porStatus: Record<string, number>;
  porPeriodo: Record<string, number>;
  porCurso: Record<string, number>;
  porSemestre: Record<string, number>;
  aprovacoesPendentes: number;
  totalEstudantesInscritos: number;
  mediaInscricoesPorEstudante: number;
  disciplinasComMaisInscricoes: Array<{
    disciplina: {
      id: string;
      codigo: string;
      nome: string;
    };
    totalInscricoes: number;
  }>;
}

export interface BulkEnrollmentData {
  estudantesIds: string[];
  disciplinaId: string;
  turmaId?: string;
  periodo: string;
  anoLetivo: number;
  semestre: number;
  observacoes?: string;
}

export interface EnrollmentPrerequisiteCheck {
  estudanteId: string;
  disciplinaId: string;
  prerequisites: Array<{
    disciplina: {
      id: string;
      codigo: string;
      nome: string;
    };
    status: 'CUMPRIDO' | 'NAO_CUMPRIDO' | 'EM_ANDAMENTO';
    nota?: number;
  }>;
  podeInscrever: boolean;
  motivos?: string[];
} 