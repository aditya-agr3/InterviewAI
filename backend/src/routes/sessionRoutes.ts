import express from 'express';
import {
  createSession,
  getSessions,
  getSession,
  generateQuestionExplanation,
  togglePinQuestion,
  updateQuestionNotes,
  getPinnedQuestions,
} from '../controllers/sessionController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', createSession);
router.get('/', getSessions);
router.get('/pinned', getPinnedQuestions);
router.get('/:sessionId', getSession);
router.post('/:sessionId/questions/:questionId/explain', generateQuestionExplanation);
router.patch('/:sessionId/questions/:questionId/pin', togglePinQuestion);
router.patch('/:sessionId/questions/:questionId/notes', updateQuestionNotes);

export default router;
