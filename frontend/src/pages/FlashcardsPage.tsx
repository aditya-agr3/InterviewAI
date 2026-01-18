import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { learningAPI } from '../services/api';
import { Flashcard, Document } from '../types/learning';
import FlashcardComponent from '../components/learning/FlashcardComponent';
import { dummyFlashcards, dummyDocuments } from '../utils/dummyData';

const FlashcardsPage = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('documentId');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>(documentId || 'all');

  useEffect(() => {
    fetchData();
  }, [selectedDocument]);

  const fetchData = async () => {
    try {
      const [flashcardsData, documentsData] = await Promise.all([
        learningAPI.getFlashcards(selectedDocument === 'all' ? undefined : selectedDocument).catch((err: any) => {
          if (err.response?.status !== 404) {
            console.error('Failed to fetch flashcards:', err);
          }
          return { flashcards: [] };
        }),
        learningAPI.getDocuments().catch((err: any) => {
          if (err.response?.status !== 404) {
            console.error('Failed to fetch documents:', err);
          }
          return { documents: [] };
        }),
      ]);
      setFlashcards(flashcardsData.flashcards.length > 0 ? flashcardsData.flashcards : dummyFlashcards);
      setDocuments(documentsData.documents.length > 0 ? documentsData.documents : dummyDocuments);
    } catch (error) {
      // Final fallback
      setFlashcards(dummyFlashcards);
      setDocuments(dummyDocuments);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedDocument || selectedDocument === 'all') {
      alert('Please select a document first');
      return;
    }

    setGenerating(true);
    try {
      const data = await learningAPI.generateFlashcards(selectedDocument);
      setFlashcards([...flashcards, ...data.flashcards]);
      setCurrentIndex(0);
    } catch (error: any) {
      // If backend is not available, add dummy flashcards
      if (error.response?.status === 404 || error.response?.status === 500) {
        const newFlashcards: Flashcard[] = [
          {
            _id: `fc-${Date.now()}`,
            documentId: selectedDocument,
            front: 'What is React?',
            back: 'React is a JavaScript library for building user interfaces, particularly web applications. It allows developers to create reusable UI components.',
            isFavorite: false,
            createdAt: new Date().toISOString(),
          },
          {
            _id: `fc-${Date.now()}-2`,
            documentId: selectedDocument,
            front: 'What are React Components?',
            back: 'React components are independent, reusable pieces of UI. They can be functional (using hooks) or class-based, and can accept props to customize their behavior.',
            isFavorite: false,
            createdAt: new Date().toISOString(),
          },
        ];
        setFlashcards([...flashcards, ...newFlashcards]);
        setCurrentIndex(0);
      } else {
        console.error('Failed to generate flashcards:', error);
        alert(error.response?.data?.message || 'Failed to generate flashcards. Backend API not available - using demo mode.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleFavorite = async (flashcardId: string) => {
    try {
      const data = await learningAPI.toggleFlashcardFavorite(flashcardId);
      setFlashcards(
        flashcards.map((fc) => (fc._id === flashcardId ? data.flashcard : fc))
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDelete = async (flashcardId: string) => {
    if (!window.confirm('Are you sure you want to delete this flashcard?')) {
      return;
    }

    try {
      await learningAPI.deleteFlashcard(flashcardId);
      setFlashcards(flashcards.filter((fc) => fc._id !== flashcardId));
      if (currentIndex >= flashcards.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
      alert('Failed to delete flashcard');
    }
  };

  const filteredFlashcards = showFavoritesOnly
    ? flashcards.filter((fc) => fc.isFavorite)
    : flashcards;

  const currentFlashcard = filteredFlashcards[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-muted">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-heading mb-2">Flashcards</h1>
              <p className="text-text-body">
                Study with AI-generated flashcards from your documents
              </p>
            </div>
            <Link to="/learning" className="btn-secondary">
              ← Back to Learning
            </Link>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-heading">Document:</label>
              <select
                value={selectedDocument}
                onChange={(e) => {
                  setSelectedDocument(e.target.value);
                  setCurrentIndex(0);
                }}
                className="px-3 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Documents</option>
                {documents.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.originalName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-2 rounded-button text-sm font-medium transition-colors ${
                showFavoritesOnly
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-gray-100 text-text-body border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {showFavoritesOnly ? '⭐ Favorites Only' : '⭐ Show All'}
            </button>

            {selectedDocument && selectedDocument !== 'all' && (
              <button
                onClick={handleGenerateFlashcards}
                disabled={generating}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {generating ? 'Generating...' : '+ Generate Flashcards'}
              </button>
            )}
          </div>
        </div>

        {/* Flashcards Display */}
        {filteredFlashcards.length === 0 ? (
          <div className="card text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-text-heading mb-2">
                {showFavoritesOnly ? 'No favorite flashcards' : 'No flashcards yet'}
              </h4>
              <p className="text-text-body mb-6">
                {showFavoritesOnly
                  ? 'Mark flashcards as favorites to see them here'
                  : selectedDocument && selectedDocument !== 'all'
                  ? 'Generate flashcards from your document to get started'
                  : 'Select a document and generate flashcards to get started'}
              </p>
              {selectedDocument && selectedDocument !== 'all' && !showFavoritesOnly && (
                <button onClick={handleGenerateFlashcards} className="btn-primary">
                  Generate Flashcards
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>
                Card {currentIndex + 1} of {filteredFlashcards.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="px-3 py-1 border border-gray-300 rounded-button disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.min(filteredFlashcards.length - 1, currentIndex + 1))}
                  disabled={currentIndex === filteredFlashcards.length - 1}
                  className="px-3 py-1 border border-gray-300 rounded-button disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Flashcard */}
            <div className="flex justify-center">
              <FlashcardComponent
                flashcard={currentFlashcard}
                onToggleFavorite={() => handleToggleFavorite(currentFlashcard._id)}
                onDelete={() => handleDelete(currentFlashcard._id)}
              />
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 flex-wrap">
              {filteredFlashcards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FlashcardsPage;
