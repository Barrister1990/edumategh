import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

// Types
export interface LessonNoteOptions {
  level: 'JHS' | 'SHS';
  class: '1' | '2' | '3';
  course?: string;
  subject?: string;
  subjectId?: string;
  strand: string;
  strandId?: string;
  subStrand: string;
  indicator: string;
  indicatorId?: string;
}

export interface LessonNote {
  id?: string;
  title: string;
  description: string;
  pdfUrl: string;
  thumbnailUrl: string;
  level: 'JHS' | 'SHS';
  class: string;
  course?: string; // Only for SHS
  strand: string;
  subStrand: string;
  indicator: string;
  subject: string;
  subjectId: string;
  strandId: string;
  indicatorId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonNoteInput {
  title: string;
  description: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  level: 'JHS' | 'SHS';
  class: string;
  course?: string; // Only for SHS
  strand: string;
  subStrand: string;
  indicator: string;
  subject: string;
  subjectId: string;
  strandId: string;
  indicatorId: string;
}

export interface UpdateLessonNoteInput extends Partial<CreateLessonNoteInput> {
  id: string;
}

export interface LessonNoteFilters {
  level?: string;
  class?: string;
  course?: string;
  subjectId?: string;
  strandId?: string;
  indicatorId?: string;
  search?: string;
}

// New interfaces for curriculum data
export interface Subject {
  id: string;
  name: string;
  level: 'JHS' | 'SHS';
  course?: string; // Only for SHS subjects
  createdAt: string;
  updatedAt: string;
}

export interface Strand {
  id: string;
  name: string;
  subjectId: string;
  subject: string; // Subject name for display
  level: 'JHS' | 'SHS';
  class: string;
  course?: string; // Only for SHS
  createdAt: string;
  updatedAt: string;
}

export interface SubStrand {
  id: string;
  name: string;
  strandId: string;
  strand: string; // Strand name for display
  subjectId: string;
  subject: string; // Subject name for display
  createdAt: string;
  updatedAt: string;
}

export interface Indicator {
  id: string;
  name: string;
  subStrandId: string;
  subStrand: string; // Sub-strand name for display
  strandId: string;
  strand: string; // Strand name for display
  subjectId: string;
  subject: string; // Subject name for display
  level: 'JHS' | 'SHS';
  class: string;
  course?: string; // Only for SHS
  createdAt: string;
  updatedAt: string;
}

interface AdminLessonNoteState {
  // Data
  lessonNotes: LessonNote[];
  selectedLessonNote: LessonNote | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  
  // Curriculum data
  subjects: Subject[];
  strands: Strand[];
  subStrands: SubStrand[];
  indicators: Indicator[];
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingSubjects: boolean;
  isLoadingStrands: boolean;
  isLoadingSubStrands: boolean;
  isLoadingIndicators: boolean;
  
  // Error states
  error: string | null;
  subjectsError: string | null;
  strandsError: string | null;
  subStrandsError: string | null;
  indicatorsError: string | null;
  
  // Filters
  filters: LessonNoteFilters;
  
  // Lesson note options for forms
  lessonNoteOptions: LessonNoteOptions | null;
  
  // Actions - CRUD Operations
  fetchLessonNotes: (page?: number, pageSize?: number) => Promise<void>;
  fetchLessonNoteById: (id: string) => Promise<LessonNote | null>;
  createLessonNote: (input: CreateLessonNoteInput) => Promise<LessonNote | null>;
  updateLessonNote: (input: UpdateLessonNoteInput) => Promise<LessonNote | null>;
  deleteLessonNote: (id: string) => Promise<boolean>;
  bulkDeleteLessonNotes: (ids: string[]) => Promise<boolean>;
  
  // Actions - Selection and State Management
  setSelectedLessonNote: (lessonNote: LessonNote | null) => void;
  setFilters: (filters: Partial<LessonNoteFilters>) => void;
  clearFilters: () => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Actions - Form helpers and curriculum data fetching
  setLessonNoteOptions: (options: Partial<LessonNoteOptions>) => void;
  fetchSubjects: (level: string, classNum: string, course?: string) => Promise<Subject[]>;
 fetchStrands: (subjectId: string, level: string, classLevel: string, course?: string) => Promise<Strand[]>;
  fetchSubStrands: (strandId: string) => Promise<SubStrand[]>;
  fetchIndicators: (subStrandId: string) => Promise<Indicator[]>;
  
  // Actions - Utility getters
  getSubjectsForLevel: (level?: 'JHS' | 'SHS', course?: string) => Subject[];
  getStrandsForSubject: (subjectId: string) => Strand[];
  getSubStrandsForStrand: (strandId: string) => SubStrand[];
  getIndicatorsForSubStrand: (subStrandId: string) => Indicator[];
  
  // Actions - Utility
  resetState: () => void;
  clearError: () => void;
  clearCurriculumErrors: () => void;
}

// SHS Courses
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

// Default lesson note options
const defaultLessonNoteOptions: LessonNoteOptions = {
  level: 'JHS',
  class: '1',
  course: undefined,
  subject: undefined,
  subjectId: undefined,
  strand: '',
  strandId: undefined,
  subStrand: '',
  indicator: '',
  indicatorId: undefined,
};

// Initial state
const initialState = {
  lessonNotes: [],
  selectedLessonNote: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  subjects: [],
  strands: [],
  subStrands: [],
  indicators: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isLoadingSubjects: false,
  isLoadingStrands: false,
  isLoadingSubStrands: false,
  isLoadingIndicators: false,
  error: null,
  subjectsError: null,
  strandsError: null,
  subStrandsError: null,
  indicatorsError: null,
  filters: {},
  lessonNoteOptions: defaultLessonNoteOptions,
};

export const useAdminLessonNoteStore = create<AdminLessonNoteState>((set, get) => ({
  ...initialState,

  // CRUD Operations (keeping existing implementation)
  fetchLessonNotes: async (page = 1, pageSize = 10) => {
    set({ isLoading: true, error: null });
    
    try {
      const { filters } = get();
      const offset = (page - 1) * pageSize;
      
      // Build query with filters - selecting only the columns that exist in your table
      let query = supabase
        .from('lesson_notes')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filters.level) query = query.eq('level', filters.level);
      if (filters.class) query = query.eq('class', filters.class);
      if (filters.course) query = query.eq('course', filters.course);
      if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);
      if (filters.strandId) query = query.eq('strand_id', filters.strandId);
      if (filters.indicatorId) query = query.eq('indicator_id', filters.indicatorId);
      
      // Search filter
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      // Pagination and ordering
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
      
      if (error) throw error;
      
      // Transform data to match your table structure
      const transformedData: LessonNote[] = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        pdfUrl: item.pdf_url,
        thumbnailUrl: item.thumbnail_url || 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg',
        level: item.level,
        class: item.class,
        course: item.course, // Only exists for SHS
        strand: item.strand,
        subStrand: item.substrand,
        indicator: item.indicator,
        subject: item.subject,
        subjectId: item.subject_id,
        strandId: item.strand_id,
        indicatorId: item.indicator_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })) || [];
      
      set({ 
        lessonNotes: transformedData,
        totalCount: count || 0,
        currentPage: page,
        pageSize,
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching lesson notes:', error);
      set({ 
        error: error.message || 'Failed to fetch lesson notes',
        isLoading: false 
      });
    }
  },

  fetchLessonNoteById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('lesson_notes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: LessonNote = {
          id: data.id,
          title: data.title,
          description: data.description,
          pdfUrl: data.pdf_url,
          thumbnailUrl: data.thumbnail_url || 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg',
          level: data.level,
          class: data.class,
          course: data.course,
          strand: data.strand,
          subStrand: data.substrand,
          indicator: data.indicator,
          subject: data.subject,
          subjectId: data.subject_id,
          strandId: data.strand_id,
          indicatorId: data.indicator_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set({ selectedLessonNote: transformedData, isLoading: false });
        return transformedData;
      }
      
      set({ isLoading: false });
      return null;
    } catch (error: any) {
      console.error('Error fetching lesson note:', error);
      set({ 
        error: error.message || 'Failed to fetch lesson note',
        isLoading: false 
      });
      return null;
    }
  },

  createLessonNote: async (input: CreateLessonNoteInput) => {
    set({ isCreating: true, error: null });
    
    try {
      const insertData = {
        title: input.title,
        description: input.description,
        pdf_url: input.pdfUrl,
        thumbnail_url: input.thumbnailUrl || 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg',
        level: input.level,
        class: input.class,
        course: input.level === 'SHS' ? input.course : null, // Only for SHS
        strand: input.strand,
        sub_strand: input.subStrand, // Note: using 'substrand' to match your table
        indicator: input.indicator,
        subject: input.subject,
        subject_id: input.subjectId,
        strand_id: input.strandId,
        indicator_id: input.indicatorId,
      };
      
      const { data, error } = await supabase
        .from('lesson_notes')
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: LessonNote = {
          id: data.id,
          title: data.title,
          description: data.description,
          pdfUrl: data.pdf_url,
          thumbnailUrl: data.thumbnail_url,
          level: data.level,
          class: data.class,
          course: data.course,
          strand: data.strand,
          subStrand: data.subStrand,
          indicator: data.indicator,
          subject: data.subject,
          subjectId: data.subject_id,
          strandId: data.strand_id,
          indicatorId: data.indicator_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        // Add to the beginning of the list
        set(state => ({
          lessonNotes: [transformedData, ...state.lessonNotes],
          totalCount: state.totalCount + 1,
          isCreating: false
        }));
        
        return transformedData;
      }
      
      set({ isCreating: false });
      return null;
    } catch (error: any) {
      console.error('Error creating lesson note:', error);
      set({ 
        error: error.message || 'Failed to create lesson note',
        isCreating: false 
      });
      return null;
    }
  },

  updateLessonNote: async (input: UpdateLessonNoteInput) => {
    set({ isUpdating: true, error: null });
    
    try {
      const updateData: any = {};
      
      // Only include fields that are provided
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.pdfUrl !== undefined) updateData.pdf_url = input.pdfUrl;
      if (input.thumbnailUrl !== undefined) updateData.thumbnail_url = input.thumbnailUrl;
      if (input.level !== undefined) updateData.level = input.level;
      if (input.class !== undefined) updateData.class = input.class;
      if (input.course !== undefined) updateData.course = input.course;
      if (input.strand !== undefined) updateData.strand = input.strand;
      if (input.subStrand !== undefined) updateData.substrand = input.subStrand;
      if (input.indicator !== undefined) updateData.indicator = input.indicator;
      if (input.subject !== undefined) updateData.subject = input.subject;
      if (input.subjectId !== undefined) updateData.subject_id = input.subjectId;
      if (input.strandId !== undefined) updateData.strand_id = input.strandId;
      if (input.indicatorId !== undefined) updateData.indicator_id = input.indicatorId;
      
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('lesson_notes')
        .update(updateData)
        .eq('id', input.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: LessonNote = {
          id: data.id,
          title: data.title,
          description: data.description,
          pdfUrl: data.pdf_url,
          thumbnailUrl: data.thumbnail_url,
          level: data.level,
          class: data.class,
          course: data.course,
          strand: data.strand,
          subStrand: data.substrand,
          indicator: data.indicator,
          subject: data.subject,
          subjectId: data.subject_id,
          strandId: data.strand_id,
          indicatorId: data.indicator_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        // Update the item in the list
        set(state => ({
          lessonNotes: state.lessonNotes.map(note => 
            note.id === input.id ? transformedData : note
          ),
          selectedLessonNote: state.selectedLessonNote?.id === input.id ? transformedData : state.selectedLessonNote,
          isUpdating: false
        }));
        
        return transformedData;
      }
      
      set({ isUpdating: false });
      return null;
    } catch (error: any) {
      console.error('Error updating lesson note:', error);
      set({ 
        error: error.message || 'Failed to update lesson note',
        isUpdating: false 
      });
      return null;
    }
  },

  deleteLessonNote: async (id: string) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('lesson_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from the list
      set(state => ({
        lessonNotes: state.lessonNotes.filter(note => note.id !== id),
        selectedLessonNote: state.selectedLessonNote?.id === id ? null : state.selectedLessonNote,
        totalCount: state.totalCount - 1,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting lesson note:', error);
      set({ 
        error: error.message || 'Failed to delete lesson note',
        isDeleting: false 
      });
      return false;
    }
  },

  bulkDeleteLessonNotes: async (ids: string[]) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('lesson_notes')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      // Remove from the list
      set(state => ({
        lessonNotes: state.lessonNotes.filter(note => !ids.includes(note.id!)),
        selectedLessonNote: ids.includes(state.selectedLessonNote?.id!) ? null : state.selectedLessonNote,
        totalCount: state.totalCount - ids.length,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error bulk deleting lesson notes:', error);
      set({ 
        error: error.message || 'Failed to delete lesson notes',
        isDeleting: false 
      });
      return false;
    }
  },

  // Selection and State Management
  setSelectedLessonNote: (lessonNote) => set({ selectedLessonNote: lessonNote }),

  setFilters: (filters) => set(state => ({ 
    filters: { ...state.filters, ...filters },
    currentPage: 1 // Reset to first page when filters change
  })),

  clearFilters: () => set({ filters: {}, currentPage: 1 }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

  // Form helpers
  setLessonNoteOptions: (options) => set((state) => {
    const newOptions = { ...state.lessonNoteOptions, ...options } as LessonNoteOptions;
    
    // Reset dependent fields when higher-level options change
    if (options.level) {
      newOptions.class = '1';
      newOptions.course = undefined;
      newOptions.subject = undefined;
      newOptions.subjectId = undefined;
      newOptions.strand = '';
      newOptions.strandId = undefined;
      newOptions.subStrand = '';
      newOptions.indicator = '';
      newOptions.indicatorId = undefined;
    }
    
    if (options.level === 'SHS' && options.class && !options.course) {
      newOptions.course = 'Core Subject';
      newOptions.subject = undefined;
      newOptions.subjectId = undefined;
      newOptions.strand = '';
      newOptions.strandId = undefined;
      newOptions.subStrand = '';
      newOptions.indicator = '';
      newOptions.indicatorId = undefined;
    }
    
    if (options.class || options.course || options.subject || options.subjectId) {
      newOptions.strand = '';
      newOptions.strandId = undefined;
      newOptions.subStrand = '';
      newOptions.indicator = '';
      newOptions.indicatorId = undefined;
    }
    
    if (options.strand || options.strandId) {
      newOptions.subStrand = '';
      newOptions.indicator = '';
      newOptions.indicatorId = undefined;
    }
    
    if (options.subStrand) {
      newOptions.indicator = '';
      newOptions.indicatorId = undefined;
    }
    
    return { lessonNoteOptions: newOptions };
  }),

  // Enhanced curriculum data fetching methods
  fetchSubjects: async (level, classNum, course) => {
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
        course: item.course,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      
      set({ subjects, isLoadingSubjects: false });
      return subjects;
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      set({ 
        subjectsError: error.message || 'Failed to fetch subjects',
        isLoadingSubjects: false
      });
      return [];
    }
  },

fetchStrands: async (subjectId: string, level: string, classLevel: string, course?: string) => {
  set({ isLoadingStrands: true, strandsError: null });
   
   const formattedClass = `${level} ${classLevel}`
   console.log(formattedClass)
  try {
    let query = supabase
      .from('curriculum_strands')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('level', level)
      .eq('class', formattedClass);
    
    // Add course filter for SHS
    if (level === 'SHS' && course) {
      query = query.eq('course', course);
    }
    
    const { data, error } = await query.order('strand');
    console.log(data)
    if (error) throw error;
    
    const strands: Strand[] = (data || []).map(item => ({
      id: item.id,
      name: item.strand,
      subjectId: item.subject_id,
      subject: item.subject,
      level: item.level,
      class: item.class,
      course: item.course,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
    
    set({ strands, isLoadingStrands: false });
    return strands;
  } catch (error: any) {
    console.error('Error fetching strands:', error);
    set({
      strandsError: error.message || 'Failed to fetch strands',
      isLoadingStrands: false
    });
    return [];
  }
},

  fetchSubStrands: async (strandId: string) => {
    set({ isLoadingSubStrands: true, subStrandsError: null });
    
    try {
      const { data, error } = await supabase
        .from('curriculum_sub_strands')
        .select('*')
        .eq('strand_id', strandId)
        .order('sub_strand');
      
      if (error) throw error;
      
      const subStrands: SubStrand[] = (data || []).map(item => ({
        id: item.id,
        name: item.sub_strand,
        strandId: item.strand_id,
        strand: item.strand,
        subjectId: item.subject_id,
        subject: item.subject,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      
      set({ subStrands, isLoadingSubStrands: false });
      return subStrands;
    } catch (error: any) {
      console.error('Error fetching sub-strands:', error);
      set({ 
        subStrandsError: error.message || 'Failed to fetch sub-strands',
        isLoadingSubStrands: false
      });
      return [];
    }
  },

  fetchIndicators: async (subStrandId: string) => {
    set({ isLoadingIndicators: true, indicatorsError: null });
    
    try {
      const { data, error } = await supabase
        .from('curriculum_indicators')
        .select('*')
        .eq('sub_strand_id', subStrandId)
        .order('indicator');
      
      if (error) throw error;
      
      const indicators: Indicator[] = (data || []).map(item => ({
        id: item.id,
        name: item.indicator,
        subStrandId: item.sub_strand_id,
        subStrand: item.sub_strand,
        strandId: item.strand_id,
        strand: item.strand,
        subjectId: item.subject_id,
        subject: item.subject,
        level: item.level,
        class: item.class,
        course: item.course,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      
      set({ indicators, isLoadingIndicators: false });
      return indicators;
    } catch (error: any) {
      console.error('Error fetching indicators:', error);
      set({ 
        indicatorsError: error.message || 'Failed to fetch indicators',
        isLoadingIndicators: false
      });
      return [];
    }
  },

  // Utility getters
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
    }
    
    return subjects;
  },

  getStrandsForSubject: (subjectId: string) => {
    const { strands } = get();
    return strands.filter(strand => strand.subjectId === subjectId);
  },

  getSubStrandsForStrand: (strandId: string) => {
    const { subStrands } = get();
    return subStrands.filter(subStrand => subStrand.strandId === strandId);
  },

  getIndicatorsForSubStrand: (subStrandId: string) => {
    const { indicators } = get();
    return indicators.filter(indicator => indicator.subStrandId === subStrandId);
  },

  // Utility
  resetState: () => set(initialState),
  clearError: () => set({ error: null }),
  clearCurriculumErrors: () => set({
    subjectsError: null,
    strandsError: null,
    subStrandsError: null,
    indicatorsError: null,
  }),
}));