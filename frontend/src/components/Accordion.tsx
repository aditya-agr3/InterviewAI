import { useState } from 'react';
import { Question } from '../types';

interface AccordionProps {
  question: Question;
  onExplain: (questionId: string) => void;
  onTogglePin: (questionId: string) => void;
  onUpdateNotes: (questionId: string, notes: string) => void;
  explanation?: string;
  loadingExplanation?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  question,
  onExplain,
  onTogglePin,
  onUpdateNotes,
  explanation,
  loadingExplanation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(question.notes || '');
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await onUpdateNotes(question._id, notes);
    setSavingNotes(false);
    setShowNotesInput(false);
  };

  return (
    <div className="card mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-left flex items-center justify-between"
          >
            <h3 className="text-lg font-semibold text-text-heading pr-4">
              {question.question}
            </h3>
            <span className="text-text-muted text-2xl">
              {isOpen ? '−' : '+'}
            </span>
          </button>
        </div>
        <button
          onClick={() => onTogglePin(question._id)}
          className={`ml-4 p-2 rounded-button transition-colors ${
            question.isPinned
              ? 'text-yellow-500 hover:text-yellow-600'
              : 'text-text-muted hover:text-text-heading'
          }`}
          title={question.isPinned ? 'Unpin' : 'Pin'}
        >
          <svg
            className="w-5 h-5"
            fill={question.isPinned ? 'currentColor' : 'none'}
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
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="prose max-w-none">
            <div className="text-text-body whitespace-pre-wrap mb-4">
              {question.answer}
            </div>
          </div>

          {explanation && (
            <div className="mt-4 p-4 bg-purple-50 rounded-button border border-purple-200">
              <h4 className="font-semibold text-secondary mb-2">AI Explanation</h4>
              <p className="text-text-body text-sm whitespace-pre-wrap">{explanation}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => onExplain(question._id)}
              disabled={loadingExplanation}
              className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50"
            >
              {loadingExplanation ? 'Generating...' : 'Explain with AI'}
            </button>
            <button
              onClick={() => setShowNotesInput(!showNotesInput)}
              className="btn-secondary text-sm py-1.5 px-3"
            >
              {showNotesInput ? 'Cancel' : 'Add Notes'}
            </button>
          </div>

          {showNotesInput && (
            <div className="mt-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your personal notes here..."
                className="input-field min-h-[100px] resize-none"
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="btn-primary mt-2 text-sm py-1.5 px-3 disabled:opacity-50"
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          )}

          {question.notes && !showNotesInput && (
            <div className="mt-4 p-3 bg-gray-50 rounded-button">
              <h4 className="font-semibold text-text-heading mb-1 text-sm">Your Notes</h4>
              <p className="text-text-body text-sm whitespace-pre-wrap">{question.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Accordion;
