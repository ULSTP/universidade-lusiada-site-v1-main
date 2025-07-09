import { Router } from 'express';
import { authenticateToken } from '@middlewares/auth';

const router = Router();

// TODO: Implementar FinancialController
// Placeholder endpoints para sistema financeiro
router.get('/', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint financeiro - Em desenvolvimento',
    data: []
  });
});

export default router; 