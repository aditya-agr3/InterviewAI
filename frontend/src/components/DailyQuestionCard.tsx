import { useState } from 'react';

interface DailyQuestionCardProps {
  question?: string;
  answer?: string;
  onExplain?: () => void;
}

const DailyQuestionCard: React.FC<DailyQuestionCardProps> = ({ 
  question, 
  answer,
  onExplain 
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  // Mock data if not provided
  const mockQuestion = question || "What is the difference between let, const, and var in JavaScript?";
  const mockAnswer = answer || "The main differences are: let and const are block-scoped, while var is function-scoped. const cannot be reassigned, while let and var can be. let and const are not hoisted in the same way as var.";

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-secondary to-primary rounded-card">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-heading mb-1">
            Daily AI Question
          </h3>
          <p className="text-sm text-text-muted">
            Practice with today's featured question
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-text-body font-medium mb-3">
          {mockQuestion}
        </p>
        
        {showAnswer && (
          <div className="mt-3 p-3 bg-white/60 rounded-button border border-purple-200">
            <p className="text-sm text-text-body leading-relaxed">
              {mockAnswer}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex-1 btn-primary text-sm py-2"
        >
          {showAnswer ? 'Hide Answer' : 'View Answer'}
        </button>
        {onExplain && (
          <button
            onClick={onExplain}
            className="px-4 py-2 bg-white border border-purple-300 text-secondary hover:bg-purple-50 rounded-button text-sm font-medium transition-colors"
          >
            Explain with AI
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyQuestionCard;
