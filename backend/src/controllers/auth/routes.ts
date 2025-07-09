import { Router } from 'express';
import { AuthController } from './AuthController';
import { loginValidation, refreshTokenValidation, forgotPasswordValidation, resetPasswordValidation, changePasswordValidation } from '@middlewares/validations/authValidation';
import { authenticateToken } from '@middlewares/auth';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Fazer login no sistema
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginValidation, authController.login);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Renovar token de acesso
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *       401:
 *         description: Refresh token inválido
 */
router.post('/refresh', refreshTokenValidation, authController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Fazer logout do sistema
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token inválido
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
 */
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Redefinir senha com token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Alterar senha (usuário logado)
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Senha atual incorreta
 *       401:
 *         description: Token inválido
 */
router.post('/change-password', authenticateToken, changePasswordValidation, authController.changePassword);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Obter perfil do usuário logado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *       401:
 *         description: Token inválido
 */
router.get('/me', authenticateToken, authController.getProfile);

export default router; 