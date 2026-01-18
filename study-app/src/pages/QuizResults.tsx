import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { endQuiz } from '../features/quiz/quizSlice';

export function QuizResults() {
  const dispatch = useAppDispatch();
  const { questions: quizQuestions, answers, score } = useAppSelector(
    (state) => state.quiz
  );

  const handleEndQuiz = () => {
    dispatch(endQuiz());
  };

  if (quizQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h1 className="text-2xl font-bold mb-4">No Quiz Results</h1>
            <p className="text-base-content/70 mb-6">
              Start a quiz to see your results here.
            </p>
            <Link to="/quiz" className="btn btn-primary">
              Start a Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.round((score / quizQuestions.length) * 100);
  const passed = percentage >= 70;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quiz Results</h1>
            <p className="text-base-content/70 mt-1">
              Review your answers and learn from mistakes
            </p>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Final Score</div>
              <div
                className={`stat-value ${passed ? 'text-success' : 'text-error'}`}
              >
                {score}/{quizQuestions.length}
              </div>
              <div className="stat-desc">{percentage}% - {passed ? 'Passed' : 'Failed'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {quizQuestions.map((question, index) => {
          const answer = answers[index];
          const isCorrect = answer?.isCorrect ?? false;

          return (
            <div
              key={question.question_id}
              className={`card bg-base-100 shadow-lg border-l-4 ${
                isCorrect ? 'border-success' : 'border-error'
              }`}
            >
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-ghost">
                        Question {index + 1}
                      </span>
                      <span className="badge badge-secondary">
                        {question.points}
                      </span>
                      <span
                        className={`badge ${
                          isCorrect ? 'badge-success' : 'badge-error'
                        }`}
                      >
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">
                      {question.question_text}
                    </h3>
                  </div>
                </div>

                {question.video_urls.length > 0 && (
                  <div className="my-4">
                    {question.video_urls.map((url, vidIndex) => (
                      <video
                        key={vidIndex}
                        controls
                        loop
                        playsInline
                        className="w-full max-w-md rounded-lg"
                      >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ))}
                  </div>
                )}

                {question.image_urls.length > 0 && (
                  <div className="my-4">
                    {question.image_urls.map((url, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={url}
                        alt={`Question illustration ${imgIndex + 1}`}
                        className="max-w-full h-auto rounded-lg max-h-48 object-contain"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  {question.options.map((option) => {
                    const isCorrectAnswer = question.correct_answers.some(
                      (a) => a.letter === option.letter
                    );
                    const wasSelected = answer?.selectedOptions.includes(
                      option.letter
                    );

                    let bgClass = 'bg-base-200';
                    if (isCorrectAnswer) {
                      bgClass = 'bg-success/20 border-success';
                    } else if (wasSelected && !isCorrectAnswer) {
                      bgClass = 'bg-error/20 border-error';
                    }

                    return (
                      <div
                        key={option.letter}
                        className={`p-3 rounded-lg border ${bgClass} flex items-center gap-2`}
                      >
                        <span className="font-bold">{option.letter}</span>
                        <span className="flex-1">{option.text}</span>
                        {isCorrectAnswer && (
                          <span className="badge badge-success badge-sm">
                            Correct
                          </span>
                        )}
                        {wasSelected && (
                          <span className="badge badge-outline badge-sm">
                            Your answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {question.comment && (
                  <div className="mt-4 p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold text-sm text-base-content/70 mb-2">
                      Explanation:
                    </h4>
                    <p className="text-sm leading-relaxed">{question.comment}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Link to="/quiz" className="btn btn-primary" onClick={handleEndQuiz}>
          Start New Quiz
        </Link>
        <Link to="/" className="btn btn-outline" onClick={handleEndQuiz}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
