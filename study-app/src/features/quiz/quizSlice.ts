import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Question, QuizAnswer } from '../../types';

interface QuizState {
  isActive: boolean;
  questions: Question[];
  currentIndex: number;
  answers: QuizAnswer[];
  score: number;
  isAnswered: boolean;
  selectedOptions: string[];
  isCompleted: boolean;
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

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<Question[]>) => {
      const allQuestions = action.payload;
      const shuffled = shuffleArray(allQuestions);
      state.questions = shuffled.slice(0, Math.min(QUIZ_SIZE, shuffled.length));
      state.isActive = true;
      state.currentIndex = 0;
      state.answers = [];
      state.score = 0;
      state.isAnswered = false;
      state.selectedOptions = [];
      state.isCompleted = false;
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
      const correctLetters = currentQuestion.correct_answers.map(a => a.letter);

      const isCorrect =
        state.selectedOptions.length === correctLetters.length &&
        state.selectedOptions.every(opt => correctLetters.includes(opt)) &&
        correctLetters.every(letter => state.selectedOptions.includes(letter));

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
    },
  },
});

export const {
  startQuiz,
  toggleQuizOption,
  submitAnswer,
  nextQuizQuestion,
  endQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
