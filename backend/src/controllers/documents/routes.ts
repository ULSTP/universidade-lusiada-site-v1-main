import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '@middlewares/auth';
import { DocumentController } from './DocumentController';
import { config } from '@config/environment';

const router = Router();
const upload = multer({ dest: config.upload.directory });
const controller = new DocumentController();

router.get('/', authenticateToken, controller.list.bind(controller));
router.post('/', authenticateToken, upload.single('file'), controller.upload.bind(controller));
router.delete('/:id', authenticateToken, controller.remove.bind(controller));

export default router;