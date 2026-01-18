interface FeedbackProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswers: { letter: string; text: string }[];
}

export function Feedback({ isCorrect, explanation, correctAnswers }: FeedbackProps) {
  return (
    <div className="space-y-4 mt-4">
      <div
        role="alert"
        className={`alert ${isCorrect ? 'alert-success' : 'alert-error'}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          {isCorrect ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          )}
        </svg>
        <span className="font-medium">
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </span>
      </div>

      <div className="card bg-base-200">
        <div className="card-body py-4">
          <h3 className="font-semibold text-sm text-base-content/70">
            Correct Answer{correctAnswers.length > 1 ? 's' : ''}:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {correctAnswers.map((answer) => (
              <li key={answer.letter} className="text-success font-medium">
                {answer.letter} {answer.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {explanation && (
        <div className="card bg-base-200">
          <div className="card-body py-4">
            <h3 className="font-semibold text-sm text-base-content/70">
              Explanation:
            </h3>
            <p className="text-base-content/90 leading-relaxed">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
