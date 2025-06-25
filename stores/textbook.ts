import { create } from 'zustand';
import { Textbook, TextbookFormData } from '@/types/textbook';

interface TextbookState {
  textbooks: Textbook[];
  isLoading: boolean;
  error: string | null;
  addTextbook: (data: TextbookFormData) => Promise<void>;
  updateTextbook: (id: string, data: TextbookFormData) => Promise<void>;
  deleteTextbook: (id: string) => Promise<void>;
  fetchTextbooks: () => Promise<void>;
}

export const useTextbookStore = create<TextbookState>()((set, get) => ({
  textbooks: [],
  isLoading: false,
  error: null,

  fetchTextbooks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const mockData: Textbook[] = [
        {
          id: '1',
          options: {
            level: 'JHS',
            class: 'JHS 2',
            subject: 'Mathematics',
            term: '1',
            publisher: 'Ghana Education Service',
            isbn: '978-0-123456-78-9',
            year: '2024',
          },
          content: {
            title: 'Junior High School Mathematics',
            description: 'Comprehensive mathematics textbook covering the JHS curriculum',
            authors: ['Dr. Kwame Mensah', 'Prof. Abena Osei'],
            coverUrl: 'https://example.com/math-cover.jpg',
            pdfUrl: 'https://example.com/math-textbook.pdf',
            totalPages: 250,
            keywords: ['mathematics', 'algebra', 'geometry', 'JHS'],
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      set({ textbooks: mockData });
    } catch (error) {
      set({ error: 'Failed to fetch textbooks' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTextbook: async (data: TextbookFormData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const newTextbook: Textbook = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const textbooks = get().textbooks;
      set({ textbooks: [...textbooks, newTextbook] });
    } catch (error) {
      set({ error: 'Failed to add textbook' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTextbook: async (id: string, data: TextbookFormData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const textbooks = get().textbooks;
      const updatedTextbooks = textbooks.map((textbook) =>
        textbook.id === id
          ? {
              ...textbook,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : textbook
      );
      set({ textbooks: updatedTextbooks });
    } catch (error) {
      set({ error: 'Failed to update textbook' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTextbook: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const textbooks = get().textbooks;
      const filteredTextbooks = textbooks.filter((textbook) => textbook.id !== id);
      set({ textbooks: filteredTextbooks });
    } catch (error) {
      set({ error: 'Failed to delete textbook' });
    } finally {
      set({ isLoading: false });
    }
  },
}));