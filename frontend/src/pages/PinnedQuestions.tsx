import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { PinnedQuestion } from '../types';
import Accordion from '../components/Accordion';

const PinnedQuestions = () => {
  const [pinnedQuestions, setPinnedQuestions] = useState<PinnedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingExplanations, setLoadingExplanations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPinnedQuestions();
  }, []);

  const fetchPinnedQuestions = async () => {
    try {
      const { pinnedQuestions } = await sessionAPI.getPinnedQuestions();
      setPinnedQuestions(pinnedQuestions);
    } catch (error) {
      console.error('Failed to fetch pinned questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async (questionId: string, sessionId: string) => {
    setLoadingExplanations({ ...loadingExplanations, [questionId]: true });

    try {
      const { explanation } = await sessionAPI.generateExplanation(sessionId, questionId);
      setExplanations({ ...explanations, [questionId]: explanation });
    } catch (error) {
      console.error('Failed to generate explanation:', error);
    } finally {
      setLoadingExplanations({ ...loadingExplanations, [questionId]: false });
    }
  };

  const handleTogglePin = async (questionId: string, sessionId: string) => {
    try {
      await sessionAPI.togglePin(sessionId, questionId);
      await fetchPinnedQuestions(); // Refresh pinned questions
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const handleUpdateNotes = async (questionId: string, sessionId: string, notes: string) => {
    try {
      await sessionAPI.updateNotes(sessionId, questionId, notes);
      await fetchPinnedQuestions(); // Refresh pinned questions
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

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
              <h1 className="text-2xl font-bold text-text-heading">Pinned Questions</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-text-muted">Loading pinned questions...</div>
        ) : pinnedQuestions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-text-body mb-4">No pinned questions yet.</p>
            <Link to="/dashboard" className="btn-primary inline-block">
              Browse Sessions
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-text-body">
                You have {pinnedQuestions.length} pinned question{pinnedQuestions.length !== 1 ? 's' : ''}.
              </p>
            </div>

            {pinnedQuestions.map((question) => (
              <div key={`${question.sessionId}-${question._id}`} className="mb-4">
                <div className="mb-2 text-sm text-text-muted">
                  From: <Link to={`/session/${question.sessionId}`} className="text-primary hover:underline">
                    {question.sessionJobRole} ({question.sessionExperienceLevel})
                  </Link>
                </div>
                <Accordion
                  question={question}
                  onExplain={(qId) => handleExplain(qId, question.sessionId)}
                  onTogglePin={(qId) => handleTogglePin(qId, question.sessionId)}
                  onUpdateNotes={(qId, notes) => handleUpdateNotes(qId, question.sessionId, notes)}
                  explanation={explanations[question._id] || question.aiExplanation}
                  loadingExplanation={loadingExplanations[question._id]}
                />
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default PinnedQuestions;
