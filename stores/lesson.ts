import { Lesson, LessonFormData } from '@/types/lesson';
import { create } from 'zustand';

interface LessonState {
  lessons: Lesson[];
  isLoading: boolean;
  error: string | null;
  addLesson: (data: LessonFormData) => Promise<void>;
  updateLesson: (id: string, data: LessonFormData) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  fetchLessons: () => Promise<void>;
}

export const useLessonStore = create<LessonState>()((set, get) => ({
  lessons: [],
  isLoading: false,
  error: null,

  fetchLessons: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const mockData: Lesson[] = [
        {
          id: '1',
          options: {
            level: 'JHS',
            class: 'JHS 2',
            subject: 'Mathematics',
            topic: 'Algebra',
            subtopic: 'Linear Equations',
          },
          content: {
            title: 'Solving Linear Equations',
            description: 'Learn how to solve linear equations step by step',
            content: 'Linear equations are equations where each term is either a constant or...',
            videoUrl: 'https://example.com/linear-equations.mp4',
            questions: [
              {
                type: 'multiple_choice',
                options: ['5x', '6x', '5x²', '6x²'],
                question: 'Simplify: 3x + 2x',
                explanation: '3x + 2x = (3 + 2)x = 5x. We add the coefficients of like terms.',
                correct_answer: '5x'
              },
              {
                type: 'multiple_choice',
                options: ['9', '10', '11', '12'],
                question: 'If x = 4, what is the value of 2x + 3?',
                explanation: '2x + 3 = 2(4) + 3 = 8 + 3 = 11',
                correct_answer: '11'
              },
              {
                type: 'multiple_choice',
                options: ['3x + 2', '3x + 5', '3x + 6', 'x + 6'],
                question: 'Expand: 3(x + 2)',
                explanation: '3(x + 2) = 3×x + 3×2 = 3x + 6',
                correct_answer: '3x + 6'
              },
              {
                type: 'multiple_choice',
                options: ['6', '7', '8', '17'],
                question: 'Solve for x: x + 5 = 12',
                explanation: 'x + 5 = 12, so x = 12 - 5 = 7',
                correct_answer: '7'
              },
              {
                type: 'multiple_choice',
                options: ['4y', 'x²', '7x', '4'],
                question: 'Which of the following is a like term to 4x?',
                explanation: 'Like terms have the same variable with the same power. 4x and 7x are like terms.',
                correct_answer: '7x'
              }
            ]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      set({ lessons: mockData });
    } catch (error) {
      set({ error: 'Failed to fetch lessons' });
    } finally {
      set({ isLoading: false });
    }
  },

  addLesson: async (data: LessonFormData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const newLesson: Lesson = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const lessons = get().lessons;
      set({ lessons: [...lessons, newLesson] });
    } catch (error) {
      set({ error: 'Failed to add lesson' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateLesson: async (id: string, data: LessonFormData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const lessons = get().lessons;
      const updatedLessons = lessons.map((lesson) =>
        lesson.id === id
          ? {
              ...lesson,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : lesson
      );
      set({ lessons: updatedLessons });
    } catch (error) {
      set({ error: 'Failed to update lesson' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLesson: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const lessons = get().lessons;
      const filteredLessons = lessons.filter((lesson) => lesson.id !== id);
      set({ lessons: filteredLessons });
    } catch (error) {
      set({ error: 'Failed to delete lesson' });
    } finally {
      set({ isLoading: false });
    }
  },
}));