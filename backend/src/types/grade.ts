export interface CreateGradeData {
  estudanteId: string;
  disciplinaId: string;
  avaliacaoId?: string;
  tipoAvaliacao: 'PROVA' | 'TRABALHO' | 'PARTICIPACAO' | 'PROJETO' | 'SEMINARIO' | 'EXAME';
  nome: string; // Nome da avaliação (ex: "Prova 1", "Trabalho Final")
  nota: number; // Nota obtida (0-20)
  peso: number; // Peso da avaliação (0-1)
  dataAvaliacao: Date;
  observacoes?: string;
  periodo: string;
  anoLetivo: number;
  semestre: number;
}

export interface UpdateGradeData {
  nota?: number;
  peso?: number;
  observacoes?: string;
  dataAvaliacao?: Date;
  status?: 'ATIVO' | 'CANCELADO' | 'REVISAO';
}

export interface GradeFilters {
  estudanteId?: string;
  disciplinaId?: string;
  avaliacaoId?: string;
  tipoAvaliacao?: 'PROVA' | 'TRABALHO' | 'PARTICIPACAO' | 'PROJETO' | 'SEMINARIO' | 'EXAME';
  periodo?: string;
  anoLetivo?: number;
  semestre?: number;
  notaMinima?: number;
  notaMaxima?: number;
  status?: 'ATIVO' | 'CANCELADO' | 'REVISAO';
  search?: string;
  skip?: number;
  take?: number;
  ordenacao?: {
    [key: string]: 'asc' | 'desc';
  };
}

export interface GradeResponse {
  id: string;
  estudanteId: string;
  disciplinaId: string;
  avaliacaoId?: string;
  tipoAvaliacao: string;
  nome: string;
  nota: number;
  peso: number;
  dataAvaliacao: Date;
  observacoes?: string;
  periodo: string;
  anoLetivo: number;
  semestre: number;
  status: string;
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
    curso?: {
      id: string;
      nome: string;
      codigo: string;
    };
  };
  avaliacao?: {
    id: string;
    nome: string;
    descricao: string;
    peso: number;
  };
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface GradeListResponse {
  grades: GradeResponse[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface StudentGradesSummary {
  estudanteId: string;
  disciplinaId: string;
  periodo: string;
  avaliacoes: GradeResponse[];
  notaFinal?: number;
  status: 'APROVADO' | 'REPROVADO' | 'EM_ANDAMENTO';
  mediaMinima: number;
  totalPesoAvaliacoes: number;
  avaliacoesPendentes: string[];
}

export interface SubjectGradesReport {
  disciplinaId: string;
  periodo: string;
  totalEstudantes: number;
  aprovados: number;
  reprovados: number;
  emAndamento: number;
  mediaGeral: number;
  notaMaisAlta: number;
  notaMaisBaixa: number;
  distribuicaoNotas: {
    faixa: string;
    quantidade: number;
    percentual: number;
  }[];
  estudantes: Array<{
    estudante: {
      id: string;
      nome: string;
      numeroEstudante: string;
    };
    notaFinal?: number;
    status: string;
    totalAvaliacoes: number;
  }>;
}

export interface GradeStatsResponse {
  total: number;
  porTipoAvaliacao: Record<string, number>;
  porPeriodo: Record<string, number>;
  porDisciplina: Record<string, number>;
  porStatus: Record<string, number>;
  mediaGeral: number;
  aprovacoes: number;
  reprovacoes: number;
  emAndamento: number;
  distribuicaoNotas: {
    '0-5': number;
    '6-9': number;
    '10-13': number;
    '14-16': number;
    '17-20': number;
  };
  disciplinasComMaiorMedia: Array<{
    disciplina: {
      id: string;
      codigo: string;
      nome: string;
    };
    media: number;
    totalAvaliacoes: number;
  }>;
}

export interface CreateBulkGradesData {
  disciplinaId: string;
  avaliacaoId?: string;
  tipoAvaliacao: 'PROVA' | 'TRABALHO' | 'PARTICIPACAO' | 'PROJETO' | 'SEMINARIO' | 'EXAME';
  nome: string;
  peso: number;
  dataAvaliacao: Date;
  periodo: string;
  anoLetivo: number;
  semestre: number;
  notas: Array<{
    estudanteId: string;
    nota: number;
    observacoes?: string;
  }>;
}

export interface GradeCalculationConfig {
  mediaMinima: number; // Nota mínima para aprovação (ex: 10)
  pesoMinimo: number; // Peso mínimo total das avaliações (ex: 1.0)
  permitirRecuperacao: boolean; // Se permite prova de recuperação
  notaMinimaRecuperacao?: number; // Nota mínima na recuperação
}

export interface StudentTranscript {
  estudanteId: string;
  estudante: {
    id: string;
    nome: string;
    email: string;
    numeroEstudante: string;
  };
  disciplinas: Array<{
    disciplina: {
      id: string;
      codigo: string;
      nome: string;
      creditos: number;
      semestre: number;
    };
    periodo: string;
    avaliacoes: GradeResponse[];
    notaFinal?: number;
    status: 'APROVADO' | 'REPROVADO' | 'EM_ANDAMENTO';
    dataInscricao: Date;
    dataAprovacao?: Date;
  }>;
  resumo: {
    totalDisciplinas: number;
    disciplinasAprovadas: number;
    disciplinasReprovadas: number;
    disciplinasEmAndamento: number;
    creditosObtidos: number;
    creditosTotais: number;
    mediaGeral: number;
    percentualConclusao: number;
  };
}

export interface TeacherGradesDashboard {
  professorId: string;
  periodo: string;
  disciplinas: Array<{
    disciplina: {
      id: string;
      codigo: string;
      nome: string;
    };
    totalEstudantes: number;
    avaliacoesLancadas: number;
    avaliacoesPendentes: number;
    mediaGeral: number;
    aprovados: number;
    reprovados: number;
    emAndamento: number;
  }>;
  resumo: {
    totalDisciplinas: number;
    totalEstudantes: number;
    totalAvaliacoes: number;
    avaliacoesPendentes: number;
    mediaGeralTurmas: number;
  };
} 