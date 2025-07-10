import { Router } from 'express';
import { authenticateToken } from '@middlewares/auth';
import { DashboardController } from './DashboardController';

const router = Router();
const controller = new DashboardController();

router.get('/stats', authenticateToken, controller.stats.bind(controller));

export default router;