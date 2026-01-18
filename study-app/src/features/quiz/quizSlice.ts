import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Question, QuizAnswer, QuizFilterType } from '../../types';

interface QuizState {
  isActive: boolean;
  questions: Question[];
  currentIndex: number;
  answers: QuizAnswer[];
  score: number;
  isAnswered: boolean;
  selectedOptions: string[];
  isCompleted: boolean;
  category: string | null;
  filterType: QuizFilterType;
}

const initialState: QuizState = {
  isActive: false,
  questions: [],
  currentIndex: 0,
  answers: [],
  score: 0,
  isAnswered: false,
  selectedOptions: [],
  isCompleted: false,
  category: null,
  filterType: 'all',
};

const QUIZ_SIZE = 30;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function filterQuestions(
  questions: Question[],
  category: string | null,
  filterType: QuizFilterType
): Question[] {
  let filtered = questions;

  if (category) {
    filtered = filtered.filter((q) => q.theme_name === category);
  }

  switch (filterType) {
    case 'with-images':
      filtered = filtered.filter((q) => q.image_urls.length > 0);
      break;
    case 'with-videos':
      filtered = filtered.filter((q) => q.video_urls.length > 0);
      break;
    case 'multi-answer':
      filtered = filtered.filter((q) => q.correct_answers.length > 1);
      break;
    case 'single-answer':
      filtered = filtered.filter((q) => q.correct_answers.length === 1);
      break;
  }

  return filtered;
}

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (
      state,
      action: PayloadAction<{
        questions: Question[];
        category?: string | null;
        filterType?: QuizFilterType;
      }>
    ) => {
      const { questions, category = null, filterType = 'all' } = action.payload;
      const filtered = filterQuestions(questions, category, filterType);
      const shuffled = shuffleArray(filtered);
      state.questions = shuffled.slice(0, Math.min(QUIZ_SIZE, shuffled.length));
      state.isActive = true;
      state.currentIndex = 0;
      state.answers = [];
      state.score = 0;
      state.isAnswered = false;
      state.selectedOptions = [];
      state.isCompleted = false;
      state.category = category;
      state.filterType = filterType;
    },
    startQuizWithQuestionIds: (
      state,
      action: PayloadAction<{
        allQuestions: Question[];
        questionIds: string[];
        category?: string | null;
        filterType?: QuizFilterType;
      }>
    ) => {
      const { allQuestions, questionIds, category = null, filterType = 'all' } = action.payload;
      const questionMap = new Map(allQuestions.map((q) => [q.question_id, q]));
      const questions = questionIds
        .map((id) => questionMap.get(id))
        .filter((q): q is Question => q !== undefined);
      state.questions = questions;
      state.isActive = true;
      state.currentIndex = 0;
      state.answers = [];
      state.score = 0;
      state.isAnswered = false;
      state.selectedOptions = [];
      state.isCompleted = false;
      state.category = category;
      state.filterType = filterType;
    },
    toggleQuizOption: (state, action: PayloadAction<string>) => {
      if (state.isAnswered) return;
      const option = action.payload;
      const index = state.selectedOptions.indexOf(option);
      if (index === -1) {
        state.selectedOptions.push(option);
      } else {
        state.selectedOptions.splice(index, 1);
      }
    },
    submitAnswer: (state) => {
      if (state.isAnswered || state.selectedOptions.length === 0) return;

      const currentQuestion = state.questions[state.currentIndex];
      const correctLetters = currentQuestion.correct_answers.map((a) => a.letter);

      const isCorrect =
        state.selectedOptions.length === correctLetters.length &&
        state.selectedOptions.every((opt) => correctLetters.includes(opt)) &&
        correctLetters.every((letter) => state.selectedOptions.includes(letter));

      state.answers.push({
        questionId: currentQuestion.question_id,
        selectedOptions: [...state.selectedOptions],
        isCorrect,
      });

      if (isCorrect) {
        state.score += 1;
      }

      state.isAnswered = true;
    },
    nextQuizQuestion: (state) => {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex += 1;
        state.isAnswered = false;
        state.selectedOptions = [];
      } else {
        state.isCompleted = true;
      }
    },
    endQuiz: (state) => {
      state.isActive = false;
      state.isCompleted = false;
      state.questions = [];
      state.currentIndex = 0;
      state.answers = [];
      state.score = 0;
      state.isAnswered = false;
      state.selectedOptions = [];
      state.category = null;
      state.filterType = 'all';
    },
  },
});

export const {
  startQuiz,
  startQuizWithQuestionIds,
  toggleQuizOption,
  submitAnswer,
  nextQuizQuestion,
  endQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
