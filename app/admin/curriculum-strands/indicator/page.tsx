"use client";
import { CreateIndicatorInput, useCurriculumStore } from '@/stores/curriculumStrand';
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Clipboard,
  GraduationCap,
  Lightbulb,
  List,
  Loader2,
  Plus,
  RotateCcw,
  School,
  X
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Form data interface for better type safety
interface FormData {
  name: string;
  level: string;
  class: string;
  course: string;
  subjectId: string;
  subject: string;
  strandId: string;
  strand: string;
  subStrandId: string;
  subStrand: string;
  contentStandardId: string;
  contentStandard: string;
}

const initialFormData: FormData = {
  name: '',
  level: 'JHS',
  class: '1',
  course: '',
  subjectId: '',
  subject: '',
  strandId: '',
  strand: '',
  subStrandId: '',
  subStrand: '',
  contentStandardId: '',
  contentStandard: ''
};

const AddNewIndicator = () => {
  const {
    subjects = [],
    strands = [],
    subStrands = [],
    contentStandards = [],
    indicators = [],
    isCreating = false,
    error,
    fetchSubjects,
    fetchStrands,
    fetchSubStrands,
    fetchContentStandards,
    fetchIndicators,
    createIndicator,
    clearError
  } = useCurriculumStore();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);

  // Memoized calculations for better performance
  useEffect(() => {
    if (formData.level === 'SHS' && subjects.length > 0) {
      const courses = Array.from(new Set(
        subjects
          .filter(subject => subject.level === 'SHS' && Array.isArray(subject.course))
          .flatMap(subject => subject.course) // flatten array of arrays
      )).filter(Boolean) as string[];

      setAvailableCourses(courses);
    } else {
      setAvailableCourses([]);
      setFormData(prev => ({ ...prev, course: '' }));
    }
  }, [formData.level, subjects]);





const availableSubjects = useMemo(() => {
  if (formData.level === 'KG') {
    return subjects.filter(subject => subject.level === 'KG');
  } else if (formData.level === 'Basic') {
    return subjects.filter(subject => subject.level === 'Basic');
  } else if (formData.level === 'JHS') {
    return subjects.filter(subject => subject.level === 'JHS');
  } else if (formData.level === 'SHS') {
    if (!formData.course) return [];
    return subjects.filter(
      subject => 
        subject.level === 'SHS' &&
        Array.isArray(subject.course) &&
        subject.course.includes(formData.course)
    );
  }
  return [];
}, [formData.level, formData.course, subjects]);

  const availableStrands = useMemo(() => {
    if (!formData.subjectId) return [];
    
    return strands.filter(strand => 
      strand.subjectId === formData.subjectId &&
      strand.level === formData.level &&
      strand.class === `${formData.level} ${formData.class}`
    );
  }, [formData.subjectId, formData.level, formData.class, strands]);

  const availableSubStrands = useMemo(() => {
    if (!formData.strandId) return [];
    
    return subStrands.filter(subStrand => 
      subStrand.strandId === formData.strandId
    );
  }, [formData.strandId, subStrands]);

  const availableContentStandards = useMemo(() => {
    if (!formData.subStrandId) return [];
    
    return contentStandards.filter(contentStandard => 
      contentStandard.subStrandId === formData.subStrandId
    );
  }, [formData.subStrandId, contentStandards]);

const isFormValid = useMemo(() => {
  return formData.name.trim() !== '' && 
         formData.subjectId !== '' && 
         formData.strandId !== '' &&
         formData.subStrandId !== '' &&
         formData.contentStandardId !== '' &&
         (formData.level === 'KG' || formData.level === 'Basic' || formData.level === 'JHS' || formData.course !== '');
}, [formData]);

const progressPercentage = useMemo(() => {
  const totalFields = (formData.level === 'KG' || formData.level === 'Basic' || formData.level === 'JHS') ? 7 : 8;
  let filledFields = 0;
  
  if (formData.name.trim()) filledFields++;
  if (formData.level) filledFields++;
  if (formData.class) filledFields++;
  if (formData.subjectId) filledFields++;
  if (formData.strandId) filledFields++;
  if (formData.subStrandId) filledFields++;
  if (formData.contentStandardId) filledFields++;
  if (formData.level === 'KG' || formData.level === 'Basic' || formData.level === 'JHS' || formData.course) filledFields++;
  
  return Math.round((filledFields / totalFields) * 100);
}, [formData]);

  // Load data with proper error handling
  const loadData = useCallback(async () => {
    if (!fetchSubjects || !fetchStrands) return;
    
    setIsLoading(true);
    try {
      // Always fetch subjects when level changes
      await fetchSubjects(formData.level);
      
      // Only fetch strands if we have the required dependencies
      if (formData.subjectId && formData.level && formData.class) {
        // For KG, Basic and JHS, course is not required, for SHS it is
        if (formData.level === 'KG' || formData.level === 'Basic' || formData.level === 'JHS' || (formData.level === 'SHS' && formData.course)) {
          const fullClassName = `${formData.level} ${formData.class}`;
          await fetchStrands(formData.subjectId, formData.level, fullClassName, formData.course);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData.level, formData.subjectId, formData.class, formData.course, fetchSubjects, fetchStrands]);

  // Load data on mount and level change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load subjects when level changes
  useEffect(() => {
    if (fetchSubjects) {
      fetchSubjects(formData.level).catch(err => {
        console.error('Failed to load subjects:', err);
      });
    }
  }, [formData.level, fetchSubjects]);

  // Load strands when dependencies change
  useEffect(() => {
    if (fetchStrands && formData.subjectId && formData.level && formData.class) {
      // For KG, Basic and JHS, course is not required, for SHS it is
      if (formData.level === 'KG' || formData.level === 'Basic' || formData.level === 'JHS' || (formData.level === 'SHS' && formData.course)) {
        const fullClassName = `${formData.level} ${formData.class}`;
        fetchStrands(formData.subjectId, formData.level, fullClassName, formData.course).catch(err => {
          console.error('Failed to load strands:', err);
        });
      }
    }
  }, [formData.subjectId, formData.level, formData.class, formData.course, fetchStrands]);

  // Load sub-strands when strand changes
  useEffect(() => {
    if (fetchSubStrands && formData.strandId) {
      fetchSubStrands(formData.strandId).catch(err => {
        console.error('Failed to load sub-strands:', err);
      });
    }
  }, [formData.strandId, fetchSubStrands]);

  // Load content standards when sub-strand changes
  useEffect(() => {
    if (fetchContentStandards && formData.subStrandId) {
      fetchContentStandards(formData.subStrandId).catch(err => {
        console.error('Failed to load content standards:', err);
      });
    }
  }, [formData.subStrandId, fetchContentStandards]);

  // Load indicators when content standard changes
  useEffect(() => {
    if (fetchIndicators && formData.contentStandardId) {
      fetchIndicators(formData.contentStandardId).catch(err => {
        console.error('Failed to load indicators:', err);
      });
    }
  }, [formData.contentStandardId, fetchIndicators]);

  // Reset dependent fields when parent selections change
  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      subjectId: '', 
      subject: '', 
      strandId: '', 
      strand: '',
      subStrandId: '',
      subStrand: '',
      contentStandardId: '',
      contentStandard: ''
    }));
  }, [formData.level, formData.course]);

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      strandId: '', 
      strand: '',
      subStrandId: '',
      subStrand: '',
      contentStandardId: '',
      contentStandard: ''
    }));
  }, [formData.subjectId, formData.class]);

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      subStrandId: '', 
      subStrand: '',
      contentStandardId: '',
      contentStandard: ''
    }));
  }, [formData.strandId]);

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      contentStandardId: '',
      contentStandard: ''
    }));
  }, [formData.subStrandId]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouchedFields(prev => new Set(prev).add(name));
    
    if (name === 'subjectId') {
      const selectedSubject = availableSubjects.find(subject => subject.id === value);
      setFormData(prev => ({
        ...prev,
        subjectId: value,
        subject: selectedSubject?.name || '',
        strandId: '',
        strand: '',
        subStrandId: '',
        subStrand: '',
        contentStandardId: '',
        contentStandard: ''
      }));
    } else if (name === 'strandId') {
      const selectedStrand = availableStrands.find(strand => strand.id === value);
      setFormData(prev => ({
        ...prev,
        strandId: value,
        strand: selectedStrand?.name || '',
        subStrandId: '',
        subStrand: '',
        contentStandardId: '',
        contentStandard: ''
      }));
    } else if (name === 'subStrandId') {
      const selectedSubStrand = availableSubStrands.find(subStrand => subStrand.id === value);
      setFormData(prev => ({
        ...prev,
        subStrandId: value,
        subStrand: selectedSubStrand?.name || '',
        contentStandardId: '',
        contentStandard: ''
      }));
    } else if (name === 'contentStandardId') {
      const selectedContentStandard = availableContentStandards.find(contentStandard => contentStandard.id === value);
      setFormData(prev => ({
        ...prev,
        contentStandardId: value,
        contentStandard: selectedContentStandard?.name || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, [availableSubjects, availableStrands, availableSubStrands, availableContentStandards]);

// Check for duplicate indicators
const checkForDuplicate = useCallback((name: string, contentStandardId: string): boolean => {
  if (!name.trim() || !contentStandardId) return false;
  
  return indicators.some(indicator => 
    indicator.contentStandardId === contentStandardId && 
    indicator.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
}, [indicators]);

const validateForm = useCallback(() => {
  const errors: string[] = [];
  
  if (!formData.name.trim()) {
    errors.push('Indicator name is required');
  }
  
  if (!formData.subjectId) {
    errors.push('Please select a subject');
  }

  if (!formData.strandId) {
    errors.push('Please select a strand');
  }

  if (!formData.subStrandId) {
    errors.push('Please select a sub-strand');
  }

  if (!formData.contentStandardId) {
    errors.push('Please select a content standard');
  }

  if (formData.level === 'SHS' && !formData.course) {
    errors.push('Please select a course for SHS');
  }

  // Check for duplicate indicator
  if (formData.name.trim() && formData.contentStandardId && checkForDuplicate(formData.name, formData.contentStandardId)) {
    errors.push('An indicator with this name already exists for the selected content standard');
  }

  return errors;
}, [formData, checkForDuplicate]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    if (!createIndicator) {
      alert('Create function is not available');
      return;
    }

    const indicatorInput: CreateIndicatorInput = {
      name: formData.name.trim(),
      contentStandardId: formData.contentStandardId,
      contentStandard: formData.contentStandard,
      subStrandId: formData.subStrandId,
      subStrand: formData.subStrand,
      level: formData.level,
      class: formData.class,
      strandId: formData.strandId,
      strand: formData.strand,
      subjectId: formData.subjectId,
      subject: formData.subject
    };

    try {
      const result = await createIndicator(indicatorInput);
      
      if (result) {
        // Reset form on success
        setFormData(initialFormData);
        setTouchedFields(new Set());
        alert('🎉 Indicator created successfully!');
      }
    } catch (err) {
      console.error('Failed to create indicator:', err);
      alert('Failed to create indicator. Please try again.');
    }
  }, [formData, validateForm, createIndicator]);

  const handleReset = useCallback(() => {
    setFormData(initialFormData);
    setTouchedFields(new Set());
    if (clearError) {
      clearError();
    }
  }, [clearError]);

const getFieldError = useCallback((fieldName: string): string => {
  if (!touchedFields.has(fieldName)) return '';
  
  switch (fieldName) {
    case 'name':
      if (formData.name.trim() === '') {
        return 'Indicator name is required';
      }
      if (formData.name.trim() && formData.contentStandardId && checkForDuplicate(formData.name, formData.contentStandardId)) {
        return 'An indicator with this name already exists for the selected content standard';
      }
      return '';
    case 'subjectId':
      return formData.subjectId === '' ? 'Please select a subject' : '';
    case 'strandId':
      return formData.strandId === '' ? 'Please select a strand' : '';
    case 'subStrandId':
      return formData.subStrandId === '' ? 'Please select a sub-strand' : '';
    case 'contentStandardId':
      return formData.contentStandardId === '' ? 'Please select a content standard' : '';
    case 'course':
      return formData.level === 'SHS' && formData.course === '' ? 'Please select a course' : '';
    default:
      return '';
  }
}, [formData, touchedFields, checkForDuplicate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 md:h-12 md:w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-sm md:text-base">Loading curriculum data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <List className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">New Indicator</h1>
              <p className="text-xs text-gray-500">{progressPercentage}% Complete</p>
            </div>
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <Clipboard className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Mobile Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSidebar(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clipboard className="w-5 h-5 mr-2 text-green-600" />
                  Form Summary
                </h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20">
              {/* Form Summary Content */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Level:</span>
                    <span className="text-sm font-semibold text-gray-900">{formData.level}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Class:</span>
                    <span className="text-sm font-semibold text-gray-900">{formData.level} {formData.class}</span>
                  </div>

                  {formData.level === 'SHS' && (
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Course:</span>
                      <span className="text-sm font-semibold text-gray-900">{formData.course || 'Not selected'}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Subject:</span>
                    <span className="text-sm font-semibold text-gray-900 truncate ml-2">{formData.subject || 'Not selected'}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Strand:</span>
                    <span className="text-sm font-semibold text-gray-900 truncate ml-2">{formData.strand || 'Not selected'}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Sub-Strand:</span>
                    <span className="text-sm font-semibold text-gray-900 truncate ml-2">{formData.subStrand || 'Not selected'}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Content Standard:</span>
                    <span className="text-sm font-semibold text-gray-900 truncate ml-2">{formData.contentStandard || 'Not selected'}</span>
                  </div>

                  {formData.contentStandardId && (
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Existing Indicators:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {indicators.filter(indicator => indicator.contentStandardId === formData.contentStandardId).length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Validation Status */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Form Status:</span>
                    <span className={`text-sm font-semibold flex items-center ${isFormValid ? 'text-green-600' : 'text-orange-600'}`}>
                      {isFormValid ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Ready
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Incomplete
                        </>
                      )}
                    </span>
                  </div>
                  
                  {!isFormValid && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-xs text-orange-800 font-medium mb-1">Required fields:</p>
                      <ul className="text-xs text-orange-700 space-y-1">
                        {!formData.name.trim() && <li>• Indicator name</li>}
                        {formData.level === 'SHS' && !formData.course && <li>• Course selection</li>}
                        {!formData.subjectId && <li>• Subject selection</li>}
                        {!formData.strandId && <li>• Strand selection</li>}
                        {!formData.subStrandId && <li>• Sub-strand selection</li>}
                        {!formData.contentStandardId && <li>• Content standard selection</li>}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Help Text */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Quick Tips
                  </h4>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• Fill out all required fields marked with *</li>
                    <li>• Use specific, measurable indicator names</li>
                    <li>• Follow the hierarchy: Subject → Strand → Sub-Strand → Content Standard</li>
                    <li>• You can reset the form at any time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden lg:block text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
              <List className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Indicator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Define specific, measurable learning indicators that align with your content standards
            </p>
          </div>

          {/* Desktop Progress Bar */}
          <div className="hidden lg:block mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Form Progress</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 border border-gray-100">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                      <p className="text-red-800 font-medium text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6 md:space-y-8">
                  {/* Indicator Name */}
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                      Indicator Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Identify and write numbers from 1 to 100"
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 ${
                          getFieldError('name') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-green-500 hover:border-gray-300'
                        }`}
                      />
                      {formData.name && (
                        <div className="absolute right-3 top-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {getFieldError('name') && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                        {getFieldError('name')}
                      </p>
                    )}
                    {formData.name.trim() && formData.contentStandardId && checkForDuplicate(formData.name, formData.contentStandardId) && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-red-800 font-medium">Duplicate Indicator</p>
                            <p className="text-xs text-red-700 mt-1">
                              An indicator with the name "{formData.name}" already exists for this content standard. 
                              Please choose a different name or select a different content standard.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Level Selection */}
<div className="space-y-4">
  <label className="block text-sm font-semibold text-gray-700">
    Education Level *
  </label>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {(['KG', 'Basic', 'JHS', 'SHS'] as const).map((level) => (
      <label key={level} className="relative cursor-pointer">
        <input
          type="radio"
          name="level"
          value={level}
          checked={formData.level === level}
          onChange={handleInputChange}
          className="sr-only"
        />
        <div className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
          formData.level === level
            ? 'border-green-500 bg-green-50 shadow-lg ring-4 ring-green-500/20'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}>
          <div className="flex items-center justify-center mb-2">
            {level === 'KG' ? (
              <School className={`w-5 h-5 ${formData.level === level ? 'text-green-700' : 'text-gray-600'}`} />
            ) : level === 'Basic' ? (
              <School className={`w-5 h-5 ${formData.level === level ? 'text-green-700' : 'text-gray-600'}`} />
            ) : level === 'JHS' ? (
              <School className={`w-5 h-5 ${formData.level === level ? 'text-green-700' : 'text-gray-600'}`} />
            ) : (
              <GraduationCap className={`w-5 h-5 ${formData.level === level ? 'text-green-700' : 'text-gray-600'}`} />
            )}
          </div>
          <div className={`font-semibold text-sm md:text-base ${formData.level === level ? 'text-green-700' : 'text-gray-700'}`}>
            {level === 'KG' ? 'Kindergarten' : level === 'Basic' ? 'Basic School' : level === 'JHS' ? 'Junior High School' : 'Senior High School'}
          </div>
          <div className={`text-xs md:text-sm ${formData.level === level ? 'text-green-600' : 'text-gray-500'}`}>
            {level}
          </div>
        </div>
      </label>
    ))}
  </div>
</div>

                  {/* Class Selection */}
<div>
  <label htmlFor="class" className="block text-sm font-semibold text-gray-700 mb-3">
    Class Level *
  </label>
  <div className={`grid gap-3 ${
    formData.level === 'Basic' ? 'grid-cols-3 sm:grid-cols-6' : 
    formData.level === 'KG' ? 'grid-cols-2' : 'grid-cols-3'
  }`}>
    {(() => {
      let classOptions;
      if (formData.level === 'KG') {
        classOptions = ['1', '2'];
      } else if (formData.level === 'Basic') {
        classOptions = ['1', '2', '3', '4', '5', '6'];
      } else {
        classOptions = ['1', '2', '3'];
      }
      
      return classOptions.map((classNum) => (
        <button
          key={classNum}
          type="button"
          onClick={() => handleInputChange({ target: { name: 'class', value: classNum } } as any)}
          className={`p-3 border-2 rounded-xl text-center transition-all duration-200 ${
            formData.class === classNum
              ? 'border-green-500 bg-green-50 text-green-700 shadow-lg ring-4 ring-green-500/20'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="font-semibold text-sm md:text-base">
            {formData.level === 'KG' ? `KG ${classNum}` : 
             formData.level === 'Basic' ? `Basic ${classNum}` : 
             `${formData.level} ${classNum}`}
          </div>
        </button>
      ));
    })()}
  </div>
</div>

                  {/* Course Selection (SHS only) */}
                  {formData.level === 'SHS' && (
                    <div>
                      <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-3">
                        Course *
                      </label>
                      <div className="relative">
                        <select
                          id="course"
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 appearance-none ${
                            getFieldError('course') 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 focus:border-green-500 hover:border-gray-300'
                          }`}
                        >
                          <option value="">Select a course</option>
                          {availableCourses.map((course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                        {formData.course && (
                          <div className="absolute right-10 top-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {getFieldError('course') && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                          {getFieldError('course')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Subject Selection */}
                  <div>
                    <label htmlFor="subjectId" className="block text-sm font-semibold text-gray-700 mb-3">
                      Subject *
                    </label>
                    <div className="relative">
                      <select
                        id="subjectId"
                        name="subjectId"
                        value={formData.subjectId}
                        onChange={handleInputChange}
                        disabled={!availableSubjects.length}
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 appearance-none ${
                          getFieldError('subjectId') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-green-500 hover:border-gray-300'
                        } ${!availableSubjects.length ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">
                          {availableSubjects.length ? 'Select a subject' : 'No subjects available'}
                        </option>
                        {availableSubjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                      {formData.subjectId && (
                        <div className="absolute right-10 top-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {getFieldError('subjectId') && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                        {getFieldError('subjectId')}
                      </p>
                    )}
                  </div>

                  {/* Strand Selection */}
                  <div>
                    <label htmlFor="strandId" className="block text-sm font-semibold text-gray-700 mb-3">
                      Strand *
                    </label>
                    <div className="relative">
                      <select
                        id="strandId"
                        name="strandId"
                        value={formData.strandId}
                        onChange={handleInputChange}
                        disabled={!availableStrands.length}
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 appearance-none ${
                          getFieldError('strandId') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-green-500 hover:border-gray-300'
                        } ${!availableStrands.length ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">
                          {availableStrands.length ? 'Select a strand' : 'No strands available'}
                        </option>
                        {availableStrands.map((strand) => (
                          <option key={strand.id} value={strand.id}>
                            {strand.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                      {formData.strandId && (
                        <div className="absolute right-10 top-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {getFieldError('strandId') && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                        {getFieldError('strandId')}
                      </p>
                    )}
                  </div>

                  {/* Sub-Strand Selection */}
                  <div>
                    <label htmlFor="subStrandId" className="block text-sm font-semibold text-gray-700 mb-3">
                      Sub-Strand *
                    </label>
                    <div className="relative">
                      <select
                        id="subStrandId"
                        name="subStrandId"
                        value={formData.subStrandId}
                        onChange={handleInputChange}
                        disabled={!availableSubStrands.length}
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 appearance-none ${
                          getFieldError('subStrandId') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-green-500 hover:border-gray-300'
                        } ${!availableSubStrands.length ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">
                          {availableSubStrands.length ? 'Select a sub-strand' : 'No sub-strands available'}
                        </option>
                        {availableSubStrands.map((subStrand) => (
                          <option key={subStrand.id} value={subStrand.id}>
                            {subStrand.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                      {formData.subStrandId && (
                        <div className="absolute right-10 top-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {getFieldError('subStrandId') && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                        {getFieldError('subStrandId')}
                      </p>
                    )}
                  </div>

                  {/* Content Standard Selection */}
                  <div>
                    <label htmlFor="contentStandardId" className="block text-sm font-semibold text-gray-700 mb-3">
                      Content Standard *
                    </label>
                    <div className="relative">
                      <select
                        id="contentStandardId"
                        name="contentStandardId"
                        value={formData.contentStandardId}
                        onChange={handleInputChange}
                        disabled={!availableContentStandards.length}
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 appearance-none ${
                          getFieldError('contentStandardId') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-green-500 hover:border-gray-300'
                        } ${!availableContentStandards.length ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">
                          {availableContentStandards.length ? 'Select a content standard' : 'No content standards available'}
                        </option>
                        {availableContentStandards.map((contentStandard) => (
                          <option key={contentStandard.id} value={contentStandard.id}>
                            {contentStandard.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                      {formData.contentStandardId && (
                        <div className="absolute right-10 top-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {getFieldError('contentStandardId') && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                        {getFieldError('contentStandardId')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center justify-center"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset Form
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid || isCreating}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                      isFormValid && !isCreating
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Create Indicator
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                      <Clipboard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Form Summary</h3>
                  </div>

                  {/* Progress Ring */}
                  <div className="text-center mb-6">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                          className="text-green-500 transition-all duration-500 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{progressPercentage}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Form Progress</p>
                  </div>

                  {/* Form Summary */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Level:</span>
                        <span className="text-sm font-semibold text-gray-900">{formData.level}</span>
                      </div>

                      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Class:</span>
                        <span className="text-sm font-semibold text-gray-900">{formData.level} {formData.class}</span>
                      </div>

                      {formData.level === 'SHS' && (
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">Course:</span>
                          <span className="text-sm font-semibold text-gray-900">{formData.course || 'Not selected'}</span>
                        </div>
                      )}

                      <div className="py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">Subject:</span>
                          <span className={`text-sm font-semibold ${formData.subject ? 'text-gray-900' : 'text-gray-400'}`}>
                            {formData.subject || 'Not selected'}
                          </span>
                        </div>
                      </div>

                      <div className="py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">Strand:</span>
                          <span className={`text-sm font-semibold ${formData.strand ? 'text-gray-900' : 'text-gray-400'}`}>
                            {formData.strand || 'Not selected'}
                          </span>
                        </div>
                      </div>

                      <div className="py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">Sub-Strand:</span>
                          <span className={`text-sm font-semibold ${formData.subStrand ? 'text-gray-900' : 'text-gray-400'}`}>
                            {formData.subStrand || 'Not selected'}
                          </span>
                        </div>
                      </div>

                      <div className="py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">Content Standard:</span>
                          <span className={`text-sm font-semibold ${formData.contentStandard ? 'text-gray-900' : 'text-gray-400'}`}>
                            {formData.contentStandard || 'Not selected'}
                          </span>
                        </div>

                        {formData.contentStandardId && (
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">Existing Indicators:</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {indicators.filter(indicator => indicator.contentStandardId === formData.contentStandardId).length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Validation Status */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Form Status:</span>
                        <span className={`text-sm font-semibold flex items-center ${isFormValid ? 'text-green-600' : 'text-orange-600'}`}>
                          {isFormValid ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Ready
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Incomplete
                            </>
                          )}
                        </span>
                      </div>
                      
                      {!isFormValid && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <p className="text-xs text-orange-800 font-medium mb-1">Required fields:</p>
                          <ul className="text-xs text-orange-700 space-y-1">
                            {!formData.name.trim() && <li>• Indicator name</li>}
                            {formData.level === 'SHS' && !formData.course && <li>• Course selection</li>}
                            {!formData.subjectId && <li>• Subject selection</li>}
                            {!formData.strandId && <li>• Strand selection</li>}
                            {!formData.subStrandId && <li>• Sub-strand selection</li>}
                            {!formData.contentStandardId && <li>• Content standard selection</li>}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Help Text */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Quick Tips
                      </h4>
                      <ul className="text-xs text-green-800 space-y-1">
                        <li>• Fill out all required fields marked with *</li>
                        <li>• Use specific, measurable indicator names</li>
                        <li>• Follow the hierarchy: Subject → Strand → Sub-Strand → Content Standard</li>
                        <li>• You can reset the form at any time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewIndicator;