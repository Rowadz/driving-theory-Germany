import type { StudyProgress, QuizAttempt } from '../types';

const STUDY_PROGRESS_KEY = 'driving-theory-study-progress';
const QUIZ_HISTORY_KEY = 'driving-theory-quiz-history';

export const loadStudyProgress = (): StudyProgress => {
  try {
    const stored = localStorage.getItem(STUDY_PROGRESS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load study progress:', e);
  }
  return {
    studiedQuestionIds: [],
    lastStudiedIndex: 0,
    totalQuestionsStudied: 0,
  };
};

export const saveStudyProgress = (progress: StudyProgress): void => {
  try {
    localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save study progress:', e);
  }
};

export const loadQuizHistory = (): QuizAttempt[] => {
  try {
    const stored = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load quiz history:', e);
  }
  return [];
};

export const saveQuizHistory = (history: QuizAttempt[]): void => {
  try {
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save quiz history:', e);
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
