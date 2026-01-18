import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningAPI } from '../services/api';
import { Quiz, QuizQuestion } from '../types/learning';

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const fetchQuiz = async () => {
    if (!quizId) return;

    try {
      // Check if it's a demo quiz from sessionStorage
      const demoQuizData = sessionStorage.getItem(`demo-quiz-${quizId}`);
      if (demoQuizData) {
        const demoQuiz = JSON.parse(demoQuizData);
        setQuiz(demoQuiz);
        setLoading(false);
        return;
      }

      const data = await learningAPI.getQuiz(quizId);
      setQuiz(data.quiz);
      // If quiz already has a score, it's been submitted
      if (data.quiz.score !== undefined) {
        setSubmitted(true);
        setScore(data.quiz.score);
        // Set user answers if available
        const userAnswers: Record<string, number> = {};
        data.quiz.questions.forEach((q) => {
          if (q.userAnswer !== undefined) {
            userAnswers[q._id] = q.userAnswer;
          }
        });
        setAnswers(userAnswers);
      }
    } catch (error: any) {
      // Silently handle 404 (backend not available)
      if (error.response?.status !== 404) {
        console.error('Failed to fetch quiz:', error);
      }
      // If it's a demo quiz ID but not in sessionStorage, show error
      if (!quizId.startsWith('quiz-demo-')) {
        setQuiz(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;

    setSubmitting(true);
    try {
      // Check if it's a demo quiz
      if (quiz._id.startsWith('quiz-demo-')) {
        // Calculate demo score
        let correct = 0;
        quiz.questions.forEach((q) => {
          if (answers[q._id] === q.correctAnswer) {
            correct++;
          }
        });
        const demoScore = Math.round((correct / quiz.totalQuestions) * 100);
        setScore(demoScore);
        setSubmitted(true);
        // Update quiz with user answers
        const updatedQuiz = {
          ...quiz,
          score: demoScore,
          questions: quiz.questions.map((q) => ({
            ...q,
            userAnswer: answers[q._id],
          })),
        };
        setQuiz(updatedQuiz);
      } else {
        const data = await learningAPI.submitQuiz(quiz._id, answers);
        setQuiz(data.quiz);
        setScore(data.score);
        setSubmitted(true);
      }
    } catch (error: any) {
      // If backend is not available, calculate score locally
      if (error.response?.status === 404 || error.response?.status === 500) {
        let correct = 0;
        quiz.questions.forEach((q) => {
          if (answers[q._id] === q.correctAnswer) {
            correct++;
          }
        });
        const demoScore = Math.round((correct / quiz.totalQuestions) * 100);
        setScore(demoScore);
        setSubmitted(true);
      } else {
        console.error('Failed to submit quiz:', error);
        alert(error.response?.data?.message || 'Failed to submit quiz. Backend API not available - using demo mode.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getQuestionStatus = (question: QuizQuestion) => {
    if (!submitted) return null;
    const isCorrect = answers[question._id] === question.correctAnswer;
    return isCorrect ? 'correct' : 'incorrect';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-muted">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="card text-center max-w-md">
          <h2 className="text-2xl font-bold text-text-heading mb-4">Quiz Not Found</h2>
          <p className="text-text-body mb-6">The quiz you're looking for doesn't exist.</p>
          <Link to="/learning/quizzes" className="btn-primary">
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const allAnswered = quiz.questions.every((q) => answers[q._id] !== undefined);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-heading mb-2">{quiz.title}</h1>
              <p className="text-text-body">
                {quiz.totalQuestions} questions • {submitted ? 'Completed' : 'In Progress'}
              </p>
            </div>
            <Link to="/learning/quizzes" className="btn-secondary">
              ← Back to Quizzes
            </Link>
          </div>

          {submitted && score !== null && (
            <div className={`card mb-6 ${
              score >= 80 ? 'bg-green-50 border-green-200' :
              score >= 60 ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-heading mb-1">Quiz Results</h3>
                  <p className="text-text-body">
                    You scored <span className={`font-bold text-lg ${
                      score >= 80 ? 'text-green-600' :
                      score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{score}%</span>
                  </p>
                </div>
                <div className="text-4xl">
                  {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
                </div>
              </div>
            </div>
          )}

          {!submitted && (
            <div className="card bg-blue-50 border border-blue-200 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-text-body">
                  Progress: {answeredCount} / {quiz.totalQuestions} questions answered
                </p>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(answeredCount / quiz.totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const status = getQuestionStatus(question);
            const userAnswer = answers[question._id];

            return (
              <div
                key={question._id}
                className={`card ${
                  submitted
                    ? status === 'correct'
                      ? 'bg-green-50 border-green-200'
                      : status === 'incorrect'
                      ? 'bg-red-50 border-red-200'
                      : ''
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-heading">
                    Question {index + 1}
                  </h3>
                  {submitted && status && (
                    <span className={`px-3 py-1 rounded-button text-sm font-medium ${
                      status === 'correct'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {status === 'correct' ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  )}
                </div>

                <p className="text-text-body mb-4 font-medium">{question.question}</p>

                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = userAnswer === optionIndex;
                    const isCorrect = optionIndex === question.correctAnswer;
                    const showCorrect = submitted && isCorrect;
                    const showIncorrect = submitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(question._id, optionIndex)}
                        disabled={submitted}
                        className={`w-full text-left px-4 py-3 rounded-button border-2 transition-all ${
                          submitted
                            ? showCorrect
                              ? 'border-green-500 bg-green-100 text-green-800'
                              : showIncorrect
                              ? 'border-red-500 bg-red-100 text-red-800'
                              : isSelected
                              ? 'border-gray-400 bg-gray-100'
                              : 'border-gray-200 bg-white'
                            : isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                          {showCorrect && <span className="text-green-600 font-bold">✓</span>}
                          {showIncorrect && <span className="text-red-600 font-bold">✗</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {submitted && question.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-button">
                    <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                    <p className="text-sm text-blue-700">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : allAnswered ? 'Submit Quiz' : `Answer ${quiz.totalQuestions - answeredCount} more question(s)`}
            </button>
          </div>
        )}

        {submitted && (
          <div className="mt-8 text-center">
            <Link to="/learning/quizzes" className="btn-primary">
              Back to Quizzes
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
