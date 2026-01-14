import { Response } from 'express';
import InterviewSession from '../models/InterviewSession';
import { AuthRequest } from '../middlewares/auth';
import {
  generateInterviewQuestions,
  generateAnswer,
  generateExplanation,
} from '../services/geminiService';

// Create a new interview session
export const createSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { jobRole, experienceLevel, techStack } = req.body;

    if (!jobRole || !experienceLevel || !techStack || !Array.isArray(techStack)) {
      res.status(400).json({
        message: 'Job role, experience level, and tech stack are required',
      });
      return;
    }

    // Generate questions using Gemini
    const questions = await generateInterviewQuestions(
      jobRole,
      experienceLevel,
      techStack
    );

    // Generate answers sequentially with delays to respect rate limits
    // Free tier: 5 requests per minute = 12 seconds between requests
    const questionsWithAnswers = [];
    const delayBetweenRequests = 13000; // 13 seconds to be safe (5 req/min = 12 sec)
    
    for (let i = 0; i < questions.length; i++) {
      try {
        const question = questions[i];
        console.log(`Generating answer ${i + 1}/${questions.length}...`);
        
        const answer = await generateAnswer(
          question,
          jobRole,
          experienceLevel,
          techStack
        );
        
        questionsWithAnswers.push({
          question,
          answer,
          isPinned: false,
          notes: '',
        });
        
        // Add delay between requests (except for the last one)
        if (i < questions.length - 1) {
          console.log(`Waiting ${delayBetweenRequests / 1000}s before next request...`);
          await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
        }
      } catch (error: any) {
        console.error(`Error generating answer for question ${i + 1}:`, error);
        // Continue with other questions even if one fails
        questionsWithAnswers.push({
          question: questions[i],
          answer: 'Failed to generate answer. Please try again later.',
          isPinned: false,
          notes: '',
        });
      }
    }

    // Create session
    const session = new InterviewSession({
      userId: req.userId,
      jobRole,
      experienceLevel,
      techStack,
      questions: questionsWithAnswers,
    });

    await session.save();

    res.status(201).json({
      message: 'Interview session created successfully',
      session,
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Failed to create interview session' });
  }
};

// Get all sessions for a user
export const getSessions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const sessions = await InterviewSession.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-questions');

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

// Get a single session with all questions
export const getSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.userId,
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    res.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Failed to fetch session' });
  }
};

// Generate AI explanation for a question
export const generateQuestionExplanation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { sessionId, questionId } = req.params;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.userId,
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    const question = session.questions.find((q: any) => q._id?.toString() === questionId);
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    // Generate explanation
    const explanation = await generateExplanation(
      question.question,
      question.answer
    );

    // Update question with explanation
    question.aiExplanation = explanation;
    session.markModified('questions');
    await session.save();

    res.json({ explanation });
  } catch (error) {
    console.error('Generate explanation error:', error);
    res.status(500).json({ message: 'Failed to generate explanation' });
  }
};

// Toggle pin status of a question
export const togglePinQuestion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { sessionId, questionId } = req.params;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.userId,
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    const question = session.questions.find((q: any) => q._id?.toString() === questionId);
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    question.isPinned = !question.isPinned;
    session.markModified('questions');
    await session.save();

    res.json({
      message: question.isPinned
        ? 'Question pinned successfully'
        : 'Question unpinned successfully',
      question,
    });
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({ message: 'Failed to toggle pin status' });
  }
};

// Update notes for a question
export const updateQuestionNotes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { sessionId, questionId } = req.params;
    const { notes } = req.body;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.userId,
    });

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    const question = session.questions.find((q: any) => q._id?.toString() === questionId);
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    question.notes = notes || '';
    session.markModified('questions');
    await session.save();

    res.json({
      message: 'Notes updated successfully',
      question,
    });
  } catch (error) {
    console.error('Update notes error:', error);
    res.status(500).json({ message: 'Failed to update notes' });
  }
};

// Get all pinned questions across all sessions
export const getPinnedQuestions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const sessions = await InterviewSession.find({ userId: req.userId });

    const pinnedQuestions = sessions.flatMap((session) =>
      session.questions
        .filter((q) => q.isPinned)
        .map((q) => ({
          ...q.toObject(),
          sessionId: session._id,
          sessionJobRole: session.jobRole,
          sessionExperienceLevel: session.experienceLevel,
        }))
    );

    res.json({ pinnedQuestions });
  } catch (error) {
    console.error('Get pinned questions error:', error);
    res.status(500).json({ message: 'Failed to fetch pinned questions' });
  }
};
