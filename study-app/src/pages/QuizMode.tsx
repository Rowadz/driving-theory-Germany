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
  } = useAppSelector((state) => state.quiz);

  const handleStartQuiz = () => {
    dispatch(startQuiz(allQuestions));
  };

  const handleSubmitAnswer = () => {
    dispatch(submitAnswer());
  };

  const handleNextQuestion = () => {
    if (currentIndex === quizQuestions.length - 1) {
      // Quiz completed - save results
      dispatch(
        addQuizAttempt({
          score: score + (isAnswered && answers[answers.length - 1]?.isCorrect ? 0 : 0),
          totalQuestions: quizQuestions.length,
          answers: answers,
          questionIds: quizQuestions.map((q) => q.question_id),
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
              className={`radial-progress text-6xl mx-auto mb-6 ${
                passed ? 'text-success' : 'text-error'
              }`}
              style={
                { '--value': percentage, '--size': '12rem' } as React.CSSProperties
              }
              role="progressbar"
            >
              {percentage}%
            </div>

            <div className="stats shadow mb-6">
              <div className="stat">
                <div className="stat-title">Score</div>
                <div className="stat-value">
                  {score}/{quizQuestions.length}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Result</div>
                <div
                  className={`stat-value ${passed ? 'text-success' : 'text-error'}`}
                >
                  {passed ? 'PASSED' : 'FAILED'}
                </div>
                <div className="stat-desc">70% required to pass</div>
              </div>
            </div>

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

  // Quiz not started
  if (!isActive) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h1 className="text-3xl font-bold mb-4">Quiz Mode</h1>
            <p className="text-base-content/70 mb-6">
              Test your knowledge with 30 randomly selected questions. You'll get
              immediate feedback after each answer.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Questions</div>
                <div className="stat-value text-primary">30</div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Pass Mark</div>
                <div className="stat-value text-secondary">70%</div>
              </div>
            </div>

            <div className="alert alert-info mb-6">
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
              <span>
                Questions are randomly selected from a pool of {allQuestions.length}{' '}
                questions.
              </span>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleStartQuiz}
              disabled={allQuestions.length < 30}
            >
              Start Quiz
            </button>
          </div>
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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Quiz Mode</h1>
          <div className="flex items-center gap-4">
            <span className="badge badge-lg badge-primary">
              Score: {score}/{currentIndex + (isAnswered ? 1 : 0)}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleEndQuiz}>
              Exit Quiz
            </button>
          </div>
        </div>
        <progress
          className="progress progress-secondary w-full"
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
          <span>This question has multiple correct answers. Select all that apply.</span>
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
