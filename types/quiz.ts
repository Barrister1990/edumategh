export interface QuizOptions {
  level: 'JHS' | 'SHS';
  class: string;
  subject: string;
  course?: string;
  topic: string;
  subtopic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  type: 'multiple-choice' | 'true-false';
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  options: QuizOptions;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizFormData {
  title: string;
  description: string;
  options: QuizOptions;
  questions: QuizQuestion[];
}