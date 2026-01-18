import axios from 'axios';
import { User, InterviewSession, SessionSummary, PinnedQuestion } from '../types';
import { Resume, ResumeSummary } from '../types/resume';
import { Document, ChatMessage, Flashcard, Quiz, ProgressStats } from '../types/learning';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expected 404s on learning endpoints (backend not implemented yet)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // For learning API endpoints, mark 404s as expected (backend not connected)
    // Components will handle these gracefully with dummy data
    if (
      error.response?.status === 404 &&
      error.config?.url?.includes('/learning/')
    ) {
      // Mark as expected error - components will handle gracefully
      error.isExpected404 = true;
      
      // In development, log a helpful message once
      if (import.meta.env.DEV && !window.__learning404Logged) {
        console.info(
          '%cℹ️ Expected 404s on /learning/* endpoints',
          'color: #3b82f6; font-weight: bold;',
          '\nThese are normal when the backend API is not yet implemented.\n' +
          'The app will use dummy data automatically. When you connect your backend,\n' +
          'these errors will disappear and real data will load automatically.'
        );
        window.__learning404Logged = true;
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};

// Session APIs
export const sessionAPI = {
  createSession: async (
    jobRole: string,
    experienceLevel: string,
    techStack: string[]
  ) => {
    const response = await api.post<{ session: InterviewSession }>('/sessions', {
      jobRole,
      experienceLevel,
      techStack,
    });
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get<{ sessions: SessionSummary[] }>('/sessions');
    return response.data;
  },

  getSession: async (sessionId: string) => {
    const response = await api.get<{ session: InterviewSession }>(
      `/sessions/${sessionId}`
    );
    return response.data;
  },

  generateExplanation: async (sessionId: string, questionId: string) => {
    const response = await api.post<{ explanation: string }>(
      `/sessions/${sessionId}/questions/${questionId}/explain`
    );
    return response.data;
  },

  togglePin: async (sessionId: string, questionId: string) => {
    const response = await api.patch<{ question: any }>(
      `/sessions/${sessionId}/questions/${questionId}/pin`
    );
    return response.data;
  },

  updateNotes: async (sessionId: string, questionId: string, notes: string) => {
    const response = await api.patch<{ question: any }>(
      `/sessions/${sessionId}/questions/${questionId}/notes`,
      { notes }
    );
    return response.data;
  },

  getPinnedQuestions: async () => {
    const response = await api.get<{ pinnedQuestions: PinnedQuestion[] }>(
      '/sessions/pinned'
    );
    return response.data;
  },
};

// Resume APIs
export const resumeAPI = {
  getResumes: async () => {
    const response = await api.get<{ resumes: ResumeSummary[] }>('/resumes');
    return response.data;
  },

  getResume: async (resumeId: string) => {
    const response = await api.get<{ resume: Resume }>(`/resumes/${resumeId}`);
    return response.data;
  },

  createResume: async (resumeData: Partial<Resume>) => {
    const response = await api.post<{ resume: Resume }>('/resumes', resumeData);
    return response.data;
  },

  updateResume: async (resumeId: string, resumeData: Partial<Resume>) => {
    const response = await api.put<{ resume: Resume }>(`/resumes/${resumeId}`, resumeData);
    return response.data;
  },

  deleteResume: async (resumeId: string) => {
    const response = await api.delete(`/resumes/${resumeId}`);
    return response.data;
  },

  uploadImage: async (resumeId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<{ imageUrl: string }>(
      `/resumes/${resumeId}/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

// Learning Assistant APIs
export const learningAPI = {
  // Document Management
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await api.post<{ document: Document }>(
      '/learning/documents',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getDocuments: async () => {
    const response = await api.get<{ documents: Document[] }>('/learning/documents');
    return response.data;
  },

  getDocument: async (documentId: string) => {
    const response = await api.get<{ document: Document }>(`/learning/documents/${documentId}`);
    return response.data;
  },

  deleteDocument: async (documentId: string) => {
    const response = await api.delete(`/learning/documents/${documentId}`);
    return response.data;
  },

  getDocumentUrl: async (documentId: string): Promise<string> => {
    // Fetch PDF as blob with authentication, then create object URL
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/learning/documents/${documentId}/file`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  // AI Chat
  sendChatMessage: async (documentId: string, message: string, chatHistory: ChatMessage[] = []) => {
    const response = await api.post<{ message: ChatMessage }>(
      `/learning/documents/${documentId}/chat`,
      { message, chatHistory }
    );
    return response.data;
  },

  getChatHistory: async (documentId: string) => {
    const response = await api.get<{ messages: ChatMessage[] }>(
      `/learning/documents/${documentId}/chat`
    );
    return response.data;
  },

  // AI Document Summary
  generateSummary: async (documentId: string) => {
    const response = await api.post<{ summary: string }>(
      `/learning/documents/${documentId}/summary`
    );
    return response.data;
  },

  // AI Concept Explainer
  explainConcept: async (documentId: string, concept: string) => {
    const response = await api.post<{ explanation: string }>(
      `/learning/documents/${documentId}/explain`,
      { concept }
    );
    return response.data;
  },

  // Flashcards
  generateFlashcards: async (documentId: string) => {
    const response = await api.post<{ flashcards: Flashcard[] }>(
      `/learning/documents/${documentId}/flashcards/generate`
    );
    return response.data;
  },

  getFlashcards: async (documentId?: string) => {
    const url = documentId 
      ? `/learning/flashcards?documentId=${documentId}`
      : '/learning/flashcards';
    const response = await api.get<{ flashcards: Flashcard[] }>(url);
    return response.data;
  },

  toggleFlashcardFavorite: async (flashcardId: string) => {
    const response = await api.patch<{ flashcard: Flashcard }>(
      `/learning/flashcards/${flashcardId}/favorite`
    );
    return response.data;
  },

  deleteFlashcard: async (flashcardId: string) => {
    const response = await api.delete(`/learning/flashcards/${flashcardId}`);
    return response.data;
  },

  // Quiz Generator
  generateQuiz: async (documentId: string, questionCount: number) => {
    const response = await api.post<{ quiz: Quiz }>(
      `/learning/documents/${documentId}/quizzes/generate`,
      { questionCount }
    );
    return response.data;
  },

  getQuizzes: async (documentId?: string) => {
    const url = documentId 
      ? `/learning/quizzes?documentId=${documentId}`
      : '/learning/quizzes';
    const response = await api.get<{ quizzes: Quiz[] }>(url);
    return response.data;
  },

  getQuiz: async (quizId: string) => {
    const response = await api.get<{ quiz: Quiz }>(`/learning/quizzes/${quizId}`);
    return response.data;
  },

  submitQuiz: async (quizId: string, answers: Record<string, number>) => {
    const response = await api.post<{ quiz: Quiz; score: number }>(
      `/learning/quizzes/${quizId}/submit`,
      { answers }
    );
    return response.data;
  },

  deleteQuiz: async (quizId: string) => {
    const response = await api.delete(`/learning/quizzes/${quizId}`);
    return response.data;
  },

  // Progress Tracking
  getProgress: async () => {
    const response = await api.get<{ progress: ProgressStats }>('/learning/progress');
    return response.data;
  },
};

// Outreach Generator APIs
export const outreachAPI = {
  generateMessages: async (payload: {
    platform: string;
    tone: string;
    relationship: string;
    length: string;
    jobDescription: string;
    resumeFile: File;
    companyName?: string;
    roleTitle?: string;
    recruiterName?: string;
    senderName?: string;
  }) => {
    const formData = new FormData();
    formData.append('platform', payload.platform);
    formData.append('tone', payload.tone);
    formData.append('relationship', payload.relationship);
    formData.append('length', payload.length);
    formData.append('jobDescription', payload.jobDescription);
    if (payload.companyName) formData.append('companyName', payload.companyName);
    if (payload.roleTitle) formData.append('roleTitle', payload.roleTitle);
    if (payload.recruiterName) formData.append('recruiterName', payload.recruiterName);
    if (payload.senderName) formData.append('senderName', payload.senderName);
    formData.append('resume', payload.resumeFile);

    const response = await api.post<{ messages: string[] }>(
      '/outreach/generate',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

export default api;
