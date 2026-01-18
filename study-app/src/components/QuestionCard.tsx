import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber?: number;
  totalQuestions?: number;
  showTheme?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  showTheme = true,
}: QuestionCardProps) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        {(questionNumber !== undefined || showTheme) && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {questionNumber !== undefined && totalQuestions !== undefined && (
              <span className="badge badge-primary">
                Question {questionNumber} of {totalQuestions}
              </span>
            )}
            <span className="badge badge-secondary">{question.points}</span>
            {showTheme && (
              <span className="badge badge-ghost text-xs">
                {question.theme_name}
              </span>
            )}
          </div>
        )}

        <h2 className="card-title text-lg md:text-xl leading-relaxed">
          {question.question_text}
        </h2>

        {question.image_urls.length > 0 && (
          <div className="my-4">
            {question.image_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Question illustration ${index + 1}`}
                className="max-w-full h-auto rounded-lg"
              />
            ))}
          </div>
        )}

        <p className="text-sm text-base-content/60 mt-2">
          ID: {question.question_id}
        </p>
      </div>
    </div>
  );
}
