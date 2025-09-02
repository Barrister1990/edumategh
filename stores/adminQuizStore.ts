import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

// Types
export interface Subject {
  id: string;
  name: string;
  level: string;
  course?: string | string[]; // Can be string or array for SHS subjects
  createdAt: string;
  updatedAt: string;
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

export interface QuizQuestion {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
}

export interface Quiz {
  id?: string;
  title: string;
  subject_id: string;
  substrand_id: string;
  substrand: string;
  course: string;
  subject: string;
  level: string;
  class: string;
  questions: QuizQuestion[];
  description?: string;
  duration_minutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  total_marks?: number;
  pass_mark?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateQuizData {
  title: string;
  subject_id: string;
  substrand_id: string;
  level: string;
  class: string;
  questions: QuizQuestion[];
  description?: string;
  duration_minutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  total_marks?: number;
  pass_mark?: number;
}

export interface UpdateQuizData extends Partial<CreateQuizData> {
  id: string;
}

interface AdminQuizState {
  // Data
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
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
  totalQuizzes: number;
  pageSize: number;
  
  // Actions - Quiz CRUD
  createQuiz: (quizData: CreateQuizData) => Promise<boolean>;
  updateQuiz: (quizData: UpdateQuizData) => Promise<boolean>;
  deleteQuiz: (quizId: string) => Promise<boolean>;
  fetchQuizById: (quizId: string) => Promise<void>;
  fetchQuizzes: (page?: number, filters?: QuizFilters) => Promise<void>;
  
  // Actions - Question Management
  addQuestion: (question: Omit<QuizQuestion, 'id'>) => void;
  updateQuestion: (questionId: number, question: Partial<QuizQuestion>) => void;
  deleteQuestion: (questionId: number) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  
  // Actions - Data Fetching
  fetchSubjects: (level?: string, course?: string) => Promise<void>;
  fetchSubStrands: (subjectId: string, classFilter?: string) => Promise<void>;
  getAvailableCourses: (level?: string) => { name: string }[];
  getFilteredSubjects: (level?: string, course?: string) => Subject[];
  
  // Actions - UI State
  setCurrentQuiz: (quiz: Quiz | null) => void;
  clearError: () => void;
  resetState: () => void;
  setPage: (page: number) => void;
}

export interface QuizFilters {
  level?: string;
  class?: string;
  subject_id?: string;
  substrand_id?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  search?: string;
}

// Initial state
const initialState = {
  quizzes: [],
  currentQuiz: null,
  subjects: [],
  subStrands: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalQuizzes: 0,
  pageSize: 10,
};

export const useAdminQuizStore = create<AdminQuizState>((set, get) => ({
  ...initialState,

  // Quiz CRUD Operations
  createQuiz: async (quizData) => {
    set({ isCreating: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert([{
          ...quizData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      // Add the new quiz to the current list
      set((state) => ({
        quizzes: [data, ...state.quizzes],
        totalQuizzes: state.totalQuizzes + 1,
        isCreating: false,
      }));

      console.log('Quiz created successfully:', data);
      return true;
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      set({
        error: error.message || 'Failed to create quiz',
        isCreating: false,
      });
      return false;
    }
  },

  updateQuiz: async (quizData) => {
    set({ isUpdating: true, error: null });
    
    try {
      const { id, ...updateData } = quizData;
      
      const { data, error } = await supabase
        .from('quizzes')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update the quiz in the current list
      set((state) => ({
        quizzes: state.quizzes.map((quiz) =>
          quiz.id === id ? data : quiz
        ),
        currentQuiz: state.currentQuiz?.id === id ? data : state.currentQuiz,
        isUpdating: false,
      }));

      console.log('Quiz updated successfully:', data);
      return true;
    } catch (error: any) {
      console.error('Error updating quiz:', error);
      set({
        error: error.message || 'Failed to update quiz',
        isUpdating: false,
      });
      return false;
    }
  },

  deleteQuiz: async (quizId) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;

      // Remove the quiz from the current list
      set((state) => ({
        quizzes: state.quizzes.filter((quiz) => quiz.id !== quizId),
        currentQuiz: state.currentQuiz?.id === quizId ? null : state.currentQuiz,
        totalQuizzes: Math.max(0, state.totalQuizzes - 1),
        isDeleting: false,
      }));

      console.log('Quiz deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting quiz:', error);
      set({
        error: error.message || 'Failed to delete quiz',
        isDeleting: false,
      });
      return false;
    }
  },

  fetchQuizById: async (quizId) => {
    set({ isLoading: true, error: null });
    console.log(quizId);
    
    try {
      const { data, error } = await supabase
        .from('quizzes')
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
        .eq('id', quizId)
        .single();
 console.log(data)
      if (error) throw error;

      set({
        currentQuiz: data,
        isLoading: false,
      });

      console.log('Quiz fetched successfully:', data);
    } catch (error: any) {
      console.error('Error fetching quiz:', error);
      set({
        error: error.message || 'Failed to fetch quiz',
        currentQuiz: null,
        isLoading: false,
      });
    }
  },

  fetchQuizzes: async (page = 1, filters = {}) => {
    set({ isLoading: true, error: null });
         
    try {
      const { pageSize } = get();
      const offset = (page - 1) * pageSize;
       
      let query = supabase
        .from('quizzes')
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
       
      const totalQuizzes = count || 0;
      const totalPages = Math.ceil(totalQuizzes / pageSize);
       
      set({
        quizzes: data || [],
        currentPage: page,
        totalPages,
        totalQuizzes,
        isLoading: false,
      });
       
      console.log(`Fetched ${data?.length || 0} quizzes (page ${page}/${totalPages})`);
    } catch (error: any) {
      console.error('Error fetching quizzes:', error);
      set({
        quizzes: [],
        error: error.message || 'Failed to fetch quizzes',
        isLoading: false,
      });
    }
  },

  // Question Management
  addQuestion: (question) => {
    set((state) => {
      if (!state.currentQuiz) return state;

      const newId = Math.max(0, ...state.currentQuiz.questions.map(q => q.id)) + 1;
      const newQuestion = { ...question, id: newId };

      return {
        currentQuiz: {
          ...state.currentQuiz,
          questions: [...state.currentQuiz.questions, newQuestion],
        },
      };
    });
  },

  updateQuestion: (questionId, question) => {
    set((state) => {
      if (!state.currentQuiz) return state;

      return {
        currentQuiz: {
          ...state.currentQuiz,
          questions: state.currentQuiz.questions.map((q) =>
            q.id === questionId ? { ...q, ...question } : q
          ),
        },
      };
    });
  },

  deleteQuestion: (questionId) => {
    set((state) => {
      if (!state.currentQuiz) return state;

      return {
        currentQuiz: {
          ...state.currentQuiz,
          questions: state.currentQuiz.questions.filter((q) => q.id !== questionId),
        },
      };
    });
  },

  reorderQuestions: (fromIndex, toIndex) => {
    set((state) => {
      if (!state.currentQuiz) return state;

      const questions = [...state.currentQuiz.questions];
      const [movedQuestion] = questions.splice(fromIndex, 1);
      questions.splice(toIndex, 0, movedQuestion);

      return {
        currentQuiz: {
          ...state.currentQuiz,
          questions,
        },
      };
    });
  },

  // Data Fetching
  fetchSubjects: async (level?: string, course?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      let query = supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (level) {
        query = query.eq('level', level);
      }

      // Filter by course if provided (for SHS subjects)
      if (level === 'SHS' && course) {
        query = query.contains('course', [course]);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match interface
      const subjects = (data || []).map(subject => ({
        id: subject.id,
        name: subject.name,
        level: subject.level,
        course: subject.course, // This will be either string or array from database
        createdAt: subject.created_at,
        updatedAt: subject.updated_at,
      }));

      // Remove duplicates based on id to ensure uniqueness
      const uniqueSubjects = subjects.filter((subject, index, self) => 
        index === self.findIndex(s => s.id === subject.id)
      );

      set({
        subjects: uniqueSubjects,
        isLoading: false,
      });

      console.log(`Fetched ${uniqueSubjects.length} subjects for level: ${level}, course: ${course}`);
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
  setCurrentQuiz: (quiz: Quiz | null) => set({ currentQuiz: quiz }),

  clearError: () => set({ error: null }),

  resetState: () => set(initialState),

  setPage: (page: number) => {
    const { fetchQuizzes } = get();
    set({ currentPage: page });
    fetchQuizzes(page);
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
    
    // Convert set to array and sort alphabetically
    return uniqueCourses.map(course => ({ name: course }));
  },
}));