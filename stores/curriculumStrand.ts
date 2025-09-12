import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

// Types
export interface Subject {
  id: string;
  name: string;
  level:string;
  course?: string; // Only for SHS subjects
  createdAt: string;
  updatedAt: string;
}

export interface Strand {
  id: string;
  name: string;
  subjectId: string;
  subject: string; // Subject name for display
  level:string;
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

export interface ContentStandard {
  id: string;
  name: string;
  subStrandId: string;
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
  contentStandardId: string;
  contentStandard: string; // Content standard name for display
  subStrandId: string;
  subStrand: string; // Sub-strand name for display
  strandId: string;
  strand: string; // Strand name for display
  subjectId: string;
  subject: string; // Subject name for display
  createdAt: string;
  updatedAt: string;
}

// Input types for creation
export interface CreateStrandInput {
  name: string;
  subjectId: string;
  subject: string;
  level:string;
  class: string;
  course?: string;
}

export interface CreateSubStrandInput {
  name: string;
  strandId: string;
  strand: string;
  subjectId: string;
  subject: string;
}

export interface CreateContentStandardInput {
  name: string;
  subStrandId: string;
  subStrand: string;
  strandId: string;
  strand: string;
  subjectId: string;
  subject: string;
  level:string;
  class: string;
  course?: string;
}

export interface CreateIndicatorInput {
  name: string;
  contentStandardId: string;
  contentStandard: string;
  subStrandId: string;
  subStrand: string;
  strandId: string;
  strand: string;
  subjectId: string;
  subject: string;
  level: string;
  class: string;
  course?: string;
}

// Update input types
export interface UpdateStrandInput extends Partial<CreateStrandInput> {
  id: string;
}

export interface UpdateSubStrandInput extends Partial<CreateSubStrandInput> {
  id: string;
}

export interface UpdateContentStandardInput extends Partial<CreateContentStandardInput> {
  id: string;
}

export interface UpdateIndicatorInput extends Partial<CreateIndicatorInput> {
  id: string;
}

// Filter types
export interface CurriculumFilters {
  level?: string;
  class?: string;
  course?: string;
  subjectId?: string;
  strandId?: string;
  subStrandId?: string;
  contentStandardId?: string;
  search?: string;
}

// Selection options for forms
export interface CurriculumOptions {
  level: string;
  class: string;
  course?: string;
  subjectId?: string;
  subject?: string;
  strandId?: string;
  strand?: string;
  subStrandId?: string;
  subStrand?: string;
  contentStandardId?: string;
  contentStandard?: string;
}

interface CurriculumState {
  // Data
  subjects: Subject[];
  strands: Strand[];
  subStrands: SubStrand[];
  contentStandards: ContentStandard[];
  indicators: Indicator[];
  
  // Selected items for detailed view
  selectedSubject: Subject | null;
  selectedStrand: Strand | null;
  selectedSubStrand: SubStrand | null;
  selectedContentStandard: ContentStandard | null;
  selectedIndicator: Indicator | null;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalCount: number;
  
  // Loading states
  isLoading: boolean;
  isLoadingSubjects: boolean;
  isLoadingStrands: boolean;
  isLoadingSubStrands: boolean;
  isLoadingContentStandards: boolean;
  isLoadingIndicators: boolean;
  
  // CRUD loading states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error states
  error: string | null;
  subjectsError: string | null;
  strandsError: string | null;
  subStrandsError: string | null;
  contentStandardsError: string | null;
  indicatorsError: string | null;
  
  // Filters
  filters: CurriculumFilters;
  
  // Form options
  curriculumOptions: CurriculumOptions | null;
  
  // Actions - Fetch Operations
  fetchAllSubjects: () => Promise<Subject[]>;
  fetchSubjects: (level: string, course?: string) => Promise<Subject[]>;
  fetchStrands: (subjectId: string, level: string, classLevel: string, course?: string) => Promise<Strand[]>;
  fetchSubStrands: (strandId: string) => Promise<SubStrand[]>;
  fetchContentStandards: (subStrandId: string) => Promise<ContentStandard[]>;
  fetchIndicators: (contentStandardId: string) => Promise<Indicator[]>;
  
  // Actions - CRUD Operations for Strands
  createStrand: (input: CreateStrandInput) => Promise<Strand | null>;
  updateStrand: (input: UpdateStrandInput) => Promise<Strand | null>;
  deleteStrand: (id: string) => Promise<boolean>;
  bulkDeleteStrands: (ids: string[]) => Promise<boolean>;
  
  // Actions - CRUD Operations for Sub Strands
  createSubStrand: (input: CreateSubStrandInput) => Promise<SubStrand | null>;
  updateSubStrand: (input: UpdateSubStrandInput) => Promise<SubStrand | null>;
  deleteSubStrand: (id: string) => Promise<boolean>;
  bulkDeleteSubStrands: (ids: string[]) => Promise<boolean>;
  
  // Actions - CRUD Operations for Content Standards
  createContentStandard: (input: CreateContentStandardInput) => Promise<ContentStandard | null>;
  updateContentStandard: (input: UpdateContentStandardInput) => Promise<ContentStandard | null>;
  deleteContentStandard: (id: string) => Promise<boolean>;
  bulkDeleteContentStandards: (ids: string[]) => Promise<boolean>;
  
  // Actions - CRUD Operations for Indicators
  createIndicator: (input: CreateIndicatorInput) => Promise<Indicator | null>;
  updateIndicator: (input: UpdateIndicatorInput) => Promise<Indicator | null>;
  deleteIndicator: (id: string) => Promise<boolean>;
  bulkDeleteIndicators: (ids: string[]) => Promise<boolean>;
  
  // Actions - Selection and State Management
  setSelectedSubject: (subject: Subject | null) => void;
  setSelectedStrand: (strand: Strand | null) => void;
  setSelectedSubStrand: (subStrand: SubStrand | null) => void;
  setSelectedContentStandard: (contentStandard: ContentStandard | null) => void;
  setSelectedIndicator: (indicator: Indicator | null) => void;
  
  // Actions - Filters and Pagination
  setFilters: (filters: Partial<CurriculumFilters>) => void;
  clearFilters: () => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Actions - Form helpers
  setCurriculumOptions: (options: Partial<CurriculumOptions>) => void;
  
  // Actions - Utility getters
  getSubjectsForLevel: (level?:string, course?: string) => Subject[];
  getStrandsForSubject: (subjectId: string) => Strand[];
  getSubStrandsForStrand: (strandId: string) => SubStrand[];
  getContentStandardsForSubStrand: (subStrandId: string) => ContentStandard[];
  getIndicatorsForContentStandard: (contentStandardId: string) => Indicator[];
  
  // Actions - Utility
  resetState: () => void;
  clearError: () => void;
  clearAllErrors: () => void;
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

// Default curriculum options
const defaultCurriculumOptions: CurriculumOptions = {
  level: 'JHS',
  class: '1',
  course: undefined,
  subjectId: undefined,
  subject: undefined,
  strandId: undefined,
  strand: undefined,
  subStrandId: undefined,
  subStrand: undefined,
  contentStandardId: undefined,
  contentStandard: undefined,
};

// Initial state
const initialState = {
  subjects: [],
  strands: [],
  subStrands: [],
  contentStandards: [],
  indicators: [],
  selectedSubject: null,
  selectedStrand: null,
  selectedSubStrand: null,
  selectedContentStandard: null,
  selectedIndicator: null,
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,
  isLoading: false,
  isLoadingSubjects: false,
  isLoadingStrands: false,
  isLoadingSubStrands: false,
  isLoadingContentStandards: false,
  isLoadingIndicators: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  subjectsError: null,
  strandsError: null,
  subStrandsError: null,
  contentStandardsError: null,
  indicatorsError: null,
  filters: {},
  curriculumOptions: defaultCurriculumOptions,
};

export const useCurriculumStore = create<CurriculumState>((set, get) => ({
  ...initialState,

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
        course: item.course,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      
      set({ subjects, isLoadingSubjects: false });
      return subjects;
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
 console.log(classLevel)
    try {
      let query = supabase
        .from('curriculum_strands')
        .select('*')
        .eq('subject_id', subjectId)
        .eq('level', level)
        .eq('class', classLevel);
      
      
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
        level: item.level,
        class: item.class,
        course: item.course,
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

  fetchContentStandards: async (subStrandId: string) => {
    set({ isLoadingContentStandards: true, contentStandardsError: null });
    
    try {
      const { data, error } = await supabase
        .from('curriculum_content_standards')
        .select('*')
        .eq('sub_strand_id', subStrandId)
        .order('content_standard');
      
      if (error) throw error;
      
      const contentStandards: ContentStandard[] = (data || []).map(item => ({
        id: item.id,
        name: item.content_standard,
        subStrandId: item.sub_strand_id,
        strandId: item.strand_id,
        strand: item.strand_name,
        subjectId: item.subject_id,
        subject: item.subject,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      
      set({ contentStandards, isLoadingContentStandards: false });
      return contentStandards;
    } catch (error: any) {
      console.error('Error fetching content standards:', error);
      set({ 
        contentStandardsError: error.message || 'Failed to fetch content standards',
        isLoadingContentStandards: false
      });
      return [];
    }
  },

  fetchIndicators: async (contentStandardId: string) => {
    set({ isLoadingIndicators: true, indicatorsError: null });
    
    try {
      const { data, error } = await supabase
        .from('curriculum_indicators')
        .select('*')
        .eq('content_standard_id', contentStandardId)
        .order('indicator');
      
      if (error) throw error;
      
      const indicators: Indicator[] = (data || []).map(item => ({
        id: item.id,
        name: item.indicator,
        contentStandardId: item.content_standard_id,
        contentStandard: item.content_standard,
        subStrandId: item.sub_strand_id,
        subStrand: item.sub_strand,
        strandId: item.strand_id,
        strand: item.strand,
        subjectId: item.subject_id,
        subject: item.subject,
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

  // CRUD Operations for Strands
  createStrand: async (input: CreateStrandInput) => {
    set({ isCreating: true, error: null });
    
    try {
      const insertData = {
        strand: input.name,
        subject_id: input.subjectId,
        subject_name: input.subject,
        level: input.level,
        class: input.class,
        
      };
      
      const { data, error } = await supabase
        .from('curriculum_strands')
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: Strand = {
          id: data.id,
          name: data.strand,
          subjectId: data.subject_id,
          subject: data.subject,
          level: data.level,
          class: data.class,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set(state => ({
          strands: [transformedData, ...state.strands],
          isCreating: false
        }));
        
        return transformedData;
      }
      
      set({ isCreating: false });
      return null;
    } catch (error: any) {
      console.error('Error creating strand:', error);
      set({ 
        error: error.message || 'Failed to create strand',
        isCreating: false 
      });
      return null;
    }
  },

  updateStrand: async (input: UpdateStrandInput) => {
    set({ isUpdating: true, error: null });
    
    try {
      const updateData: any = {};
      
      if (input.name !== undefined) updateData.strand = input.name;
      if (input.subjectId !== undefined) updateData.subject_id = input.subjectId;
      if (input.subject !== undefined) updateData.subject = input.subject;
      if (input.level !== undefined) updateData.level = input.level;
      if (input.class !== undefined) updateData.class = input.class;
      if (input.course !== undefined) updateData.course = input.course;
      
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('curriculum_strands')
        .update(updateData)
        .eq('id', input.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: Strand = {
          id: data.id,
          name: data.strand,
          subjectId: data.subject_id,
          subject: data.subject,
          level: data.level,
          class: data.class,
          
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set(state => ({
          strands: state.strands.map(strand => 
            strand.id === input.id ? transformedData : strand
          ),
          selectedStrand: state.selectedStrand?.id === input.id ? transformedData : state.selectedStrand,
          isUpdating: false
        }));
        
        return transformedData;
      }
      
      set({ isUpdating: false });
      return null;
    } catch (error: any) {
      console.error('Error updating strand:', error);
      set({ 
        error: error.message || 'Failed to update strand',
        isUpdating: false 
      });
      return null;
    }
  },

  deleteStrand: async (id: string) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('curriculum_strands')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        strands: state.strands.filter(strand => strand.id !== id),
        selectedStrand: state.selectedStrand?.id === id ? null : state.selectedStrand,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting strand:', error);
      set({ 
        error: error.message || 'Failed to delete strand',
        isDeleting: false 
      });
      return false;
    }
  },

  bulkDeleteStrands: async (ids: string[]) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('curriculum_strands')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      set(state => ({
        strands: state.strands.filter(strand => !ids.includes(strand.id)),
        selectedStrand: ids.includes(state.selectedStrand?.id!) ? null : state.selectedStrand,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error bulk deleting strands:', error);
      set({ 
        error: error.message || 'Failed to delete strands',
        isDeleting: false 
      });
      return false;
    }
  },

  // CRUD Operations for Sub Strands
  createSubStrand: async (input: CreateSubStrandInput) => {
    set({ isCreating: true, error: null });
    
    try {
      const insertData = {
        sub_strand: input.name,
        strand_id: input.strandId,
        strand: input.strand,
        subject_id: input.subjectId,
        subject_name: input.subject,
      };
      
      const { data, error } = await supabase
        .from('curriculum_sub_strands')
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: SubStrand = {
          id: data.id,
          name: data.sub_strand,
          strandId: data.strand_id,
          strand: data.strand,
          subjectId: data.subject_id,
          subject: data.subject,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set(state => ({
          subStrands: [transformedData, ...state.subStrands],
          isCreating: false
        }));
        
        return transformedData;
      }
      
      set({ isCreating: false });
      return null;
    } catch (error: any) {
      console.error('Error creating sub strand:', error);
      set({ 
        error: error.message || 'Failed to create sub strand',
        isCreating: false 
      });
      return null;
    }
  },

  updateSubStrand: async (input: UpdateSubStrandInput) => {
    set({ isUpdating: true, error: null });
    
    try {
      const updateData: any = {};
      
      if (input.name !== undefined) updateData.sub_strand = input.name;
      if (input.strandId !== undefined) updateData.strand_id = input.strandId;
      if (input.strand !== undefined) updateData.strand = input.strand;
      if (input.subjectId !== undefined) updateData.subject_id = input.subjectId;
      if (input.subject !== undefined) updateData.subject = input.subject;

      
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('curriculum_sub_strands')
        .update(updateData)
        .eq('id', input.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: SubStrand = {
          id: data.id,
          name: data.sub_strand,
          strandId: data.strand_id,
          strand: data.strand,
          subjectId: data.subject_id,
          subject: data.subject,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set(state => ({
          subStrands: state.subStrands.map(subStrand => 
            subStrand.id === input.id ? transformedData : subStrand
          ),
          selectedSubStrand: state.selectedSubStrand?.id === input.id ? transformedData : state.selectedSubStrand,
          isUpdating: false
        }));
        
        return transformedData;
      }
      
      set({ isUpdating: false });
      return null;
    } catch (error: any) {
      console.error('Error updating sub strand:', error);
      set({ 
        error: error.message || 'Failed to update sub strand',
        isUpdating: false 
      });
      return null;
    }
  },

  deleteSubStrand: async (id: string) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('curriculum_sub_strands')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        subStrands: state.subStrands.filter(subStrand => subStrand.id !== id),
        selectedSubStrand: state.selectedSubStrand?.id === id ? null : state.selectedSubStrand,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting sub strand:', error);
      set({ 
        error: error.message || 'Failed to delete sub strand',
        isDeleting: false 
      });
      return false;
    }
  },

  bulkDeleteSubStrands: async (ids: string[]) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('curriculum_sub_strands')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      set(state => ({
        subStrands: state.subStrands.filter(subStrand => !ids.includes(subStrand.id)),
        selectedSubStrand: ids.includes(state.selectedSubStrand?.id!) ? null : state.selectedSubStrand,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error bulk deleting sub strands:', error);
      set({ 
        error: error.message || 'Failed to delete sub strands',
        isDeleting: false 
      });
      return false;
    }
  },

  // CRUD Operations for Content Standards
  createContentStandard: async (input: CreateContentStandardInput) => {
    set({ isCreating: true, error: null });
    
    try {
      const insertData = {
        content_standard: input.name,
        sub_strand_id: input.subStrandId,
        strand_id: input.strandId,
        strand_name: input.strand,
        subject_id: input.subjectId,
        subject_name: input.subject,
      };
      
      const { data, error } = await supabase
        .from('curriculum_content_standards')
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: ContentStandard = {
          id: data.id,
          name: data.content_standard,
          subStrandId: data.sub_strand_id,
          strandId: data.strand_id,
          strand: data.strand,
          subjectId: data.subject_id,
          subject: data.subject,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set(state => ({
          contentStandards: [transformedData, ...state.contentStandards],
          isCreating: false
        }));
        
        return transformedData;
      }
      
      set({ isCreating: false });
      return null;
    } catch (error: any) {
      console.error('Error creating content standard:', error);
      set({ 
        error: error.message || 'Failed to create content standard',
        isCreating: false 
      });
      return null;
    }
  },

  updateContentStandard: async (input: UpdateContentStandardInput) => {
    set({ isUpdating: true, error: null });
    
    try {
      const updateData: any = {};
      
      if (input.name !== undefined) updateData.content_standard = input.name;
      if (input.subStrandId !== undefined) updateData.sub_strand_id = input.subStrandId;
      if (input.subStrand !== undefined) updateData.sub_strand = input.subStrand;
      if (input.strandId !== undefined) updateData.strand_id = input.strandId;
      if (input.strand !== undefined) updateData.strand = input.strand;
      if (input.subjectId !== undefined) updateData.subject_id = input.subjectId;
      if (input.subject !== undefined) updateData.subject = input.subject;

      
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('curriculum_content_standards')
        .update(updateData)
        .eq('id', input.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: ContentStandard = {
          id: data.id,
          name: data.content_standard,
          subStrandId: data.sub_strand_id,
          strandId: data.strand_id,
          strand: data.strand,
          subjectId: data.subject_id,
          subject: data.subject,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set(state => ({
          contentStandards: state.contentStandards.map(contentStandard => 
            contentStandard.id === input.id ? transformedData : contentStandard
          ),
          selectedContentStandard: state.selectedContentStandard?.id === input.id ? transformedData : state.selectedContentStandard,
          isUpdating: false
        }));
        
        return transformedData;
      }
      
      set({ isUpdating: false });
      return null;
    } catch (error: any) {
      console.error('Error updating content standard:', error);
      set({ 
        error: error.message || 'Failed to update content standard',
        isUpdating: false 
      });
      return null;
    }
  },

  deleteContentStandard: async (id: string) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('curriculum_content_standards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        contentStandards: state.contentStandards.filter(contentStandard => contentStandard.id !== id),
        selectedContentStandard: state.selectedContentStandard?.id === id ? null : state.selectedContentStandard,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting content standard:', error);
      set({ 
        error: error.message || 'Failed to delete content standard',
        isDeleting: false 
      });
      return false;
    }
  },

  bulkDeleteContentStandards: async (ids: string[]) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('curriculum_content_standards')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      set(state => ({
        contentStandards: state.contentStandards.filter(contentStandard => !ids.includes(contentStandard.id)),
        selectedContentStandard: ids.includes(state.selectedContentStandard?.id!) ? null : state.selectedContentStandard,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error bulk deleting content standards:', error);
      set({ 
        error: error.message || 'Failed to delete content standards',
        isDeleting: false 
      });
      return false;
    }
  },

  // CRUD Operations for Indicators
  createIndicator: async (input: CreateIndicatorInput) => {
    set({ isCreating: true, error: null });
    
    try {
      const insertData = {
        indicator: input.name,
        content_standard_id: input.contentStandardId,
        sub_strand_id: input.subStrandId,
        sub_strand: input.subStrand,
        strand_id: input.strandId,
        strand_name: input.strand,
        subject_id: input.subjectId,
        subject_name: input.subject,
      };
      
      const { data, error } = await supabase
        .from('curriculum_indicators')
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: Indicator = {
          id: data.id,
          name: data.indicator,
          contentStandardId: data.content_standard_id,
          contentStandard: data.content_standard,
          subStrandId: data.sub_strand_id,
          subStrand: data.sub_strand,
          strandId: data.strand_id,
          strand: data.strand,
          subjectId: data.subject_id,
          subject: data.subject,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set(state => ({
          indicators: [transformedData, ...state.indicators],
          isCreating: false
        }));
        
        return transformedData;
      }
      
      set({ isCreating: false });
      return null;
    } catch (error: any) {
      console.error('Error creating indicator:', error);
      set({ 
        error: error.message || 'Failed to create indicator',
        isCreating: false 
      });
      return null;
    }
  },

  updateIndicator: async (input: UpdateIndicatorInput) => {
    set({ isUpdating: true, error: null });
    
    try {
      const updateData: any = {};
      
      if (input.name !== undefined) updateData.indicator = input.name;
      if (input.contentStandardId !== undefined) updateData.content_standard_id = input.contentStandardId;
      if (input.contentStandard !== undefined) updateData.content_standard = input.contentStandard;
      if (input.subStrandId !== undefined) updateData.sub_strand_id = input.subStrandId;
      if (input.subStrand !== undefined) updateData.sub_strand = input.subStrand;
      if (input.strandId !== undefined) updateData.strand_id = input.strandId;
      if (input.strand !== undefined) updateData.strand = input.strand;
      if (input.subjectId !== undefined) updateData.subject_id = input.subjectId;
      if (input.subject !== undefined) updateData.subject = input.subject;
      if (input.level !== undefined) updateData.level = input.level;
      if (input.class !== undefined) updateData.class = input.class;
      if (input.course !== undefined) updateData.course = input.course;
      
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('curriculum_indicators')
        .update(updateData)
        .eq('id', input.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedData: Indicator = {
          id: data.id,
          name: data.indicator,
          contentStandardId: data.content_standard_id,
          contentStandard: data.content_standard,
          subStrandId: data.sub_strand_id,
          subStrand: data.sub_strand,
          strandId: data.strand_id,
          strand: data.strand,
          subjectId: data.subject_id,
          subject: data.subject,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        
        set(state => ({
          indicators: state.indicators.map(indicator => 
            indicator.id === input.id ? transformedData : indicator
          ),
          selectedIndicator: state.selectedIndicator?.id === input.id ? transformedData : state.selectedIndicator,
          isUpdating: false
        }));
        
        return transformedData;
      }
      
      set({ isUpdating: false });
      return null;
    } catch (error: any) {
      console.error('Error updating indicator:', error);
      set({ 
        error: error.message || 'Failed to update indicator',
        isUpdating: false 
      });
      return null;
    }
  },

  deleteIndicator: async (id: string) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('curriculum_indicators')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        indicators: state.indicators.filter(indicator => indicator.id !== id),
        selectedIndicator: state.selectedIndicator?.id === id ? null : state.selectedIndicator,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting indicator:', error);
      set({ 
        error: error.message || 'Failed to delete indicator',
        isDeleting: false 
      });
      return false;
    }
  },

  bulkDeleteIndicators: async (ids: string[]) => {
    set({ isDeleting: true, error: null });
    
    try {
      const { error } = await supabase
        .from('curriculum_indicators')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      set(state => ({
        indicators: state.indicators.filter(indicator => !ids.includes(indicator.id)),
        selectedIndicator: ids.includes(state.selectedIndicator?.id!) ? null : state.selectedIndicator,
        isDeleting: false
      }));
      
      return true;
    } catch (error: any) {
      console.error('Error bulk deleting indicators:', error);
      set({ 
        error: error.message || 'Failed to delete indicators',
        isDeleting: false 
      });
      return false;
    }
  },

  // Selection and State Management
  setSelectedSubject: (subject: Subject | null) => {
    set({ selectedSubject: subject });
  },

  setSelectedStrand: (strand: Strand | null) => {
    set({ selectedStrand: strand });
  },

  setSelectedSubStrand: (subStrand: SubStrand | null) => {
    set({ selectedSubStrand: subStrand });
  },

  setSelectedContentStandard: (contentStandard: ContentStandard | null) => {
    set({ selectedContentStandard: contentStandard });
  },

  setSelectedIndicator: (indicator: Indicator | null) => {
    set({ selectedIndicator: indicator });
  },

  // Filters and Pagination
  setFilters: (filters: Partial<CurriculumFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      currentPage: 1 // Reset to first page when filters change
    }));
  },

  clearFilters: () => {
    set({ filters: {}, currentPage: 1 });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 1 });
  },

  // Form helpers
// Form helpers
setCurriculumOptions: (options: Partial<CurriculumOptions>) => {
  set(state => ({
    curriculumOptions: state.curriculumOptions ? { ...state.curriculumOptions, ...options } : { ...defaultCurriculumOptions, ...options }
  }));
},

  // Utility getters
  getSubjectsForLevel: (level?:string, course?: string) => {
    const { subjects } = get();
    
    if (!level) return subjects;
    
    let filteredSubjects = subjects.filter(subject => subject.level === level);
    
    if (level === 'SHS' && course) {
      filteredSubjects = filteredSubjects.filter(subject => subject.course === course);
    }
    
    return filteredSubjects;
  },

  getStrandsForSubject: (subjectId: string) => {
    const { strands } = get();
    return strands.filter(strand => strand.subjectId === subjectId);
  },

  getSubStrandsForStrand: (strandId: string) => {
    const { subStrands } = get();
    return subStrands.filter(subStrand => subStrand.strandId === strandId);
  },

  getContentStandardsForSubStrand: (subStrandId: string) => {
    const { contentStandards } = get();
    return contentStandards.filter(contentStandard => contentStandard.subStrandId === subStrandId);
  },

  getIndicatorsForContentStandard: (contentStandardId: string) => {
    const { indicators } = get();
    return indicators.filter(indicator => indicator.contentStandardId === contentStandardId);
  },

  // Utility
  resetState: () => {
    set({ ...initialState });
  },

  clearError: () => {
    set({ error: null });
  },

  clearAllErrors: () => {
    set({ 
      error: null,
      subjectsError: null,
      strandsError: null,
      subStrandsError: null,
      contentStandardsError: null,
      indicatorsError: null
    });
  },
}));