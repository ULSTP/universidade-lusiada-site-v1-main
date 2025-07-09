import { body, query, param } from 'express-validator';
import { DiaSemana, TipoSala, TipoEvento, TipoConflito } from '../../types/schedule';

// ==================== SCHEDULE VALIDATIONS ====================

export const createScheduleValidation = [
  body('disciplinaId')
    .notEmpty()
    .withMessage('ID da disciplina é obrigatório')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('professorId')
    .notEmpty()
    .withMessage('ID do professor é obrigatório')
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),

  body('salaId')
    .optional()
    .isUUID()
    .withMessage('ID da sala deve ser um UUID válido'),

  body('diaSemana')
    .notEmpty()
    .withMessage('Dia da semana é obrigatório')
    .isIn(Object.values(DiaSemana))
    .withMessage('Dia da semana deve ser válido (DOMINGO, SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO)'),

  body('horaInicio')
    .notEmpty()
    .withMessage('Hora de início é obrigatória')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de início deve estar no formato HH:mm (ex: 08:00)'),

  body('horaFim')
    .notEmpty()
    .withMessage('Hora de fim é obrigatória')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de fim deve estar no formato HH:mm (ex: 10:00)')
    .custom((horaFim, { req }) => {
      const horaInicio = req.body.horaInicio;
      if (horaInicio && horaFim <= horaInicio) {
        throw new Error('Hora de fim deve ser posterior à hora de início');
      }
      return true;
    }),

  body('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres')
];

export const updateScheduleValidation = [
  body('disciplinaId')
    .optional()
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('professorId')
    .optional()
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),

  body('salaId')
    .optional()
    .isUUID()
    .withMessage('ID da sala deve ser um UUID válido'),

  body('diaSemana')
    .optional()
    .isIn(Object.values(DiaSemana))
    .withMessage('Dia da semana deve ser válido'),

  body('horaInicio')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de início deve estar no formato HH:mm'),

  body('horaFim')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de fim deve estar no formato HH:mm')
    .custom((horaFim, { req }) => {
      const horaInicio = req.body.horaInicio;
      if (horaInicio && horaFim && horaFim <= horaInicio) {
        throw new Error('Hora de fim deve ser posterior à hora de início');
      }
      return true;
    }),

  body('periodo')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres'),

  body('ativo')
    .optional()
    .isBoolean()
    .withMessage('Ativo deve ser um valor booleano')
];

export const bulkScheduleValidation = [
  body('disciplinaId')
    .notEmpty()
    .withMessage('ID da disciplina é obrigatório')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('professorId')
    .notEmpty()
    .withMessage('ID do professor é obrigatório')
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),

  body('salaId')
    .optional()
    .isUUID()
    .withMessage('ID da sala deve ser um UUID válido'),

  body('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres'),

  body('horarios')
    .isArray({ min: 1 })
    .withMessage('Deve ter pelo menos um horário'),

  body('horarios.*.diaSemana')
    .isIn(Object.values(DiaSemana))
    .withMessage('Dia da semana deve ser válido'),

  body('horarios.*.horaInicio')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de início deve estar no formato HH:mm'),

  body('horarios.*.horaFim')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de fim deve estar no formato HH:mm')
];

export const scheduleFiltersValidation = [
  query('disciplinaId')
    .optional()
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  query('professorId')
    .optional()
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),

  query('salaId')
    .optional()
    .isUUID()
    .withMessage('ID da sala deve ser um UUID válido'),

  query('diaSemana')
    .optional()
    .isIn(Object.values(DiaSemana))
    .withMessage('Dia da semana deve ser válido'),

  query('periodo')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres'),

  query('ativo')
    .optional()
    .isBoolean()
    .withMessage('Ativo deve ser um valor booleano'),

  query('horaInicio')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de início deve estar no formato HH:mm'),

  query('horaFim')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de fim deve estar no formato HH:mm'),

  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de busca deve ter entre 1 e 100 caracteres'),

  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip deve ser um número inteiro não negativo'),

  query('take')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Take deve ser um número entre 1 e 100')
];

// ==================== CLASSROOM VALIDATIONS ====================

export const createClassroomValidation = [
  body('nome')
    .notEmpty()
    .withMessage('Nome da sala é obrigatório')
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome deve ter entre 1 e 100 caracteres'),

  body('capacidade')
    .notEmpty()
    .withMessage('Capacidade é obrigatória')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Capacidade deve ser um número entre 1 e 1000'),

  body('tipo')
    .notEmpty()
    .withMessage('Tipo da sala é obrigatório')
    .isIn(Object.values(TipoSala))
    .withMessage('Tipo deve ser válido (AULA_COMUM, LABORATORIO, AUDITORIO, BIBLIOTECA, SALA_CONFERENCIA, GINASIO)'),

  body('equipamentos')
    .optional()
    .isArray()
    .withMessage('Equipamentos deve ser um array'),

  body('equipamentos.*')
    .optional()
    .isString()
    .withMessage('Cada equipamento deve ser uma string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome do equipamento deve ter entre 1 e 100 caracteres'),

  body('localizacao')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Localização deve ter entre 1 e 200 caracteres')
];

export const updateClassroomValidation = [
  body('nome')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome deve ter entre 1 e 100 caracteres'),

  body('capacidade')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Capacidade deve ser um número entre 1 e 1000'),

  body('tipo')
    .optional()
    .isIn(Object.values(TipoSala))
    .withMessage('Tipo deve ser válido'),

  body('equipamentos')
    .optional()
    .isArray()
    .withMessage('Equipamentos deve ser um array'),

  body('equipamentos.*')
    .optional()
    .isString()
    .withMessage('Cada equipamento deve ser uma string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Nome do equipamento deve ter entre 1 e 100 caracteres'),

  body('disponivel')
    .optional()
    .isBoolean()
    .withMessage('Disponível deve ser um valor booleano'),

  body('localizacao')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Localização deve ter entre 1 e 200 caracteres')
];

export const classroomFiltersValidation = [
  query('tipo')
    .optional()
    .isIn(Object.values(TipoSala))
    .withMessage('Tipo deve ser válido'),

  query('capacidadeMinima')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacidade mínima deve ser um número positivo'),

  query('disponivel')
    .optional()
    .isBoolean()
    .withMessage('Disponível deve ser um valor booleano'),

  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de busca deve ter entre 1 e 100 caracteres'),

  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip deve ser um número inteiro não negativo'),

  query('take')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Take deve ser um número entre 1 e 100')
];

// ==================== CALENDAR VALIDATIONS ====================

export const createCalendarValidation = [
  body('nome')
    .notEmpty()
    .withMessage('Nome do evento é obrigatório')
    .isLength({ min: 1, max: 200 })
    .withMessage('Nome deve ter entre 1 e 200 caracteres'),

  body('dataInicio')
    .notEmpty()
    .withMessage('Data de início é obrigatória')
    .isISO8601()
    .withMessage('Data de início deve estar no formato ISO 8601'),

  body('dataFim')
    .notEmpty()
    .withMessage('Data de fim é obrigatória')
    .isISO8601()
    .withMessage('Data de fim deve estar no formato ISO 8601')
    .custom((dataFim, { req }) => {
      const dataInicio = new Date(req.body.dataInicio);
      const dataFimDate = new Date(dataFim);
      if (dataFimDate <= dataInicio) {
        throw new Error('Data de fim deve ser posterior à data de início');
      }
      return true;
    }),

  body('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres'),

  body('tipo')
    .notEmpty()
    .withMessage('Tipo do evento é obrigatório')
    .isIn(Object.values(TipoEvento))
    .withMessage('Tipo deve ser válido (PERIODO_LETIVO, FERIAS, PROVA, FERIADO, EVENTO_ACADEMICO, MANUTENCAO)'),

  body('descricao')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Descrição deve ter entre 1 e 500 caracteres')
];

export const updateCalendarValidation = [
  body('nome')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Nome deve ter entre 1 e 200 caracteres'),

  body('dataInicio')
    .optional()
    .isISO8601()
    .withMessage('Data de início deve estar no formato ISO 8601'),

  body('dataFim')
    .optional()
    .isISO8601()
    .withMessage('Data de fim deve estar no formato ISO 8601')
    .custom((dataFim, { req }) => {
      if (req.body.dataInicio && dataFim) {
        const dataInicio = new Date(req.body.dataInicio);
        const dataFimDate = new Date(dataFim);
        if (dataFimDate <= dataInicio) {
          throw new Error('Data de fim deve ser posterior à data de início');
        }
      }
      return true;
    }),

  body('periodo')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres'),

  body('tipo')
    .optional()
    .isIn(Object.values(TipoEvento))
    .withMessage('Tipo deve ser válido'),

  body('descricao')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Descrição deve ter entre 1 e 500 caracteres'),

  body('ativo')
    .optional()
    .isBoolean()
    .withMessage('Ativo deve ser um valor booleano')
];

export const calendarFiltersValidation = [
  query('periodo')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres'),

  query('tipo')
    .optional()
    .isIn(Object.values(TipoEvento))
    .withMessage('Tipo deve ser válido'),

  query('ativo')
    .optional()
    .isBoolean()
    .withMessage('Ativo deve ser um valor booleano'),

  query('dataInicio')
    .optional()
    .isISO8601()
    .withMessage('Data de início deve estar no formato ISO 8601'),

  query('dataFim')
    .optional()
    .isISO8601()
    .withMessage('Data de fim deve estar no formato ISO 8601'),

  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de busca deve ter entre 1 e 100 caracteres'),

  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip deve ser um número inteiro não negativo'),

  query('take')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Take deve ser um número entre 1 e 100')
];

// ==================== CONFLICT VALIDATIONS ====================

export const conflictFiltersValidation = [
  query('tipo')
    .optional()
    .isIn(Object.values(TipoConflito))
    .withMessage('Tipo deve ser válido (PROFESSOR_SOBREPOSICAO, SALA_SOBREPOSICAO, CAPACIDADE_EXCEDIDA, HORARIO_INDISPONIVEL)'),

  query('resolvido')
    .optional()
    .isBoolean()
    .withMessage('Resolvido deve ser um valor booleano'),

  query('professorId')
    .optional()
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),

  query('salaId')
    .optional()
    .isUUID()
    .withMessage('ID da sala deve ser um UUID válido'),

  query('periodo')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres'),

  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip deve ser um número inteiro não negativo'),

  query('take')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Take deve ser um número entre 1 e 100')
];

export const conflictResolutionValidation = [
  body('solucao')
    .notEmpty()
    .withMessage('Solução é obrigatória')
    .isLength({ min: 1, max: 500 })
    .withMessage('Solução deve ter entre 1 e 500 caracteres'),

  body('novoHorario')
    .optional()
    .isObject()
    .withMessage('Novo horário deve ser um objeto'),

  body('novoHorario.diaSemana')
    .if(body('novoHorario').exists())
    .isIn(Object.values(DiaSemana))
    .withMessage('Dia da semana deve ser válido'),

  body('novoHorario.horaInicio')
    .if(body('novoHorario').exists())
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de início deve estar no formato HH:mm'),

  body('novoHorario.horaFim')
    .if(body('novoHorario').exists())
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de fim deve estar no formato HH:mm'),

  body('novoHorario.salaId')
    .optional()
    .isUUID()
    .withMessage('ID da sala deve ser um UUID válido'),

  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações devem ter no máximo 500 caracteres')
];

// ==================== GENERAL VALIDATIONS ====================

export const uuidParamValidation = [
  param('id')
    .isUUID()
    .withMessage('ID deve ser um UUID válido')
];

export const professorIdParamValidation = [
  param('professorId')
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido')
];

export const salaIdParamValidation = [
  param('salaId')
    .isUUID()
    .withMessage('ID da sala deve ser um UUID válido')
];

export const disciplinaIdParamValidation = [
  param('disciplinaId')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido')
];

export const availabilityValidation = [
  query('data')
    .notEmpty()
    .withMessage('Data é obrigatória')
    .isISO8601()
    .withMessage('Data deve estar no formato ISO 8601'),

  query('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres')
];

export const weeklyScheduleValidation = [
  query('professorId')
    .optional()
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),

  query('salaId')
    .optional()
    .isUUID()
    .withMessage('ID da sala deve ser um UUID válido'),

  query('periodo')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres')
];

export const scheduleRecommendationValidation = [
  body('disciplinaId')
    .notEmpty()
    .withMessage('ID da disciplina é obrigatório')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('professorId')
    .notEmpty()
    .withMessage('ID do professor é obrigatório')
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),

  body('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .isLength({ min: 1, max: 20 })
    .withMessage('Período deve ter entre 1 e 20 caracteres'),

  body('duracaoMinutos')
    .notEmpty()
    .withMessage('Duração em minutos é obrigatória')
    .isInt({ min: 30, max: 480 })
    .withMessage('Duração deve ser entre 30 e 480 minutos'),

  body('preferencias')
    .optional()
    .isObject()
    .withMessage('Preferências deve ser um objeto'),

  body('preferencias.tipoSala')
    .optional()
    .isIn(Object.values(TipoSala))
    .withMessage('Tipo de sala deve ser válido'),

  body('preferencias.capacidadeMinima')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacidade mínima deve ser um número positivo'),

  body('preferencias.diasPreferidos')
    .optional()
    .isArray()
    .withMessage('Dias preferidos deve ser um array'),

  body('preferencias.diasPreferidos.*')
    .if(body('preferencias.diasPreferidos').exists())
    .isIn(Object.values(DiaSemana))
    .withMessage('Cada dia preferido deve ser válido')
]; 