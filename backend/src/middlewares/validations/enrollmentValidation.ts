import { body, param, query } from 'express-validator';

export const createEnrollmentValidation = [
  body('estudanteId')
    .notEmpty()
    .withMessage('ID do estudante é obrigatório')
    .isUUID()
    .withMessage('ID do estudante deve ser um UUID válido'),

  body('disciplinaId')
    .notEmpty()
    .withMessage('ID da disciplina é obrigatório')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('turmaId')
    .optional()
    .isUUID()
    .withMessage('ID da turma deve ser um UUID válido'),

  body('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),

  body('anoLetivo')
    .notEmpty()
    .withMessage('Ano letivo é obrigatório')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Ano letivo deve ser um número inteiro entre 2020 e 2030'),

  body('semestre')
    .notEmpty()
    .withMessage('Semestre é obrigatório')
    .isInt({ min: 1, max: 12 })
    .withMessage('Semestre deve ser um número inteiro entre 1 e 12'),

  body('status')
    .optional()
    .isIn(['PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA'])
    .withMessage('Status deve ser: PENDENTE, APROVADA, REJEITADA ou CANCELADA'),

  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações não podem exceder 500 caracteres')
    .trim(),
];

export const updateEnrollmentValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da inscrição deve ser um UUID válido'),

  body('turmaId')
    .optional()
    .isUUID()
    .withMessage('ID da turma deve ser um UUID válido'),

  body('status')
    .optional()
    .isIn(['PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA'])
    .withMessage('Status deve ser: PENDENTE, APROVADA, REJEITADA ou CANCELADA'),

  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações não podem exceder 500 caracteres')
    .trim(),

  body('motivo')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Motivo não pode exceder 200 caracteres')
    .trim(),
];

export const getEnrollmentValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da inscrição deve ser um UUID válido'),
];

export const deleteEnrollmentValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da inscrição deve ser um UUID válido'),
];

export const updateEnrollmentStatusValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da inscrição deve ser um UUID válido'),

  body('status')
    .notEmpty()
    .withMessage('Status é obrigatório')
    .isIn(['PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA'])
    .withMessage('Status deve ser: PENDENTE, APROVADA, REJEITADA ou CANCELADA'),

  body('motivo')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Motivo não pode exceder 200 caracteres')
    .trim(),
];

export const getEnrollmentsValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Termo de busca deve ter pelo menos 1 caractere'),

  query('estudanteId')
    .optional()
    .isUUID()
    .withMessage('ID do estudante deve ser um UUID válido'),

  query('disciplinaId')
    .optional()
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  query('turmaId')
    .optional()
    .isUUID()
    .withMessage('ID da turma deve ser um UUID válido'),

  query('cursoId')
    .optional()
    .isUUID()
    .withMessage('ID do curso deve ser um UUID válido'),

  query('departamentoId')
    .optional()
    .isUUID()
    .withMessage('ID do departamento deve ser um UUID válido'),

  query('status')
    .optional()
    .isIn(['PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA'])
    .withMessage('Status deve ser: PENDENTE, APROVADA, REJEITADA ou CANCELADA'),

  query('periodo')
    .optional()
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),

  query('anoLetivo')
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Ano letivo deve ser um número inteiro entre 2020 e 2030'),

  query('semestre')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Semestre deve ser um número inteiro entre 1 e 12'),

  query('pagina')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que 0'),

  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser um número inteiro entre 1 e 100'),

  query('ordenacao')
    .optional()
    .isIn(['dataInscricao', 'status', 'periodo', 'estudante', 'disciplina'])
    .withMessage('Ordenação deve ser: dataInscricao, status, periodo, estudante ou disciplina'),

  query('direcao')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Direção deve ser: asc ou desc'),
];

export const createBulkEnrollmentValidation = [
  body('estudantesIds')
    .notEmpty()
    .withMessage('Lista de IDs dos estudantes é obrigatória')
    .isArray({ min: 1, max: 100 })
    .withMessage('Deve conter entre 1 e 100 estudantes'),

  body('estudantesIds.*')
    .isUUID()
    .withMessage('Cada ID de estudante deve ser um UUID válido'),

  body('disciplinaId')
    .notEmpty()
    .withMessage('ID da disciplina é obrigatório')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('turmaId')
    .optional()
    .isUUID()
    .withMessage('ID da turma deve ser um UUID válido'),

  body('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),

  body('anoLetivo')
    .notEmpty()
    .withMessage('Ano letivo é obrigatório')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Ano letivo deve ser um número inteiro entre 2020 e 2030'),

  body('semestre')
    .notEmpty()
    .withMessage('Semestre é obrigatório')
    .isInt({ min: 1, max: 12 })
    .withMessage('Semestre deve ser um número inteiro entre 1 e 12'),

  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações não podem exceder 500 caracteres')
    .trim(),
];

export const getEnrollmentsByStudentValidation = [
  param('estudanteId')
    .isUUID()
    .withMessage('ID do estudante deve ser um UUID válido'),

  query('periodo')
    .optional()
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),
];

export const getEnrollmentsBySubjectValidation = [
  param('disciplinaId')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  query('periodo')
    .optional()
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),
];

export const checkPrerequisitesValidation = [
  query('estudanteId')
    .notEmpty()
    .withMessage('ID do estudante é obrigatório')
    .isUUID()
    .withMessage('ID do estudante deve ser um UUID válido'),

  query('disciplinaId')
    .notEmpty()
    .withMessage('ID da disciplina é obrigatório')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),
];

export const checkClassCapacityValidation = [
  param('turmaId')
    .isUUID()
    .withMessage('ID da turma deve ser um UUID válido'),
];

export const searchEnrollmentsValidation = [
  query('q')
    .notEmpty()
    .withMessage('Termo de busca é obrigatório')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de busca deve ter entre 1 e 100 caracteres'),
];

export const approvePendingEnrollmentsValidation = [
  body('disciplinaId')
    .notEmpty()
    .withMessage('ID da disciplina é obrigatório')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),
];

export const validatePeriod = [
  body('periodo')
    .custom((value) => {
      if (!value) return true; // Opcional
      
      const regex = /^\d{4}\.[12]$/;
      if (!regex.test(value)) {
        throw new Error('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)');
      }
      
      const [year, semester] = value.split('.');
      const currentYear = new Date().getFullYear();
      
      if (parseInt(year) < currentYear - 1 || parseInt(year) > currentYear + 1) {
        throw new Error('Ano do período deve estar entre o ano anterior e o próximo ano');
      }
      
      return true;
    }),
];

export const validateAcademicYear = [
  body('anoLetivo')
    .custom((value) => {
      if (!value) return true; // Opcional
      
      const currentYear = new Date().getFullYear();
      if (value < currentYear - 1 || value > currentYear + 1) {
        throw new Error('Ano letivo deve estar entre o ano anterior e o próximo ano');
      }
      
      return true;
    }),
]; 