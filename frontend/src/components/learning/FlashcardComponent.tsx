import { useState } from 'react';
import { Flashcard } from '../../types/learning';

interface FlashcardComponentProps {
  flashcard: Flashcard;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

const FlashcardComponent = ({ flashcard, onToggleFavorite, onDelete }: FlashcardComponentProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative w-full max-w-2xl h-96 perspective-1000">
      <div
        className={`relative w-full h-full preserve-3d transition-transform duration-600 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
        style={{
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
        }}
      >
        {/* Front Side */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-card ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <div className="card h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-blue-600">Question</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                  }}
                  className={`p-2 rounded-button transition-colors ${
                    flashcard.isFavorite
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill={flashcard.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this flashcard?')) {
                      onDelete();
                    }
                  }}
                  className="p-2 text-red-400 hover:text-red-600 rounded-button transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl font-medium text-text-heading text-center px-6">
                {flashcard.front}
              </p>
            </div>
            <div className="text-center text-sm text-text-muted mt-4">
              Click to flip
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-card rotate-y-180 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="card h-full bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-purple-600">Answer</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                  }}
                  className={`p-2 rounded-button transition-colors ${
                    flashcard.isFavorite
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill={flashcard.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this flashcard?')) {
                      onDelete();
                    }
                  }}
                  className="p-2 text-red-400 hover:text-red-600 rounded-button transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl font-medium text-text-heading text-center px-6">
                {flashcard.back}
              </p>
            </div>
            <div className="text-center text-sm text-text-muted mt-4">
              Click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardComponent;
