import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuizAttempt, QuizAnswer } from '../../types';
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
      }>
    ) => {
      const { score, totalQuestions, answers, questionIds } = action.payload;
      const attempt: QuizAttempt = {
        id: generateId(),
        date: new Date().toISOString(),
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        answers,
        questionIds,
      };
      state.quizHistory.unshift(attempt);
      saveQuizHistory(state.quizHistory);
    },
    clearQuizHistory: (state) => {
      state.quizHistory = [];
      saveQuizHistory([]);
    },
  },
});

export const { addQuizAttempt, clearQuizHistory } = progressSlice.actions;

export default progressSlice.reducer;
