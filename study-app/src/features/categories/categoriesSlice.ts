import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type QuestionTypeFilter =
  | 'with-images'
  | 'with-videos'
  | 'multi-answer'
  | 'single-answer';

interface CategoriesState {
  selectedThemes: string[];
  selectedFilters: QuestionTypeFilter[];
  currentIndex: number;
  isAnswerRevealed: boolean;
  selectedOptions: string[];
  isStudying: boolean;
}

const initialState: CategoriesState = {
  selectedThemes: [],
  selectedFilters: [],
  currentIndex: 0,
  isAnswerRevealed: false,
  selectedOptions: [],
  isStudying: false,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    toggleTheme: (state, action: PayloadAction<string>) => {
      const theme = action.payload;
      const index = state.selectedThemes.indexOf(theme);
      if (index === -1) {
        state.selectedThemes.push(theme);
      } else {
        state.selectedThemes.splice(index, 1);
      }
    },
    toggleFilter: (state, action: PayloadAction<QuestionTypeFilter>) => {
      const filter = action.payload;
      const index = state.selectedFilters.indexOf(filter);
      if (index === -1) {
        state.selectedFilters.push(filter);
      } else {
        state.selectedFilters.splice(index, 1);
      }
    },
    startStudying: (state) => {
      state.isStudying = true;
      state.currentIndex = 0;
      state.isAnswerRevealed = false;
      state.selectedOptions = [];
    },
    stopStudying: (state) => {
      state.isStudying = false;
      state.currentIndex = 0;
      state.isAnswerRevealed = false;
      state.selectedOptions = [];
    },
    clearAllSelections: (state) => {
      state.selectedThemes = [];
      state.selectedFilters = [];
    },
    setCategoryIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
      state.isAnswerRevealed = false;
      state.selectedOptions = [];
    },
    nextCategoryQuestion: (state, action: PayloadAction<number>) => {
      const totalQuestions = action.payload;
      if (state.currentIndex < totalQuestions - 1) {
        state.currentIndex += 1;
        state.isAnswerRevealed = false;
        state.selectedOptions = [];
      }
    },
    previousCategoryQuestion: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.isAnswerRevealed = false;
        state.selectedOptions = [];
      }
    },
    toggleCategoryOption: (state, action: PayloadAction<string>) => {
      const option = action.payload;
      const index = state.selectedOptions.indexOf(option);
      if (index === -1) {
        state.selectedOptions.push(option);
      } else {
        state.selectedOptions.splice(index, 1);
      }
    },
    revealCategoryAnswer: (state) => {
      state.isAnswerRevealed = true;
    },
    resetCategoryState: (state) => {
      state.selectedThemes = [];
      state.selectedFilters = [];
      state.currentIndex = 0;
      state.isAnswerRevealed = false;
      state.selectedOptions = [];
      state.isStudying = false;
    },
  },
});

export const {
  toggleTheme,
  toggleFilter,
  startStudying,
  stopStudying,
  clearAllSelections,
  setCategoryIndex,
  nextCategoryQuestion,
  previousCategoryQuestion,
  toggleCategoryOption,
  revealCategoryAnswer,
  resetCategoryState,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
