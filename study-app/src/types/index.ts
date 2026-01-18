export interface QuestionOption {
  letter: string;
  text: string;
}

export interface Question {
  theme_number: string;
  theme_name: string;
  chapter_number: string;
  chapter_name: string;
  question_id: string;
  question_number: string;
  points: string;
  question_text: string;
  options: QuestionOption[];
  correct_answers: QuestionOption[];
  comment: string;
  image_urls: string[];
  local_image_paths: string[];
  video_urls: string[];
  local_video_paths: string[];
  url: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
}

export type QuizFilterType = 'all' | 'with-images' | 'with-videos' | 'multi-answer' | 'single-answer';

export interface QuizAttempt {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: QuizAnswer[];
  questionIds: string[];
  category?: string | null;
  filterType?: QuizFilterType;
}

export interface StudyProgress {
  studiedQuestionIds: string[];
  lastStudiedIndex: number;
  totalQuestionsStudied: number;
}

export interface QuizState {
  isActive: boolean;
  questions: Question[];
  currentIndex: number;
  answers: QuizAnswer[];
  score: number;
  isAnswered: boolean;
  selectedOptions: string[];
}

export interface ProgressState {
  studyProgress: StudyProgress;
  quizHistory: QuizAttempt[];
}
