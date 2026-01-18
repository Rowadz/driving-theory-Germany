import { configureStore } from '@reduxjs/toolkit';
import questionsReducer from '../features/questions/questionsSlice';
import studyReducer from '../features/study/studySlice';
import quizReducer from '../features/quiz/quizSlice';
import progressReducer from '../features/progress/progressSlice';

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    study: studyReducer,
    quiz: quizReducer,
    progress: progressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
