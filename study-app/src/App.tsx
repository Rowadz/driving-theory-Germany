import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchQuestions } from './features/questions/questionsSlice';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { StudyMode } from './pages/StudyMode';
import { QuizMode } from './pages/QuizMode';
import { QuizResults } from './pages/QuizResults';
import { History } from './pages/History';
import { Categories } from './pages/Categories';

function AppContent() {
  const dispatch = useAppDispatch();
  const { questions, loading, error } = useAppSelector((state) => state.questions);

  useEffect(() => {
    if (questions.length === 0 && !loading && !error) {
      dispatch(fetchQuestions());
    }
  }, [dispatch, questions.length, loading, error]);

  return (
    <div className="min-h-screen bg-base-300">
      <Navigation />
      <main className="pb-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<StudyMode />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/quiz" element={<QuizMode />} />
          <Route path="/quiz/results" element={<QuizResults />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
