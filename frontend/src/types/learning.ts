export interface Document {
  _id: string;
  userId: string;
  filename: string;
  originalName: string;
  fileSize: number;
  uploadDate: string;
  summary?: string;
  pageCount?: number;
}

export interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  documentId?: string;
  timestamp?: string;
}

export interface Flashcard {
  _id: string;
  documentId: string;
  front: string;
  back: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface Quiz {
  _id: string;
  documentId: string;
  title: string;
  questions: QuizQuestion[];
  score?: number;
  totalQuestions: number;
  createdAt: string;
}

export interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  userAnswer?: number;
}

export interface ProgressStats {
  totalDocuments: number;
  totalFlashcards: number;
  totalQuizzes: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: 'document' | 'flashcard' | 'quiz';
  action: string;
  timestamp: string;
  itemId: string;
  itemName: string;
}
