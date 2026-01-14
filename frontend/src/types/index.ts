export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Question {
  _id: string;
  question: string;
  answer: string;
  aiExplanation?: string;
  isPinned: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InterviewSession {
  _id: string;
  userId: string;
  jobRole: string;
  experienceLevel: string;
  techStack: string[];
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionSummary {
  _id: string;
  userId: string;
  jobRole: string;
  experienceLevel: string;
  techStack: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PinnedQuestion extends Question {
  sessionId: string;
  sessionJobRole: string;
  sessionExperienceLevel: string;
}
