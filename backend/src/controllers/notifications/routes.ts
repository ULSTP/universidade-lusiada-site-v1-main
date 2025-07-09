import { Router } from 'express';
import { authenticateToken } from '@middlewares/auth';

const router = Router();

// TODO: Implementar NotificationController
// Placeholder endpoints para notificações
router.get('/', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint de notificações - Em desenvolvimento',
    data: []
  });
});

export default router; 