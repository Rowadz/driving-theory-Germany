import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  startQuiz,
  toggleQuizOption,
  submitAnswer,
  nextQuizQuestion,
  endQuiz,
} from '../features/quiz/quizSlice';
import { addQuizAttempt } from '../features/progress/progressSlice';
import { QuestionCard } from '../components/QuestionCard';
import { OptionButton } from '../components/OptionButton';
import { Feedback } from '../components/Feedback';
import type { QuizFilterType } from '../types';

const FILTER_OPTIONS: { id: QuizFilterType; label: string; icon: string }[] = [
  { id: 'all', label: 'All Questions', icon: '📚' },
  { id: 'with-images', label: 'With Pictures', icon: '🖼️' },
  { id: 'with-videos', label: 'With Videos', icon: '🎬' },
  { id: 'multi-answer', label: 'Multiple Answers', icon: '☑️' },
  { id: 'single-answer', label: 'Single Answer', icon: '✓' },
];

export function QuizMode() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { questions: allQuestions, loading } = useAppSelector(
    (state) => state.questions
  );
  const {
    isActive,
    questions: quizQuestions,
    currentIndex,
    answers,
    score,
    isAnswered,
    selectedOptions,
    isCompleted,
    category,
    filterType,
  } = useAppSelector((state) => state.quiz);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<QuizFilterType>('all');

  // Get unique themes
  const themes = useMemo(() => {
    const themeSet = new Set(allQuestions.map((q) => q.theme_name));
    return Array.from(themeSet).sort();
  }, [allQuestions]);

  // Count available questions for current selection
  const availableCount = useMemo(() => {
    let filtered = allQuestions;
    if (selectedCategory) {
      filtered = filtered.filter((q) => q.theme_name === selectedCategory);
    }
    switch (selectedFilter) {
      case 'with-images':
        filtered = filtered.filter((q) => q.image_urls.length > 0);
        break;
      case 'with-videos':
        filtered = filtered.filter((q) => q.video_urls.length > 0);
        break;
      case 'multi-answer':
        filtered = filtered.filter((q) => q.correct_answers.length > 1);
        break;
      case 'single-answer':
        filtered = filtered.filter((q) => q.correct_answers.length === 1);
        break;
    }
    return filtered.length;
  }, [allQuestions, selectedCategory, selectedFilter]);

  const handleStartQuiz = () => {
    dispatch(
      startQuiz({
        questions: allQuestions,
        category: selectedCategory,
        filterType: selectedFilter,
      })
    );
  };

  const handleSubmitAnswer = () => {
    dispatch(submitAnswer());
  };

  const handleNextQuestion = () => {
    if (currentIndex === quizQuestions.length - 1) {
      dispatch(
        addQuizAttempt({
          score,
          totalQuestions: quizQuestions.length,
          answers,
          questionIds: quizQuestions.map((q) => q.question_id),
          category,
          filterType,
        })
      );
    }
    dispatch(nextQuizQuestion());
  };

  const handleEndQuiz = () => {
    dispatch(endQuiz());
  };

  const handleViewResults = () => {
    navigate('/quiz/results');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Quiz completed screen
  if (isCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>

            <div
              className={`radial-progress text-5xl mx-auto mb-6 ${
                passed ? 'text-success' : 'text-error'
              }`}
              style={
                { '--value': percentage, '--size': '10rem', '--thickness': '0.8rem' } as React.CSSProperties
              }
              role="progressbar"
            >
              {percentage}%
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <div className="stat bg-base-200 rounded-box p-4">
                <div className="stat-title text-xs">Score</div>
                <div className="stat-value text-2xl">
                  {score}/{quizQuestions.length}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-box p-4">
                <div className="stat-title text-xs">Result</div>
                <div
                  className={`stat-value text-2xl ${passed ? 'text-success' : 'text-error'}`}
                >
                  {passed ? 'PASSED' : 'FAILED'}
                </div>
                <div className="stat-desc text-xs">70% to pass</div>
              </div>
            </div>

            {(category || filterType !== 'all') && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {category && (
                  <span className="badge badge-primary">{category}</span>
                )}
                {filterType !== 'all' && (
                  <span className="badge badge-secondary">
                    {FILTER_OPTIONS.find((f) => f.id === filterType)?.label}
                  </span>
                )}
              </div>
            )}

            <div className="card-actions justify-center gap-4">
              <button className="btn btn-primary" onClick={handleViewResults}>
                Review Answers
              </button>
              <button className="btn btn-outline" onClick={handleEndQuiz}>
                Back to Quiz Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz not started - show setup screen
  if (!isActive) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Quiz Mode</h1>
          <p className="text-base-content/70">
            Test your knowledge with 30 randomly selected questions
          </p>
        </div>

        {/* Quiz Info */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">30</div>
            <div className="text-sm text-base-content/60">Questions</div>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary">70%</div>
            <div className="text-sm text-base-content/60">Pass Mark</div>
          </div>
          <div className="divider divider-horizontal"></div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent">{availableCount}</div>
            <div className="text-sm text-base-content/60">Available</div>
          </div>
        </div>

        {/* Filter by Type */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg">Question Type</h2>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={`btn btn-sm ${
                    selectedFilter === option.id ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => setSelectedFilter(option.id)}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter by Category */}
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <h2 className="card-title text-lg">Topic (Optional)</h2>
            <div className="flex flex-wrap gap-2">
              <button
                className={`btn btn-sm ${
                  selectedCategory === null ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Topics
              </button>
              {themes.map((theme) => (
                <button
                  key={theme}
                  className={`btn btn-sm ${
                    selectedCategory === theme ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => setSelectedCategory(theme)}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          {availableCount < 30 && availableCount > 0 && (
            <div className="alert alert-warning mb-4 max-w-md mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>
                Only {availableCount} questions available. Quiz will have {availableCount} questions.
              </span>
            </div>
          )}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleStartQuiz}
            disabled={availableCount === 0}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Active quiz
  const currentQuestion = quizQuestions[currentIndex];
  const isMultipleChoice = currentQuestion.correct_answers.length > 1;

  const correctLetters = currentQuestion.correct_answers.map((a) => a.letter);
  const isCorrect =
    selectedOptions.length === correctLetters.length &&
    selectedOptions.every((opt) => correctLetters.includes(opt)) &&
    correctLetters.every((letter) => selectedOptions.includes(letter));

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Quiz</h1>
            {category && (
              <span className="badge badge-primary badge-sm">{category}</span>
            )}
            {filterType !== 'all' && (
              <span className="badge badge-secondary badge-sm">
                {FILTER_OPTIONS.find((f) => f.id === filterType)?.icon}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="badge badge-lg badge-outline">
              Score: {score}/{currentIndex + (isAnswered ? 1 : 0)}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleEndQuiz}>
              Exit
            </button>
          </div>
        </div>
        <progress
          className="progress progress-secondary w-full h-2"
          value={currentIndex + 1}
          max={quizQuestions.length}
        ></progress>
        <p className="text-sm text-base-content/60 mt-1 text-center">
          Question {currentIndex + 1} of {quizQuestions.length}
        </p>
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={quizQuestions.length}
        showTheme={false}
      />

      {isMultipleChoice && (
        <div role="alert" className="alert alert-info mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Multiple correct answers. Select all that apply.</span>
        </div>
      )}

      <div className="space-y-3 mt-6">
        {currentQuestion.options.map((option) => (
          <OptionButton
            key={option.letter}
            option={option}
            isSelected={selectedOptions.includes(option.letter)}
            isRevealed={isAnswered}
            correctAnswers={currentQuestion.correct_answers}
            onClick={() => dispatch(toggleQuizOption(option.letter))}
            disabled={isAnswered}
          />
        ))}
      </div>

      {isAnswered && (
        <Feedback
          isCorrect={isCorrect}
          explanation={currentQuestion.comment}
          correctAnswers={currentQuestion.correct_answers}
        />
      )}

      <div className="flex justify-end mt-8">
        {!isAnswered ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmitAnswer}
            disabled={selectedOptions.length === 0}
          >
            Submit Answer
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNextQuestion}>
            {currentIndex === quizQuestions.length - 1
              ? 'Finish Quiz'
              : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
