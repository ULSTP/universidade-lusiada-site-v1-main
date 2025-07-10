import { Router } from 'express';
import { SubjectController } from './SubjectController';
import { authenticateToken } from '../../middlewares/auth';
import {
  createSubjectValidation,
  updateSubjectValidation,
  getSubjectValidation,
  deleteSubjectValidation,
  updateSubjectStatusValidation,
  getSubjectsValidation,
  getSubjectsByCourseValidation,
  getSubjectsByProfessorValidation,
  searchSubjectsValidation,
} from '../../middlewares/validations/subjectValidation';

const router = Router();
const subjectController = new SubjectController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
 *       type: object
 *       required:
 *         - codigo
 *         - nome
 *         - cargaHoraria
 *         - creditos
 *         - semestre
 *         - tipo
 *         - departamentoId
 *         - cursoId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único da disciplina
 *         codigo:
 *           type: string
 *           description: Código da disciplina
 *           example: "MAT101"
 *         nome:
 *           type: string
 *           description: Nome da disciplina
 *           example: "Matemática I"
 *         descricao:
 *           type: string
 *           description: Descrição da disciplina
 *         cargaHoraria:
 *           type: integer
 *           description: Carga horária em horas
 *           example: 60
 *         creditos:
 *           type: integer
 *           description: Número de créditos
 *           example: 4
 *         semestre:
 *           type: integer
 *           description: Semestre em que é oferecida
 *           example: 1
 *         tipo:
 *           type: string
 *           enum: [OBRIGATORIA, OPTATIVA, ESTAGIO, TCC]
 *           description: Tipo da disciplina
 *         status:
 *           type: string
 *           enum: [ATIVA, INATIVA, SUSPENSA]
 *           description: Status da disciplina
 *         prerequisitos:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de pré-requisitos
 *         competencias:
 *           type: array
 *           items:
 *             type: string
 *           description: Competências desenvolvidas
 *         objetivos:
 *           type: string
 *           description: Objetivos da disciplina
 *         programa:
 *           type: string
 *           description: Programa da disciplina
 *         metodologia:
 *           type: string
 *           description: Metodologia de ensino
 *         avaliacao:
 *           type: string
 *           description: Sistema de avaliação
 *         bibliografia:
 *           type: array
 *           items:
 *             type: string
 *           description: Bibliografia
 *         departamentoId:
 *           type: string
 *           format: uuid
 *           description: ID do departamento
 *         cursoId:
 *           type: string
 *           format: uuid
 *           description: ID do curso
 *         professorId:
 *           type: string
 *           format: uuid
 *           description: ID do professor responsável
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/subjects:
 *   post:
 *     summary: Criar nova disciplina
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Sem permissão
 */
router.post(
  '/',
  authenticateToken,
  createSubjectValidation,
  subjectController.createSubject.bind(subjectController)
);

/**
 * @swagger
 * /api/v1/subjects:
 *   get:
 *     summary: Listar disciplinas
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca
 *       - in: query
 *         name: cursoId
 *         schema:
 *           type: string
 *         description: Filtrar por curso
 *       - in: query
 *         name: departamentoId
 *         schema:
 *           type: string
 *         description: Filtrar por departamento
 *       - in: query
 *         name: professorId
 *         schema:
 *           type: string
 *         description: Filtrar por professor
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: integer
 *         description: Filtrar por semestre
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [OBRIGATORIA, OPTATIVA, ESTAGIO, TCC]
 *         description: Filtrar por tipo
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ATIVA, INATIVA, SUSPENSA]
 *         description: Filtrar por status
 *       - in: query
 *         name: creditos
 *         schema:
 *           type: integer
 *         description: Filtrar por créditos
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *         description: Itens por página
 *       - in: query
 *         name: ordenacao
 *         schema:
 *           type: string
 *           enum: [nome, codigo, semestre, creditos, criadoEm]
 *         description: Campo para ordenação
 *       - in: query
 *         name: direcao
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Direção da ordenação
 *     responses:
 *       200:
 *         description: Lista de disciplinas
 *       401:
 *         description: Token inválido
 */
router.get(
  '/',
  authenticateToken,
  getSubjectsValidation,
  subjectController.getSubjects.bind(subjectController)
);

/**
 * @swagger
 * /api/v1/subjects/stats:
 *   get:
 *     summary: Obter estatísticas das disciplinas
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas das disciplinas
 *       401:
 *         description: Token inválido
 */
router.get(
  '/stats',
  authenticateToken,
  subjectController.getSubjectStats.bind(subjectController)
);

/**
 * @swagger
 * /api/v1/subjects/search:
 *   get:
 *     summary: Pesquisar disciplinas
 *     tags: [Subjects]
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
 *         description: Resultados da pesquisa
 *       400:
 *         description: Termo de busca inválido
 *       401:
 *         description: Token inválido
 */
router.get(
  '/search',
  authenticateToken,
  searchSubjectsValidation,
  subjectController.searchSubjects.bind(subjectController)
);

/**
 * @swagger
 * /api/v1/subjects/course/{cursoId}:
 *   get:
 *     summary: Obter disciplinas por curso
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Disciplinas do curso
 *       404:
 *         description: Curso não encontrado
 *       401:
 *         description: Token inválido
 */
router.get(
  '/course/:cursoId',
  authenticateToken,
  getSubjectsByCourseValidation,
  subjectController.getSubjectsByCourse.bind(subjectController)
);

/**
 * @swagger
 * /api/v1/subjects/professor/{professorId}:
 *   get:
 *     summary: Obter disciplinas por professor
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Disciplinas do professor
 *       404:
 *         description: Professor não encontrado
 *       401:
 *         description: Token inválido
 */
router.get(
  '/professor/:professorId',
  authenticateToken,
  getSubjectsByProfessorValidation,
  subjectController.getSubjectsByProfessor.bind(subjectController)
);

/**
 * @swagger
 * /api/v1/subjects/{id}:
 *   get:
 *     summary: Obter disciplina por ID
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Dados da disciplina
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Token inválido
 */
router.get(
  '/:id',
  authenticateToken,
  getSubjectValidation,
  subjectController.getSubjectById.bind(subjectController)
);

/**
 * @swagger
 * /api/v1/subjects/{id}:
 *   put:
 *     summary: Atualizar disciplina
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: Disciplina atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Sem permissão
 */
router.put(
  '/:id',
  authenticateToken,
  updateSubjectValidation,
  subjectController.updateSubject.bind(subjectController)
);

/**
 * @swagger
 * /api/v1/subjects/{id}/status:
 *   patch:
 *     summary: Atualizar status da disciplina
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ATIVA, INATIVA, SUSPENSA]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Sem permissão
 */
router.patch(
  '/:id/status',
  authenticateToken,
  updateSubjectStatusValidation,
  subjectController.updateSubjectStatus.bind(subjectController)
);

/**
 * @swagger
 * /api/v1/subjects/{id}:
 *   delete:
 *     summary: Excluir disciplina
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Disciplina excluída com sucesso
 *       400:
 *         description: Disciplina possui dependências
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Sem permissão
 */
router.delete(
  '/:id',
  authenticateToken,
  deleteSubjectValidation,
  subjectController.deleteSubject.bind(subjectController)
);

export default router;
