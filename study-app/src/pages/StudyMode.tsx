import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  nextQuestion,
  previousQuestion,
  toggleOption,
  revealAnswer,
  setCurrentIndex,
} from '../features/study/studySlice';
import { QuestionCard } from '../components/QuestionCard';
import { OptionButton } from '../components/OptionButton';
import { Feedback } from '../components/Feedback';

export function StudyMode() {
  const dispatch = useAppDispatch();
  const { questions, loading, error } = useAppSelector((state) => state.questions);
  const { currentIndex, isAnswerRevealed, selectedOptions, studiedQuestionIds } =
    useAppSelector((state) => state.study);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div role="alert" className="alert alert-error">
          <span>Error loading questions: {error}</span>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div role="alert" className="alert alert-info">
          <span>No questions available.</span>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isMultipleChoice = currentQuestion.correct_answers.length > 1;

  const correctLetters = currentQuestion.correct_answers.map((a) => a.letter);
  const isCorrect =
    selectedOptions.length === correctLetters.length &&
    selectedOptions.every((opt) => correctLetters.includes(opt)) &&
    correctLetters.every((letter) => selectedOptions.includes(letter));

  const handleRevealAnswer = () => {
    dispatch(revealAnswer(currentQuestion.question_id));
  };

  const handleNext = () => {
    dispatch(nextQuestion(questions.length));
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

  const handleJumpToQuestion = (index: number) => {
    dispatch(setCurrentIndex(index));
  };

  const studyProgress = Math.round(
    (studiedQuestionIds.length / questions.length) * 100
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Study Mode</h1>
          <span className="text-sm text-base-content/60">
            {studiedQuestionIds.length} / {questions.length} studied
          </span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={studyProgress}
          max="100"
        ></progress>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm">Jump to:</span>
        <input
          type="number"
          min={1}
          max={questions.length}
          value={currentIndex + 1}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 && value <= questions.length) {
              handleJumpToQuestion(value - 1);
            }
          }}
          className="input input-bordered input-sm w-20"
        />
        <span className="text-sm text-base-content/60">of {questions.length}</span>
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
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
            isRevealed={isAnswerRevealed}
            correctAnswers={currentQuestion.correct_answers}
            onClick={() => dispatch(toggleOption(option.letter))}
          />
        ))}
      </div>

      {isAnswerRevealed && (
        <Feedback
          isCorrect={isCorrect}
          explanation={currentQuestion.comment}
          correctAnswers={currentQuestion.correct_answers}
        />
      )}

      <div className="flex justify-between mt-8">
        <button
          className="btn btn-outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        {!isAnswerRevealed ? (
          <button
            className="btn btn-primary"
            onClick={handleRevealAnswer}
            disabled={selectedOptions.length === 0}
          >
            Check Answer
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
