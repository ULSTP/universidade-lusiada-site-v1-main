import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { GradeController } from './GradeController';
import { authenticateToken } from '../../middlewares/auth';
import { 
  createGradeValidation,
  updateGradeValidation,
  createBulkGradesValidation,
  gradeFiltersValidation,
  updateGradeStatusValidation
} from '../../middlewares/validations/gradeValidation';

const router = Router();
const prisma = new PrismaClient();
const gradeController = new GradeController(prisma);

/**
 * @swagger
 * components:
 *   schemas:
 *     Grade:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da nota
 *         estudanteId:
 *           type: string
 *           description: ID do estudante
 *         disciplinaId:
 *           type: string
 *           description: ID da disciplina
 *         nome:
 *           type: string
 *           description: Nome da avaliação
 *         tipoAvaliacao:
 *           type: string
 *           enum: [PROVA, TRABALHO, PARTICIPACAO, PROJETO, SEMINARIO, EXAME]
 *           description: Tipo de avaliação
 *         nota:
 *           type: number
 *           minimum: 0
 *           maximum: 20
 *           description: Nota obtida (0-20)
 *         peso:
 *           type: number
 *           minimum: 0.01
 *           maximum: 1.0
 *           description: Peso da avaliação
 *         dataAvaliacao:
 *           type: string
 *           format: date
 *           description: Data da avaliação
 *         periodo:
 *           type: string
 *           description: Período letivo
 *         observacoes:
 *           type: string
 *           description: Observações sobre a avaliação
 *         status:
 *           type: string
 *           enum: [ATIVO, CANCELADO, REVISAO]
 *           description: Status da nota
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 *         estudante:
 *           $ref: '#/components/schemas/User'
 *         disciplina:
 *           $ref: '#/components/schemas/Subject'
 *     
 *     StudentGradesSummary:
 *       type: object
 *       properties:
 *         estudante:
 *           $ref: '#/components/schemas/User'
 *         disciplina:
 *           $ref: '#/components/schemas/Subject'
 *         periodo:
 *           type: string
 *         notas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Grade'
 *         notaFinal:
 *           type: number
 *           description: Nota final calculada
 *         statusAcademico:
 *           type: string
 *           enum: [APROVADO, REPROVADO, EM_ANDAMENTO]
 *         totalPeso:
 *           type: number
 *           description: Soma total dos pesos
 *         mediaSimples:
 *           type: number
 *           description: Média aritmética simples
 *         totalAvaliacoes:
 *           type: integer
 *           description: Número total de avaliações
 *   
 *     SubjectGradesReport:
 *       type: object
 *       properties:
 *         disciplina:
 *           $ref: '#/components/schemas/Subject'
 *         periodo:
 *           type: string
 *         totalEstudantes:
 *           type: integer
 *         aprovados:
 *           type: integer
 *         reprovados:
 *           type: integer
 *         emAndamento:
 *           type: integer
 *         mediaGeral:
 *           type: number
 *         distribuicaoNotas:
 *           type: object
 *         estudantesNotas:
 *           type: array
 *   
 *     StudentTranscript:
 *       type: object
 *       properties:
 *         estudante:
 *           $ref: '#/components/schemas/User'
 *         disciplinas:
 *           type: array
 *         mediaGeralCurso:
 *           type: number
 *         creditosCompletos:
 *           type: integer
 *         totalCreditos:
 *           type: integer
 *         statusGeral:
 *           type: string
 *           enum: [ATIVO, FORMADO, JUBILADO, TRANCADO]
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * tags:
 *   - name: Grades
 *     description: Operações relacionadas às notas e avaliações
 */

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);

/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Criar nova nota
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudanteId
 *               - disciplinaId
 *               - nome
 *               - tipoAvaliacao
 *               - nota
 *               - peso
 *               - dataAvaliacao
 *               - periodo
 *             properties:
 *               estudanteId:
 *                 type: string
 *                 description: ID do estudante
 *               disciplinaId:
 *                 type: string
 *                 description: ID da disciplina
 *               nome:
 *                 type: string
 *                 description: Nome da avaliação
 *                 example: "Prova 1"
 *               tipoAvaliacao:
 *                 type: string
 *                 enum: [PROVA, TRABALHO, PARTICIPACAO, PROJETO, SEMINARIO, EXAME]
 *                 description: Tipo de avaliação
 *               nota:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 20
 *                 description: Nota obtida (0-20)
 *                 example: 15.5
 *               peso:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 1.0
 *                 description: Peso da avaliação
 *                 example: 0.6
 *               dataAvaliacao:
 *                 type: string
 *                 format: date
 *                 description: Data da avaliação
 *                 example: "2024-01-15"
 *               periodo:
 *                 type: string
 *                 description: Período letivo
 *                 example: "2024.1"
 *               observacoes:
 *                 type: string
 *                 description: Observações opcionais
 *                 example: "Avaliação com consulta"
 *     responses:
 *       201:
 *         description: Nota criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Nota criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Estudante ou disciplina não encontrados
 *       401:
 *         description: Não autorizado
 */
router.post('/', createGradeValidation, gradeController.createGrade.bind(gradeController));

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Listar notas com filtros e paginação
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estudanteId
 *         schema:
 *           type: string
 *         description: Filtrar por estudante
 *       - in: query
 *         name: disciplinaId
 *         schema:
 *           type: string
 *         description: Filtrar por disciplina
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: Filtrar por período
 *         example: "2024.1"
 *       - in: query
 *         name: tipoAvaliacao
 *         schema:
 *           type: string
 *           enum: [PROVA, TRABALHO, PARTICIPACAO, PROJETO, SEMINARIO, EXAME]
 *         description: Filtrar por tipo de avaliação
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ATIVO, CANCELADO, REVISAO]
 *         description: Filtrar por status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome da avaliação
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de registros a pular (paginação)
 *         example: 0
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número de registros por página
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista de notas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     grades:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Grade'
 *                     total:
 *                       type: integer
 *                       description: Total de registros
 *                     pagina:
 *                       type: integer
 *                       description: Página atual
 *                     totalPaginas:
 *                       type: integer
 *                       description: Total de páginas
 *       401:
 *         description: Não autorizado
 */
router.get('/', gradeFiltersValidation, gradeController.getGrades.bind(gradeController));

/**
 * @swagger
 * /grades/bulk:
 *   post:
 *     summary: Criar notas em lote para uma turma
 *     tags: [Grades]
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
 *               - nome
 *               - tipoAvaliacao
 *               - peso
 *               - dataAvaliacao
 *               - periodo
 *               - notas
 *             properties:
 *               disciplinaId:
 *                 type: string
 *                 description: ID da disciplina
 *               nome:
 *                 type: string
 *                 description: Nome da avaliação
 *                 example: "Prova Final"
 *               tipoAvaliacao:
 *                 type: string
 *                 enum: [PROVA, TRABALHO, PARTICIPACAO, PROJETO, SEMINARIO, EXAME]
 *                 description: Tipo de avaliação
 *               peso:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 1.0
 *                 description: Peso da avaliação (mesmo para todos)
 *                 example: 0.4
 *               dataAvaliacao:
 *                 type: string
 *                 format: date
 *                 description: Data da avaliação
 *                 example: "2024-01-20"
 *               periodo:
 *                 type: string
 *                 description: Período letivo
 *                 example: "2024.1"
 *               observacoes:
 *                 type: string
 *                 description: Observações opcionais
 *               notas:
 *                 type: array
 *                 description: Lista de notas por estudante
 *                 items:
 *                   type: object
 *                   required:
 *                     - estudanteId
 *                     - nota
 *                   properties:
 *                     estudanteId:
 *                       type: string
 *                       description: ID do estudante
 *                     nota:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 20
 *                       description: Nota do estudante
 *                       example: 18.5
 *     responses:
 *       201:
 *         description: Notas criadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "25 notas criadas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: integer
 *                       description: Número de notas criadas
 *                     errors:
 *                       type: array
 *                       description: Lista de erros (se houver)
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado
 */
router.post('/bulk', createBulkGradesValidation, gradeController.createBulkGrades.bind(gradeController));

/**
 * @swagger
 * /grades/stats:
 *   get:
 *     summary: Obter estatísticas gerais das notas
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas das notas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalNotas:
 *                       type: integer
 *                       description: Total de notas no sistema
 *                     mediaGeral:
 *                       type: number
 *                       description: Média geral de todas as notas
 *                     distribuicaoPorTipo:
 *                       type: object
 *                       description: Distribuição por tipo de avaliação
 *                     distribuicaoPorStatus:
 *                       type: object
 *                       description: Distribuição por status
 *                     notasRecentes:
 *                       type: array
 *                       description: Últimas notas lançadas
 *       401:
 *         description: Não autorizado
 */
router.get('/stats', gradeController.getGradeStats.bind(gradeController));

/**
 * @swagger
 * /grades/search:
 *   get:
 *     summary: Pesquisar notas por termo
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo de busca
 *         example: "Prova"
 *     responses:
 *       200:
 *         description: Resultados da pesquisa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Termo de busca é obrigatório
 *       401:
 *         description: Não autorizado
 */
router.get('/search', gradeController.searchGrades.bind(gradeController));

/**
 * @swagger
 * /grades/student/{estudanteId}/subject/{disciplinaId}:
 *   get:
 *     summary: Obter resumo das notas de um estudante em uma disciplina
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estudanteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do estudante
 *       - in: path
 *         name: disciplinaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *       - in: query
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *         description: Período letivo
 *         example: "2024.1"
 *     responses:
 *       200:
 *         description: Resumo das notas do estudante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/StudentGradesSummary'
 *       400:
 *         description: Período é obrigatório
 *       404:
 *         description: Estudante ou disciplina não encontrados
 *       401:
 *         description: Não autorizado
 */
router.get('/student/:estudanteId/subject/:disciplinaId', gradeController.getStudentGrades.bind(gradeController));

/**
 * @swagger
 * /grades/subject/{disciplinaId}/report:
 *   get:
 *     summary: Relatório detalhado das notas de uma disciplina
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disciplinaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *       - in: query
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *         description: Período letivo
 *         example: "2024.1"
 *     responses:
 *       200:
 *         description: Relatório da disciplina
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SubjectGradesReport'
 *       400:
 *         description: Período é obrigatório
 *       404:
 *         description: Disciplina não encontrada
 *       401:
 *         description: Não autorizado
 */
router.get('/subject/:disciplinaId/report', gradeController.getSubjectGradesReport.bind(gradeController));

/**
 * @swagger
 * /grades/transcript/{estudanteId}:
 *   get:
 *     summary: Histórico acadêmico completo do estudante
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estudanteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Histórico acadêmico completo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/StudentTranscript'
 *       404:
 *         description: Estudante não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/transcript/:estudanteId', gradeController.getStudentTranscript.bind(gradeController));

/**
 * @swagger
 * /grades/teacher/{professorId}/dashboard:
 *   get:
 *     summary: Dashboard do professor com estatísticas das suas disciplinas
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *       - in: query
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *         description: Período letivo
 *         example: "2024.1"
 *     responses:
 *       200:
 *         description: Dashboard do professor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     professor:
 *                       $ref: '#/components/schemas/User'
 *                     periodo:
 *                       type: string
 *                     totalDisciplinas:
 *                       type: integer
 *                     totalEstudantes:
 *                       type: integer
 *                     totalNotas:
 *                       type: integer
 *                     disciplinas:
 *                       type: array
 *                       description: Lista das disciplinas do professor
 *       400:
 *         description: Período é obrigatório
 *       404:
 *         description: Professor não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/teacher/:professorId/dashboard', gradeController.getTeacherDashboard.bind(gradeController));

/**
 * @swagger
 * /grades/{id}:
 *   get:
 *     summary: Buscar nota por ID
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da nota
 *     responses:
 *       200:
 *         description: Nota encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Grade'
 *       404:
 *         description: Nota não encontrada
 *       401:
 *         description: Não autorizado
 */
router.get('/:id', gradeController.getGradeById.bind(gradeController));

/**
 * @swagger
 * /grades/{id}:
 *   put:
 *     summary: Atualizar nota existente
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da nota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da avaliação
 *               nota:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 20
 *                 description: Nova nota
 *               peso:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 1.0
 *                 description: Novo peso
 *               dataAvaliacao:
 *                 type: string
 *                 format: date
 *                 description: Data da avaliação
 *               observacoes:
 *                 type: string
 *                 description: Observações
 *     responses:
 *       200:
 *         description: Nota atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Nota atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Nota não encontrada
 *       401:
 *         description: Não autorizado
 */
router.put('/:id', updateGradeValidation, gradeController.updateGrade.bind(gradeController));

/**
 * @swagger
 * /grades/{id}/status:
 *   patch:
 *     summary: Atualizar status da nota
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da nota
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
 *                 enum: [ATIVO, CANCELADO, REVISAO]
 *                 description: Novo status da nota
 *                 example: "REVISAO"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Status atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Nota não encontrada
 *       401:
 *         description: Não autorizado
 */
router.patch('/:id/status', updateGradeStatusValidation, gradeController.updateGradeStatus.bind(gradeController));

/**
 * @swagger
 * /grades/{id}:
 *   delete:
 *     summary: Excluir nota
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da nota
 *     responses:
 *       200:
 *         description: Nota excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Nota excluída com sucesso"
 *       404:
 *         description: Nota não encontrada
 *       401:
 *         description: Não autorizado
 */
router.delete('/:id', gradeController.deleteGrade.bind(gradeController));

export default router; 