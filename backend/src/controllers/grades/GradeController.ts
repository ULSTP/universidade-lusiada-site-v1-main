import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GradeService } from '../../services/GradeService';
import { validationResult } from 'express-validator';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';

export class GradeController {
  private gradeService: GradeService;

  constructor(prisma: PrismaClient) {
    this.gradeService = new GradeService(prisma);
  }

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
   *               - observacoes
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
   *               tipoAvaliacao:
   *                 type: string
   *                 enum: [PROVA, TRABALHO, PARTICIPACAO, PROJETO, SEMINARIO, EXAME]
   *               nota:
   *                 type: number
   *                 minimum: 0
   *                 maximum: 20
   *                 description: Nota (0-20)
   *               peso:
   *                 type: number
   *                 minimum: 0.01
   *                 maximum: 1.0
   *                 description: Peso da avaliação
   *               dataAvaliacao:
   *                 type: string
   *                 format: date
   *               periodo:
   *                 type: string
   *                 description: Período letivo
   *               observacoes:
   *                 type: string
   *                 description: Observações opcionais
   *     responses:
   *       201:
   *         description: Nota criada com sucesso
   *       400:
   *         description: Dados inválidos
   *       404:
   *         description: Estudante ou disciplina não encontrados
   *       401:
   *         description: Não autorizado
   */
  async createGrade(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const grade = await this.gradeService.createGrade(req.body);

      res.status(201).json({
        success: true,
        message: 'Nota criada com sucesso',
        data: grade
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro inesperado ao criar nota', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  /**
   * @swagger
   * /grades:
   *   get:
   *     summary: Listar notas com filtros
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
   *         description: Pular registros
   *       - in: query
   *         name: take
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Número de registros
   *     responses:
   *       200:
   *         description: Lista de notas
   *       401:
   *         description: Não autorizado
   */
  async getGrades(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        estudanteId: req.query.estudanteId as string,
        disciplinaId: req.query.disciplinaId as string,
        periodo: req.query.periodo as string,
        tipoAvaliacao: req.query.tipoAvaliacao as any,
        status: req.query.status as any,
        search: req.query.search as string,
        skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
        take: req.query.take ? parseInt(req.query.take as string) : undefined,
      };

      const result = await this.gradeService.getGrades(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Erro ao buscar notas', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

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
   *       404:
   *         description: Nota não encontrada
   *       401:
   *         description: Não autorizado
   */
  async getGradeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const grade = await this.gradeService.getGradeById(id);

      res.json({
        success: true,
        data: grade
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar nota', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  /**
   * @swagger
   * /grades/{id}:
   *   put:
   *     summary: Atualizar nota
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
   *               nota:
   *                 type: number
   *                 minimum: 0
   *                 maximum: 20
   *               peso:
   *                 type: number
   *                 minimum: 0.01
   *                 maximum: 1.0
   *               dataAvaliacao:
   *                 type: string
   *                 format: date
   *               observacoes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Nota atualizada com sucesso
   *       400:
   *         description: Dados inválidos
   *       404:
   *         description: Nota não encontrada
   *       401:
   *         description: Não autorizado
   */
  async updateGrade(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const grade = await this.gradeService.updateGrade(id, req.body);

      res.json({
        success: true,
        message: 'Nota atualizada com sucesso',
        data: grade
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao atualizar nota', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

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
   *       404:
   *         description: Nota não encontrada
   *       401:
   *         description: Não autorizado
   */
  async deleteGrade(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.gradeService.deleteGrade(id);

      res.json({
        success: true,
        message: 'Nota excluída com sucesso'
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao excluir nota', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  /**
   * @swagger
   * /grades/bulk:
   *   post:
   *     summary: Criar notas em lote
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
   *               nome:
   *                 type: string
   *               tipoAvaliacao:
   *                 type: string
   *                 enum: [PROVA, TRABALHO, PARTICIPACAO, PROJETO, SEMINARIO, EXAME]
   *               peso:
   *                 type: number
   *                 minimum: 0.01
   *                 maximum: 1.0
   *               dataAvaliacao:
   *                 type: string
   *                 format: date
   *               periodo:
   *                 type: string
   *               observacoes:
   *                 type: string
   *               notas:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - estudanteId
   *                     - nota
   *                   properties:
   *                     estudanteId:
   *                       type: string
   *                     nota:
   *                       type: number
   *                       minimum: 0
   *                       maximum: 20
   *     responses:
   *       201:
   *         description: Notas criadas com sucesso
   *       400:
   *         description: Dados inválidos
   *       404:
   *         description: Disciplina não encontrada
   *       401:
   *         description: Não autorizado
   */
  async createBulkGrades(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
        return;
      }

      const result = await this.gradeService.createBulkGrades(req.body);

      res.status(201).json({
        success: true,
        message: `${result.success} notas criadas com sucesso`,
        data: result
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao criar notas em lote', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  /**
   * @swagger
   * /grades/stats:
   *   get:
   *     summary: Obter estatísticas das notas
   *     tags: [Grades]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Estatísticas das notas
   *       401:
   *         description: Não autorizado
   */
  async getGradeStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.gradeService.getGradeStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Erro ao buscar estatísticas', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * @swagger
   * /grades/student/{estudanteId}/subject/{disciplinaId}:
   *   get:
   *     summary: Obter notas de um estudante em uma disciplina
   *     tags: [Grades]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: estudanteId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: disciplinaId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: periodo
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Notas do estudante
   *       404:
   *         description: Estudante ou disciplina não encontrados
   *       401:
   *         description: Não autorizado
   */
  async getStudentGrades(req: Request, res: Response): Promise<void> {
    try {
      const { estudanteId, disciplinaId } = req.params;
      const { periodo } = req.query;

      if (!periodo) {
        res.status(400).json({
          success: false,
          message: 'Período é obrigatório'
        });
        return;
      }

      const grades = await this.gradeService.getStudentGrades(
        estudanteId,
        disciplinaId,
        periodo as string
      );

      res.json({
        success: true,
        data: grades
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar notas do estudante', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  /**
   * @swagger
   * /grades/subject/{disciplinaId}/report:
   *   get:
   *     summary: Relatório de notas da disciplina
   *     tags: [Grades]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: disciplinaId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: periodo
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Relatório da disciplina
   *       404:
   *         description: Disciplina não encontrada
   *       401:
   *         description: Não autorizado
   */
  async getSubjectGradesReport(req: Request, res: Response): Promise<void> {
    try {
      const { disciplinaId } = req.params;
      const { periodo } = req.query;

      if (!periodo) {
        res.status(400).json({
          success: false,
          message: 'Período é obrigatório'
        });
        return;
      }

      const report = await this.gradeService.getSubjectGradesReport(
        disciplinaId,
        periodo as string
      );

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar relatório da disciplina', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  /**
   * @swagger
   * /grades/transcript/{estudanteId}:
   *   get:
   *     summary: Histórico acadêmico do estudante
   *     tags: [Grades]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: estudanteId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Histórico acadêmico
   *       404:
   *         description: Estudante não encontrado
   *       401:
   *         description: Não autorizado
   */
  async getStudentTranscript(req: Request, res: Response): Promise<void> {
    try {
      const { estudanteId } = req.params;
      const transcript = await this.gradeService.getStudentTranscript(estudanteId);

      res.json({
        success: true,
        data: transcript
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar histórico acadêmico', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  /**
   * @swagger
   * /grades/teacher/{professorId}/dashboard:
   *   get:
   *     summary: Dashboard do professor
   *     tags: [Grades]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: professorId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: periodo
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Dashboard do professor
   *       404:
   *         description: Professor não encontrado
   *       401:
   *         description: Não autorizado
   */
  async getTeacherDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { professorId } = req.params;
      const { periodo } = req.query;

      if (!periodo) {
        res.status(400).json({
          success: false,
          message: 'Período é obrigatório'
        });
        return;
      }

      const dashboard = await this.gradeService.getTeacherDashboard(
        professorId,
        periodo as string
      );

      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao buscar dashboard do professor', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

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
   *     responses:
   *       200:
   *         description: Status atualizado com sucesso
   *       400:
   *         description: Status inválido
   *       404:
   *         description: Nota não encontrada
   *       401:
   *         description: Não autorizado
   */
  async updateGradeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['ATIVO', 'CANCELADO', 'REVISAO'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
        return;
      }

      const grade = await this.gradeService.updateGradeStatus(id, status);

      res.json({
        success: true,
        message: 'Status atualizado com sucesso',
        data: grade
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        logger.error('Erro ao atualizar status da nota', { error });
        res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    }
  }

  /**
   * @swagger
   * /grades/search:
   *   get:
   *     summary: Pesquisar notas
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
   *     responses:
   *       200:
   *         description: Resultados da pesquisa
   *       400:
   *         description: Termo de busca é obrigatório
   *       401:
   *         description: Não autorizado
   */
  async searchGrades(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Termo de busca é obrigatório'
        });
        return;
      }

      const grades = await this.gradeService.searchGrades(q as string);

      res.json({
        success: true,
        data: grades
      });
    } catch (error) {
      logger.error('Erro ao pesquisar notas', { error });
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
} 