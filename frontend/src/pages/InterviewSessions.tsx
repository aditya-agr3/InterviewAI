import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { SessionSummary } from '../types';
import SessionCard from '../components/SessionCard';
import DailyQuestionCard from '../components/DailyQuestionCard';
import TopicCard from '../components/TopicCard';
import { dummySessions } from '../utils/dummyData';

const InterviewSessions = () => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const sessionsData = await sessionAPI.getSessions();
      // Use dummy data if API returns empty or fails
      setSessions(sessionsData.sessions.length > 0 ? sessionsData.sessions : dummySessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      // Fallback to dummy data on error
      setSessions(dummySessions);
    } finally {
      setLoading(false);
    }
  };

  // Core topics data
  const coreTopics = [
    {
      title: 'JavaScript',
      description: 'Master ES6+, async/await, closures, and more',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.26 10.2,18.26C9.62,18.26 9.38,17.9 9.11,17.5L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z" />
        </svg>
      ),
      color: 'yellow' as 'yellow',
    },
    {
      title: 'React',
      description: 'Hooks, state management, and component patterns',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.23,12.004a2.236,2.236,0,0,0,1.885-1.05,2.236,2.236,0,0,0,0-2.206,2.236,2.236,0,0,0-1.885-1.05,2.236,2.236,0,0,0-1.885,1.05,2.236,2.236,0,0,0,0,2.206A2.236,2.236,0,0,0,14.23,12.004Zm-8.46-1.05a2.236,2.236,0,0,0-1.885,1.05,2.236,2.236,0,0,0,0,2.206,2.236,2.236,0,0,0,1.885,1.05,2.236,2.236,0,0,0,1.885-1.05,2.236,2.236,0,0,0,0-2.206A2.236,2.236,0,0,0,5.77,10.954Zm11.54,0a2.236,2.236,0,0,0-1.885,1.05,2.236,2.236,0,0,0,0,2.206,2.236,2.236,0,0,0,1.885,1.05,2.236,2.236,0,0,0,1.885-1.05,2.236,2.236,0,0,0,0-2.206A2.236,2.236,0,0,0,17.31,10.954ZM12,5.954a2.236,2.236,0,0,0-1.885,1.05,2.236,2.236,0,0,0,0,2.206,2.236,2.236,0,0,0,1.885,1.05,2.236,2.236,0,0,0,1.885-1.05,2.236,2.236,0,0,0,0-2.206A2.236,2.236,0,0,0,12,5.954ZM12,18.054a2.236,2.236,0,0,0-1.885,1.05,2.236,2.236,0,0,0,0,2.206,2.236,2.236,0,0,0,1.885,1.05,2.236,2.236,0,0,0,1.885-1.05,2.236,2.236,0,0,0,0-2.206A2.236,2.236,0,0,0,12,18.054Z" />
        </svg>
      ),
      color: 'blue' as const,
    },
    {
      title: 'Node.js',
      description: 'Backend development, APIs, and server architecture',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392c1.307,0.654,2.108-0.116,2.108-0.89V7.037c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v11.331c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.570,0.329,0.924,0.944,0.924,1.603v10.15c0,0.659-0.354,1.265-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24zM19.099,13.993c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233c1.807,0,2.473,0.389,2.747,0.142c0.273-0.245,0.273-0.245,0.273-0.566c0-0.321-0.046-0.567-0.273-0.812c-0.273-0.245-0.939-0.567-2.747-0.567c-2.258,0-3.893,0.948-3.893,2.764c0,1.852,1.331,2.402,4.07,2.75c2.771,0.355,3.009,0.596,3.009,1.233c0,0.646-0.392,1.234-2.365,1.234c-2.024,0-2.88-0.389-3.131-0.646c-0.252-0.252-0.252-0.252-0.252-0.567c0-0.314,0.138-0.53,0.252-0.688c0.252-0.314,1.107-0.646,3.131-0.646C17.815,11.1,19.099,11.646,19.099,13.993z" />
        </svg>
      ),
      color: 'green' as const,
    },
    {
      title: 'System Design',
      description: 'Architecture patterns, scalability, and best practices',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      color: 'purple' as const,
    },
  ];

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
                <Link to="/interview-sessions" className="text-primary font-medium">
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-heading mb-2">Interview Practice</h1>
          <p className="text-text-body">
            Practice with AI-generated questions tailored to your role and experience level.
          </p>
        </div>

        {/* Daily AI Question */}
        <div className="mb-8">
          <DailyQuestionCard />
        </div>

        {/* Core Topics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-heading">Core Topics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreTopics.map((topic, idx) => (
              <TopicCard
                key={idx}
                title={topic.title}
                description={topic.description}
                icon={topic.icon}
                color={topic.color}
              />
            ))}
          </div>
        </div>

        {/* Interview Sessions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text-heading">My Interview Sessions</h3>
            <Link to="/create-session" className="btn-primary">
              + Create New Session
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-text-muted">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="card text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-text-heading mb-2">No interview sessions yet</h4>
                <p className="text-text-body mb-6">
                  Create your first interview session to start practicing with AI-generated questions tailored to your role and experience level.
                </p>
                <Link to="/create-session" className="btn-primary inline-block">
                  Create Your First Session
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <SessionCard key={session._id} session={session} questionCount={2} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewSessions;
