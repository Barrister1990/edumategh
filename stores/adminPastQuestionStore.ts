import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

// Types for the extended question structure
export interface AdminPastQuestion {
  question_number: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  marks?: number; // For essay questions or multi-mark questions
}

export interface AdminPastQuestionSection {
  title: string;
  section: string;
  questions: AdminPastQuestion[];
  instructions: string;
  time_allocation?: string; // e.g., "30 minutes"
  marks_allocation?: number; // Total marks for this section
}

// Paper 2 specific types (Essays/Subjective)
export interface AdminEssayQuestion {
  question_number: number;
  question: string;
  sub_questions?: AdminEssaySubQuestion[]; // For questions with parts a, b, c, etc.
  marks: number;
  suggested_time?: string; // e.g., "15 minutes"
  marking_scheme?: string; // Guidelines for marking
  sample_answer?: string; // Optional sample answer
}

export interface AdminEssaySubQuestion {
  sub_letter: string; // a, b, c, etc.
  question: string;
  marks: number;
  marking_points?: string[]; // Key points to award marks
  sample_answer?: string; // Optional sample answer
  sub_questions?: AdminEssaySubQuestion[]; // For nested sub-questions like (i), (ii)
}

export interface AdminPaper2Section {
  title: string;
  section: string;
  questions: AdminEssayQuestion[];
  instructions: string;
  time_allocation?: string;
  marks_allocation?: number;
  question_selection?: string; // e.g., "Answer 3 out of 5 questions"
}

// Main structure for both papers
export interface AdminPastQuestionStructure {
  paper_1?: {
    title: string;
    sections: AdminPastQuestionSection[];
    total_marks: number;
    duration: string;
    instructions: string;
  };
  paper_2?: {
    title: string;
    sections: AdminPaper2Section[];
    total_marks: number;
    duration: string;
    instructions: string;
    general_instructions?: string; // Overall paper instructions
  };
}

// Complete past question paper interface
export interface AdminPastQuestionPaper {
  id?: string;
  exam_type: string; // BECE, WASSCE, etc.
  subject_name: string;
  subject_id: string;
  year: number;
  course?: string; // For SHS subjects
  level: string; // JHS, SHS
  questions_count: number;
  coin_price: number;
  has_paper_1: boolean;
  has_paper_2: boolean;
  questions: AdminPastQuestionStructure; // The main questions structure
  created_at?: string;
  updated_at?: string;
  created_by?: string; // Admin user who created it
}

// Subject and course management
export interface AdminSubject {
  id?: string;
  name: string;
  level: string; // JHS, SHS
  course?: string; // For SHS subjects (Science, Arts, Business, etc.)
  code?: string; // Subject code like ENG, MATH, etc.
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Stats and analytics
export interface AdminStats {
  totalPastQuestions: number;
  totalSubjects: number;
  totalUnlocks: number;
  recentActivity: AdminActivity[];
  popularSubjects: { subject: string; count: number }[];
  yearlyDistribution: { year: number; count: number }[];
}

export interface AdminActivity {
  id: string;
  type: 'created' | 'updated' | 'unlocked';
  description: string;
  timestamp: string;
  user_id?: string;
}

// Store state interface
interface AdminPastQuestionState {
  // Data
  pastQuestionPapers: AdminPastQuestionPaper[];
  subjects: AdminSubject[];
  examTypes: string[];
  availableYears: number[];
  availableCourses: string[];
  stats: AdminStats | null;
  
  // Current editing state
  currentPaper: AdminPastQuestionPaper | null;
  currentSection: AdminPastQuestionSection | AdminPaper2Section | null;
  currentQuestion: AdminPastQuestion | AdminEssayQuestion | null;
  editingPaper: number; // 1 or 2 to indicate which paper is being edited
  
  // UI State
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Filters and pagination
  filters: {
    examType?: string;
    subject?: string;
    year?: number;
    level?: string;
    course?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  
  // Actions
  // Data fetching
  fetchPastQuestionPapers: (filters?: any) => Promise<void>;
  fetchPastQuestionById: (id: string) => Promise<void>;
  fetchSubjects: (level?: string) => Promise<void>;
  fetchExamTypes: () => Promise<void>;
  fetchAvailableYears: () => Promise<void>;
  fetchAvailableCourses: (level?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  
  // Past Question Paper Management
  createPastQuestionPaper: (paper: Omit<AdminPastQuestionPaper, 'id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  updatePastQuestionPaper: (id: string, updates: Partial<AdminPastQuestionPaper>) => Promise<boolean>;
  deletePastQuestionPaper: (id: string) => Promise<boolean>;
  duplicatePastQuestionPaper: (id: string, newYear: number) => Promise<string | null>;
  
  // Paper Structure Management
  addSection: (paperNumber: 1 | 2, section: AdminPastQuestionSection | AdminPaper2Section) => void;
  updateSection: (paperNumber: 1 | 2, sectionIndex: number, updates: Partial<AdminPastQuestionSection | AdminPaper2Section>) => void;
  deleteSection: (paperNumber: 1 | 2, sectionIndex: number) => void;
  reorderSections: (paperNumber: 1 | 2, fromIndex: number, toIndex: number) => void;
  
  // Question Management
  addQuestion: (paperNumber: 1 | 2, sectionIndex: number, question: AdminPastQuestion | AdminEssayQuestion) => void;
  updateQuestion: (paperNumber: 1 | 2, sectionIndex: number, questionIndex: number, updates: Partial<AdminPastQuestion | AdminEssayQuestion>) => void;
  deleteQuestion: (paperNumber: 1 | 2, sectionIndex: number, questionIndex: number) => void;
  reorderQuestions: (paperNumber: 1 | 2, sectionIndex: number, fromIndex: number, toIndex: number) => void;
  
  // Bulk operations
  importQuestionsFromJSON: (paperNumber: 1 | 2, jsonData: any) => boolean;
  exportPaperToJSON: (paperNumber: 1 | 2) => string;
  bulkUpdateQuestions: (paperNumber: 1 | 2, sectionIndex: number, questions: (AdminPastQuestion | AdminEssayQuestion)[]) => void;
  
  // Current editing state management
  setCurrentPaper: (paper: AdminPastQuestionPaper | null) => void;
  setEditingPaper: (paperNumber: 1 | 2) => void;
  setCurrentSection: (section: AdminPastQuestionSection | AdminPaper2Section | null) => void;
  setCurrentQuestion: (question: AdminPastQuestion | AdminEssayQuestion | null) => void;
  
  // Filters and search
  setFilters: (filters: Partial<AdminPastQuestionState['filters']>) => void;
  setPagination: (pagination: Partial<AdminPastQuestionState['pagination']>) => void;
  searchPastQuestions: (searchTerm: string) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  resetCurrentPaper: () => void;
  validatePaper: (paper: AdminPastQuestionPaper) => string[];
  calculateTotalMarks: (paperNumber: 1 | 2) => number;
}

// Default paper structures
const createDefaultPaper1 = (): AdminPastQuestionStructure['paper_1'] => ({
  title: '',
  sections: [],
  total_marks: 0,
  duration: '2 hours',
  instructions: 'Answer ALL questions. Each question carries 1 mark. Choose the letter (A, B, C, or D) that corresponds to the correct answer and shade it completely on your answer sheet.',
});

const createDefaultPaper2 = (): AdminPastQuestionStructure['paper_2'] => ({
  title: '',
  sections: [],
  total_marks: 0,
  duration: '1 hour 30 minutes',
  instructions: 'Answer ALL questions in this section.',
  general_instructions: 'Write your answers in the spaces provided. Show all working where necessary.',
});

// Initial state
const initialState = {
  pastQuestionPapers: [],
  subjects: [],
  examTypes: ['BECE', 'WASSCE', 'MOCK'],
  availableYears: [],
  availableCourses: [],
  stats: null,
  currentPaper: null,
  currentSection: null,
  currentQuestion: null,
  editingPaper: 1,
  isLoading: false,
  isSaving: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

export const useAdminPastQuestionStore = create<AdminPastQuestionState>((set, get) => ({
  ...initialState,

  fetchPastQuestionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('pastquestions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      set({ currentPaper: data, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching past question paper:', error);
      set({ error: error.message || 'Failed to fetch past question paper', isLoading: false });
    }
  },

  // Fetch past question papers with optional filters
  fetchPastQuestionPapers: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      let query = supabase
        .from('pastquestions')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.examType) {
        query = query.eq('exam_type', filters.examType);
      }
      if (filters.subject) {
        query = query.eq('subject_name', filters.subject);
      }
      if (filters.year) {
        query = query.eq('year', filters.year);
      }
      if (filters.level) {
        query = query.eq('level', filters.level);
      }
      if (filters.course) {
        query = query.eq('course', filters.course);
      }

      // Apply pagination
      const { pagination } = get();
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      
      if (error) throw error;

      set({
        pastQuestionPapers: data || [],
        pagination: { ...pagination, total: count || 0 },
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Error fetching past question papers:', error);
      set({
        error: error.message || 'Failed to fetch past question papers',
        isLoading: false,
      });
    }
  },

  // Fetch subjects
fetchSubjects: async (level?: string) => {
  set({ isLoading: true, error: null });
  
  try {
    let query = supabase
      .from('subjects')
      .select('*')
      .in('level', ['JHS', 'SHS']) // Only fetch JHS and SHS subjects
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
  } catch (error: any) {
    console.error('Error fetching subjects:', error);
    set({
      error: error.message || 'Failed to fetch subjects',
      isLoading: false,
    });
  }
},

  // Fetch exam types
  fetchExamTypes: async () => {
    try {
      const { data, error } = await supabase
        .from('pastquestions')
        .select('exam_type')
        .not('exam_type', 'is', null);

      if (error) throw error;

      const uniqueExamTypes = Array.from(new Set(data?.map(item => item.exam_type) || []));
      set({ examTypes: uniqueExamTypes });
    } catch (error: any) {
      console.error('Error fetching exam types:', error);
      // Keep default exam types if fetch fails
    }
  },

  // Fetch available years
  fetchAvailableYears: async () => {
    try {
      const { data, error } = await supabase
        .from('pastquestions')
        .select('year')
        .not('year', 'is', null)
        .order('year', { ascending: false });

      if (error) throw error;

      const uniqueYears = Array.from(new Set(data?.map(item => item.year) || []));
      set({ availableYears: uniqueYears });
    } catch (error: any) {
      console.error('Error fetching available years:', error);
      set({ availableYears: [] });
    }
  },

  // Fetch available courses
fetchAvailableCourses: async (level?: string) => {
  try {
    let query = supabase
      .from('subjects')
      .select('course')
      .not('course', 'is', null);

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query;
    
    if (error) throw error;

    // Flatten the arrays and get unique courses
    const uniqueCourses = Array.from(
      new Set(
        data
          ?.flatMap(item => item.course || []) // Flatten arrays of courses
          .filter(Boolean) // Remove null/undefined/empty values
        || []
      )
    );

    set({ availableCourses: uniqueCourses });
  } catch (error: any) {
    console.error('Error fetching available courses:', error);
    set({ availableCourses: [] });
  }
},

  // Fetch dashboard stats


  // Create new past question paper
  createPastQuestionPaper: async (paper) => {
    set({ isSaving: true, error: null });
    
    try {
      const paperData = {
        ...paper,
        course: paper.course || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        questions: paper.questions || { paper_1: createDefaultPaper1() },
      };

      const { data, error } = await supabase
        .from('pastquestions')
        .insert([paperData])
        .select('id')
        .single();

      if (error) throw error;

      // Refresh the list
      await get().fetchPastQuestionPapers(get().filters);
      
      set({ isSaving: false });
      return data.id;
    } catch (error: any) {
      console.error('Error creating past question paper:', error);
      set({
        error: error.message || 'Failed to create past question paper',
        isSaving: false,
      });
      return null;
    }
  },

  // Update past question paper
  updatePastQuestionPaper: async (id, updates) => {
    set({ isSaving: true, error: null });
    
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('pastquestions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set(state => ({
        pastQuestionPapers: state.pastQuestionPapers.map(paper =>
          paper.id === id ? { ...paper, ...updateData } : paper
        ),
        currentPaper: state.currentPaper?.id === id 
          ? { ...state.currentPaper, ...updateData }
          : state.currentPaper,
        isSaving: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error updating past question paper:', error);
      set({
        error: error.message || 'Failed to update past question paper',
        isSaving: false,
      });
      return false;
    }
  },
    fetchStats: async () => {
    try {
      // Parallel fetch for better performance
      const [papersResult, subjectsResult, unlocksResult] = await Promise.all([
        supabase.from('pastquestions').select('id', { count: 'exact' }),
        supabase.from('subjects').select('id', { count: 'exact' }),
        supabase.from('past_question_unlocks').select('id', { count: 'exact' }),
      ]);

      // Get popular subjects
      const { data: popularData } = await supabase
        .from('past_question_unlocks')
        .select('past_question_id, pastquestions(subject_name)')
        .limit(10);

      // Get yearly distribution
      const { data: yearlyData } = await supabase
        .from('pastquestions')
        .select('year')
        .not('year', 'is', null);

      const yearlyDistribution = yearlyData?.reduce((acc: any, item) => {
        const year = item.year;
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {});

      const stats: AdminStats = {
        totalPastQuestions: papersResult.count || 0,
        totalSubjects: subjectsResult.count || 0,
        totalUnlocks: unlocksResult.count || 0,
        recentActivity: [], // Could be populated with more complex query
        popularSubjects: [], // Could be calculated from popularData
        yearlyDistribution: Object.entries(yearlyDistribution || {}).map(([year, count]) => ({
          year: parseInt(year),
          count: count as number,
        })),
      };

      set({ stats });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      set({ error: error.message || 'Failed to fetch stats' });
    }
  },

  // Delete past question paper
  deletePastQuestionPaper: async (id) => {
    set({ isSaving: true, error: null });
    
    try {
      const { error } = await supabase
        .from('pastquestions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set(state => ({
        pastQuestionPapers: state.pastQuestionPapers.filter(paper => paper.id !== id),
        currentPaper: state.currentPaper?.id === id ? null : state.currentPaper,
        isSaving: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error deleting past question paper:', error);
      set({
        error: error.message || 'Failed to delete past question paper',
        isSaving: false,
      });
      return false;
    }
  },

  // Duplicate past question paper with new year
  duplicatePastQuestionPaper: async (id, newYear) => {
    set({ isSaving: true, error: null });
    
    try {
      const { data: originalPaper, error: fetchError } = await supabase
        .from('pastquestions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { id: _, created_at, updated_at, ...paperData } = originalPaper;
      
      const newPaper = {
        ...paperData,
        year: newYear,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('pastquestions')
        .insert([newPaper])
        .select('id')
        .single();

      if (error) throw error;

      await get().fetchPastQuestionPapers(get().filters);
      
      set({ isSaving: false });
      return data.id;
    } catch (error: any) {
      console.error('Error duplicating past question paper:', error);
      set({
        error: error.message || 'Failed to duplicate past question paper',
        isSaving: false,
      });
      return null;
    }
  },


  // Add section to paper
  addSection: (paperNumber, section) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      if (!updatedPaper.questions[paperKey]) {
        updatedPaper.questions[paperKey] = (paperNumber === 1 
          ? createDefaultPaper1() 
          : createDefaultPaper2()) as any;
      }
      
      updatedPaper.questions[paperKey]!.sections.push(section as any);
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Update section
  updateSection: (paperNumber, sectionIndex, updates) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      if (updatedPaper.questions[paperKey]?.sections[sectionIndex]) {
        updatedPaper.questions[paperKey]!.sections[sectionIndex] = {
          ...updatedPaper.questions[paperKey]!.sections[sectionIndex],
          ...updates,
        } as any;
      }
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Delete section
  deleteSection: (paperNumber, sectionIndex) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      if (updatedPaper.questions[paperKey]?.sections) {
        updatedPaper.questions[paperKey]!.sections.splice(sectionIndex, 1);
      }
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Reorder sections
  reorderSections: (paperNumber, fromIndex, toIndex) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      if (updatedPaper.questions[paperKey]?.sections) {
        const sections = updatedPaper.questions[paperKey]!.sections as any[];
        const [movedSection] = sections.splice(fromIndex, 1);
        sections.splice(toIndex, 0, movedSection);
      }
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Add question to section
  addQuestion: (paperNumber, sectionIndex, question) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      if (updatedPaper.questions[paperKey]?.sections[sectionIndex]) {
        updatedPaper.questions[paperKey]!.sections[sectionIndex].questions.push(question as any);
      }
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Update question
  updateQuestion: (paperNumber, sectionIndex, questionIndex, updates) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      if (updatedPaper.questions[paperKey]?.sections[sectionIndex]?.questions[questionIndex]) {
        updatedPaper.questions[paperKey]!.sections[sectionIndex].questions[questionIndex] = {
          ...updatedPaper.questions[paperKey]!.sections[sectionIndex].questions[questionIndex],
          ...updates,
        } as any;
      }
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Delete question
  deleteQuestion: (paperNumber, sectionIndex, questionIndex) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      if (updatedPaper.questions[paperKey]?.sections[sectionIndex]?.questions) {
        updatedPaper.questions[paperKey]!.sections[sectionIndex].questions.splice(questionIndex, 1);
      }
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Reorder questions
  reorderQuestions: (paperNumber, sectionIndex, fromIndex, toIndex) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      if (updatedPaper.questions[paperKey]?.sections[sectionIndex]?.questions) {
        const questions = updatedPaper.questions[paperKey]!.sections[sectionIndex].questions as any[];
        const [movedQuestion] = questions.splice(fromIndex, 1);
        questions.splice(toIndex, 0, movedQuestion);
      }
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Import questions from JSON
  importQuestionsFromJSON: (paperNumber, jsonData) => {
    try {
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      set(state => {
        if (!state.currentPaper) return state;
        
        const updatedPaper = { ...state.currentPaper };
        updatedPaper.questions[paperKey] = jsonData;
        
        return {
          ...state,
          currentPaper: updatedPaper,
        };
      });
      
      return true;
    } catch (error) {
      console.error('Error importing questions:', error);
      set({ error: 'Failed to import questions from JSON' });
      return false;
    }
  },

  // Export paper to JSON
  exportPaperToJSON: (paperNumber) => {
    const { currentPaper } = get();
    if (!currentPaper) return '';
    
    const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
    const paperData = currentPaper.questions[paperKey];
    
    return JSON.stringify(paperData, null, 2);
  },

  // Bulk update questions
  bulkUpdateQuestions: (paperNumber, sectionIndex, questions) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      
      if (updatedPaper.questions[paperKey]?.sections[sectionIndex]) {
        updatedPaper.questions[paperKey]!.sections[sectionIndex].questions = questions as any;
      }
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Current editing state management
  setCurrentPaper: (paper) => {
    set({ currentPaper: paper });
  },

  setEditingPaper: (paperNumber) => {
    set({ editingPaper: paperNumber });
  },

  setCurrentSection: (section) => {
    set({ currentSection: section });
  },

  setCurrentQuestion: (question) => {
    set({ currentQuestion: question });
  },

  // Filters and search
  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page when filters change
    }));
  },

  setPagination: (pagination) => {
    set(state => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },

  searchPastQuestions: async (searchTerm) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('pastquestions')
        .select('*')
        .or(`subject_name.ilike.%${searchTerm}%,exam_type.ilike.%${searchTerm}%,year.eq.${parseInt(searchTerm) || 0}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({
        pastQuestionPapers: data || [],
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Error searching past questions:', error);
      set({
        error: error.message || 'Failed to search past questions',
        isLoading: false,
      });
    }
  },

  // Utility actions
  clearError: () => {
    set({ error: null });
  },

  resetCurrentPaper: () => {
    set({
      currentPaper: null,
      currentSection: null,
      currentQuestion: null,
      editingPaper: 1,
    });
  },

  validatePaper: (paper) => {
    const errors: string[] = [];

    // Basic validation
    if (!paper.exam_type) errors.push('Exam type is required');
    if (!paper.subject_name) errors.push('Subject name is required');
    if (!paper.subject_id) errors.push('Subject ID is required');
    if (!paper.year || paper.year < 2000 || paper.year > new Date().getFullYear() + 1) {
      errors.push('Valid year is required');
    }
    if (!paper.level) errors.push('Level is required');
    if (paper.coin_price < 0) errors.push('Coin price cannot be negative');

    // Validate paper structure
    if (paper.has_paper_1 && !paper.questions.paper_1) {
      errors.push('Paper 1 structure is missing');
    }
    if (paper.has_paper_2 && !paper.questions.paper_2) {
      errors.push('Paper 2 structure is missing');
    }

    // Validate sections and questions
    if (paper.questions.paper_1) {
      paper.questions.paper_1.sections.forEach((section, sIndex) => {
        if (!section.title) errors.push(`Paper 1 Section ${sIndex + 1}: Title is required`);
        if (!section.section) errors.push(`Paper 1 Section ${sIndex + 1}: Section identifier is required`);
        if (section.questions.length === 0) errors.push(`Paper 1 Section ${sIndex + 1}: At least one question is required`);
        
        section.questions.forEach((question, qIndex) => {
          if (!question.question) errors.push(`Paper 1 Section ${sIndex + 1} Question ${qIndex + 1}: Question text is required`);
          if (!question.options || question.options.length < 2) {
            errors.push(`Paper 1 Section ${sIndex + 1} Question ${qIndex + 1}: At least 2 options are required`);
          }
          if (question.answer < 0 || question.answer >= question.options.length) {
            errors.push(`Paper 1 Section ${sIndex + 1} Question ${qIndex + 1}: Invalid answer index`);
          }
        });
      });
    }

    if (paper.questions.paper_2) {
      paper.questions.paper_2.sections.forEach((section, sIndex) => {
        if (!section.title) errors.push(`Paper 2 Section ${sIndex + 1}: Title is required`);
        if (!section.section) errors.push(`Paper 2 Section ${sIndex + 1}: Section identifier is required`);
        if (section.questions.length === 0) errors.push(`Paper 2 Section ${sIndex + 1}: At least one question is required`);
        
        section.questions.forEach((question, qIndex) => {
          if (!question.question) errors.push(`Paper 2 Section ${sIndex + 1} Question ${qIndex + 1}: Question text is required`);
          if (!question.marks || question.marks <= 0) {
            errors.push(`Paper 2 Section ${sIndex + 1} Question ${qIndex + 1}: Valid marks allocation is required`);
          }
          
          // Validate sub-questions if they exist
          if (question.sub_questions) {
            question.sub_questions.forEach((subQ, subIndex) => {
              if (!subQ.question) {
                errors.push(`Paper 2 Section ${sIndex + 1} Question ${qIndex + 1} Sub-question ${subQ.sub_letter}: Question text is required`);
              }
              if (!subQ.marks || subQ.marks <= 0) {
                errors.push(`Paper 2 Section ${sIndex + 1} Question ${qIndex + 1} Sub-question ${subQ.sub_letter}: Valid marks allocation is required`);
              }
            });
          }
        });
      });
    }

    return errors;
  },

  calculateTotalMarks: (paperNumber) => {
    const { currentPaper } = get();
    if (!currentPaper) return 0;

    const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
    const paper = currentPaper.questions[paperKey];
    
    if (!paper) return 0;

    let totalMarks = 0;

    paper.sections.forEach(section => {
      if (paperNumber === 1) {
        // Paper 1: Each question typically carries 1 mark
        totalMarks += section.questions.length;
      } else {
        // Paper 2: Sum up marks from each question and sub-questions
        section.questions.forEach((question: any) => {
          if (question.sub_questions && question.sub_questions.length > 0) {
            // If question has sub-questions, sum their marks
            totalMarks += question.sub_questions.reduce((sum: number, subQ: any) => sum + (subQ.marks || 0), 0);
          } else {
            // Direct question marks
            totalMarks += question.marks || 0;
          }
        });
      }
    });

    return totalMarks;
  },

  // Additional utility methods for better admin experience
  
  // Clone a section within the same paper
  cloneSection: (paperNumber: 1 | 2, sectionIndex: number) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      const paper = updatedPaper.questions[paperKey];
      
      if (!paper || !paper.sections[sectionIndex]) return state;
      
      const sectionToClone = paper.sections[sectionIndex];
      const clonedSection = {
        ...sectionToClone,
        title: `${sectionToClone.title} (Copy)`,
        section: `${sectionToClone.section}_copy`,
        questions: sectionToClone.questions.map(q => ({ ...q })), // Deep copy questions
      };
      
      paper.sections.splice(sectionIndex + 1, 0, clonedSection as any);
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Clone a question within the same section
  cloneQuestion: (paperNumber: 1 | 2, sectionIndex: number, questionIndex: number) => {
    set(state => {
      if (!state.currentPaper) return state;
      
      const updatedPaper = { ...state.currentPaper };
      const paperKey = paperNumber === 1 ? 'paper_1' : 'paper_2';
      const paper = updatedPaper.questions[paperKey];
      
      if (!paper || !paper.sections[sectionIndex] || !paper.sections[sectionIndex].questions[questionIndex]) {
        return state;
      }
      
      const questionToClone = paper.sections[sectionIndex].questions[questionIndex];
      const clonedQuestion = {
        ...questionToClone,
        question_number: questionToClone.question_number + 0.1, // Temporary number
      };
      
      paper.sections[sectionIndex].questions.splice(questionIndex + 1, 0, clonedQuestion as any);
      
      // Renumber questions in the section
      paper.sections[sectionIndex].questions.forEach((q: any, index: number) => {
        q.question_number = index + 1;
      });
      
      return {
        ...state,
        currentPaper: updatedPaper,
      };
    });
  },

  // Auto-save functionality (optional)
  autoSave: async () => {
    const { currentPaper, isSaving } = get();
    
    if (!currentPaper || !currentPaper.id || isSaving) return;
    
    try {
      await get().updatePastQuestionPaper(currentPaper.id, {
        questions: currentPaper.questions,
        questions_count: get().calculateTotalMarks(1) + get().calculateTotalMarks(2),
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  },

  // Batch operations for efficiency
  batchUpdatePapers: async (updates: { id: string; updates: Partial<AdminPastQuestionPaper> }[]) => {
    set({ isSaving: true, error: null });
    
    try {
      const promises = updates.map(({ id, updates: paperUpdates }) =>
        supabase
          .from('pastquestions')
          .update({ ...paperUpdates, updated_at: new Date().toISOString() })
          .eq('id', id)
      );
      
      const results = await Promise.all(promises);
      
      // Check for errors
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        throw new Error('Some updates failed');
      }
      
      // Refresh the list
      await get().fetchPastQuestionPapers(get().filters);
      
      set({ isSaving: false });
      return true;
    } catch (error: any) {
      console.error('Error batch updating papers:', error);
      set({
        error: error.message || 'Failed to batch update papers',
        isSaving: false,
      });
      return false;
    }
  },
  
  // Export multiple papers to ZIP (would need additional library)
  exportMultiplePapersToJSON: (paperIds: string[]) => {
    const { pastQuestionPapers } = get();
    const papersToExport = pastQuestionPapers.filter(paper => 
      paper.id && paperIds.includes(paper.id)
    );
    
    const exportData = papersToExport.map(paper => ({
      ...paper,
      exportedAt: new Date().toISOString(),
    }));
    
    return JSON.stringify(exportData, null, 2);
  },
}));

// Selector hooks for better performance (optional)
export const useAdminPastQuestionPapers = () => 
  useAdminPastQuestionStore(state => state.pastQuestionPapers);

export const useAdminCurrentPaper = () => 
  useAdminPastQuestionStore(state => state.currentPaper);

export const useAdminSubjects = () => 
  useAdminPastQuestionStore(state => state.subjects);

export const useAdminStats = () => 
  useAdminPastQuestionStore(state => state.stats);

export const useAdminLoading = () => 
  useAdminPastQuestionStore(state => ({ 
    isLoading: state.isLoading, 
    isSaving: state.isSaving 
  }));

// Helper functions for question numbering and structure validation
export const renumberQuestions = (sections: (AdminPastQuestionSection | AdminPaper2Section)[]): void => {
  let questionNumber = 1;
  
  sections.forEach(section => {
    section.questions.forEach((question: any) => {
      question.question_number = questionNumber++;
    });
  });
};

export const validateQuestionStructure = (question: AdminPastQuestion | AdminEssayQuestion, paperType: 1 | 2): string[] => {
  const errors: string[] = [];
  
  if (!question.question) errors.push('Question text is required');
  if (!question.question_number || question.question_number <= 0) {
    errors.push('Valid question number is required');
  }
  
  if (paperType === 1) {
    const mcqQuestion = question as AdminPastQuestion;
    if (!mcqQuestion.options || mcqQuestion.options.length < 2) {
      errors.push('At least 2 options are required');
    }
    if (mcqQuestion.answer < 0 || mcqQuestion.answer >= mcqQuestion.options.length) {
      errors.push('Valid answer selection is required');
    }
    if (!mcqQuestion.explanation) {
      errors.push('Explanation is recommended for better learning');
    }
  } else {
    const essayQuestion = question as AdminEssayQuestion;
    if (!essayQuestion.marks || essayQuestion.marks <= 0) {
      errors.push('Valid marks allocation is required');
    }
  }
  
  return errors;
};
