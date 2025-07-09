import { body, param, query } from 'express-validator';

export const createGradeValidation = [
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

  body('avaliacaoId')
    .optional()
    .isUUID()
    .withMessage('ID da avaliação deve ser um UUID válido'),

  body('tipoAvaliacao')
    .notEmpty()
    .withMessage('Tipo de avaliação é obrigatório')
    .isIn(['PROVA', 'TRABALHO', 'PARTICIPACAO', 'PROJETO', 'SEMINARIO', 'EXAME'])
    .withMessage('Tipo deve ser: PROVA, TRABALHO, PARTICIPACAO, PROJETO, SEMINARIO ou EXAME'),

  body('nome')
    .notEmpty()
    .withMessage('Nome da avaliação é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim(),

  body('nota')
    .notEmpty()
    .withMessage('Nota é obrigatória')
    .isFloat({ min: 0, max: 20 })
    .withMessage('Nota deve ser um número entre 0 e 20'),

  body('peso')
    .notEmpty()
    .withMessage('Peso é obrigatório')
    .isFloat({ min: 0.01, max: 1.0 })
    .withMessage('Peso deve ser um número entre 0.01 e 1.0'),

  body('dataAvaliacao')
    .notEmpty()
    .withMessage('Data da avaliação é obrigatória')
    .isISO8601()
    .withMessage('Data deve estar no formato ISO 8601')
    .custom((value) => {
      const dataAvaliacao = new Date(value);
      const hoje = new Date();
      if (dataAvaliacao > hoje) {
        throw new Error('Data da avaliação não pode ser futura');
      }
      return true;
    }),

  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações não podem exceder 500 caracteres')
    .trim(),

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
];

export const updateGradeValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da nota deve ser um UUID válido'),

  body('nota')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Nota deve ser um número entre 0 e 20'),

  body('peso')
    .optional()
    .isFloat({ min: 0.01, max: 1.0 })
    .withMessage('Peso deve ser um número entre 0.01 e 1.0'),

  body('observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações não podem exceder 500 caracteres')
    .trim(),

  body('dataAvaliacao')
    .optional()
    .isISO8601()
    .withMessage('Data deve estar no formato ISO 8601')
    .custom((value) => {
      if (!value) return true;
      const dataAvaliacao = new Date(value);
      const hoje = new Date();
      if (dataAvaliacao > hoje) {
        throw new Error('Data da avaliação não pode ser futura');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['ATIVO', 'CANCELADO', 'REVISAO'])
    .withMessage('Status deve ser: ATIVO, CANCELADO ou REVISAO'),
];

export const getGradeValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da nota deve ser um UUID válido'),
];

export const deleteGradeValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da nota deve ser um UUID válido'),
];

export const getGradesValidation = [
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

  query('avaliacaoId')
    .optional()
    .isUUID()
    .withMessage('ID da avaliação deve ser um UUID válido'),

  query('tipoAvaliacao')
    .optional()
    .isIn(['PROVA', 'TRABALHO', 'PARTICIPACAO', 'PROJETO', 'SEMINARIO', 'EXAME'])
    .withMessage('Tipo deve ser: PROVA, TRABALHO, PARTICIPACAO, PROJETO, SEMINARIO ou EXAME'),

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

  query('notaMinima')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Nota mínima deve ser um número entre 0 e 20'),

  query('notaMaxima')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Nota máxima deve ser um número entre 0 e 20'),

  query('status')
    .optional()
    .isIn(['ATIVO', 'CANCELADO', 'REVISAO'])
    .withMessage('Status deve ser: ATIVO, CANCELADO ou REVISAO'),

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
    .isIn(['dataAvaliacao', 'nota', 'nome', 'peso', 'estudante', 'disciplina'])
    .withMessage('Ordenação deve ser: dataAvaliacao, nota, nome, peso, estudante ou disciplina'),

  query('direcao')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Direção deve ser: asc ou desc'),
];

export const createBulkGradesValidation = [
  body('disciplinaId')
    .notEmpty()
    .withMessage('ID da disciplina é obrigatório')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('avaliacaoId')
    .optional()
    .isUUID()
    .withMessage('ID da avaliação deve ser um UUID válido'),

  body('tipoAvaliacao')
    .notEmpty()
    .withMessage('Tipo de avaliação é obrigatório')
    .isIn(['PROVA', 'TRABALHO', 'PARTICIPACAO', 'PROJETO', 'SEMINARIO', 'EXAME'])
    .withMessage('Tipo deve ser: PROVA, TRABALHO, PARTICIPACAO, PROJETO, SEMINARIO ou EXAME'),

  body('nome')
    .notEmpty()
    .withMessage('Nome da avaliação é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim(),

  body('peso')
    .notEmpty()
    .withMessage('Peso é obrigatório')
    .isFloat({ min: 0.01, max: 1.0 })
    .withMessage('Peso deve ser um número entre 0.01 e 1.0'),

  body('dataAvaliacao')
    .notEmpty()
    .withMessage('Data da avaliação é obrigatória')
    .isISO8601()
    .withMessage('Data deve estar no formato ISO 8601'),

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

  body('notas')
    .notEmpty()
    .withMessage('Lista de notas é obrigatória')
    .isArray({ min: 1, max: 200 })
    .withMessage('Deve conter entre 1 e 200 notas'),

  body('notas.*.estudanteId')
    .notEmpty()
    .withMessage('ID do estudante é obrigatório')
    .isUUID()
    .withMessage('ID do estudante deve ser um UUID válido'),

  body('notas.*.nota')
    .notEmpty()
    .withMessage('Nota é obrigatória')
    .isFloat({ min: 0, max: 20 })
    .withMessage('Nota deve ser um número entre 0 e 20'),

  body('notas.*.observacoes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações não podem exceder 500 caracteres')
    .trim(),
];

export const getStudentGradesValidation = [
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

  query('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),
];

export const getSubjectGradesReportValidation = [
  param('disciplinaId')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  query('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),
];

export const getStudentTranscriptValidation = [
  param('estudanteId')
    .isUUID()
    .withMessage('ID do estudante deve ser um UUID válido'),
];

export const getTeacherDashboardValidation = [
  param('professorId')
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),

  query('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),
];

export const searchGradesValidation = [
  query('q')
    .notEmpty()
    .withMessage('Termo de busca é obrigatório')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de busca deve ter entre 1 e 100 caracteres'),
];

export const updateGradeStatusValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da nota deve ser um UUID válido'),

  body('status')
    .notEmpty()
    .withMessage('Status é obrigatório')
    .isIn(['ATIVO', 'CANCELADO', 'REVISAO'])
    .withMessage('Status deve ser: ATIVO, CANCELADO ou REVISAO'),
];

export const calculateFinalGradeValidation = [
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

  query('periodo')
    .notEmpty()
    .withMessage('Período é obrigatório')
    .matches(/^\d{4}\.[12]$/)
    .withMessage('Período deve estar no formato YYYY.S (ex: 2024.1, 2024.2)'),
]; 