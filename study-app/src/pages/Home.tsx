import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export function Home() {
  const { questions, loading } = useAppSelector((state) => state.questions);
  const { studiedQuestionIds } = useAppSelector((state) => state.study);
  const { quizHistory } = useAppSelector((state) => state.progress);

  const studyProgress = questions.length > 0
    ? Math.round((studiedQuestionIds.length / questions.length) * 100)
    : 0;

  const averageScore = quizHistory.length > 0
    ? Math.round(
        quizHistory.reduce((sum, q) => sum + q.percentage, 0) / quizHistory.length
      )
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">German Driving Theory</h1>
        <p className="text-lg text-base-content/70">
          Practice for your driving theory exam with {questions.length} questions
        </p>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
        <div className="stat">
          <div className="stat-title">Total Questions</div>
          <div className="stat-value">{questions.length}</div>
          <div className="stat-desc">Available for study</div>
        </div>
        <div className="stat">
          <div className="stat-title">Questions Studied</div>
          <div className="stat-value">{studiedQuestionIds.length}</div>
          <div className="stat-desc">{studyProgress}% complete</div>
        </div>
        <div className="stat">
          <div className="stat-title">Quizzes Taken</div>
          <div className="stat-value">{quizHistory.length}</div>
          <div className="stat-desc">
            {quizHistory.length > 0 ? `Avg: ${averageScore}%` : 'Start practicing!'}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">Study Mode</h2>
            <p className="text-base-content/70">
              Go through questions sequentially. Take your time to understand each
              question and learn from the explanations.
            </p>
            <div className="mt-4">
              <progress
                className="progress progress-primary w-full"
                value={studyProgress}
                max="100"
              ></progress>
              <p className="text-sm text-base-content/60 mt-1">
                {studiedQuestionIds.length} of {questions.length} studied
              </p>
            </div>
            <div className="card-actions justify-end mt-4">
              <Link to="/study" className="btn btn-primary">
                Start Studying
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">Quiz Mode</h2>
            <p className="text-base-content/70">
              Test yourself with 30 random questions. Get immediate feedback and
              see your final score at the end.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span className="badge badge-outline">30 Questions</span>
                <span className="badge badge-outline">Random Order</span>
                <span className="badge badge-outline">Timed Feedback</span>
              </div>
            </div>
            <div className="card-actions justify-end mt-4">
              <Link to="/quiz" className="btn btn-secondary">
                Start Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>

      {quizHistory.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Quizzes</h2>
            <Link to="/history" className="btn btn-ghost btn-sm">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.slice(0, 5).map((attempt) => (
                  <tr key={attempt.id}>
                    <td>{new Date(attempt.date).toLocaleDateString()}</td>
                    <td>
                      {attempt.score}/{attempt.totalQuestions}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          attempt.percentage >= 70
                            ? 'badge-success'
                            : 'badge-error'
                        }`}
                      >
                        {attempt.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
