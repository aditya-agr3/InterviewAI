import { useState } from 'react';
import { learningAPI } from '../../services/api';

interface ConceptExplainerProps {
  documentId: string;
}

const ConceptExplainer = ({ documentId }: ConceptExplainerProps) => {
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || loading) return;

    setLoading(true);
    setError('');
    setExplanation('');

    try {
      const data = await learningAPI.explainConcept(documentId, concept.trim());
      setExplanation(data.explanation);
    } catch (err: any) {
      // If backend is not available, provide a demo explanation
      if (err.response?.status === 404 || err.response?.status === 500) {
        setExplanation(`This is a demo explanation for "${concept}". In demo mode, the AI concept explainer is not available as the backend API is not connected. Once the backend is set up with Google Gemini integration, this will provide detailed explanations of concepts from your documents based on the actual content.`);
      } else {
        console.error('Failed to explain concept:', err);
        setError(err.response?.data?.message || 'Failed to explain concept. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-heading mb-2">Concept Explainer</h2>
        <p className="text-text-body">
          Get detailed explanations of specific topics or concepts from your document
        </p>
      </div>

      <form onSubmit={handleExplain} className="mb-6">
        <div className="card p-6">
          <label htmlFor="concept" className="block text-sm font-medium text-text-heading mb-2">
            What concept would you like explained?
          </label>
          <div className="flex gap-2">
            <input
              id="concept"
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g., React hooks, async/await, machine learning..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!concept.trim() || loading}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Explain'
              )}
            </button>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Enter a topic, term, or concept from your document
          </p>
        </div>
      </form>

      {loading && (
        <div className="card text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-body">Analyzing document and generating explanation...</p>
          <p className="text-sm text-text-muted mt-2">This may take a few moments</p>
        </div>
      )}

      {error && (
        <div className="card bg-red-50 border border-red-200 p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {explanation && (
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-heading">
              Explanation: {concept}
            </h3>
            <button
              onClick={() => {
                setConcept('');
                setExplanation('');
                setError('');
              }}
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              Clear
            </button>
          </div>
          <div className="prose max-w-none">
            <p className="text-text-body leading-relaxed whitespace-pre-wrap">{explanation}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-purple-200">
            <button
              onClick={() => navigator.clipboard.writeText(explanation)}
              className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy to clipboard
            </button>
          </div>
        </div>
      )}

      {!explanation && !loading && !error && (
        <div className="card text-center py-12 bg-gray-50">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-text-body">
            Enter a concept above to get a detailed explanation
          </p>
        </div>
      )}
    </div>
  );
};

export default ConceptExplainer;
