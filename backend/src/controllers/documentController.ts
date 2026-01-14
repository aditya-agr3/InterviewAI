import { Response } from 'express';
import Document from '../models/Document';
import { AuthRequest } from '../middlewares/auth';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { generateDocumentSummary } from '../services/geminiService';
import path from 'path';
import fs from 'fs';

// Upload a new document
export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'PDF file is required' });
      return;
    }

    const userId = req.userId!;
    const file = req.file;
    const filePath = file.path;
    const fileSize = file.size;
    const originalName = file.originalname;

    // Extract text and page count from PDF
    let pageCount = 0;
    let summary: string | undefined;

    try {
      const pdfInfo = await extractTextFromPDF(filePath);
      pageCount = pdfInfo.pageCount;

      // Generate summary if text was extracted successfully
      if (pdfInfo.text && pdfInfo.text.length > 100) {
        try {
          summary = await generateDocumentSummary(pdfInfo.text);
        } catch (summaryError) {
          console.error('Error generating summary:', summaryError);
          // Continue without summary
        }
      }
    } catch (extractError) {
      console.error('Error extracting PDF text:', extractError);
      // Continue without text extraction
    }

    // Create document record
    const document = new Document({
      userId,
      filename: file.filename,
      originalName,
      fileSize,
      filePath,
      pageCount: pageCount || undefined,
      summary,
    });

    await document.save();

    res.status(201).json({
      document: {
        _id: document._id.toString(),
        userId: document.userId.toString(),
        filename: document.filename,
        originalName: document.originalName,
        fileSize: document.fileSize,
        uploadDate: document.uploadDate,
        summary: document.summary,
        pageCount: document.pageCount,
      },
    });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: error.message || 'Failed to upload document' });
  }
};

// Get all documents for the user
export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const documents = await Document.find({ userId })
      .sort({ uploadDate: -1 })
      .select('-filePath');

    res.json({
      documents: documents.map((doc) => ({
        _id: doc._id.toString(),
        userId: doc.userId.toString(),
        filename: doc.filename,
        originalName: doc.originalName,
        fileSize: doc.fileSize,
        uploadDate: doc.uploadDate.toISOString(),
        summary: doc.summary,
        pageCount: doc.pageCount,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch documents' });
  }
};

// Get a single document
export const getDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.params;

    const document = await Document.findOne({ _id: documentId, userId });

    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    res.json({
      document: {
        _id: document._id.toString(),
        userId: document.userId.toString(),
        filename: document.filename,
        originalName: document.originalName,
        fileSize: document.fileSize,
        uploadDate: document.uploadDate.toISOString(),
        summary: document.summary,
        pageCount: document.pageCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch document' });
  }
};

// Get PDF file
export const getDocumentFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.params;

    const document = await Document.findOne({ _id: documentId, userId });

    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    const filePath = document.filePath;

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'PDF file not found' });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);
    res.sendFile(path.resolve(filePath));
  } catch (error: any) {
    console.error('Error fetching document file:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch document file' });
  }
};

// Delete a document
export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.params;

    const document = await Document.findOne({ _id: documentId, userId });

    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // Delete the file
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete the document record
    await Document.deleteOne({ _id: documentId, userId });

    res.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: error.message || 'Failed to delete document' });
  }
};
