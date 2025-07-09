import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

// Types
export interface CurriculumOptions {
  level: string;
  class: string;
  course?: string; // For SHS
  subject: string;
}

export interface CurriculumDocument {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  thumbnailUrl: string;
  level: string;
  class: string; // e.g., "JHS 1", "SHS 2"
  subject: string;
  course?: string; // For SHS only
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurriculumDocument {
  title: string;
  description: string;
  pdfUrl: string;
  thumbnailUrl: string;
  level: string;
  class: string;
  subject: string;
  course?: string;
}

export interface UpdateCurriculumDocument {
  id: string;
  title?: string;
  description?: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  class?: string;
  subject?: string;
  course?: string;
}

export interface FilterOptions {
  level?: string;
  class?: string;
  course?: string;
  subject?: string;
  searchTerm?: string;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Subject interface for database
export interface Subject {
  id: string;
  name: string;
  level: string;
  course?: string; // Only for SHS subjects
  createdAt: string;
  updatedAt: string;
}

// SHS Courses - exported as a constant
export const shsCourses = [
  'Core Subject',
  'General Science',
  'General Arts',
  'Business',
  'Home Economics',
  'Visual Arts',
  'Agriculture Science',
  'Technical'
];

interface AdminCurriculumState {
  // Data
  documents: CurriculumDocument[];
  selectedDocument: CurriculumDocument | null;
  subjects: Subject[];
  filters: FilterOptions;
  pagination: PaginationState;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingSubjects: boolean;
  isLoadingDocument: boolean;
  
  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  subjectsError: string | null;
  documentError: string | null;
  
  // Actions
  fetchDocuments: () => Promise<void>;
  fetchDocumentById: (id: string) => Promise<CurriculumDocument | null>;
  fetchSubjects: (level?: string, course?: string) => Promise<void>;
  createDocument: (document: CreateCurriculumDocument) => Promise<boolean>;
  updateDocument: (document: UpdateCurriculumDocument) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  deleteManyDocuments: (ids: string[]) => Promise<boolean>;
  checkDuplicateDocument: (level: string, classNum: string, subject: string, course?: string) => Promise<any>;
  
  // Selection and filtering
  setSelectedDocument: (document: CurriculumDocument | null) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Utility
  getSubjectsForLevel: (level?: string, course?: string) => Subject[];
  resetState: () => void;
  clearErrors: () => void;
}

// Initial state
const initialState = {
  documents: [],
  selectedDocument: null,
  subjects: [],
  filters: {},
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isLoadingSubjects: false,
  isLoadingDocument: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  subjectsError: null,
  documentError: null,
};

export const useAdminCurriculumStore = create<AdminCurriculumState>((set, get) => ({
  ...initialState,

  fetchDocumentById: async (id: string) => {
    set({ isLoadingDocument: true, documentError: null });

    try {
      const { data, error } = await supabase
        .from('curriculum_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Document not found');
      }

      // Transform data to match interface
      const document: CurriculumDocument = {
        id: data.id,
        title: data.title,
        description: data.description,
        pdfUrl: data.pdf_url,
        thumbnailUrl: data.thumbnail_url,
        class: data.class,
        level: data.level,
        subject: data.subject,
        course: data.course,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      set({
        selectedDocument: document,
        isLoadingDocument: false,
      });

      return document;
    } catch (error: any) {
      console.error('Error fetching curriculum document:', error);
      set({
        documentError: error.message || 'Failed to fetch curriculum document',
        isLoadingDocument: false,
      });
      return null;
    }
  },

  fetchSubjects: async (level, course) => {
    set({ isLoadingSubjects: true, subjectsError: null });

    try {
      let query = supabase
        .from('subjects')
        .select('*')
        .order('name');

      // Filter by level if provided
      if (level) {
        query = query.eq('level', level);
      }

      // Filter by course if provided (for SHS subjects)
      if (course) {
        query = query.eq('course', course);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match interface
      const subjects: Subject[] = (data || []).map(subject => ({
        id: subject.id,
        name: subject.name,
        level: subject.level,
        course: subject.course,
        createdAt: subject.created_at,
        updatedAt: subject.updated_at,
      }));

      set({
        subjects,
        isLoadingSubjects: false,
      });
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      set({
        subjectsError: error.message || 'Failed to fetch subjects',
        isLoadingSubjects: false,
      });
    }
  },

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });

    try {
      const { filters, pagination } = get();
      
      // Build query
      let query = supabase
        .from('curriculum_documents')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.level && filters.class) {
       
        query = query.eq('class', filters.class);
      }
      
      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }
      
      if (filters.course) {
        query = query.eq('course', filters.course);
      }
      
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      // Apply pagination
      const from = (pagination.currentPage - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      // Order by updated_at desc
      query = query.order('updated_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      // Transform data to match interface
      const documents: CurriculumDocument[] = (data || []).map(doc => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        pdfUrl: doc.pdf_url,
        thumbnailUrl: doc.thumbnail_url,
        class: doc.class,
        level: doc.level,
        subject: doc.subject,
        course: doc.course,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
      }));

      set({
        documents,
        pagination: {
          ...pagination,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pagination.pageSize),
        },
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Error fetching curriculum documents:', error);
      set({
        error: error.message || 'Failed to fetch curriculum documents',
        isLoading: false,
      });
    }
  },

  createDocument: async (document) => {
    set({ isCreating: true, createError: null });

    try {
      const { data, error } = await supabase
        .from('curriculum_documents')
        .insert({
          title: document.title,
          description: document.description,
          pdf_url: document.pdfUrl,
          thumbnail_url: document.thumbnailUrl,
          level: document.level,
          class: document.class,
          subject: document.subject,
          course: document.course,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newDocument: CurriculumDocument = {
        id: data.id,
        title: data.title,
        description: data.description,
        pdfUrl: data.pdf_url,
        thumbnailUrl: data.thumbnail_url,
        class: data.class,
        level: data.level,
        subject: data.subject,
        course: data.course,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      set((state) => ({
        documents: [newDocument, ...state.documents],
        pagination: {
          ...state.pagination,
          totalCount: state.pagination.totalCount + 1,
          totalPages: Math.ceil((state.pagination.totalCount + 1) / state.pagination.pageSize),
        },
        isCreating: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error creating curriculum document:', error);
      set({
        createError: error.message || 'Failed to create curriculum document',
        isCreating: false,
      });
      return false;
    }
  },
// Add this method to your useAdminCurriculumStore in the store file

checkDuplicateDocument: async (
  level: string,
  classNum: string,
  subject: string,
  course?: string
) => {
  try {
    let query = supabase
      .from('curriculum_documents')
      .select('id, title')
      .eq('class', classNum)
      .eq('subject', subject);

    // Add course filter for SHS documents
    if (level === 'SHS' && course) {
      query = query.eq('course', course);
    } else if (level === 'JHS' || level === 'Basic') {
      // For JHS and Basic, course should be null
      query = query.is('course', null);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data && data.length > 0 ? data[0] : null;
  } catch (error: any) {
    console.error('Error checking for duplicate document:', error);
    throw new Error('Failed to check for existing documents');
  }
},

  updateDocument: async (document) => {
    set({ isUpdating: true, updateError: null });

    try {
      const updateData: any = {};
      
      if (document.title !== undefined) updateData.title = document.title;
      if (document.description !== undefined) updateData.description = document.description;
      if (document.pdfUrl !== undefined) updateData.pdf_url = document.pdfUrl;
      if (document.thumbnailUrl !== undefined) updateData.thumbnail_url = document.thumbnailUrl;
      if (document.class !== undefined) updateData.class = document.class;
      if (document.subject !== undefined) updateData.subject = document.subject;
      if (document.course !== undefined) updateData.course = document.course;

      const { data, error } = await supabase
        .from('curriculum_documents')
        .update(updateData)
        .eq('id', document.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const updatedDocument: CurriculumDocument = {
        id: data.id,
        title: data.title,
        description: data.description,
        pdfUrl: data.pdf_url,
        thumbnailUrl: data.thumbnail_url,
        class: data.class,
        level: data.level,
        subject: data.subject,
        course: data.course,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      set((state) => ({
        documents: state.documents.map(doc => 
          doc.id === document.id ? updatedDocument : doc
        ),
        selectedDocument: state.selectedDocument?.id === document.id 
          ? updatedDocument 
          : state.selectedDocument,
        isUpdating: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error updating curriculum document:', error);
      set({
        updateError: error.message || 'Failed to update curriculum document',
        isUpdating: false,
      });
      return false;
    }
  },

  deleteDocument: async (id) => {
    set({ isDeleting: true, deleteError: null });

    try {
      const { error } = await supabase
        .from('curriculum_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      set((state) => ({
        documents: state.documents.filter(doc => doc.id !== id),
        selectedDocument: state.selectedDocument?.id === id 
          ? null 
          : state.selectedDocument,
        pagination: {
          ...state.pagination,
          totalCount: Math.max(0, state.pagination.totalCount - 1),
          totalPages: Math.ceil(Math.max(0, state.pagination.totalCount - 1) / state.pagination.pageSize),
        },
        isDeleting: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error deleting curriculum document:', error);
      set({
        deleteError: error.message || 'Failed to delete curriculum document',
        isDeleting: false,
      });
      return false;
    }
  },

  deleteManyDocuments: async (ids) => {
    set({ isDeleting: true, deleteError: null });

    try {
      const { error } = await supabase
        .from('curriculum_documents')
        .delete()
        .in('id', ids);

      if (error) throw error;

      // Remove from local state
      set((state) => ({
        documents: state.documents.filter(doc => !ids.includes(doc.id)),
        selectedDocument: ids.includes(state.selectedDocument?.id || '') 
          ? null 
          : state.selectedDocument,
        pagination: {
          ...state.pagination,
          totalCount: Math.max(0, state.pagination.totalCount - ids.length),
          totalPages: Math.ceil(Math.max(0, state.pagination.totalCount - ids.length) / state.pagination.pageSize),
        },
        isDeleting: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error deleting curriculum documents:', error);
      set({
        deleteError: error.message || 'Failed to delete curriculum documents',
        isDeleting: false,
      });
      return false;
    }
  },

  setSelectedDocument: (document) => set({ selectedDocument: document }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, currentPage: 1 }, // Reset to first page when filtering
  })),

  clearFilters: () => set((state) => ({
    filters: {},
    pagination: { ...state.pagination, currentPage: 1 },
  })),

  setPage: (page) => set((state) => ({
    pagination: { ...state.pagination, currentPage: page },
  })),

  setPageSize: (pageSize) => set((state) => ({
    pagination: { 
      ...state.pagination, 
      pageSize, 
      currentPage: 1,
      totalPages: Math.ceil(state.pagination.totalCount / pageSize),
    },
  })),

getSubjectsForLevel: (level, course) => {
  const { subjects } = get();

  if (!level) {
    return subjects;
  }

  if (level === 'JHS') {
    return subjects.filter(subject => subject.level === 'JHS');
  } else if (level === 'SHS') {
    if (course) {
      return subjects.filter(subject =>
        subject.level === 'SHS' && subject.course === course
      );
    } else {
      return subjects.filter(subject => subject.level === 'SHS');
    }
  } else if (level === 'Basic') {
    return subjects.filter(subject => subject.level === 'Basic');
  }

  return subjects;
},


  resetState: () => set(initialState),

  clearErrors: () => set({
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    subjectsError: null,
    documentError: null,
  }),
}));