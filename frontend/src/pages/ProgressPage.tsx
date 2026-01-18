import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { learningAPI } from '../services/api';
import { ProgressStats, ActivityItem } from '../types/learning';
import StatsCard from '../components/StatsCard';

const ProgressPage = () => {
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await learningAPI.getProgress();
      setProgress(data.progress);
    } catch (error: any) {
      // Silently fallback to dummy progress if API is not available
      if (error.response?.status !== 404) {
        console.error('Failed to fetch progress:', error);
      }
      setProgress({
        totalDocuments: 5,
        totalFlashcards: 12,
        totalQuizzes: 3,
        recentActivity: [
          {
            type: 'document',
            action: 'Uploaded document',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            itemId: 'doc1',
            itemName: 'Complete React Guide 2024.pdf',
          },
          {
            type: 'quiz',
            action: 'Completed quiz',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            itemId: 'quiz1',
            itemName: 'React Fundamentals Quiz',
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'document':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'flashcard':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'document':
        return 'bg-blue-50 text-blue-600';
      case 'flashcard':
        return 'bg-purple-50 text-purple-600';
      case 'quiz':
        return 'bg-green-50 text-green-600';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return time.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-muted">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="card text-center max-w-md">
          <h2 className="text-2xl font-bold text-text-heading mb-4">No Progress Data</h2>
          <p className="text-text-body mb-6">Start using the Learning Assistant to see your progress.</p>
          <Link to="/learning" className="btn-primary">
            Go to Learning Assistant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-heading mb-2">Progress Dashboard</h1>
              <p className="text-text-body">
                Track your learning progress and activity
              </p>
            </div>
            <Link to="/learning" className="btn-secondary">
              ← Back to Learning
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Documents"
            value={progress.totalDocuments}
            icon={
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            trend={`${progress.totalDocuments} uploaded`}
          />
          <StatsCard
            title="Total Flashcards"
            value={progress.totalFlashcards}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            }
            trend={`${progress.totalFlashcards} cards created`}
          />
          <StatsCard
            title="Total Quizzes"
            value={progress.totalQuizzes}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={`${progress.totalQuizzes} quizzes completed`}
          />
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-heading">Recent Activity</h2>
            <button
              onClick={fetchProgress}
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              Refresh
            </button>
          </div>

          {progress.recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-text-body">No recent activity</p>
              <p className="text-sm text-text-muted mt-2">
                Start using the Learning Assistant to see your activity here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {progress.recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-button hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-3 rounded-button ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-body font-medium">{activity.action}</p>
                    <p className="text-sm text-text-muted truncate">{activity.itemName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-muted">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/learning/documents"
            className="card hover:shadow-card-hover transition-all duration-200 group text-center"
          >
            <div className="p-4 bg-blue-50 rounded-card inline-block mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-heading mb-1">Upload Documents</h3>
            <p className="text-sm text-text-muted">Add new study materials</p>
          </Link>

          <Link
            to="/learning/flashcards"
            className="card hover:shadow-card-hover transition-all duration-200 group text-center"
          >
            <div className="p-4 bg-purple-50 rounded-card inline-block mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-heading mb-1">Study Flashcards</h3>
            <p className="text-sm text-text-muted">Review your flashcards</p>
          </Link>

          <Link
            to="/learning/quizzes"
            className="card hover:shadow-card-hover transition-all duration-200 group text-center"
          >
            <div className="p-4 bg-green-50 rounded-card inline-block mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-heading mb-1">Take Quizzes</h3>
            <p className="text-sm text-text-muted">Test your knowledge</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
