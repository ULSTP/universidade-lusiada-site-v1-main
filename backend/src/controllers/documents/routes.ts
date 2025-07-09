import { Router } from 'express';
import { authenticateToken } from '@middlewares/auth';

const router = Router();

// TODO: Implementar DocumentController
// Placeholder endpoints para documentos
router.get('/', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint de documentos - Em desenvolvimento',
    data: []
  });
});

export default router; 