import { body } from 'express-validator';

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

export const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token é obrigatório')
];

export const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail()
];

export const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Token é obrigatório'),
  body('novaSenha')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
];

export const changePasswordValidation = [
  body('senhaAtual')
    .notEmpty()
    .withMessage('Senha atual é obrigatória'),
  body('novaSenha')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
]; 