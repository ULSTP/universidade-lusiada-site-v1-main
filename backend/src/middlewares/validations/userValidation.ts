import { body } from 'express-validator';

export const createUserValidation = [
  body('nome')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório'),

  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail(),

  body('senha')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número'),

  body('tipoUsuario')
    .isIn(['ADMIN', 'PROFESSOR', 'ESTUDANTE', 'FUNCIONARIO'])
    .withMessage('Tipo de usuário deve ser: ADMIN, PROFESSOR, ESTUDANTE ou FUNCIONARIO'),

  body('genero')
    .optional()
    .isIn(['MASCULINO', 'FEMININO', 'OUTRO'])
    .withMessage('Gênero deve ser: MASCULINO, FEMININO ou OUTRO'),

  body('dataNascimento')
    .optional()
    .isISO8601()
    .withMessage('Data de nascimento deve estar no formato válido (YYYY-MM-DD)')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 16 || age > 100) {
        throw new Error('Idade deve estar entre 16 e 100 anos');
      }
      return true;
    }),

  body('telefone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]{8,20}$/)
    .withMessage('Telefone deve ter formato válido'),

  body('numeroEstudante')
    .optional()
    .isLength({ min: 4, max: 20 })
    .withMessage('Número de estudante deve ter entre 4 e 20 caracteres')
    .isAlphanumeric()
    .withMessage('Número de estudante deve conter apenas letras e números'),

  body('numeroFuncionario')
    .optional()
    .isLength({ min: 4, max: 20 })
    .withMessage('Número de funcionário deve ter entre 4 e 20 caracteres')
    .isAlphanumeric()
    .withMessage('Número de funcionário deve conter apenas letras e números')
];

export const updateUserValidation = [
  body('nome')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim(),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail(),

  body('telefone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]{8,20}$/)
    .withMessage('Telefone deve ter formato válido'),

  body('genero')
    .optional()
    .isIn(['MASCULINO', 'FEMININO', 'OUTRO'])
    .withMessage('Gênero deve ser: MASCULINO, FEMININO ou OUTRO'),

  body('dataNascimento')
    .optional()
    .isISO8601()
    .withMessage('Data de nascimento deve estar no formato válido (YYYY-MM-DD)')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 16 || age > 100) {
        throw new Error('Idade deve estar entre 16 e 100 anos');
      }
      return true;
    })
]; 