import { Router } from 'express';
import { CourseController } from './CourseController';
import { authenticateToken, requireAdmin, requireTeacherOrAdmin } from '@middlewares/auth';
import { 
  createCourseValidation, 
  updateCourseValidation, 
  courseIdValidation,
  assignCoordinatorValidation,
  changeStatusValidation
} from '@middlewares/validations/courseValidation';

const router = Router();
const courseController = new CourseController();

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Listar cursos
 *     tags: [Cursos]
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
 *         name: nivel
 *         schema:
 *           type: string
 *           enum: [LICENCIATURA, MESTRADO, DOUTORAMENTO, ESPECIALIZACAO, TECNOLOGO]
 *       - in: query
 *         name: departamentoId
 *         schema:
 *           type: string
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de cursos
 *       401:
 *         description: Não autorizado
 */
router.get('/', authenticateToken, courseController.list);

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Criar novo curso (Admin)
 *     tags: [Cursos]
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
 *               - codigo
 *               - nivel
 *               - duracaoAnos
 *               - duracaoSemestres
 *               - creditosMinimos
 *               - departamentoId
 *             properties:
 *               nome:
 *                 type: string
 *               codigo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               nivel:
 *                 type: string
 *                 enum: [LICENCIATURA, MESTRADO, DOUTORAMENTO, ESPECIALIZACAO, TECNOLOGO]
 *               duracaoAnos:
 *                 type: integer
 *               duracaoSemestres:
 *                 type: integer
 *               creditosMinimos:
 *                 type: integer
 *               departamentoId:
 *                 type: string
 *               coordenadorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       409:
 *         description: Código já existe
 */
router.post('/', authenticateToken, requireAdmin, createCourseValidation, courseController.create);

/**
 * @swagger
 * /api/v1/courses/search:
 *   get:
 *     summary: Buscar cursos
 *     tags: [Cursos]
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
 */
router.get('/search', authenticateToken, courseController.search);

/**
 * @swagger
 * /api/v1/courses/stats:
 *   get:
 *     summary: Obter estatísticas de cursos (Admin/Professor)
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas dos cursos
 */
router.get('/stats', authenticateToken, requireTeacherOrAdmin, courseController.getStats);

/**
 * @swagger
 * /api/v1/courses/department/{departmentId}:
 *   get:
 *     summary: Obter cursos por departamento
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cursos do departamento
 */
router.get('/department/:departmentId', authenticateToken, courseController.getByDepartment);

/**
 * @swagger
 * /api/v1/courses/coordinator/{coordinatorId}:
 *   get:
 *     summary: Obter cursos por coordenador
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coordinatorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cursos do coordenador
 */
router.get('/coordinator/:coordinatorId', authenticateToken, courseController.getByCoordinator);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Obter curso por ID
 *     tags: [Cursos]
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
 *         description: Dados do curso
 *       404:
 *         description: Curso não encontrado
 */
router.get('/:id', authenticateToken, courseIdValidation, courseController.getById);

/**
 * @swagger
 * /api/v1/courses/code/{code}:
 *   get:
 *     summary: Obter curso por código
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do curso
 *       404:
 *         description: Curso não encontrado
 */
router.get('/code/:code', authenticateToken, courseController.getByCode);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   put:
 *     summary: Atualizar curso (Admin)
 *     tags: [Cursos]
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
 *               descricao:
 *                 type: string
 *               duracaoAnos:
 *                 type: integer
 *               duracaoSemestres:
 *                 type: integer
 *               creditosMinimos:
 *                 type: integer
 *               departamentoId:
 *                 type: string
 *               coordenadorId:
 *                 type: string
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *       404:
 *         description: Curso não encontrado
 */
router.put('/:id', authenticateToken, requireAdmin, updateCourseValidation, courseController.update);

/**
 * @swagger
 * /api/v1/courses/{id}/status:
 *   patch:
 *     summary: Alterar status do curso (Admin)
 *     tags: [Cursos]
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
 *               - ativo
 *             properties:
 *               ativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status alterado com sucesso
 */
router.patch('/:id/status', authenticateToken, requireAdmin, changeStatusValidation, courseController.changeStatus);

/**
 * @swagger
 * /api/v1/courses/{id}/coordinator:
 *   post:
 *     summary: Atribuir coordenador ao curso (Admin)
 *     tags: [Cursos]
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
 *               - coordinatorId
 *             properties:
 *               coordinatorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coordenador atribuído com sucesso
 */
router.post('/:id/coordinator', authenticateToken, requireAdmin, assignCoordinatorValidation, courseController.assignCoordinator);

/**
 * @swagger
 * /api/v1/courses/{id}/coordinator:
 *   delete:
 *     summary: Remover coordenador do curso (Admin)
 *     tags: [Cursos]
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
 *         description: Coordenador removido com sucesso
 */
router.delete('/:id/coordinator', authenticateToken, requireAdmin, courseIdValidation, courseController.removeCoordinator);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: Excluir curso (Admin)
 *     tags: [Cursos]
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
 *         description: Curso excluído com sucesso
 *       404:
 *         description: Curso não encontrado
 */
router.delete('/:id', authenticateToken, requireAdmin, courseIdValidation, courseController.delete);

export default router; 