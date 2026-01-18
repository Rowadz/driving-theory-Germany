import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuizAttempt, QuizAnswer, QuizFilterType } from '../../types';
import { loadQuizHistory, saveQuizHistory, generateId } from '../../utils/localStorage';

interface ProgressState {
  quizHistory: QuizAttempt[];
}

const initialState: ProgressState = {
  quizHistory: loadQuizHistory(),
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addQuizAttempt: (
      state,
      action: PayloadAction<{
        score: number;
        totalQuestions: number;
        answers: QuizAnswer[];
        questionIds: string[];
        category?: string | null;
        filterType?: QuizFilterType;
      }>
    ) => {
      const { score, totalQuestions, answers, questionIds, category, filterType } = action.payload;
      const attempt: QuizAttempt = {
        id: generateId(),
        date: new Date().toISOString(),
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        answers,
        questionIds,
        category: category || null,
        filterType: filterType || 'all',
      };
      state.quizHistory.unshift(attempt);
      saveQuizHistory(state.quizHistory);
    },
    clearQuizHistory: (state) => {
      state.quizHistory = [];
      saveQuizHistory([]);
    },
    deleteQuizAttempt: (state, action: PayloadAction<string>) => {
      state.quizHistory = state.quizHistory.filter((a) => a.id !== action.payload);
      saveQuizHistory(state.quizHistory);
    },
  },
});

export const { addQuizAttempt, clearQuizHistory, deleteQuizAttempt } = progressSlice.actions;

export default progressSlice.reducer;
