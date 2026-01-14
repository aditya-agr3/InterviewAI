import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { learningAPI } from '../services/api';
import { Quiz, Document } from '../types/learning';
import { dummyQuizzes, dummyDocuments } from '../utils/dummyData';

const QuizzesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('documentId');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>(documentId || 'all');
  const [questionCount, setQuestionCount] = useState(5);

  useEffect(() => {
    fetchData();
  }, [selectedDocument]);

  const fetchData = async () => {
    try {
      const [quizzesData, documentsData] = await Promise.all([
        learningAPI.getQuizzes(selectedDocument === 'all' ? undefined : selectedDocument).catch((err: any) => {
          if (err.response?.status !== 404) {
            console.error('Failed to fetch quizzes:', err);
          }
          return { quizzes: [] };
        }),
        learningAPI.getDocuments().catch((err: any) => {
          if (err.response?.status !== 404) {
            console.error('Failed to fetch documents:', err);
          }
          return { documents: [] };
        }),
      ]);
      setQuizzes(quizzesData.quizzes.length > 0 ? quizzesData.quizzes : dummyQuizzes);
      setDocuments(documentsData.documents.length > 0 ? documentsData.documents : dummyDocuments);
    } catch (error) {
      // Final fallback
      setQuizzes(dummyQuizzes);
      setDocuments(dummyDocuments);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedDocument || selectedDocument === 'all') {
      alert('Please select a document first');
      return;
    }

    setGenerating(true);
    try {
      const data = await learningAPI.generateQuiz(selectedDocument, questionCount);
      navigate(`/learning/quizzes/${data.quiz._id}`);
    } catch (error: any) {
      // If backend is not available, create a demo quiz
      if (error.response?.status === 404 || error.response?.status === 500) {
        const demoQuizId = `quiz-demo-${Date.now()}`;
        // Store demo quiz in sessionStorage for demo mode
        const demoQuiz = {
          _id: demoQuizId,
          documentId: selectedDocument,
          title: `Quiz from ${documents.find(d => d._id === selectedDocument)?.originalName || 'Document'}`,
          questions: Array.from({ length: questionCount }, (_, i) => ({
            _id: `q-${i}`,
            question: `Sample question ${i + 1}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: 'This is a demo question. Backend API is not available.',
          })),
          totalQuestions: questionCount,
          createdAt: new Date().toISOString(),
        };
        sessionStorage.setItem(`demo-quiz-${demoQuizId}`, JSON.stringify(demoQuiz));
        navigate(`/learning/quizzes/${demoQuizId}`);
      } else {
        console.error('Failed to generate quiz:', error);
        alert(error.response?.data?.message || 'Failed to generate quiz. Backend API not available - using demo mode.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await learningAPI.deleteQuiz(quizId);
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      alert('Failed to delete quiz');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-muted">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-bg-card shadow-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                InterviewAI
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/dashboard" className="text-text-body hover:text-text-heading transition-colors">
                  Dashboard
                </Link>
                <Link to="/interview-sessions" className="text-text-body hover:text-text-heading transition-colors">
                  Interview Practice
                </Link>
                <Link to="/resumes" className="text-text-body hover:text-text-heading transition-colors">
                  Resume Builder
                </Link>
                <Link to="/learning" className="text-primary font-medium">
                  Learning Assistant
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/pinned" className="text-text-body hover:text-text-heading transition-colors flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="hidden sm:inline">Pinned</span>
              </Link>
              <span className="text-text-muted hidden sm:inline">Welcome, {user?.name}</span>
              <button onClick={logout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-heading mb-2">Quizzes</h1>
              <p className="text-text-body">
                Generate and take AI-powered quizzes from your documents
              </p>
            </div>
            <Link to="/learning" className="btn-secondary">
              ← Back to Learning
            </Link>
          </div>

          {/* Generate Quiz Section */}
          {selectedDocument && selectedDocument !== 'all' && (
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-6">
              <h3 className="text-lg font-semibold text-text-heading mb-4">Generate New Quiz</h3>
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="20"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={generating}
                  className="btn-primary disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate Quiz'}
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-text-heading">Filter by Document:</label>
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Documents</option>
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.originalName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quizzes Grid */}
        {quizzes.length === 0 ? (
          <div className="card text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-text-heading mb-2">No quizzes yet</h4>
              <p className="text-text-body mb-6">
                {selectedDocument && selectedDocument !== 'all'
                  ? 'Generate a quiz from your document to get started'
                  : 'Select a document and generate a quiz to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="card hover:shadow-card-hover transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-heading mb-2">{quiz.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <span>{quiz.totalQuestions} questions</span>
                      {quiz.score !== undefined && (
                        <>
                          <span>•</span>
                          <span className={`font-medium ${
                            quiz.score >= 80 ? 'text-green-600' :
                            quiz.score >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            Score: {quiz.score}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {quiz.score === undefined && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-button">
                      New
                    </span>
                  )}
                </div>

                <p className="text-xs text-text-muted mb-4">
                  Created {new Date(quiz.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/learning/quizzes/${quiz._id}`)}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    {quiz.score !== undefined ? 'Review' : 'Take Quiz'}
                  </button>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-button text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizzesPage;
