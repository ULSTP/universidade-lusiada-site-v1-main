import { body, param, query } from 'express-validator';

export const createSubjectValidation = [
  body('codigo')
    .notEmpty()
    .withMessage('Código da disciplina é obrigatório')
    .isLength({ min: 2, max: 20 })
    .withMessage('Código deve ter entre 2 e 20 caracteres')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Código deve conter apenas letras maiúsculas e números'),

  body('nome')
    .notEmpty()
    .withMessage('Nome da disciplina é obrigatório')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres')
    .trim(),

  body('descricao')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Descrição não pode exceder 1000 caracteres')
    .trim(),

  body('cargaHoraria')
    .notEmpty()
    .withMessage('Carga horária é obrigatória')
    .isInt({ min: 1, max: 500 })
    .withMessage('Carga horária deve ser um número inteiro entre 1 e 500'),

  body('creditos')
    .notEmpty()
    .withMessage('Créditos são obrigatórios')
    .isInt({ min: 1, max: 20 })
    .withMessage('Créditos devem ser um número inteiro entre 1 e 20'),

  body('semestre')
    .notEmpty()
    .withMessage('Semestre é obrigatório')
    .isInt({ min: 1, max: 12 })
    .withMessage('Semestre deve ser um número inteiro entre 1 e 12'),

  body('tipo')
    .notEmpty()
    .withMessage('Tipo da disciplina é obrigatório')
    .isIn(['OBRIGATORIA', 'OPTATIVA', 'ESTAGIO', 'TCC'])
    .withMessage('Tipo deve ser: OBRIGATORIA, OPTATIVA, ESTAGIO ou TCC'),

  body('status')
    .optional()
    .isIn(['ATIVA', 'INATIVA', 'SUSPENSA'])
    .withMessage('Status deve ser: ATIVA, INATIVA ou SUSPENSA'),

  body('prerequisitos')
    .optional()
    .isArray()
    .withMessage('Pré-requisitos devem ser um array'),

  body('prerequisitos.*')
    .optional()
    .isString()
    .withMessage('Cada pré-requisito deve ser uma string'),

  body('competencias')
    .optional()
    .isArray()
    .withMessage('Competências devem ser um array'),

  body('competencias.*')
    .optional()
    .isString()
    .withMessage('Cada competência deve ser uma string'),

  body('objetivos')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Objetivos não podem exceder 2000 caracteres')
    .trim(),

  body('programa')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Programa não pode exceder 5000 caracteres')
    .trim(),

  body('metodologia')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Metodologia não pode exceder 2000 caracteres')
    .trim(),

  body('avaliacao')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Avaliação não pode exceder 2000 caracteres')
    .trim(),

  body('bibliografia')
    .optional()
    .isArray()
    .withMessage('Bibliografia deve ser um array'),

  body('bibliografia.*')
    .optional()
    .isString()
    .withMessage('Cada item da bibliografia deve ser uma string'),

  body('departamentoId')
    .notEmpty()
    .withMessage('ID do departamento é obrigatório')
    .isUUID()
    .withMessage('ID do departamento deve ser um UUID válido'),

  body('cursoId')
    .notEmpty()
    .withMessage('ID do curso é obrigatório')
    .isUUID()
    .withMessage('ID do curso deve ser um UUID válido'),

  body('professorId')
    .optional()
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),
];

export const updateSubjectValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('codigo')
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage('Código deve ter entre 2 e 20 caracteres')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Código deve conter apenas letras maiúsculas e números'),

  body('nome')
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres')
    .trim(),

  body('descricao')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Descrição não pode exceder 1000 caracteres')
    .trim(),

  body('cargaHoraria')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('Carga horária deve ser um número inteiro entre 1 e 500'),

  body('creditos')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Créditos devem ser um número inteiro entre 1 e 20'),

  body('semestre')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Semestre deve ser um número inteiro entre 1 e 12'),

  body('tipo')
    .optional()
    .isIn(['OBRIGATORIA', 'OPTATIVA', 'ESTAGIO', 'TCC'])
    .withMessage('Tipo deve ser: OBRIGATORIA, OPTATIVA, ESTAGIO ou TCC'),

  body('status')
    .optional()
    .isIn(['ATIVA', 'INATIVA', 'SUSPENSA'])
    .withMessage('Status deve ser: ATIVA, INATIVA ou SUSPENSA'),

  body('prerequisitos')
    .optional()
    .isArray()
    .withMessage('Pré-requisitos devem ser um array'),

  body('prerequisitos.*')
    .optional()
    .isString()
    .withMessage('Cada pré-requisito deve ser uma string'),

  body('competencias')
    .optional()
    .isArray()
    .withMessage('Competências devem ser um array'),

  body('competencias.*')
    .optional()
    .isString()
    .withMessage('Cada competência deve ser uma string'),

  body('objetivos')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Objetivos não podem exceder 2000 caracteres')
    .trim(),

  body('programa')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Programa não pode exceder 5000 caracteres')
    .trim(),

  body('metodologia')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Metodologia não pode exceder 2000 caracteres')
    .trim(),

  body('avaliacao')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Avaliação não pode exceder 2000 caracteres')
    .trim(),

  body('bibliografia')
    .optional()
    .isArray()
    .withMessage('Bibliografia deve ser um array'),

  body('bibliografia.*')
    .optional()
    .isString()
    .withMessage('Cada item da bibliografia deve ser uma string'),

  body('departamentoId')
    .optional()
    .isUUID()
    .withMessage('ID do departamento deve ser um UUID válido'),

  body('cursoId')
    .optional()
    .isUUID()
    .withMessage('ID do curso deve ser um UUID válido'),

  body('professorId')
    .optional()
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),
];

export const getSubjectValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),
];

export const deleteSubjectValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),
];

export const updateSubjectStatusValidation = [
  param('id')
    .isUUID()
    .withMessage('ID da disciplina deve ser um UUID válido'),

  body('status')
    .notEmpty()
    .withMessage('Status é obrigatório')
    .isIn(['ATIVA', 'INATIVA', 'SUSPENSA'])
    .withMessage('Status deve ser: ATIVA, INATIVA ou SUSPENSA'),
];

export const getSubjectsValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Termo de busca deve ter pelo menos 1 caractere'),

  query('cursoId')
    .optional()
    .isUUID()
    .withMessage('ID do curso deve ser um UUID válido'),

  query('departamentoId')
    .optional()
    .isUUID()
    .withMessage('ID do departamento deve ser um UUID válido'),

  query('professorId')
    .optional()
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),

  query('semestre')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Semestre deve ser um número inteiro entre 1 e 12'),

  query('tipo')
    .optional()
    .isIn(['OBRIGATORIA', 'OPTATIVA', 'ESTAGIO', 'TCC'])
    .withMessage('Tipo deve ser: OBRIGATORIA, OPTATIVA, ESTAGIO ou TCC'),

  query('status')
    .optional()
    .isIn(['ATIVA', 'INATIVA', 'SUSPENSA'])
    .withMessage('Status deve ser: ATIVA, INATIVA ou SUSPENSA'),

  query('creditos')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Créditos devem ser um número inteiro entre 1 e 20'),

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
    .isIn(['nome', 'codigo', 'semestre', 'creditos', 'criadoEm'])
    .withMessage('Ordenação deve ser: nome, codigo, semestre, creditos ou criadoEm'),

  query('direcao')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Direção deve ser: asc ou desc'),
];

export const getSubjectsByCourseValidation = [
  param('cursoId')
    .isUUID()
    .withMessage('ID do curso deve ser um UUID válido'),
];

export const getSubjectsByProfessorValidation = [
  param('professorId')
    .isUUID()
    .withMessage('ID do professor deve ser um UUID válido'),
];

export const searchSubjectsValidation = [
  query('q')
    .notEmpty()
    .withMessage('Termo de busca é obrigatório')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Termo de busca deve ter entre 1 e 100 caracteres'),
]; 