import { Response } from 'express';
import Document from '../models/Document';
import { AuthRequest } from '../middlewares/auth';
import { explainConcept as explainConceptAI } from '../services/geminiService';
import { extractTextFromPDF } from '../utils/pdfExtractor';

// Explain a concept from a document
export const explainConcept = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.params;
    const { concept } = req.body;

    if (!concept || typeof concept !== 'string' || concept.trim().length === 0) {
      res.status(400).json({ message: 'Concept is required' });
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
        res.status(400).json({ message: 'Document does not contain enough text' });
        return;
      }
    } catch (error: any) {
      console.error('Error extracting PDF text:', error);
      res.status(500).json({ message: 'Failed to extract text from PDF' });
      return;
    }

    // Generate explanation
    let explanation: string;
    try {
      explanation = await explainConceptAI(concept.trim(), documentContent);
    } catch (error: any) {
      console.error('Error generating explanation:', error);
      res.status(500).json({ message: error.message || 'Failed to generate explanation' });
      return;
    }

    res.json({ explanation });
  } catch (error: any) {
    console.error('Error explaining concept:', error);
    res.status(500).json({ message: error.message || 'Failed to explain concept' });
  }
};
