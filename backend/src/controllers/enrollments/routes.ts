import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { EnrollmentController } from './EnrollmentController';
import { authenticateToken } from '../../middlewares/auth';
import {
  createEnrollmentValidation,
  updateEnrollmentValidation,
  getEnrollmentValidation,
  deleteEnrollmentValidation,
  updateEnrollmentStatusValidation,
  getEnrollmentsValidation,
  createBulkEnrollmentValidation,
  getEnrollmentsByStudentValidation,
  getEnrollmentsBySubjectValidation,
  checkPrerequisitesValidation,
  checkClassCapacityValidation,
  searchEnrollmentsValidation,
  approvePendingEnrollmentsValidation,
} from '../../middlewares/validations/enrollmentValidation';

const router = Router();
const prisma = new PrismaClient();
const enrollmentController = new EnrollmentController(prisma);

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateEnrollment:
 *       type: object
 *       required:
 *         - estudanteId
 *         - disciplinaId
 *         - periodo
 *         - anoLetivo
 *         - semestre
 *       properties:
 *         estudanteId:
 *           type: string
 *           format: uuid
 *           description: ID do estudante
 *         disciplinaId:
 *           type: string
 *           format: uuid
 *           description: ID da disciplina
 *         turmaId:
 *           type: string
 *           format: uuid
 *           description: ID da turma (opcional)
 *         periodo:
 *           type: string
 *           pattern: '^\d{4}\.[12]$'
 *           description: Período letivo (ex 2024.1, 2024.2)
 *         anoLetivo:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2030
 *           description: Ano letivo
 *         semestre:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: Semestre do curso
 *         status:
 *           type: string
 *           enum: [PENDENTE, APROVADA, REJEITADA, CANCELADA]
 *           description: Status da inscrição
 *         observacoes:
 *           type: string
 *           maxLength: 500
 *           description: Observações sobre a inscrição
 *
 *     UpdateEnrollment:
 *       type: object
 *       properties:
 *         turmaId:
 *           type: string
 *           format: uuid
 *           description: ID da turma
 *         status:
 *           type: string
 *           enum: [PENDENTE, APROVADA, REJEITADA, CANCELADA]
 *           description: Status da inscrição
 *         observacoes:
 *           type: string
 *           maxLength: 500
 *           description: Observações
 *         motivo:
 *           type: string
 *           maxLength: 200
 *           description: Motivo da alteração
 *
 *     BulkEnrollment:
 *       type: object
 *       required:
 *         - estudantesIds
 *         - disciplinaId
 *         - periodo
 *         - anoLetivo
 *         - semestre
 *       properties:
 *         estudantesIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           minItems: 1
 *           maxItems: 100
 *           description: Lista de IDs dos estudantes
 *         disciplinaId:
 *           type: string
 *           format: uuid
 *           description: ID da disciplina
 *         turmaId:
 *           type: string
 *           format: uuid
 *           description: ID da turma (opcional)
 *         periodo:
 *           type: string
 *           pattern: '^\d{4}\.[12]$'
 *           description: Período letivo
 *         anoLetivo:
 *           type: integer
 *           description: Ano letivo
 *         semestre:
 *           type: integer
 *           description: Semestre
 *         observacoes:
 *           type: string
 *           maxLength: 500
 *           description: Observações
 *
 *     EnrollmentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         estudanteId:
 *           type: string
 *           format: uuid
 *         disciplinaId:
 *           type: string
 *           format: uuid
 *         turmaId:
 *           type: string
 *           format: uuid
 *         periodo:
 *           type: string
 *         anoLetivo:
 *           type: integer
 *         semestre:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [PENDENTE, APROVADA, REJEITADA, CANCELADA]
 *         observacoes:
 *           type: string
 *         dataInscricao:
 *           type: string
 *           format: date-time
 *         dataAprovacao:
 *           type: string
 *           format: date-time
 *         dataRejeicao:
 *           type: string
 *           format: date-time
 *         dataCancelamento:
 *           type: string
 *           format: date-time
 *         motivo:
 *           type: string
 *         estudante:
 *           type: object
 *         disciplina:
 *           type: object
 *         turma:
 *           type: object
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Criar nova inscrição
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEnrollment'
 *     responses:
 *       201:
 *         description: Inscrição criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 dados:
 *                   $ref: '#/components/schemas/EnrollmentResponse'
 *                 mensagem:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Estudante ou disciplina não encontrados
 */
router.post('/', authenticateToken, createEnrollmentValidation, (req, res) => {
  enrollmentController.createEnrollment(req, res);
});

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Listar inscrições com filtros
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca
 *       - in: query
 *         name: estudanteId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por estudante
 *       - in: query
 *         name: disciplinaId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por disciplina
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, APROVADA, REJEITADA, CANCELADA]
 *         description: Filtrar por status
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: Filtrar por período (ex 2024.1)
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número da página
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de inscrições
 */
router.get('/', authenticateToken, getEnrollmentsValidation, (req, res) => {
  enrollmentController.getEnrollments(req, res);
});

/**
 * @swagger
 * /api/enrollments/stats:
 *   get:
 *     summary: Obter estatísticas das inscrições
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas das inscrições
 */
router.get('/stats', authenticateToken, (req, res) => {
  enrollmentController.getEnrollmentStats(req, res);
});

/**
 * @swagger
 * /api/enrollments/search:
 *   get:
 *     summary: Buscar inscrições por termo
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Resultados da busca
 */
router.get('/search', authenticateToken, searchEnrollmentsValidation, (req, res) => {
  enrollmentController.searchEnrollments(req, res);
});

/**
 * @swagger
 * /api/enrollments/prerequisites:
 *   get:
 *     summary: Verificar pré-requisitos para inscrição
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estudanteId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do estudante
 *       - in: query
 *         name: disciplinaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Verificação de pré-requisitos
 */
router.get('/prerequisites', authenticateToken, checkPrerequisitesValidation, (req, res) => {
  enrollmentController.checkPrerequisites(req, res);
});

/**
 * @swagger
 * /api/enrollments/capacity/{turmaId}:
 *   get:
 *     summary: Verificar capacidade da turma
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turmaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Informações de capacidade da turma
 */
router.get('/capacity/:turmaId', authenticateToken, checkClassCapacityValidation, (req, res) => {
  enrollmentController.checkClassCapacity(req, res);
});

/**
 * @swagger
 * /api/enrollments/student/{estudanteId}:
 *   get:
 *     summary: Obter inscrições de um estudante
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estudanteId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do estudante
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: Filtrar por período
 *     responses:
 *       200:
 *         description: Inscrições do estudante
 */
router.get('/student/:estudanteId', authenticateToken, getEnrollmentsByStudentValidation, (req, res) => {
  enrollmentController.getEnrollmentsByStudent(req, res);
});

/**
 * @swagger
 * /api/enrollments/subject/{disciplinaId}:
 *   get:
 *     summary: Obter inscrições de uma disciplina
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disciplinaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da disciplina
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: Filtrar por período
 *     responses:
 *       200:
 *         description: Inscrições da disciplina
 */
router.get('/subject/:disciplinaId', authenticateToken, getEnrollmentsBySubjectValidation, (req, res) => {
  enrollmentController.getEnrollmentsBySubject(req, res);
});

/**
 * @swagger
 * /api/enrollments/{id}:
 *   get:
 *     summary: Obter inscrição por ID
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da inscrição
 *     responses:
 *       200:
 *         description: Dados da inscrição
 *       404:
 *         description: Inscrição não encontrada
 */
router.get('/:id', authenticateToken, getEnrollmentValidation, (req, res) => {
  enrollmentController.getEnrollmentById(req, res);
});

/**
 * @swagger
 * /api/enrollments/{id}:
 *   put:
 *     summary: Atualizar inscrição
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da inscrição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEnrollment'
 *     responses:
 *       200:
 *         description: Inscrição atualizada com sucesso
 *       404:
 *         description: Inscrição não encontrada
 */
router.put('/:id', authenticateToken, updateEnrollmentValidation, (req, res) => {
  enrollmentController.updateEnrollment(req, res);
});

/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Excluir inscrição
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da inscrição
 *     responses:
 *       200:
 *         description: Inscrição excluída com sucesso
 *       400:
 *         description: Não é possível excluir inscrição com notas
 *       404:
 *         description: Inscrição não encontrada
 */
router.delete('/:id', authenticateToken, deleteEnrollmentValidation, (req, res) => {
  enrollmentController.deleteEnrollment(req, res);
});

/**
 * @swagger
 * /api/enrollments/{id}/status:
 *   patch:
 *     summary: Atualizar status da inscrição
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da inscrição
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
 *                 enum: [PENDENTE, APROVADA, REJEITADA, CANCELADA]
 *               motivo:
 *                 type: string
 *                 maxLength: 200
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.patch('/:id/status', authenticateToken, updateEnrollmentStatusValidation, (req, res) => {
  enrollmentController.updateEnrollmentStatus(req, res);
});

/**
 * @swagger
 * /api/enrollments/bulk:
 *   post:
 *     summary: Criar inscrições em lote
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkEnrollment'
 *     responses:
 *       201:
 *         description: Inscrições criadas em lote
 *       400:
 *         description: Dados inválidos ou conflitos
 */
router.post('/bulk', authenticateToken, createBulkEnrollmentValidation, (req, res) => {
  enrollmentController.createBulkEnrollments(req, res);
});

/**
 * @swagger
 * /api/enrollments/approve-pending:
 *   post:
 *     summary: Aprovar todas as inscrições pendentes de uma disciplina/período
 *     tags: [Inscrições]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - disciplinaId
 *               - periodo
 *             properties:
 *               disciplinaId:
 *                 type: string
 *                 format: uuid
 *               periodo:
 *                 type: string
 *                 pattern: '^\d{4}\.[12]$'
 *     responses:
 *       200:
 *         description: Inscrições aprovadas em lote
 */
router.post('/approve-pending', authenticateToken, approvePendingEnrollmentsValidation, (req, res) => {
  enrollmentController.approvePendingEnrollments(req, res);
});

export default router; 