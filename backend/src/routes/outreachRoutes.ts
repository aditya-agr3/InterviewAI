import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { uploadPDF } from '../utils/uploadPDF';
import { generateOutreach } from '../controllers/outreachController';

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', uploadPDF.single('resume'), generateOutreach);

export default router;
