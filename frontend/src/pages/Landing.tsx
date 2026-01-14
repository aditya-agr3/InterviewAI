import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Testimonials from '../components/Testimonials';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-bg-card shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              InterviewAI
            </h1>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-text-heading mb-6">
            Ace Your Next Interview with
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              {' '}AI-Powered Preparation
            </span>
          </h2>
          <p className="text-xl text-text-body max-w-2xl mx-auto mb-8">
            Practice with personalized interview questions, get AI-generated answers,
            and master your technical skills.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
              Start Preparing Now
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-heading mb-2">
              AI-Generated Questions
            </h3>
            <p className="text-text-body">
              Get personalized interview questions based on your role, experience level,
              and tech stack.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-heading mb-2">
              Expert Answers
            </h3>
            <p className="text-text-body">
              Receive comprehensive, well-structured answers with code examples
              and detailed explanations.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-heading mb-2">
              Organize & Learn
            </h3>
            <p className="text-text-body">
              Pin important questions, add personal notes, and get AI-powered
              simplified explanations.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="card bg-gradient-to-r from-secondary to-primary text-white max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of developers who are landing their dream jobs with InterviewAI
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="bg-white text-primary font-semibold px-8 py-3 rounded-button hover:opacity-90 transition-opacity inline-block">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
