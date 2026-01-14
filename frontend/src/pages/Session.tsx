import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { InterviewSession } from '../types';
import Accordion from '../components/Accordion';
import Modal from '../components/Modal';

const Session = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingExplanations, setLoadingExplanations] = useState<Record<string, boolean>>({});
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState('');

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      if (!sessionId) return;
      const { session } = await sessionAPI.getSession(sessionId);
      setSession(session);
    } catch (error) {
      console.error('Failed to fetch session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async (questionId: string) => {
    if (!sessionId) return;

    setLoadingExplanations({ ...loadingExplanations, [questionId]: true });

    try {
      const { explanation } = await sessionAPI.generateExplanation(sessionId, questionId);
      setExplanations({ ...explanations, [questionId]: explanation });
      setCurrentExplanation(explanation);
      setShowExplanationModal(true);
      
      // Update session with explanation
      if (session) {
        const updatedQuestions = session.questions.map((q) =>
          q._id === questionId ? { ...q, aiExplanation: explanation } : q
        );
        setSession({ ...session, questions: updatedQuestions });
      }
    } catch (error) {
      console.error('Failed to generate explanation:', error);
    } finally {
      setLoadingExplanations({ ...loadingExplanations, [questionId]: false });
    }
  };

  const handleTogglePin = async (questionId: string) => {
    if (!sessionId) return;

    try {
      await sessionAPI.togglePin(sessionId, questionId);
      await fetchSession(); // Refresh session
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const handleUpdateNotes = async (questionId: string, notes: string) => {
    if (!sessionId) return;

    try {
      await sessionAPI.updateNotes(sessionId, questionId, notes);
      await fetchSession(); // Refresh session
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-muted">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="card text-center">
          <p className="text-text-body mb-4">Session not found</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-bg-card shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/dashboard" className="text-text-muted hover:text-text-heading mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-text-heading">{session.jobRole}</h1>
              <p className="text-text-muted text-sm">
                {session.experienceLevel} • {session.techStack.join(', ')}
              </p>
            </div>
            <Link to="/pinned" className="btn-secondary">
              View Pinned
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-text-heading mb-2">
            Interview Questions ({session.questions.length})
          </h2>
          <p className="text-text-body">
            Click on any question to expand and view the answer, add notes, or get AI explanations.
          </p>
        </div>

        {session.questions.map((question) => (
          <Accordion
            key={question._id}
            question={question}
            onExplain={handleExplain}
            onTogglePin={handleTogglePin}
            onUpdateNotes={handleUpdateNotes}
            explanation={explanations[question._id] || question.aiExplanation}
            loadingExplanation={loadingExplanations[question._id]}
          />
        ))}
      </main>

      <Modal
        isOpen={showExplanationModal}
        onClose={() => setShowExplanationModal(false)}
        title="AI Explanation"
      >
        <div className="prose max-w-none">
          <p className="text-text-body whitespace-pre-wrap">{currentExplanation}</p>
        </div>
      </Modal>
    </div>
  );
};

export default Session;
