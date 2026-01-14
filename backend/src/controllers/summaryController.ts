import { Response } from 'express';
import Document from '../models/Document';
import { AuthRequest } from '../middlewares/auth';
import { generateDocumentSummary } from '../services/geminiService';
import { extractTextFromPDF } from '../utils/pdfExtractor';

// Generate document summary
export const generateSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.params;

    // Verify document belongs to user
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // Use existing summary if available
    if (document.summary) {
      res.json({ summary: document.summary });
      return;
    }

    // Extract text from PDF
    let documentContent: string;
    try {
      const pdfInfo = await extractTextFromPDF(document.filePath);
      documentContent = pdfInfo.text;

      if (!documentContent || documentContent.length < 100) {
        res.status(400).json({ message: 'Document does not contain enough text to generate a summary' });
        return;
      }
    } catch (error: any) {
      console.error('Error extracting PDF text:', error);
      res.status(500).json({ message: 'Failed to extract text from PDF' });
      return;
    }

    // Generate summary
    let summary: string;
    try {
      summary = await generateDocumentSummary(documentContent);
    } catch (error: any) {
      console.error('Error generating summary:', error);
      res.status(500).json({ message: error.message || 'Failed to generate summary' });
      return;
    }

    // Save summary to document
    document.summary = summary;
    await document.save();

    res.json({ summary });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: error.message || 'Failed to generate summary' });
  }
};
