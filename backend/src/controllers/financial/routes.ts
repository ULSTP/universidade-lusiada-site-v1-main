import { Router } from 'express';
import { authenticateToken } from '@middlewares/auth';
import { FinancialController } from './FinancialController';

const router = Router();

const controller = new FinancialController();
router.get('/', authenticateToken, controller.summary.bind(controller));

export default router;