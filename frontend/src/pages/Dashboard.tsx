import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import EngagementWidget from '../components/EngagementWidget';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<{ sessions: any[] }>({ sessions: [] });
  const [pinnedCount, setPinnedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsData, pinnedData] = await Promise.all([
        sessionAPI.getSessions(),
        sessionAPI.getPinnedQuestions().catch(() => ({ pinnedQuestions: [] }))
      ]);
      
      setSessions(sessionsData);
      setPinnedCount(pinnedData.pinnedQuestions?.length || 0);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats (with dummy data fallback)
  const totalSessions = sessions.sessions?.length || 5;
  const totalQuestions = totalSessions * 2; // 2 questions per session
  const readinessScore = totalSessions > 0 ? Math.min(100, Math.round((totalSessions * 20) + (pinnedCount * 5))) : 82;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-bg-card shadow-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                InterviewAI
              </h1>
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/dashboard" className="text-primary font-medium">
                  Dashboard
                </Link>
                <Link to="/interview-sessions" className="text-text-body hover:text-text-heading transition-colors">
                  Interview Practice
                </Link>
                <Link to="/resumes" className="text-text-body hover:text-text-heading transition-colors">
                  Resume Builder
                </Link>
                <Link to="/learning" className="text-text-body hover:text-text-heading transition-colors">
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
        {/* Welcome Header */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-card border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-secondary to-primary rounded-card">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-heading mb-1">
                {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
              </h2>
              <p className="text-text-body">
                Ready to ace your next interview? Let's practice with AI-powered questions.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Interview Sessions"
            value={totalSessions}
            icon={
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            trend={totalSessions > 0 ? `${totalSessions} active` : 'Start practicing'}
          />
          <StatsCard
            title="Questions Practiced"
            value={totalQuestions}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={totalQuestions > 0 ? 'Keep going!' : 'No questions yet'}
          />
          <StatsCard
            title="Pinned Questions"
            value={pinnedCount}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            }
            trend={pinnedCount > 0 ? 'Saved for review' : 'Pin important Qs'}
          />
          <StatsCard
            title="Readiness Score"
            value={`${readinessScore}%`}
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
            trend={readinessScore >= 80 ? 'Excellent!' : readinessScore >= 50 ? 'Good progress' : 'Keep practicing'}
            trendUp={readinessScore >= 50}
          />
        </div>

        {/* Engagement Widget */}
        <div className="mb-8">
          <EngagementWidget 
            streak={5}
            dailyGoal={{ completed: 3, total: 5 }}
          />
        </div>

        {/* Quick Access to Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Interview Practice Card */}
          <Link to="/interview-sessions" className="card bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-100 hover:shadow-card-hover transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-secondary to-primary rounded-card group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-heading mb-1 group-hover:text-primary transition-colors">
                  Interview Practice
                </h3>
                <p className="text-text-body text-sm mb-3">
                  Practice with AI-generated questions, explore core topics, and manage your interview sessions
                </p>
                <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                  Start Practicing
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Resume Builder Card */}
          <Link to="/resumes" className="card bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-card-hover transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-card group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-heading mb-1 group-hover:text-primary transition-colors">
                  Resume Builder
                </h3>
                <p className="text-text-body text-sm mb-3">
                  Create professional resumes with templates and download as PDF
                </p>
                <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                  Build Resume
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Learning Assistant Card */}
          <Link to="/learning" className="card bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-card-hover transition-all duration-200 group">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-card group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-heading mb-1 group-hover:text-primary transition-colors">
                  Learning Assistant
                </h3>
                <p className="text-text-body text-sm mb-3">
                  Upload PDFs, chat with AI, generate flashcards, and take quizzes
                </p>
                <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                  Start Learning
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
