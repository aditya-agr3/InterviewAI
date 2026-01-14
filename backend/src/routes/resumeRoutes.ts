import express from 'express';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  uploadProfileImage,
} from '../controllers/resumeController';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../utils/upload';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getResumes);
router.get('/:resumeId', getResume);
router.post('/', createResume);
router.put('/:resumeId', updateResume);
router.delete('/:resumeId', deleteResume);
router.post('/:resumeId/upload-image', upload.single('image'), uploadProfileImage);

export default router;
