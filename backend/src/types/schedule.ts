export interface Schedule {
  id: string;
  disciplinaId: string;
  professorId: string;
  salaId?: string;
  diaSemana: DiaSemana;
  horaInicio: string; // HH:mm format
  horaFim: string; // HH:mm format
  periodo: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
  disciplina?: Subject;
  professor?: User;
  sala?: Classroom;
}

export interface Classroom {
  id: string;
  nome: string;
  capacidade: number;
  tipo: TipoSala;
  equipamentos: string[];
  disponivel: boolean;
  localizacao?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface AcademicCalendar {
  id: string;
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  periodo: string;
  tipo: TipoEvento;
  descricao?: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface ScheduleConflict {
  id: string;
  tipo: TipoConflito;
  descricao: string;
  scheduleId1: string;
  scheduleId2?: string;
  professorId?: string;
  salaId?: string;
  detectadoEm: Date;
  resolvido: boolean;
  resolvidoEm?: Date;
  schedule1?: Schedule;
  schedule2?: Schedule;
}

// Enums
export enum DiaSemana {
  DOMINGO = 'DOMINGO',
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA',
  SABADO = 'SABADO'
}

export enum TipoSala {
  AULA_COMUM = 'AULA_COMUM',
  LABORATORIO = 'LABORATORIO',
  AUDITORIO = 'AUDITORIO',
  BIBLIOTECA = 'BIBLIOTECA',
  SALA_CONFERENCIA = 'SALA_CONFERENCIA',
  GINASIO = 'GINASIO'
}

export enum TipoEvento {
  PERIODO_LETIVO = 'PERIODO_LETIVO',
  FERIAS = 'FERIAS',
  PROVA = 'PROVA',
  FERIADO = 'FERIADO',
  EVENTO_ACADEMICO = 'EVENTO_ACADEMICO',
  MANUTENCAO = 'MANUTENCAO'
}

export enum TipoConflito {
  PROFESSOR_SOBREPOSICAO = 'PROFESSOR_SOBREPOSICAO',
  SALA_SOBREPOSICAO = 'SALA_SOBREPOSICAO',
  CAPACIDADE_EXCEDIDA = 'CAPACIDADE_EXCEDIDA',
  HORARIO_INDISPONIVEL = 'HORARIO_INDISPONIVEL'
}

// Input Types
export interface CreateScheduleData {
  disciplinaId: string;
  professorId: string;
  salaId?: string;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFim: string;
  periodo: string;
}

export interface UpdateScheduleData {
  disciplinaId?: string;
  professorId?: string;
  salaId?: string;
  diaSemana?: DiaSemana;
  horaInicio?: string;
  horaFim?: string;
  periodo?: string;
  ativo?: boolean;
}

export interface CreateClassroomData {
  nome: string;
  capacidade: number;
  tipo: TipoSala;
  equipamentos?: string[];
  localizacao?: string;
}

export interface UpdateClassroomData {
  nome?: string;
  capacidade?: number;
  tipo?: TipoSala;
  equipamentos?: string[];
  disponivel?: boolean;
  localizacao?: string;
}

export interface CreateAcademicCalendarData {
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  periodo: string;
  tipo: TipoEvento;
  descricao?: string;
}

export interface UpdateAcademicCalendarData {
  nome?: string;
  dataInicio?: Date;
  dataFim?: Date;
  periodo?: string;
  tipo?: TipoEvento;
  descricao?: string;
  ativo?: boolean;
}

// Filter Types
export interface ScheduleFilters {
  disciplinaId?: string;
  professorId?: string;
  salaId?: string;
  diaSemana?: DiaSemana;
  periodo?: string;
  ativo?: boolean;
  horaInicio?: string;
  horaFim?: string;
  search?: string;
  skip?: number;
  take?: number;
}

export interface ClassroomFilters {
  tipo?: TipoSala;
  capacidadeMinima?: number;
  disponivel?: boolean;
  search?: string;
  skip?: number;
  take?: number;
}

export interface CalendarFilters {
  periodo?: string;
  tipo?: TipoEvento;
  ativo?: boolean;
  dataInicio?: Date;
  dataFim?: Date;
  search?: string;
  skip?: number;
  take?: number;
}

export interface ConflictFilters {
  tipo?: TipoConflito;
  resolvido?: boolean;
  professorId?: string;
  salaId?: string;
  periodo?: string;
  skip?: number;
  take?: number;
}

// Response Types
export interface ScheduleResponse extends Schedule {
  conflitos?: ScheduleConflict[];
}

export interface ScheduleListResponse {
  schedules: ScheduleResponse[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface ClassroomResponse extends Classroom {
  agendamentos?: Schedule[];
}

export interface ClassroomListResponse {
  classrooms: ClassroomResponse[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface CalendarResponse extends AcademicCalendar {}

export interface CalendarListResponse {
  events: CalendarResponse[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface ConflictResponse extends ScheduleConflict {}

export interface ConflictListResponse {
  conflicts: ConflictResponse[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

// Complex Response Types
export interface WeeklySchedule {
  periodo: string;
  semana: {
    [key in DiaSemana]: DaySchedule;
  };
}

export interface DaySchedule {
  dia: DiaSemana;
  horarios: TimeSlot[];
}

export interface TimeSlot {
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
  agendamento?: Schedule;
}

export interface ProfessorSchedule {
  professor: User;
  periodo: string;
  totalHoras: number;
  disciplinas: Array<{
    disciplina: Subject;
    horarios: Schedule[];
    horasSemanais: number;
  }>;
  conflitos: ScheduleConflict[];
  disponibilidade: WeeklySchedule;
}

export interface ClassroomSchedule {
  sala: Classroom;
  periodo: string;
  taxaOcupacao: number;
  agendamentos: Schedule[];
  horariosDisponiveis: TimeSlot[];
  conflitos: ScheduleConflict[];
}

export interface ScheduleStats {
  totalAgendamentos: number;
  salasUtilizadas: number;
  professoresAtivos: number;
  disciplinasAgendadas: number;
  conflitosAtivos: number;
  conflitosResolvidos: number;
  taxaOcupacaoMedia: number;
  distribuicaoPorDia: {
    [key in DiaSemana]: number;
  };
  distribuicaoPorHorario: Array<{
    hora: string;
    quantidade: number;
  }>;
  salasPopulares: Array<{
    sala: Classroom;
    agendamentos: number;
    taxaOcupacao: number;
  }>;
}

export interface ScheduleDashboard {
  stats: ScheduleStats;
  conflitosRecentes: ScheduleConflict[];
  proximosEventos: AcademicCalendar[];
  alertas: Array<{
    tipo: 'WARNING' | 'ERROR' | 'INFO';
    mensagem: string;
    data: Date;
  }>;
}

export interface ClassroomAvailability {
  sala: Classroom;
  periodo: string;
  data: Date;
  horariosDisponiveis: Array<{
    horaInicio: string;
    horaFim: string;
    disponivel: boolean;
    motivo?: string;
  }>;
}

export interface BulkScheduleData {
  disciplinaId: string;
  professorId: string;
  salaId?: string;
  periodo: string;
  horarios: Array<{
    diaSemana: DiaSemana;
    horaInicio: string;
    horaFim: string;
  }>;
}

export interface ScheduleRecommendation {
  score: number;
  sala?: Classroom;
  professor?: User;
  horario: {
    diaSemana: DiaSemana;
    horaInicio: string;
    horaFim: string;
  };
  motivos: string[];
  conflitos: ScheduleConflict[];
}

export interface ConflictResolution {
  conflictId: string;
  solucao: string;
  novoHorario?: {
    diaSemana: DiaSemana;
    horaInicio: string;
    horaFim: string;
    salaId?: string;
  };
  observacoes?: string;
}

// Types for external entities (from other modules)
interface User {
  id: string;
  nome: string;
  email: string;
  tipoUsuario: 'ADMIN' | 'PROFESSOR' | 'ESTUDANTE' | 'FUNCIONARIO';
}

interface Subject {
  id: string;
  nome: string;
  codigo: string;
  creditos: number;
  cargaHoraria: number;
  cursoId: string;
  status: 'ATIVA' | 'INATIVA';
} 