import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clearQuizHistory, deleteQuizAttempt } from '../features/progress/progressSlice';
import { startQuizWithQuestionIds } from '../features/quiz/quizSlice';
import type { QuizAttempt, QuizFilterType } from '../types';

const FILTER_LABELS: Record<QuizFilterType, string> = {
  all: 'All Questions',
  'with-images': 'With Pictures',
  'with-videos': 'With Videos',
  'multi-answer': 'Multiple Answers',
  'single-answer': 'Single Answer',
};

export function History() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { quizHistory } = useAppSelector((state) => state.progress);
  const { questions } = useAppSelector((state) => state.questions);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  const questionMap = new Map(questions.map((q) => [q.question_id, q]));

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all quiz history?')) {
      dispatch(clearQuizHistory());
      setSelectedAttempt(null);
    }
  };

  const handleDeleteAttempt = (id: string) => {
    if (window.confirm('Delete this quiz attempt?')) {
      dispatch(deleteQuizAttempt(id));
      if (selectedAttempt?.id === id) {
        setSelectedAttempt(null);
      }
    }
  };

  const handleRetake = (attempt: QuizAttempt) => {
    dispatch(
      startQuizWithQuestionIds({
        allQuestions: questions,
        questionIds: attempt.questionIds,
        category: attempt.category,
        filterType: attempt.filterType,
      })
    );
    navigate('/quiz');
  };

  const handleViewDetails = (attempt: QuizAttempt) => {
    setSelectedAttempt(selectedAttempt?.id === attempt.id ? null : attempt);
  };

  if (quizHistory.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h1 className="text-2xl font-bold mb-4">Quiz History</h1>
            <p className="text-base-content/70 mb-6">
              No quizzes taken yet. Complete a quiz to see your history here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalQuizzes = quizHistory.length;
  const averageScore = Math.round(
    quizHistory.reduce((sum, q) => sum + q.percentage, 0) / totalQuizzes
  );
  const bestScore = Math.max(...quizHistory.map((q) => q.percentage));
  const passedQuizzes = quizHistory.filter((q) => q.percentage >= 70).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quiz History</h1>
        <button
          className="btn btn-error btn-outline btn-sm"
          onClick={handleClearHistory}
        >
          Clear All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 rounded-box shadow p-4">
          <div className="stat-title text-xs">Total Quizzes</div>
          <div className="stat-value text-2xl">{totalQuizzes}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow p-4">
          <div className="stat-title text-xs">Average Score</div>
          <div className="stat-value text-2xl">{averageScore}%</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow p-4">
          <div className="stat-title text-xs">Best Score</div>
          <div className="stat-value text-2xl text-success">{bestScore}%</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow p-4">
          <div className="stat-title text-xs">Pass Rate</div>
          <div className="stat-value text-2xl">
            {Math.round((passedQuizzes / totalQuizzes) * 100)}%
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <div className="space-y-4">
        {quizHistory.map((attempt) => {
          const passed = attempt.percentage >= 70;
          const isExpanded = selectedAttempt?.id === attempt.id;

          return (
            <div key={attempt.id} className="card bg-base-100 shadow-lg">
              <div className="card-body p-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`badge ${passed ? 'badge-success' : 'badge-error'}`}
                      >
                        {attempt.percentage}%
                      </span>
                      <span className="font-semibold">
                        {attempt.score}/{attempt.totalQuestions}
                      </span>
                      {attempt.category && (
                        <span className="badge badge-primary badge-sm">
                          {attempt.category}
                        </span>
                      )}
                      {attempt.filterType && attempt.filterType !== 'all' && (
                        <span className="badge badge-secondary badge-sm">
                          {FILTER_LABELS[attempt.filterType]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-base-content/60">
                      {new Date(attempt.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleRetake(attempt)}
                    >
                      Retake
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleViewDetails(attempt)}
                    >
                      {isExpanded ? 'Hide' : 'Review'}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => handleDeleteAttempt(attempt.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expanded Review */}
                {isExpanded && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="font-semibold mb-4">Question Review</h3>
                    <div className="space-y-4">
                      {attempt.answers.map((answer, index) => {
                        const question = questionMap.get(answer.questionId);
                        if (!question) return null;

                        return (
                          <div
                            key={answer.questionId}
                            className={`p-4 rounded-lg border-l-4 ${
                              answer.isCorrect
                                ? 'border-success bg-success/5'
                                : 'border-error bg-error/5'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="badge badge-ghost badge-sm">
                                Q{index + 1}
                              </span>
                              <span
                                className={`badge badge-sm ${
                                  answer.isCorrect ? 'badge-success' : 'badge-error'
                                }`}
                              >
                                {answer.isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            </div>

                            <p className="font-medium mb-3">
                              {question.question_text}
                            </p>

                            {/* Video */}
                            {question.video_urls.length > 0 && (
                              <div className="mb-3">
                                {question.video_urls.map((url, vidIndex) => (
                                  <video
                                    key={vidIndex}
                                    controls
                                    loop
                                    playsInline
                                    className="w-full max-w-sm rounded-lg"
                                  >
                                    <source src={url} type="video/mp4" />
                                  </video>
                                ))}
                              </div>
                            )}

                            {/* Image */}
                            {question.image_urls.length > 0 && (
                              <div className="mb-3">
                                {question.image_urls.map((url, imgIndex) => (
                                  <img
                                    key={imgIndex}
                                    src={url}
                                    alt=""
                                    className="max-w-full max-h-32 rounded-lg object-contain"
                                  />
                                ))}
                              </div>
                            )}

                            {/* Options */}
                            <div className="space-y-1 text-sm">
                              {question.options.map((option) => {
                                const isCorrectAnswer = question.correct_answers.some(
                                  (a) => a.letter === option.letter
                                );
                                const wasSelected = answer.selectedOptions.includes(
                                  option.letter
                                );

                                let className = 'p-2 rounded ';
                                if (isCorrectAnswer) {
                                  className += 'bg-success/20 text-success';
                                } else if (wasSelected) {
                                  className += 'bg-error/20 text-error';
                                } else {
                                  className += 'bg-base-200';
                                }

                                return (
                                  <div key={option.letter} className={className}>
                                    <span className="font-bold mr-2">
                                      {option.letter}
                                    </span>
                                    {option.text}
                                    {wasSelected && (
                                      <span className="ml-2 text-xs opacity-70">
                                        (your answer)
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {question.comment && (
                              <div className="mt-3 p-3 bg-base-200 rounded-lg text-sm">
                                <span className="font-semibold">Explanation: </span>
                                {question.comment}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 text-center">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRetake(attempt)}
                      >
                        Retake This Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
