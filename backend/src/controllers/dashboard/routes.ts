import { Router } from 'express';
import { authenticateToken } from '@middlewares/auth';

const router = Router();

// TODO: Implementar DashboardController
// Placeholder endpoints para dashboard
router.get('/stats', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Estatísticas do dashboard - Em desenvolvimento',
    data: {
      users: 0,
      courses: 0,
      enrollments: 0,
      activeStudents: 0
    }
  });
});

export default router; 