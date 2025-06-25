import { create } from 'zustand';
import { Quiz, QuizFormData } from '@/types/quiz';

interface QuizState {
  quizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
  addQuiz: (data: QuizFormData) => Promise<void>;
  updateQuiz: (id: string, data: QuizFormData) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  fetchQuizzes: () => Promise<void>;
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  quizzes: [],
  isLoading: false,
  error: null,

  fetchQuizzes: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const mockData: Quiz[] = [
        {
          id: '1',
          title: 'Algebra Basics Quiz',
          description: 'Test your understanding of basic algebraic concepts',
          options: {
            level: 'JHS',
            class: 'JHS 2',
            subject: 'Mathematics',
            topic: 'Algebra',
            difficulty: 'Medium',
            timeLimit: 30,
          },
          questions: [
            {
              id: '1',
              question: 'What is the value of x in 2x + 5 = 13?',
              options: ['3', '4', '5', '6'],
              correctAnswer: 1,
              explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
              type: 'multiple-choice',
            },
            // Add more mock questions as needed
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      set({ quizzes: mockData });
    } catch (error) {
      set({ error: 'Failed to fetch quizzes' });
    } finally {
      set({ isLoading: false });
    }
  },

  addQuiz: async (data: QuizFormData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const newQuiz: Quiz = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const quizzes = get().quizzes;
      set({ quizzes: [...quizzes, newQuiz] });
    } catch (error) {
      set({ error: 'Failed to add quiz' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuiz: async (id: string, data: QuizFormData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const quizzes = get().quizzes;
      const updatedQuizzes = quizzes.map((quiz) =>
        quiz.id === id
          ? {
              ...quiz,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : quiz
      );
      set({ quizzes: updatedQuizzes });
    } catch (error) {
      set({ error: 'Failed to update quiz' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteQuiz: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const quizzes = get().quizzes;
      const filteredQuizzes = quizzes.filter((quiz) => quiz.id !== id);
      set({ quizzes: filteredQuizzes });
    } catch (error) {
      set({ error: 'Failed to delete quiz' });
    } finally {
      set({ isLoading: false });
    }
  },
}));