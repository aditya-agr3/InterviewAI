import { useState } from 'react';
import { learningAPI } from '../../services/api';

interface DocumentSummaryProps {
  documentId: string;
  documentName: string;
}

const DocumentSummary = ({ documentId, documentName }: DocumentSummaryProps) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const data = await learningAPI.generateSummary(documentId);
      setSummary(data.summary);
    } catch (err: any) {
      // If backend is not available, provide a demo summary
      if (err.response?.status === 404 || err.response?.status === 500) {
        setSummary(`This is a demo summary for "${documentName}". In demo mode, the AI summary feature is not available as the backend API is not connected. Once the backend is set up with Google Gemini integration, this will generate real AI-powered summaries of your documents.`);
      } else {
        console.error('Failed to generate summary:', err);
        setError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-heading mb-2">Document Summary</h2>
        <p className="text-text-body">
          Generate a concise AI-powered summary of "{documentName}"
        </p>
      </div>

      {!summary && !loading && (
        <div className="card text-center py-12">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-heading mb-2">
            Ready to generate summary
          </h3>
          <p className="text-text-body mb-6">
            Click the button below to generate an AI-powered summary of your document
          </p>
          <button onClick={handleGenerateSummary} className="btn-primary">
            Generate Summary
          </button>
        </div>
      )}

      {loading && (
        <div className="card text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-body">Analyzing document and generating summary...</p>
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
              <button
                onClick={handleGenerateSummary}
                className="mt-4 text-sm text-red-800 hover:text-red-900 font-medium underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {summary && (
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-heading">Summary</h3>
            <button
              onClick={handleGenerateSummary}
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              Regenerate
            </button>
          </div>
          <div className="prose max-w-none">
            <p className="text-text-body leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-blue-200">
            <button
              onClick={() => navigator.clipboard.writeText(summary)}
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
    </div>
  );
};

export default DocumentSummary;
