import { Router } from 'express'
import { authenticateToken } from '@middlewares/auth'
import { MessageController } from './MessageController'

const router = Router()
const controller = new MessageController()

router.get('/:userId', authenticateToken, controller.list.bind(controller))
router.post('/', authenticateToken, controller.send.bind(controller))

export default router
