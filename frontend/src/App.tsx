import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DemoModeBanner from './components/DemoModeBanner';
import { backendStatusManager } from './utils/backendStatus';
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
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-sessions"
            element={
              <ProtectedRoute>
                <InterviewSessions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-session"
            element={
              <ProtectedRoute>
                <CreateSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/:sessionId"
            element={
              <ProtectedRoute>
                <Session />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pinned"
            element={
              <ProtectedRoute>
                <PinnedQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resumes"
            element={
              <ProtectedRoute>
                <ResumeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/:resumeId"
            element={
              <ProtectedRoute>
                <ResumeEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning"
            element={
              <ProtectedRoute>
                <LearningAssistant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/documents"
            element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/documents/:documentId"
            element={
              <ProtectedRoute>
                <DocumentViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/flashcards"
            element={
              <ProtectedRoute>
                <FlashcardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/quizzes"
            element={
              <ProtectedRoute>
                <QuizzesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/quizzes/:quizId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning/progress"
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
