import { Response } from 'express';
import Document from '../models/Document';
import Flashcard from '../models/Flashcard';
import Quiz from '../models/Quiz';
import { AuthRequest } from '../middlewares/auth';

// Get user progress statistics
export const getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    // Get counts
    const [totalDocuments, totalFlashcards, totalQuizzes] = await Promise.all([
      Document.countDocuments({ userId }),
      Flashcard.countDocuments({ userId }),
      Quiz.countDocuments({ userId }),
    ]);

    // Get recent activity
    const [recentDocuments, recentFlashcards, recentQuizzes] = await Promise.all([
      Document.find({ userId })
        .sort({ uploadDate: -1 })
        .limit(5)
        .select('originalName uploadDate'),
      Flashcard.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('front createdAt'),
      Quiz.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt'),
    ]);

    // Combine and sort recent activity
    const recentActivity = [
      ...recentDocuments.map((doc) => ({
        type: 'document' as const,
        action: 'Uploaded document',
        timestamp: doc.uploadDate.toISOString(),
        itemId: doc._id.toString(),
        itemName: doc.originalName,
      })),
      ...recentFlashcards.map((card) => ({
        type: 'flashcard' as const,
        action: 'Created flashcard',
        timestamp: card.createdAt.toISOString(),
        itemId: card._id.toString(),
        itemName: card.front.substring(0, 50) + (card.front.length > 50 ? '...' : ''),
      })),
      ...recentQuizzes.map((quiz) => ({
        type: 'quiz' as const,
        action: quiz.score !== undefined ? 'Completed quiz' : 'Created quiz',
        timestamp: quiz.createdAt.toISOString(),
        itemId: quiz._id.toString(),
        itemName: quiz.title,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    res.json({
      progress: {
        totalDocuments,
        totalFlashcards,
        totalQuizzes,
        recentActivity,
      },
    });
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch progress' });
  }
};
