import { Response } from 'express';
import ChatMessage from '../models/ChatMessage';
import Document from '../models/Document';
import { AuthRequest } from '../middlewares/auth';
import { generateChatResponse } from '../services/geminiService';
import { extractTextFromPDF } from '../utils/pdfExtractor';

// Send a chat message
export const sendChatMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.params;
    const { message, chatHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ message: 'Message is required' });
      return;
    }

    // Verify document belongs to user
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // Save user message
    const userMessage = new ChatMessage({
      userId,
      documentId,
      role: 'user',
      content: message.trim(),
    });
    await userMessage.save();

    // Get document content for context
    let documentContent: string | undefined;
    try {
      const pdfInfo = await extractTextFromPDF(document.filePath);
      documentContent = pdfInfo.text;
    } catch (error) {
      console.error('Error extracting PDF text for chat:', error);
      // Continue without document content
    }

    // Get recent chat history from database
    const recentMessages = await ChatMessage.find({ documentId })
      .sort({ timestamp: -1 })
      .limit(10)
      .sort({ timestamp: 1 }); // Reverse to chronological order

    const formattedHistory = recentMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate AI response
    let aiResponse: string;
    try {
      aiResponse = await generateChatResponse(message, documentContent, formattedHistory);
    } catch (error: any) {
      console.error('Error generating chat response:', error);
      aiResponse = 'I apologize, but I encountered an error while processing your question. Please try again.';
    }

    // Save AI response
    const assistantMessage = new ChatMessage({
      userId,
      documentId,
      role: 'assistant',
      content: aiResponse,
    });
    await assistantMessage.save();

    res.json({
      message: {
        _id: assistantMessage._id.toString(),
        role: assistantMessage.role,
        content: assistantMessage.content,
        documentId: assistantMessage.documentId.toString(),
        timestamp: assistantMessage.timestamp.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ message: error.message || 'Failed to send chat message' });
  }
};

// Get chat history
export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { documentId } = req.params;

    // Verify document belongs to user
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    const messages = await ChatMessage.find({ documentId, userId })
      .sort({ timestamp: 1 });

    res.json({
      messages: messages.map((msg) => ({
        _id: msg._id.toString(),
        role: msg.role,
        content: msg.content,
        documentId: msg.documentId.toString(),
        timestamp: msg.timestamp.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch chat history' });
  }
};
