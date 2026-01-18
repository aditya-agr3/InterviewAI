import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { learningAPI } from '../services/api';
import { Document, ProgressStats } from '../types/learning';
import StatsCard from '../components/StatsCard';
import { dummyDocuments } from '../utils/dummyData';
import { useBackendStatus } from '../hooks/useBackendStatus';

const LearningAssistant = () => {
  const navigate = useNavigate();
  const { isAvailable: backendAvailable, refreshStatus } = useBackendStatus();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh when backend becomes available
  useEffect(() => {
    if (backendAvailable && documents.length > 0 && documents[0]._id.startsWith('doc')) {
      // If we're showing dummy data and backend just came online, refresh
      fetchData();
    }
  }, [backendAvailable]);

  const fetchData = async () => {
    try {
      const [documentsData, progressData] = await Promise.all([
        learningAPI.getDocuments().catch((err: any) => {
          // Silently handle 404 (backend not available)
          if (err.response?.status !== 404) {
            console.error('Failed to fetch documents:', err);
          }
          return { documents: [] };
        }),
        learningAPI.getProgress().catch((err: any) => {
          // Silently handle 404 (backend not available)
          if (err.response?.status !== 404) {
            console.error('Failed to fetch progress:', err);
          }
          return { 
            progress: {
              totalDocuments: 5,
              totalFlashcards: 12,
              totalQuizzes: 3,
              recentActivity: [
                {
                  type: 'document' as const,
                  action: 'Uploaded document',
                  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                  itemId: 'doc1',
                  itemName: 'Complete React Guide 2024.pdf',
                },
                {
                  type: 'quiz' as const,
                  action: 'Completed quiz',
                  timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                  itemId: 'quiz1',
                  itemName: 'React Fundamentals Quiz',
                },
              ],
            }
          };
        }),
      ]);
      if (documentsData.documents.length > 0) {
        setDocuments(documentsData.documents);
        // Backend is working, update status
        await refreshStatus();
      } else {
        setDocuments(dummyDocuments);
      }
      setProgress(progressData.progress);
    } catch (error) {
      // Final fallback
      setDocuments(dummyDocuments);
      setProgress({
        totalDocuments: 5,
        totalFlashcards: 12,
        totalQuizzes: 3,
        recentActivity: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-heading mb-2">AI-Powered Learning Assistant</h1>
          <p className="text-text-body">
            Upload study documents, chat with AI, generate flashcards, and take quizzes to enhance your learning.
          </p>
        </div>

        {/* Progress Stats */}
        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
              title="Documents"
              value={progress.totalDocuments}
              icon={
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              trend={`${progress.totalDocuments} uploaded`}
            />
            <StatsCard
              title="Flashcards"
              value={progress.totalFlashcards}
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
              trend={`${progress.totalFlashcards} cards`}
            />
            <StatsCard
              title="Quizzes"
              value={progress.totalQuizzes}
              icon={
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={`${progress.totalQuizzes} completed`}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/learning/documents"
            className="card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-card-hover transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-card group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-heading group-hover:text-primary transition-colors">Upload PDF</h3>
                <p className="text-xs text-text-muted">Add study documents</p>
              </div>
            </div>
          </Link>

          <Link
            to="/learning/flashcards"
            className="card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:shadow-card-hover transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-card group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-heading group-hover:text-primary transition-colors">Flashcards</h3>
                <p className="text-xs text-text-muted">Study with cards</p>
              </div>
            </div>
          </Link>

          <Link
            to="/learning/quizzes"
            className="card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:shadow-card-hover transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-card group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-heading group-hover:text-primary transition-colors">Quizzes</h3>
                <p className="text-xs text-text-muted">Test your knowledge</p>
              </div>
            </div>
          </Link>

          <Link
            to="/learning/progress"
            className="card bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 hover:shadow-card-hover transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-card group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-heading group-hover:text-primary transition-colors">Progress</h3>
                <p className="text-xs text-text-muted">View analytics</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Documents */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text-heading">Recent Documents</h3>
            <Link to="/learning/documents" className="btn-primary text-sm">
              View All Documents
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-text-muted">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="card text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-text-heading mb-2">No documents yet</h4>
                <p className="text-text-body mb-6">
                  Upload your first PDF document to start learning with AI-powered features.
                </p>
                <Link to="/learning/documents" className="btn-primary inline-block">
                  Upload Your First Document
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.slice(0, 6).map((doc) => (
                <div
                  key={doc._id}
                  className="card hover:shadow-card-hover transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/learning/documents/${doc._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-heading mb-2 line-clamp-2">
                        {doc.originalName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <span>{formatFileSize(doc.fileSize)}</span>
                        {doc.pageCount && (
                          <>
                            <span>•</span>
                            <span>{doc.pageCount} pages</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-button">
                      <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learning/documents/${doc._id}`);
                      }}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      Open
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learning/documents/${doc._id}?tab=chat`);
                      }}
                      className="px-4 py-2 border border-gray-300 text-text-body hover:bg-gray-50 rounded-button text-sm font-medium transition-colors"
                    >
                      Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {progress && progress.recentActivity.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-heading mb-4">Recent Activity</h3>
            <div className="card">
              <div className="space-y-3">
                {progress.recentActivity.slice(0, 5).map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`p-2 rounded-button ${
                      activity.type === 'document' ? 'bg-blue-50 text-blue-600' :
                      activity.type === 'flashcard' ? 'bg-purple-50 text-purple-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {activity.type === 'document' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {activity.type === 'flashcard' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                      {activity.type === 'quiz' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text-body">{activity.action}</p>
                      <p className="text-xs text-text-muted">{activity.itemName}</p>
                    </div>
                    <span className="text-xs text-text-muted">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearningAssistant;
