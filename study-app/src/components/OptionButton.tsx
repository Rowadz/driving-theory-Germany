import type { QuestionOption } from '../types';

interface OptionButtonProps {
  option: QuestionOption;
  isSelected: boolean;
  isCorrect?: boolean;
  isRevealed: boolean;
  correctAnswers: QuestionOption[];
  onClick: () => void;
  disabled?: boolean;
}

export function OptionButton({
  option,
  isSelected,
  isRevealed,
  correctAnswers,
  onClick,
  disabled = false,
}: OptionButtonProps) {
  const isCorrectAnswer = correctAnswers.some(
    (correct) => correct.letter === option.letter
  );

  let buttonClass = 'btn btn-outline w-full justify-start text-left h-auto py-3 px-4';

  if (isRevealed) {
    if (isCorrectAnswer) {
      buttonClass += ' btn-success';
    } else if (isSelected && !isCorrectAnswer) {
      buttonClass += ' btn-error';
    }
  } else if (isSelected) {
    buttonClass += ' btn-primary';
  }

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || isRevealed}
      aria-pressed={isSelected}
    >
      <span className="font-bold mr-2 shrink-0">{option.letter}</span>
      <span className="whitespace-normal">{option.text}</span>
      {isRevealed && isCorrectAnswer && (
        <span className="ml-auto shrink-0">✓</span>
      )}
      {isRevealed && isSelected && !isCorrectAnswer && (
        <span className="ml-auto shrink-0">✗</span>
      )}
    </button>
  );
}
