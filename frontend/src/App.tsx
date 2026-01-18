import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DemoModeBanner from './components/DemoModeBanner';
import { backendStatusManager } from './utils/backendStatus';
import SidebarLayout from './components/SidebarLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InterviewSessions from './pages/InterviewSessions';
import CreateSession from './pages/CreateSession';
import Session from './pages/Session';
import PinnedQuestions from './pages/PinnedQuestions';
import ResumeDashboard from './pages/ResumeDashboard';
import ResumeEditor from './pages/ResumeEditor';
import LearningAssistant from './pages/LearningAssistant';
import DocumentsPage from './pages/DocumentsPage';
import DocumentViewer from './pages/DocumentViewer';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizzesPage from './pages/QuizzesPage';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import OutreachGenerator from './pages/OutreachGenerator';

function App() {
  // Initialize backend status checking when app loads
  useEffect(() => {
    // Start periodic backend health checks
    backendStatusManager.startPeriodicCheck(30000); // Check every 30 seconds
    
    return () => {
      // Cleanup on unmount
      backendStatusManager.stopPeriodicCheck();
    };
  }, []);

  return (
    <AuthProvider>
      <DemoModeBanner />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview-sessions" element={<InterviewSessions />} />
            <Route path="/create-session" element={<CreateSession />} />
            <Route path="/session/:sessionId" element={<Session />} />
            <Route path="/pinned" element={<PinnedQuestions />} />
            <Route path="/resumes" element={<ResumeDashboard />} />
            <Route path="/resume/:resumeId" element={<ResumeEditor />} />
            <Route path="/learning" element={<LearningAssistant />} />
            <Route path="/learning/documents" element={<DocumentsPage />} />
            <Route path="/learning/documents/:documentId" element={<DocumentViewer />} />
            <Route path="/learning/flashcards" element={<FlashcardsPage />} />
            <Route path="/learning/quizzes" element={<QuizzesPage />} />
            <Route path="/learning/quizzes/:quizId" element={<QuizPage />} />
            <Route path="/learning/progress" element={<ProgressPage />} />
            <Route path="/outreach" element={<OutreachGenerator />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
