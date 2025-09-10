import { uploadToCloudinary } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

// Types
export interface CreateTextbookInput {
  title: string;
  author: string;
  description: string;
  pdf_url: string;
  cover_url?: string;
  publisher: string;
  year: string;
  level: string;
  class: string;
  course?: string; // For SHS only
  subject: string;
  subject_id: string;
  reference: 'learner' | 'teacher';
}

export interface UpdateTextbookInput extends Partial<CreateTextbookInput> {
  id: string;
}

export interface AdminTextbook {
  id: string;
  title: string;
  author: string;
  description: string;
  pdf_url: string;
  cover_url: string | null;
  publisher: string;
  year: string;
  level: string;
  class: string;
  course: string | null;
  subject: string;
  subject_id: string;
  reference: 'learner' | 'teacher';
  created_at: string;
  updated_at: string;
}

export interface TextbookFilters {
  level?: string;
  class?: string;
  course?: string;
  subject?: string;
  search?: string;
}

export interface Subject {
  id: string;
  name: string;
  level: string;
  course?: string | string[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  name: string;
}

export interface UploadProgress {
  pdf: number;
  cover: number;
}

interface AdminTextbookState {
  // Data
  textbooks: AdminTextbook[];
  selectedTextbook: AdminTextbook | null;
  filters: TextbookFilters;
  subjects: Subject[];
  courses: Course[];
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingSubjects: boolean;
  isLoadingCourses: boolean;
  
  // Error states
  subjectsError: string | null;
  
  // Upload states
  uploadProgress: UploadProgress;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  
  // Error handling
  error: string | null;
  
  // Actions
  fetchTextbooks: (page?: number) => Promise<void>;
  fetchAllSubjects: () => Promise<Subject[]>;
  fetchSubjects: (level: string, course?: string) => Promise<Subject[]>;
  createTextbook: (textbook: Omit<CreateTextbookInput, 'pdf_url' | 'cover_url'>, pdfFile: File, coverFile?: File) => Promise<boolean>;
  updateTextbook: (textbook: UpdateTextbookInput) => Promise<boolean>;
  deleteTextbook: (id: string) => Promise<boolean>;
  duplicateTextbook: (id: string) => Promise<boolean>;
  
  // File upload
  uploadFiles: (pdfFile: File, coverFile?: File) => Promise<{ pdfUrl: string; coverUrl?: string }>;
  
  // Selection and filtering
  setSelectedTextbook: (textbook: AdminTextbook | null) => void;
  setFilters: (filters: Partial<TextbookFilters>) => void;
  clearFilters: () => void;
  
  // Pagination
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  
  // Utility
  resetState: () => void;
  clearError: () => void;
  resetUploadProgress: () => void;
  
  // Derived data getters
  getFilteredSubjects: (level?: string, course?: string) => Subject[];
  getAvailableCourses: (level?: string) => Course[];
}

// Initial state
const initialState = {
  textbooks: [],
  selectedTextbook: null,
  filters: {},
  subjects: [],
  courses: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isLoadingSubjects: false,
  isLoadingCourses: false,
  subjectsError: null,
  uploadProgress: { pdf: 0, cover: 0 },
  currentPage: 1,
  totalPages: 0,
  itemsPerPage: 10,
  totalItems: 0,
  error: null,
};

export const useAdminTextbookStore = create<AdminTextbookState>((set, get) => ({
  ...initialState,

  fetchTextbooks: async (page = 1) => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters, itemsPerPage } = get();
      const offset = (page - 1) * itemsPerPage;
      
      // Build query
      let query = supabase
        .from('textbooks')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filters.level) {
        query = query.eq('level', filters.level);
      }
      if (filters.class) {
        query = query.eq('class', filters.class);
      }
      if (filters.course) {
        query = query.eq('course', filters.course);
      }
      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
      }
      
      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + itemsPerPage - 1);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      const totalPages = Math.ceil((count || 0) / itemsPerPage);
      
      set({
        textbooks: data || [],
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Error fetching textbooks:', error);
      set({
        error: error.message || 'Failed to fetch textbooks',
        isLoading: false,
      });
    }
  },

  // Fetch Operations
  fetchAllSubjects: async () => {
    set({ isLoadingSubjects: true, subjectsError: null });
    
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      const subjects: Subject[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        level: item.level,
        course: item.course, // This will be either string or array from database
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      
      // Remove duplicates based on id to ensure uniqueness
      const uniqueSubjects = subjects.filter((subject, index, self) => 
        index === self.findIndex(s => s.id === subject.id)
      );
      
      set({ subjects: uniqueSubjects, isLoadingSubjects: false });
      return uniqueSubjects;
    } catch (error: any) {
      console.error('Error fetching all subjects:', error);
      set({ 
        subjectsError: error.message || 'Failed to fetch subjects',
        isLoadingSubjects: false
      });
      return [];
    }
  },

  fetchSubjects: async (level, course) => {
    set({ isLoadingSubjects: true, subjectsError: null });
    
    try {
      let query = supabase
        .from('subjects')
        .select('*')
        .eq('level', level)
        .order('name');
      
if (level === 'SHS' && course) {
            query = query.contains('course', [course]);
          }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const subjects: Subject[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        level: item.level,
        course: item.course, // This will be either string or array from database
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      
      // Remove duplicates based on id to ensure uniqueness
      const uniqueSubjects = subjects.filter((subject, index, self) => 
        index === self.findIndex(s => s.id === subject.id)
      );
      
      set({ subjects: uniqueSubjects, isLoadingSubjects: false });
      return uniqueSubjects;
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      set({ 
        subjectsError: error.message || 'Failed to fetch subjects',
        isLoadingSubjects: false
      });
      return [];
    }
  },

  // Derived data getters
  getFilteredSubjects: (level, course) => {
    const { subjects } = get();
    
    if (!level) return subjects;
    
    let filtered = subjects.filter(subject => subject.level === level);
    
    if (level === 'SHS' && course) {
      filtered = filtered.filter(subject => {
        if (!subject.course) return false;
        
        if (Array.isArray(subject.course)) {
          // If course is an array, check if the selected course is in the array
          return subject.course.includes(course);
        } else if (typeof subject.course === 'string') {
          // If course is a string, check for exact match
          return subject.course === course;
        }
        
        return false;
      });
    }
    
    return filtered;
  },

  getAvailableCourses: (level) => {
    const { subjects } = get();
    
    if (level !== 'SHS') return [];
    
    // Extract all unique courses from SHS subjects
    const courseSet = new Set<string>();
    
    // Filter SHS subjects and ensure we have course data
    const shsSubjects = subjects.filter(subject => 
      subject.level === 'SHS' && 
      subject.course && 
      (subject.course !== null && subject.course !== undefined)
    );
    
    console.log('SHS Subjects for course extraction:', shsSubjects.length, 'subjects');
    
    shsSubjects.forEach(subject => {
      if (Array.isArray(subject.course)) {
        // If course is an array, add each course to the set
        subject.course.forEach(course => {
          if (course && typeof course === 'string' && course.trim() !== '') {
            courseSet.add(course.trim());
          }
        });
      } else if (typeof subject.course === 'string' && subject.course.trim() !== '') {
        // If course is a string, add it to the set
        courseSet.add(subject.course.trim());
      }
    });
    
    const uniqueCourses = Array.from(courseSet).sort();
    console.log('Final unique courses:', uniqueCourses);
    
    // Convert set to array and sort alphabetically
    return uniqueCourses.map(course => ({ name: course }));
  },

  uploadFiles: async (pdfFile, coverFile) => {
    try {
      // Reset upload progress
      set({ uploadProgress: { pdf: 0, cover: 0 } });
      
      // Upload PDF
      set(state => ({ 
        uploadProgress: { ...state.uploadProgress, pdf: 10 } 
      }));
      
      const pdfResult = await uploadToCloudinary(pdfFile, 'curriculum/pdfs');
      
      set(state => ({ 
        uploadProgress: { ...state.uploadProgress, pdf: 100 } 
      }));
      
      let coverResult;
      if (coverFile) {
        set(state => ({ 
          uploadProgress: { ...state.uploadProgress, cover: 10 } 
        }));
        
        coverResult = await uploadToCloudinary(coverFile, 'curriculum/thumbnails');
        
        set(state => ({ 
          uploadProgress: { ...state.uploadProgress, cover: 100 } 
        }));
      }
      
      return {
        pdfUrl: pdfResult.secure_url,
        coverUrl: coverResult?.secure_url,
      };
    } catch (error: any) {
      console.error('Error uploading files:', error);
      throw new Error(error.message || 'Failed to upload files');
    }
  },

  createTextbook: async (textbookData, pdfFile, coverFile) => {
    set({ isCreating: true, error: null });
    
    try {
      // Upload files first
      const { pdfUrl, coverUrl } = await get().uploadFiles(pdfFile, coverFile);
      
      // Create textbook with uploaded URLs
      const { data, error } = await supabase
        .from('textbooks')
        .insert([{
          ...textbookData,
          pdf_url: pdfUrl,
          cover_url: coverUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh the textbooks list
      await get().fetchTextbooks(get().currentPage);
      
      set({ isCreating: false });
      get().resetUploadProgress();
      return true;
    } catch (error: any) {
      console.error('Error creating textbook:', error);
      set({
        error: error.message || 'Failed to create textbook',
        isCreating: false,
      });
      get().resetUploadProgress();
      return false;
    }
  },

  updateTextbook: async (textbookData) => {
    set({ isUpdating: true, error: null });
    
    try {
      const { id, ...updateData } = textbookData;
      
      const { data, error } = await supabase
        .from('textbooks')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the textbook in the local state
      set((state) => ({
        textbooks: state.textbooks.map((book) =>
          book.id === id ? { ...book, ...data } : book
        ),
        selectedTextbook: state.selectedTextbook?.id === id 
          ? { ...state.selectedTextbook, ...data } 
          : state.selectedTextbook,
        isUpdating: false,
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error updating textbook:', error);
      set({
        error: error.message || 'Failed to update textbook',
        isUpdating: false,
      });
      return false;
    }
  },

  deleteTextbook: async (id) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('textbooks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove the textbook from local state
      set((state) => ({
        textbooks: state.textbooks.filter((book) => book.id !== id),
        selectedTextbook: state.selectedTextbook?.id === id ? null : state.selectedTextbook,
        totalItems: state.totalItems - 1,
        isDeleting: false,
      }));
      
      // If current page is empty and not the first page, go to previous page
      const { textbooks, currentPage, itemsPerPage } = get();
      if (textbooks.length === 0 && currentPage > 1) {
        await get().fetchTextbooks(currentPage - 1);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error deleting textbook:', error);
      set({
        error: error.message || 'Failed to delete textbook',
        isDeleting: false,
      });
      return false;
    }
  },

  duplicateTextbook: async (id) => {
    set({ isCreating: true, error: null });
    
    try {
      // First, fetch the textbook to duplicate
      const { data: originalBook, error: fetchError } = await supabase
        .from('textbooks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Create a copy with modified title
      const duplicateData: CreateTextbookInput = {
        title: `${originalBook.title} (Copy)`,
        author: originalBook.author,
        description: originalBook.description,
        pdf_url: originalBook.pdf_url,
        cover_url: originalBook.cover_url,
        publisher: originalBook.publisher,
        year: originalBook.year,
        level: originalBook.level,
        class: originalBook.class,
        course: originalBook.course,
        subject: originalBook.subject,
        subject_id: originalBook.subject_id,
        reference: originalBook.reference || 'learner', // Default to learner if not set
      };
      
      const { data, error } = await supabase
        .from('textbooks')
        .insert([{
          ...duplicateData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh the textbooks list
      await get().fetchTextbooks(get().currentPage);
      
      set({ isCreating: false });
      return true;
    } catch (error: any) {
      console.error('Error duplicating textbook:', error);
      set({
        error: error.message || 'Failed to duplicate textbook',
        isCreating: false,
      });
      return false;
    }
  },

  setSelectedTextbook: (textbook) => set({ selectedTextbook: textbook }),

  setFilters: (newFilters) => set((state) => {
    const filters = { ...state.filters, ...newFilters };
    return { filters, currentPage: 1 }; // Reset to first page when filters change
  }),

  clearFilters: () => set({ filters: {}, currentPage: 1 }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setItemsPerPage: (items) => set((state) => ({
    itemsPerPage: items,
    currentPage: 1, // Reset to first page when changing items per page
  })),

  resetState: () => set(initialState),

  clearError: () => set({ error: null }),

  resetUploadProgress: () => set({ uploadProgress: { pdf: 0, cover: 0 } }),
}));

// Helper hook for bulk operations
export const useBulkTextbookOperations = () => {
  const store = useAdminTextbookStore();
  
  const bulkDelete = async (ids: string[]): Promise<boolean> => {
    useAdminTextbookStore.setState({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('textbooks')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      // Refresh the textbooks list
      await store.fetchTextbooks(store.currentPage);
      
      useAdminTextbookStore.setState({ isDeleting: false });
      return true;
    } catch (error: any) {
      console.error('Error bulk deleting textbooks:', error);
      useAdminTextbookStore.setState({
        error: error.message || 'Failed to delete textbooks',
        isDeleting: false,
      });
      return false;
    }
  };
  
  const bulkUpdateField = async (ids: string[], field: string, value: any): Promise<boolean> => {
    useAdminTextbookStore.setState({ isUpdating: true, error: null });
    
    try {
      const { error } = await supabase
        .from('textbooks')
        .update({ 
          [field]: value,
          updated_at: new Date().toISOString(),
        })
        .in('id', ids);
      
      if (error) throw error;
      
      // Refresh the textbooks list
      await store.fetchTextbooks(store.currentPage);
      
      useAdminTextbookStore.setState({ isUpdating: false });
      return true;
    } catch (error: any) {
      console.error('Error bulk updating textbooks:', error);
      useAdminTextbookStore.setState({
        error: error.message || 'Failed to update textbooks',
        isUpdating: false,
      });
      return false;
    }
  };
  
  return {
    bulkDelete,
    bulkUpdateField,
  };
};