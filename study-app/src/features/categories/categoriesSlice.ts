import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CategoryFilter =
  | 'all'
  | 'with-images'
  | 'with-videos'
  | 'multi-answer'
  | 'single-answer'
  | string; // For theme names

interface CategoriesState {
  selectedTheme: string | null;
  selectedFilter: CategoryFilter;
  currentIndex: number;
  isAnswerRevealed: boolean;
  selectedOptions: string[];
}

const initialState: CategoriesState = {
  selectedTheme: null,
  selectedFilter: 'all',
  currentIndex: 0,
  isAnswerRevealed: false,
  selectedOptions: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string | null>) => {
      state.selectedTheme = action.payload;
      state.currentIndex = 0;
      state.isAnswerRevealed = false;
      state.selectedOptions = [];
    },
    setFilter: (state, action: PayloadAction<CategoryFilter>) => {
      state.selectedFilter = action.payload;
      state.currentIndex = 0;
      state.isAnswerRevealed = false;
      state.selectedOptions = [];
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
      state.selectedTheme = null;
      state.selectedFilter = 'all';
      state.currentIndex = 0;
      state.isAnswerRevealed = false;
      state.selectedOptions = [];
    },
  },
});

export const {
  setTheme,
  setFilter,
  setCategoryIndex,
  nextCategoryQuestion,
  previousCategoryQuestion,
  toggleCategoryOption,
  revealCategoryAnswer,
  resetCategoryState,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
