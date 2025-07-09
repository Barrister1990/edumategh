import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

// Types
export interface Subject {
  id: string;
  name: string;
  class: string;
  level: string;
  description?: string;
  course?: string; // Only for SHS level subjects
}

export interface CurriculumStrand {
  id: string;
  strand: string;
  subject_id: string;
}

export interface CurriculumSubStrand {
  id: string;
  sub_strand: string;
  strand_id: string; // Links to curriculum_strands, not directly to subject
}

export interface LessonContent {
  id: number;
  type: 'text' | 'image' | 'video' | 'quiz';
  content: string;
  explanation?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  };
}

export interface Lesson {
  id?: string;
  title: string;
  subject_id: string;
  substrand_id: string;
  substrand: string;
  course: string;
  subject:string;
  level: string;
  class: string;
  content: LessonContent[];
  description?: string;
  duration_minutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  created_at?: string;
  updated_at?: string;
}

export interface CreateLessonData {
  title: string;
  subject_id: string;
  substrand_id: string;
  level: string;
  class: string;
  content: LessonContent[];
  description?: string;
  duration_minutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface UpdateLessonData extends Partial<CreateLessonData> {
  id: string;
}

interface AdminLessonState {
  // Data
  lessons: Lesson[];
  currentLesson: Lesson | null;
  subjects: Subject[];
  subStrands: CurriculumSubStrand[];
  
  // UI State
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalLessons: number;
  pageSize: number;
  
  // Actions - Lesson CRUD
  createLesson: (lessonData: CreateLessonData) => Promise<boolean>;
  updateLesson: (lessonData: UpdateLessonData) => Promise<boolean>;
  deleteLesson: (lessonId: string) => Promise<boolean>;
  fetchLessonById: (lessonId: string) => Promise<void>;
  fetchLessons: (page?: number, filters?: LessonFilters) => Promise<void>;
  
  // Actions - Content Management
  addContentSection: (content: Omit<LessonContent, 'id'>) => void;
  updateContentSection: (sectionId: number, content: Partial<LessonContent>) => void;
  deleteContentSection: (sectionId: number) => void;
  reorderContentSections: (fromIndex: number, toIndex: number) => void;
  
  // Actions - Data Fetching
  fetchSubjects: (level?: string, classFilter?: string) => Promise<void>;
   fetchSubStrands: (subjectId: string, classFilter?: string) => Promise<void>;
  
  // Actions - UI State
  setCurrentLesson: (lesson: Lesson | null) => void;
  clearError: () => void;
  resetState: () => void;
  setPage: (page: number) => void;
}

export interface LessonFilters {
  level?: string;
  class?: string;
  subject_id?: string;
  substrand_id?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  search?: string;
}

// Initial state
const initialState = {
  lessons: [],
  currentLesson: null,
  subjects: [],
  subStrands: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalLessons: 0,
  pageSize: 10,
};

export const useAdminLessonStore = create<AdminLessonState>((set, get) => ({
  ...initialState,

  // Lesson CRUD Operations
  createLesson: async (lessonData) => {
    set({ isCreating: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert([{
          ...lessonData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      // Add the new lesson to the current list
      set((state) => ({
        lessons: [data, ...state.lessons],
        totalLessons: state.totalLessons + 1,
        isCreating: false,
      }));

      console.log('Lesson created successfully:', data);
      return true;
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      set({
        error: error.message || 'Failed to create lesson',
        isCreating: false,
      });
      return false;
    }
  },

  updateLesson: async (lessonData) => {
    set({ isUpdating: true, error: null });
    
    try {
      const { id, ...updateData } = lessonData;
      
      const { data, error } = await supabase
        .from('lessons')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update the lesson in the current list
      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson.id === id ? data : lesson
        ),
        currentLesson: state.currentLesson?.id === id ? data : state.currentLesson,
        isUpdating: false,
      }));

      console.log('Lesson updated successfully:', data);
      return true;
    } catch (error: any) {
      console.error('Error updating lesson:', error);
      set({
        error: error.message || 'Failed to update lesson',
        isUpdating: false,
      });
      return false;
    }
  },

  deleteLesson: async (lessonId) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      // Remove the lesson from the current list
      set((state) => ({
        lessons: state.lessons.filter((lesson) => lesson.id !== lessonId),
        currentLesson: state.currentLesson?.id === lessonId ? null : state.currentLesson,
        totalLessons: Math.max(0, state.totalLessons - 1),
        isDeleting: false,
      }));

      console.log('Lesson deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting lesson:', error);
      set({
        error: error.message || 'Failed to delete lesson',
        isDeleting: false,
      });
      return false;
    }
  },

  fetchLessonById: async (lessonId) => {
    set({ isLoading: true, error: null });
    console.log(lessonId)
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          subjects(id, name, level, course),
          curriculum_sub_strands(
            id,
            sub_strand,
            curriculum_strands(
              id,
              strand,
              subject_id
            )
          )
        `)
        .eq('id', lessonId)
        .single();

      if (error) throw error;

      set({
        currentLesson: data,
        isLoading: false,
      });

      console.log('Lesson fetched successfully:', data);
    } catch (error: any) {
      console.error('Error fetching lesson:', error);
      set({
        error: error.message || 'Failed to fetch lesson',
        currentLesson: null,
        isLoading: false,
      });
    }
  },

fetchLessons: async (page = 1, filters = {}) => {
  set({ isLoading: true, error: null });
       
  try {
    const { pageSize } = get();
    const offset = (page - 1) * pageSize;
     
    let query = supabase
      .from('lessons')
      .select(`
        *,
        subjects(id, name, level, course),
        curriculum_sub_strands(
          id, 
          sub_strand, 
          curriculum_strands(
            id,
            strand,
            subject_id
          )
        )
      `, { count: 'exact' });
     
    // Apply filters
    if (filters.level) {
      query = query.eq('level', filters.level);
    }
    if (filters.class) {
      query = query.eq('class', filters.class);
    }
    if (filters.subject_id) {
      query = query.eq('subject_id', filters.subject_id);
    }
    if (filters.substrand_id) {
      query = query.eq('substrand_id', filters.substrand_id);
    }
    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
     
    // Apply pagination and ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);
     
    if (error) throw error;
     
    const totalLessons = count || 0;
    const totalPages = Math.ceil(totalLessons / pageSize);
     
    set({
      lessons: data || [],
      currentPage: page,
      totalPages,
      totalLessons,
      isLoading: false,
    });
     
    console.log(`Fetched ${data?.length || 0} lessons (page ${page}/${totalPages})`);
  } catch (error: any) {
    console.error('Error fetching lessons:', error);
    set({
      lessons: [],
      error: error.message || 'Failed to fetch lessons',
      isLoading: false,
    });
  }
},

  // Content Management
  addContentSection: (content) => {
    set((state) => {
      if (!state.currentLesson) return state;

      const newId = Math.max(0, ...state.currentLesson.content.map(c => c.id)) + 1;
      const newContent = { ...content, id: newId };

      return {
        currentLesson: {
          ...state.currentLesson,
          content: [...state.currentLesson.content, newContent],
        },
      };
    });
  },

  updateContentSection: (sectionId, content) => {
    set((state) => {
      if (!state.currentLesson) return state;

      return {
        currentLesson: {
          ...state.currentLesson,
          content: state.currentLesson.content.map((section) =>
            section.id === sectionId ? { ...section, ...content } : section
          ),
        },
      };
    });
  },

  deleteContentSection: (sectionId) => {
    set((state) => {
      if (!state.currentLesson) return state;

      return {
        currentLesson: {
          ...state.currentLesson,
          content: state.currentLesson.content.filter((section) => section.id !== sectionId),
        },
      };
    });
  },

  reorderContentSections: (fromIndex, toIndex) => {
    set((state) => {
      if (!state.currentLesson) return state;

      const content = [...state.currentLesson.content];
      const [movedSection] = content.splice(fromIndex, 1);
      content.splice(toIndex, 0, movedSection);

      return {
        currentLesson: {
          ...state.currentLesson,
          content,
        },
      };
    });
  },

  // Data Fetching
  fetchSubjects: async (level?: string, classFilter?: string) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (level) {
        query = query.eq('level', level);
      }



      const { data, error } = await query;

      if (error) throw error;

      set({
        subjects: data || [],
        isLoading: false,
      });

      console.log(`Fetched ${data?.length || 0} subjects`);
    } catch (error: any) {
      console.error('Error fetching subjects:', error);
      set({
        subjects: [],
        error: error.message || 'Failed to fetch subjects',
        isLoading: false,
      });
    }
  },

fetchSubStrands: async (subjectId: string, classFilter?: string) => {
  set({ isLoading: true, error: null });
  
  try {
    // First get the strands for this subject, filtered by class if provided
    let strandsQuery = supabase
      .from('curriculum_strands')
      .select('id')
      .eq('subject_id', subjectId);

    // Add class filter if provided
    if (classFilter) {
      strandsQuery = strandsQuery.eq('class', classFilter);
    }

    const { data: strands, error: strandsError } = await strandsQuery;

    if (strandsError) throw strandsError;

    if (!strands || strands.length === 0) {
      set({
        subStrands: [],
        isLoading: false,
      });
      console.log(`No strands found for subject: ${subjectId}${classFilter ? ` and class: ${classFilter}` : ''}`);
      return;
    }

    // Get strand IDs
    const strandIds = strands.map(strand => strand.id);
      console.log(strandIds)
    // Now get the sub-strands for these strands
    const { data: subStrands, error: subStrandsError } = await supabase
      .from('curriculum_sub_strands')
      .select(`
        id,
        sub_strand,
        strand_id,
        curriculum_strands(
          id,
          strand,
          subject_id,
          class
        )
      `)
      .in('strand_id', strandIds)
      .order('sub_strand');

    if (subStrandsError) throw subStrandsError;

    set({
      subStrands: subStrands || [],
      isLoading: false,
    });

    console.log(`Fetched ${subStrands?.length || 0} sub-strands for subject ${subjectId}${classFilter ? ` and class ${classFilter}` : ''}`);
  } catch (error: any) {
    console.error('Error fetching sub-strands:', error);
    set({
      subStrands: [],
      error: error.message || 'Failed to fetch sub-strands',
      isLoading: false,
    });
  }
},

  // UI State Management
  setCurrentLesson: (lesson: Lesson | null) => set({ currentLesson: lesson }),

  clearError: () => set({ error: null }),

  resetState: () => set(initialState),

  setPage: (page: number) => {
    const { fetchLessons } = get();
    set({ currentPage: page });
    fetchLessons(page);
  },
}));