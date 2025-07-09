import { Router } from 'express';
import { UserController } from './UserController';
import { authenticateToken, requireAdmin, requireTeacherOrAdmin } from '@middlewares/auth';
import { createUserValidation, updateUserValidation } from '@middlewares/validations/userValidation';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Listar usuários (Admin/Professor)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: tipoUsuario
 *         schema:
 *           type: string
 *           enum: [ADMIN, PROFESSOR, ESTUDANTE, FUNCIONARIO]
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ATIVO, INATIVO, SUSPENSO, BLOQUEADO]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get('/', authenticateToken, requireTeacherOrAdmin, userController.list);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Criar novo usuário (Admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - tipoUsuario
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 minLength: 6
 *               tipoUsuario:
 *                 type: string
 *                 enum: [ADMIN, PROFESSOR, ESTUDANTE, FUNCIONARIO]
 *               genero:
 *                 type: string
 *                 enum: [MASCULINO, FEMININO, OUTRO]
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               telefone:
 *                 type: string
 *               numeroEstudante:
 *                 type: string
 *               numeroFuncionario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       409:
 *         description: Email já existe
 */
router.post('/', authenticateToken, requireAdmin, createUserValidation, userController.create);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obter usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', authenticateToken, userController.getById);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *               genero:
 *                 type: string
 *                 enum: [MASCULINO, FEMININO, OUTRO]
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', authenticateToken, updateUserValidation, userController.update);

/**
 * @swagger
 * /api/v1/users/{id}/status:
 *   patch:
 *     summary: Alterar status do usuário (Admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ATIVO, INATIVO, SUSPENSO, BLOQUEADO]
 *     responses:
 *       200:
 *         description: Status alterado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.patch('/:id/status', authenticateToken, requireAdmin, userController.changeStatus);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Excluir usuário (Admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', authenticateToken, requireAdmin, userController.delete);

/**
 * @swagger
 * /api/v1/users/stats:
 *   get:
 *     summary: Obter estatísticas de usuários (Admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas dos usuários
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 */
router.get('/stats', authenticateToken, requireAdmin, userController.getStats);

/**
 * @swagger
 * /api/v1/users/search:
 *   get:
 *     summary: Buscar usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Resultados da busca
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Não autorizado
 */
router.get('/search', authenticateToken, userController.search);

export default router; 