import { body, param } from 'express-validator';

export const createCourseValidation = [
  body('nome')
    .isLength({ min: 3, max: 200 })
    .withMessage('Nome do curso deve ter entre 3 e 200 caracteres')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório'),

  body('codigo')
    .isLength({ min: 2, max: 10 })
    .withMessage('Código deve ter entre 2 e 10 caracteres')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Código deve conter apenas letras maiúsculas e números')
    .trim(),

  body('descricao')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres')
    .trim(),

  body('nivel')
    .isIn(['LICENCIATURA', 'MESTRADO', 'DOUTORAMENTO', 'ESPECIALIZACAO', 'TECNOLOGO'])
    .withMessage('Nível deve ser: LICENCIATURA, MESTRADO, DOUTORAMENTO, ESPECIALIZACAO ou TECNOLOGO'),

  body('duracaoAnos')
    .isInt({ min: 1, max: 8 })
    .withMessage('Duração em anos deve ser entre 1 e 8'),

  body('duracaoSemestres')
    .isInt({ min: 2, max: 16 })
    .withMessage('Duração em semestres deve ser entre 2 e 16')
    .custom((value, { req }) => {
      const anos = req.body.duracaoAnos;
      if (anos && value !== anos * 2) {
        throw new Error('Duração em semestres deve ser o dobro da duração em anos');
      }
      return true;
    }),

  body('creditosMinimos')
    .isInt({ min: 120, max: 500 })
    .withMessage('Créditos mínimos deve ser entre 120 e 500'),

  body('departamentoId')
    .notEmpty()
    .withMessage('Departamento é obrigatório')
    .isString()
    .withMessage('ID do departamento deve ser uma string'),

  body('coordenadorId')
    .optional()
    .isString()
    .withMessage('ID do coordenador deve ser uma string')
];

export const updateCourseValidation = [
  body('nome')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Nome do curso deve ter entre 3 e 200 caracteres')
    .trim(),

  body('descricao')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres')
    .trim(),

  body('duracaoAnos')
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage('Duração em anos deve ser entre 1 e 8'),

  body('duracaoSemestres')
    .optional()
    .isInt({ min: 2, max: 16 })
    .withMessage('Duração em semestres deve ser entre 2 e 16'),

  body('creditosMinimos')
    .optional()
    .isInt({ min: 120, max: 500 })
    .withMessage('Créditos mínimos deve ser entre 120 e 500'),

  body('departamentoId')
    .optional()
    .isString()
    .withMessage('ID do departamento deve ser uma string'),

  body('coordenadorId')
    .optional()
    .isString()
    .withMessage('ID do coordenador deve ser uma string'),

  body('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser true ou false')
];

export const courseIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID do curso é obrigatório')
    .isString()
    .withMessage('ID deve ser uma string')
];

export const assignCoordinatorValidation = [
  ...courseIdValidation,
  body('coordinatorId')
    .notEmpty()
    .withMessage('ID do coordenador é obrigatório')
    .isString()
    .withMessage('ID do coordenador deve ser uma string')
];

export const changeStatusValidation = [
  ...courseIdValidation,
  body('ativo')
    .notEmpty()
    .withMessage('Status é obrigatório')
    .isBoolean()
    .withMessage('Status deve ser true ou false')
]; 