import { SessionSummary } from '../types';
import { Document, Flashcard, Quiz } from '../types/learning';
import { ResumeSummary } from '../types/resume';

// Dummy Interview Sessions
export const dummySessions: SessionSummary[] = [
  {
    _id: '1',
    userId: 'user1',
    jobRole: 'Frontend Developer',
    experienceLevel: 'Mid-level',
    techStack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    userId: 'user1',
    jobRole: 'Full Stack Developer',
    experienceLevel: 'Senior',
    techStack: ['Node.js', 'Express', 'MongoDB', 'React', 'AWS'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    userId: 'user1',
    jobRole: 'Backend Engineer',
    experienceLevel: 'Mid-level',
    techStack: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    userId: 'user1',
    jobRole: 'DevOps Engineer',
    experienceLevel: 'Senior',
    techStack: ['AWS', 'Terraform', 'Kubernetes', 'Jenkins', 'Prometheus'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    userId: 'user1',
    jobRole: 'React Developer',
    experienceLevel: 'Junior',
    techStack: ['React', 'JavaScript', 'CSS', 'HTML'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Dummy Documents
export const dummyDocuments: Document[] = [
  {
    _id: 'doc1',
    userId: 'user1',
    filename: 'react-guide.pdf',
    originalName: 'Complete React Guide 2024.pdf',
    fileSize: 2456789,
    uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    pageCount: 45,
  },
  {
    _id: 'doc2',
    userId: 'user1',
    filename: 'system-design.pdf',
    originalName: 'System Design Patterns.pdf',
    fileSize: 3890123,
    uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    pageCount: 62,
  },
  {
    _id: 'doc3',
    userId: 'user1',
    filename: 'javascript-advanced.pdf',
    originalName: 'Advanced JavaScript Concepts.pdf',
    fileSize: 1567890,
    uploadDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    pageCount: 38,
  },
  {
    _id: 'doc4',
    userId: 'user1',
    filename: 'nodejs-best-practices.pdf',
    originalName: 'Node.js Best Practices.pdf',
    fileSize: 2123456,
    uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    pageCount: 52,
  },
  {
    _id: 'doc5',
    userId: 'user1',
    filename: 'database-design.pdf',
    originalName: 'Database Design Fundamentals.pdf',
    fileSize: 3012345,
    uploadDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    pageCount: 71,
  },
];

// Dummy Flashcards
export const dummyFlashcards: Flashcard[] = [
  {
    _id: 'fc1',
    documentId: 'doc1',
    front: 'What is the Virtual DOM in React?',
    back: 'The Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM by a library such as ReactDOM. It allows React to batch updates and minimize direct DOM manipulation for better performance.',
    isFavorite: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'fc2',
    documentId: 'doc1',
    front: 'Explain React Hooks',
    back: 'React Hooks are functions that let you use state and other React features in functional components. They allow you to reuse stateful logic between components without changing component hierarchy.',
    isFavorite: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'fc3',
    documentId: 'doc2',
    front: 'What is Load Balancing?',
    back: 'Load balancing is the process of distributing network traffic across multiple servers to ensure no single server becomes overwhelmed. It improves application availability and responsiveness.',
    isFavorite: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'fc4',
    documentId: 'doc3',
    front: 'What is a Closure in JavaScript?',
    back: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned. Closures are created every time a function is created.',
    isFavorite: false,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'fc5',
    documentId: 'doc4',
    front: 'What is Event Loop in Node.js?',
    back: 'The Event Loop is what allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible. It continuously checks the call stack and processes callbacks from the callback queue.',
    isFavorite: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Dummy Quizzes
export const dummyQuizzes: Quiz[] = [
  {
    _id: 'quiz1',
    documentId: 'doc1',
    title: 'React Fundamentals Quiz',
    questions: [],
    totalQuestions: 10,
    score: 85,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'quiz2',
    documentId: 'doc2',
    title: 'System Design Patterns Quiz',
    questions: [],
    totalQuestions: 15,
    score: 92,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'quiz3',
    documentId: 'doc3',
    title: 'JavaScript Advanced Concepts',
    questions: [],
    totalQuestions: 12,
    score: 78,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Dummy Resumes
export const dummyResumes: ResumeSummary[] = [
  {
    _id: 'resume1',
    userId: 'user1',
    title: 'Software Engineer Resume',
    template: 'modern',
    colorTheme: '#6366f1',
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'resume2',
    userId: 'user1',
    title: 'Full Stack Developer Resume',
    template: 'classic',
    colorTheme: '#8b5cf6',
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'resume3',
    userId: 'user1',
    title: 'Frontend Developer Resume',
    template: 'creative',
    colorTheme: '#ec4899',
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Testimonials
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  image?: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    rating: 5,
    text: 'InterviewAI helped me land my dream job at Google! The AI-generated questions were incredibly realistic and the explanations helped me understand concepts I was struggling with.',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Full Stack Developer',
    company: 'Microsoft',
    rating: 5,
    text: 'The Learning Assistant feature is a game-changer. I uploaded my study materials and the AI helped me create flashcards and quizzes that made studying so much more effective.',
  },
  {
    name: 'Emily Johnson',
    role: 'Frontend Developer',
    company: 'Meta',
    rating: 5,
    text: 'I love how personalized the interview questions are. The system adapts to my experience level and tech stack, making every practice session relevant and valuable.',
  },
  {
    name: 'David Kim',
    role: 'Backend Engineer',
    company: 'Amazon',
    rating: 5,
    text: 'The Resume Builder is fantastic! I created multiple versions for different roles and the PDF export feature made it easy to apply to multiple positions.',
  },
  {
    name: 'Jessica Martinez',
    role: 'DevOps Engineer',
    company: 'Netflix',
    rating: 5,
    text: 'The progress tracking and analytics helped me identify my weak areas. I improved my readiness score from 45% to 92% in just 3 weeks!',
  },
];
