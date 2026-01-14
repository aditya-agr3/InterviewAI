import { Response } from 'express';
import Flashcard from '../models/Flashcard';
import Document from '../models/Document';
import { AuthRequest } from '../middlewares/auth';
import { generateFlashcards as generateFlashcardsAI } from '../services/geminiService';
import { extractTextFromPDF } from '../utils/pdfExtractor';

// Generate flashcards from a document
export const generateFlashcards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.params;

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
        res.status(400).json({ message: 'Document does not contain enough text to generate flashcards' });
        return;
      }
    } catch (error: any) {
      console.error('Error extracting PDF text:', error);
      res.status(500).json({ message: 'Failed to extract text from PDF' });
      return;
    }

    // Generate flashcards using AI
    let generatedFlashcards: Array<{ front: string; back: string }>;
    try {
      generatedFlashcards = await generateFlashcardsAI(documentContent, 10);
    } catch (error: any) {
      console.error('Error generating flashcards:', error);
      res.status(500).json({ message: error.message || 'Failed to generate flashcards' });
      return;
    }

    // Save flashcards to database
    const flashcards = await Promise.all(
      generatedFlashcards.map((card) =>
        new Flashcard({
          userId,
          documentId,
          front: card.front,
          back: card.back,
          isFavorite: false,
        }).save()
      )
    );

    res.json({
      flashcards: flashcards.map((card) => ({
        _id: card._id.toString(),
        documentId: card.documentId.toString(),
        front: card.front,
        back: card.back,
        isFavorite: card.isFavorite,
        createdAt: card.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ message: error.message || 'Failed to generate flashcards' });
  }
};

// Get all flashcards
export const getFlashcards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.query;

    const query: any = { userId };
    if (documentId) {
      query.documentId = documentId;
    }

    const flashcards = await Flashcard.find(query).sort({ createdAt: -1 });

    res.json({
      flashcards: flashcards.map((card) => ({
        _id: card._id.toString(),
        documentId: card.documentId.toString(),
        front: card.front,
        back: card.back,
        isFavorite: card.isFavorite,
        createdAt: card.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch flashcards' });
  }
};

// Toggle favorite status
export const toggleFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { flashcardId } = req.params;

    const flashcard = await Flashcard.findOne({ _id: flashcardId, userId });

    if (!flashcard) {
      res.status(404).json({ message: 'Flashcard not found' });
      return;
    }

    flashcard.isFavorite = !flashcard.isFavorite;
    await flashcard.save();

    res.json({
      flashcard: {
        _id: flashcard._id.toString(),
        documentId: flashcard.documentId.toString(),
        front: flashcard.front,
        back: flashcard.back,
        isFavorite: flashcard.isFavorite,
        createdAt: flashcard.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: error.message || 'Failed to toggle favorite' });
  }
};

// Delete a flashcard
export const deleteFlashcard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { flashcardId } = req.params;

    const flashcard = await Flashcard.findOne({ _id: flashcardId, userId });

    if (!flashcard) {
      res.status(404).json({ message: 'Flashcard not found' });
      return;
    }

    await Flashcard.deleteOne({ _id: flashcardId, userId });

    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ message: error.message || 'Failed to delete flashcard' });
  }
};
