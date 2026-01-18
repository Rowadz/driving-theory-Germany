import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadStudyProgress, saveStudyProgress } from '../../utils/localStorage';

interface StudyState {
  currentIndex: number;
  isAnswerRevealed: boolean;
  selectedOptions: string[];
  studiedQuestionIds: string[];
}

const savedProgress = loadStudyProgress();

const initialState: StudyState = {
  currentIndex: savedProgress.lastStudiedIndex,
  isAnswerRevealed: false,
  selectedOptions: [],
  studiedQuestionIds: savedProgress.studiedQuestionIds,
};

const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
      state.isAnswerRevealed = false;
      state.selectedOptions = [];
      saveStudyProgress({
        studiedQuestionIds: state.studiedQuestionIds,
        lastStudiedIndex: action.payload,
        totalQuestionsStudied: state.studiedQuestionIds.length,
      });
    },
    nextQuestion: (state, action: PayloadAction<number>) => {
      const totalQuestions = action.payload;
      if (state.currentIndex < totalQuestions - 1) {
        state.currentIndex += 1;
        state.isAnswerRevealed = false;
        state.selectedOptions = [];
        saveStudyProgress({
          studiedQuestionIds: state.studiedQuestionIds,
          lastStudiedIndex: state.currentIndex,
          totalQuestionsStudied: state.studiedQuestionIds.length,
        });
      }
    },
    previousQuestion: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.isAnswerRevealed = false;
        state.selectedOptions = [];
        saveStudyProgress({
          studiedQuestionIds: state.studiedQuestionIds,
          lastStudiedIndex: state.currentIndex,
          totalQuestionsStudied: state.studiedQuestionIds.length,
        });
      }
    },
    toggleOption: (state, action: PayloadAction<string>) => {
      const option = action.payload;
      const index = state.selectedOptions.indexOf(option);
      if (index === -1) {
        state.selectedOptions.push(option);
      } else {
        state.selectedOptions.splice(index, 1);
      }
    },
    revealAnswer: (state, action: PayloadAction<string>) => {
      state.isAnswerRevealed = true;
      const questionId = action.payload;
      if (!state.studiedQuestionIds.includes(questionId)) {
        state.studiedQuestionIds.push(questionId);
        saveStudyProgress({
          studiedQuestionIds: state.studiedQuestionIds,
          lastStudiedIndex: state.currentIndex,
          totalQuestionsStudied: state.studiedQuestionIds.length,
        });
      }
    },
    resetStudyProgress: (state) => {
      state.currentIndex = 0;
      state.isAnswerRevealed = false;
      state.selectedOptions = [];
      state.studiedQuestionIds = [];
      saveStudyProgress({
        studiedQuestionIds: [],
        lastStudiedIndex: 0,
        totalQuestionsStudied: 0,
      });
    },
  },
});

export const {
  setCurrentIndex,
  nextQuestion,
  previousQuestion,
  toggleOption,
  revealAnswer,
  resetStudyProgress,
} = studySlice.actions;

export default studySlice.reducer;
