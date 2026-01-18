import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export function Home() {
  const { questions, loading } = useAppSelector((state) => state.questions);
  const { studiedQuestionIds } = useAppSelector((state) => state.study);
  const { quizHistory } = useAppSelector((state) => state.progress);

  const studyProgress =
    questions.length > 0
      ? Math.round((studiedQuestionIds.length / questions.length) * 100)
      : 0;

  const averageScore =
    quizHistory.length > 0
      ? Math.round(
          quizHistory.reduce((sum, q) => sum + q.percentage, 0) /
            quizHistory.length,
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
        <div className="badge badge-primary badge-lg mb-3">
          ONLY for Class B (Car)
        </div>
        <p className="text-lg text-base-content/70">
          Practice for your driving theory exam with {questions.length}{" "}
          questions
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
            {quizHistory.length > 0
              ? `Avg: ${averageScore}%`
              : "Start practicing!"}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">Study Mode</h2>
            <p className="text-base-content/70">
              Go through questions sequentially. Take your time to understand
              each question and learn from the explanations.
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
            <h2 className="card-title text-2xl">Categories</h2>
            <p className="text-base-content/70">
              Browse questions by topic or type. Filter by signs, priority,
              videos, pictures, or answer type.
            </p>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Topics
                </span>
                <span className="badge badge-secondary gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Pictures
                </span>
                <span className="badge badge-accent gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Videos
                </span>
                <span className="badge badge-info gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Multi-Answer
                </span>
              </div>
            </div>
            <div className="card-actions justify-end mt-4">
              <Link to="/categories" className="btn btn-accent">
                Browse Categories
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
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-secondary gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  30 Qs
                </span>
                <span className="badge badge-warning gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Random
                </span>
                <span className="badge badge-success gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Feedback
                </span>
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
                            ? "badge-success"
                            : "badge-error"
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
