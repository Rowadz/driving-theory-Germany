import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Question } from '../../types';

interface QuestionsState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  loading: false,
  error: null,
};

export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async () => {
    const response = await fetch('/driving_theory_questions.json');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data: Question[] = await response.json();
    return data;
  }
);

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load questions';
      });
  },
});

export default questionsSlice.reducer;
