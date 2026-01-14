import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { uploadPDF } from '../utils/uploadPDF';
import * as documentController from '../controllers/documentController';
import * as chatController from '../controllers/chatController';
import * as summaryController from '../controllers/summaryController';
import * as explainerController from '../controllers/explainerController';
import * as flashcardController from '../controllers/flashcardController';
import * as quizController from '../controllers/quizController';
import * as progressController from '../controllers/progressController';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Document routes
router.post('/documents', uploadPDF.single('pdf'), documentController.uploadDocument);
router.get('/documents', documentController.getDocuments);
router.get('/documents/:documentId', documentController.getDocument);
router.get('/documents/:documentId/file', documentController.getDocumentFile);
router.delete('/documents/:documentId', documentController.deleteDocument);

// Chat routes
router.post('/documents/:documentId/chat', chatController.sendChatMessage);
router.get('/documents/:documentId/chat', chatController.getChatHistory);

// Summary route
router.post('/documents/:documentId/summary', summaryController.generateSummary);

// Explainer route
router.post('/documents/:documentId/explain', explainerController.explainConcept);

// Flashcard routes
router.post('/documents/:documentId/flashcards/generate', flashcardController.generateFlashcards);
router.get('/flashcards', flashcardController.getFlashcards);
router.patch('/flashcards/:flashcardId/favorite', flashcardController.toggleFavorite);
router.delete('/flashcards/:flashcardId', flashcardController.deleteFlashcard);

// Quiz routes
router.post('/documents/:documentId/quizzes/generate', quizController.generateQuiz);
router.get('/quizzes', quizController.getQuizzes);
router.get('/quizzes/:quizId', quizController.getQuiz);
router.post('/quizzes/:quizId/submit', quizController.submitQuiz);
router.delete('/quizzes/:quizId', quizController.deleteQuiz);

// Progress route
router.get('/progress', progressController.getProgress);

export default router;
