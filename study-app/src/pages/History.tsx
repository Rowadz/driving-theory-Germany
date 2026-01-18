import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clearQuizHistory } from '../features/progress/progressSlice';

export function History() {
  const dispatch = useAppDispatch();
  const { quizHistory } = useAppSelector((state) => state.progress);
  const { questions } = useAppSelector((state) => state.questions);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const questionMap = new Map(questions.map((q) => [q.question_id, q]));

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all quiz history?')) {
      dispatch(clearQuizHistory());
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
        <button className="btn btn-error btn-outline btn-sm" onClick={handleClearHistory}>
          Clear History
        </button>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
        <div className="stat">
          <div className="stat-title">Total Quizzes</div>
          <div className="stat-value">{totalQuizzes}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Average Score</div>
          <div className="stat-value">{averageScore}%</div>
        </div>
        <div className="stat">
          <div className="stat-title">Best Score</div>
          <div className="stat-value text-success">{bestScore}%</div>
        </div>
        <div className="stat">
          <div className="stat-title">Pass Rate</div>
          <div className="stat-value">
            {Math.round((passedQuizzes / totalQuizzes) * 100)}%
          </div>
          <div className="stat-desc">
            {passedQuizzes} of {totalQuizzes} passed
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {quizHistory.map((attempt) => {
          const passed = attempt.percentage >= 70;
          const isExpanded = expandedId === attempt.id;

          return (
            <div key={attempt.id} className="card bg-base-100 shadow-lg">
              <div
                className="card-body cursor-pointer"
                onClick={() => toggleExpand(attempt.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {new Date(attempt.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <p className="text-sm text-base-content/60">
                      {new Date(attempt.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {attempt.score}/{attempt.totalQuestions}
                      </div>
                      <span
                        className={`badge ${passed ? 'badge-success' : 'badge-error'}`}
                      >
                        {attempt.percentage}% - {passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 border-t pt-6">
                    <h4 className="font-semibold mb-4">Question Review</h4>
                    <div className="space-y-4">
                      {attempt.answers.map((answer, index) => {
                        const question = questionMap.get(answer.questionId);
                        if (!question) return null;

                        return (
                          <div
                            key={answer.questionId}
                            className={`p-4 rounded-lg border-l-4 ${
                              answer.isCorrect
                                ? 'border-success bg-success/10'
                                : 'border-error bg-error/10'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="badge badge-ghost">Q{index + 1}</span>
                              <span
                                className={`badge badge-sm ${
                                  answer.isCorrect ? 'badge-success' : 'badge-error'
                                }`}
                              >
                                {answer.isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            </div>
                            <p className="font-medium mb-2">
                              {question.question_text}
                            </p>
                            <div className="text-sm space-y-1">
                              <p>
                                <span className="text-base-content/60">
                                  Your answer:{' '}
                                </span>
                                {answer.selectedOptions.join(', ')}
                              </p>
                              <p>
                                <span className="text-base-content/60">
                                  Correct answer:{' '}
                                </span>
                                <span className="text-success">
                                  {question.correct_answers
                                    .map((a) => a.letter)
                                    .join(', ')}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
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
