import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ScheduleController } from './ScheduleController';
import { authenticateToken } from '../../middlewares/auth';
import {
  createScheduleValidation,
  updateScheduleValidation,
  bulkScheduleValidation,
  scheduleFiltersValidation,
  createClassroomValidation,
  updateClassroomValidation,
  classroomFiltersValidation,
  createCalendarValidation,
  updateCalendarValidation,
  calendarFiltersValidation,
  conflictFiltersValidation,
  uuidParamValidation,
  professorIdParamValidation,
  salaIdParamValidation,
  availabilityValidation,
  weeklyScheduleValidation
} from '../../middlewares/validations/scheduleValidation';

const router = Router();
const prisma = new PrismaClient();
const scheduleController = new ScheduleController(prisma);

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);

// ==================== SCHEDULE ROUTES ====================

// Criar novo horário
router.post('/', createScheduleValidation, scheduleController.createSchedule.bind(scheduleController));

// Listar horários com filtros
router.get('/', scheduleFiltersValidation, scheduleController.getSchedules.bind(scheduleController));

// Criar horários em lote
router.post('/bulk', bulkScheduleValidation, scheduleController.createBulkSchedules.bind(scheduleController));

// Pesquisar horários
router.get('/search', scheduleController.searchSchedules.bind(scheduleController));

// Grade semanal
router.get('/weekly', weeklyScheduleValidation, scheduleController.getWeeklySchedule.bind(scheduleController));

// Estatísticas dos horários
router.get('/stats', scheduleController.getScheduleStats.bind(scheduleController));

// Dashboard dos horários
router.get('/dashboard', scheduleController.getScheduleDashboard.bind(scheduleController));

// Detectar conflitos
router.get('/conflicts/detect', scheduleController.detectConflicts.bind(scheduleController));

// Agenda do professor
router.get('/professor/:professorId', professorIdParamValidation, scheduleController.getProfessorSchedule.bind(scheduleController));

// Buscar horário por ID
router.get('/:id', uuidParamValidation, scheduleController.getScheduleById.bind(scheduleController));

// Atualizar horário
router.put('/:id', uuidParamValidation, updateScheduleValidation, scheduleController.updateSchedule.bind(scheduleController));

// Excluir horário
router.delete('/:id', uuidParamValidation, scheduleController.deleteSchedule.bind(scheduleController));

// ==================== CLASSROOM ROUTES ====================

// Criar nova sala
router.post('/classrooms', createClassroomValidation, scheduleController.createClassroom.bind(scheduleController));

// Listar salas
router.get('/classrooms', classroomFiltersValidation, scheduleController.getClassrooms.bind(scheduleController));

// Agenda da sala
router.get('/classrooms/:salaId/schedule', salaIdParamValidation, scheduleController.getClassroomSchedule.bind(scheduleController));

// Disponibilidade da sala
router.get('/classrooms/:salaId/availability', salaIdParamValidation, availabilityValidation, scheduleController.getClassroomAvailability.bind(scheduleController));

// Buscar sala por ID
router.get('/classrooms/:id', uuidParamValidation, scheduleController.getClassroomById.bind(scheduleController));

// Atualizar sala
router.put('/classrooms/:id', uuidParamValidation, updateClassroomValidation, scheduleController.updateClassroom.bind(scheduleController));

// Excluir sala
router.delete('/classrooms/:id', uuidParamValidation, scheduleController.deleteClassroom.bind(scheduleController));

// ==================== CALENDAR ROUTES ====================

// Criar evento do calendário
router.post('/calendar', createCalendarValidation, scheduleController.createCalendarEvent.bind(scheduleController));

// Listar eventos do calendário
router.get('/calendar', calendarFiltersValidation, scheduleController.getCalendarEvents.bind(scheduleController));

// Atualizar evento do calendário
router.put('/calendar/:id', uuidParamValidation, updateCalendarValidation, scheduleController.updateCalendarEvent.bind(scheduleController));

// ==================== CONFLICT ROUTES ====================

// Listar conflitos
router.get('/conflicts', conflictFiltersValidation, scheduleController.getConflicts.bind(scheduleController));

// Resolver conflito
router.patch('/conflicts/:id/resolve', uuidParamValidation, scheduleController.resolveConflict.bind(scheduleController));

export default router; 