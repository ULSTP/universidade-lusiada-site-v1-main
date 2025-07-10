import { Router } from 'express'
import { authenticateToken } from '@middlewares/auth'
import { cache } from '@middlewares/cache'
import { ReportController } from './ReportController'

const router = Router()
const controller = new ReportController()

router.get('/financial', authenticateToken, cache('5 minutes'), controller.financial.bind(controller))
router.get('/external', authenticateToken, controller.externalExample.bind(controller))

export default router
