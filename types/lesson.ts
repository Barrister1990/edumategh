export interface LessonOptions {
  level: 'JHS' | 'SHS';
  class: string;
  subject: string;
  course?: string;
  topic: string;
  subtopic?: string;
}

export interface QuizQuestion {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface LessonContent {
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  attachments?: string[];
  questions: QuizQuestion[];
}

export interface LessonProgress {
  completed: boolean;
  score?: number;
  timeSpent?: number;
  lastAccessed?: string;
}

export interface Lesson {
  id: string;
  options: LessonOptions;
  content: LessonContent;
  progress?: LessonProgress;
  createdAt: string;
  updatedAt: string;
}

export interface LessonFormData {
  options: LessonOptions;
  content: LessonContent;
}