import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '@middlewares/auth';
import { DocumentController } from './DocumentController';

const router = Router();
const upload = multer({ dest: 'uploads' });
const controller = new DocumentController();

router.get('/', authenticateToken, controller.list.bind(controller));
router.post('/', authenticateToken, upload.single('file'), controller.upload.bind(controller));

export default router;