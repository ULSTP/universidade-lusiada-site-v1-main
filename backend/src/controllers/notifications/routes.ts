import { Router } from 'express';
import { authenticateToken } from '@middlewares/auth';
import { NotificationController } from './NotificationController';

const router = Router();
const controller = new NotificationController();

router.get('/', authenticateToken, controller.list.bind(controller));
router.post('/', authenticateToken, controller.create.bind(controller));
router.post('/:id/read', authenticateToken, controller.markRead.bind(controller));
router.delete('/:id', authenticateToken, controller.remove.bind(controller));

export default router;