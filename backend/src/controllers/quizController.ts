import { Response } from 'express';
import Quiz from '../models/Quiz';
import Document from '../models/Document';
import { AuthRequest } from '../middlewares/auth';
import { generateQuizQuestions } from '../services/geminiService';
import { extractTextFromPDF } from '../utils/pdfExtractor';

// Generate quiz from a document
export const generateQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.params;
    const { questionCount = 5 } = req.body;

    if (!questionCount || questionCount < 1 || questionCount > 20) {
      res.status(400).json({ message: 'Question count must be between 1 and 20' });
      return;
    }

    // Verify document belongs to user
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // Extract text from PDF
    let documentContent: string;
    try {
      const pdfInfo = await extractTextFromPDF(document.filePath);
      documentContent = pdfInfo.text;

      if (!documentContent || documentContent.length < 100) {
        res.status(400).json({ message: 'Document does not contain enough text to generate a quiz' });
        return;
      }
    } catch (error: any) {
      console.error('Error extracting PDF text:', error);
      res.status(500).json({ message: 'Failed to extract text from PDF' });
      return;
    }

    // Generate quiz questions using AI
    let generatedQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
    try {
      generatedQuestions = await generateQuizQuestions(documentContent, questionCount);
    } catch (error: any) {
      console.error('Error generating quiz questions:', error);
      res.status(500).json({ message: error.message || 'Failed to generate quiz questions' });
      return;
    }

    // Create quiz
    const quiz = new Quiz({
      userId,
      documentId,
      title: `Quiz: ${document.originalName}`,
      questions: generatedQuestions,
      totalQuestions: generatedQuestions.length,
    });

    await quiz.save();

    res.json({
      quiz: {
        _id: quiz._id.toString(),
        documentId: quiz.documentId.toString(),
        title: quiz.title,
        questions: quiz.questions.map((q, idx) => ({
          _id: idx.toString(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
        totalQuestions: quiz.totalQuestions,
        createdAt: quiz.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ message: error.message || 'Failed to generate quiz' });
  }
};

// Get all quizzes
export const getQuizzes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.query;

    const query: any = { userId };
    if (documentId) {
      query.documentId = documentId;
    }

    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });

    res.json({
      quizzes: quizzes.map((quiz) => ({
        _id: quiz._id.toString(),
        documentId: quiz.documentId.toString(),
        title: quiz.title,
        totalQuestions: quiz.totalQuestions,
        score: quiz.score,
        createdAt: quiz.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch quizzes' });
  }
};

// Get a single quiz
export const getQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({ _id: quizId, userId });

    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    res.json({
      quiz: {
        _id: quiz._id.toString(),
        documentId: quiz.documentId.toString(),
        title: quiz.title,
        questions: quiz.questions.map((q, idx) => ({
          _id: idx.toString(),
          question: q.question,
          options: q.options,
          correctAnswer: quiz.score !== undefined ? q.correctAnswer : undefined, // Only show if completed
          explanation: q.explanation,
          userAnswer: quiz.userAnswers?.get(idx.toString()),
        })),
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        createdAt: quiz.createdAt.toISOString(),
        completedAt: quiz.completedAt?.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch quiz' });
  }
};

// Submit quiz answers
export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      res.status(400).json({ message: 'Answers are required' });
      return;
    }

    const quiz = await Quiz.findOne({ _id: quizId, userId });

    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    if (quiz.score !== undefined) {
      res.status(400).json({ message: 'Quiz has already been submitted' });
      return;
    }

    // Calculate score
    let correctCount = 0;
    const userAnswersMap = new Map<string, number>();

    quiz.questions.forEach((question, idx) => {
      const answerKey = idx.toString();
      const userAnswer = answers[answerKey] !== undefined ? Number(answers[answerKey]) : -1;
      userAnswersMap.set(answerKey, userAnswer);

      if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.totalQuestions) * 100);

    // Update quiz
    quiz.userAnswers = userAnswersMap;
    quiz.score = score;
    quiz.completedAt = new Date();
    await quiz.save();

    res.json({
      quiz: {
        _id: quiz._id.toString(),
        documentId: quiz.documentId.toString(),
        title: quiz.title,
        questions: quiz.questions.map((q, idx) => ({
          _id: idx.toString(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          userAnswer: userAnswersMap.get(idx.toString()),
        })),
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        createdAt: quiz.createdAt.toISOString(),
        completedAt: quiz.completedAt.toISOString(),
      },
      score,
    });
  } catch (error: any) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: error.message || 'Failed to submit quiz' });
  }
};

// Delete a quiz
export const deleteQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({ _id: quizId, userId });

    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    await Quiz.deleteOne({ _id: quizId, userId });

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: error.message || 'Failed to delete quiz' });
  }
};
