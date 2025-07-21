"use client";
import { CreateContentStandardInput, useCurriculumStore } from '@/stores/curriculumStrand';
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clipboard,
  FileText,
  GraduationCap,
  Lightbulb,
  Link,
  Loader2,
  Plus,
  RotateCcw,
  School,
  Target,
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
  subStrand: ''
};

const AddNewContentStandard = () => {
  const {
    subjects = [],
    strands = [],
    subStrands = [],
    isCreating = false,
    error,
    fetchSubjects,
    fetchStrands,
    fetchSubStrands,
    createContentStandard,
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
  if (formData.level === 'Basic') {
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
      strand.class === `${formData.level} ${formData.class}` &&
      (formData.level === 'JHS' || strand.course === formData.course)
    );
  }, [formData.subjectId, formData.level, formData.class, formData.course, strands]);

  const availableSubStrands = useMemo(() => {
    if (!formData.strandId) return [];
    
    return subStrands.filter(subStrand => 
      subStrand.strandId === formData.strandId
    );
  }, [formData.strandId, subStrands]);

const isFormValid = useMemo(() => {
  return formData.name.trim() !== '' && 
         formData.subjectId !== '' && 
         formData.strandId !== '' &&
         formData.subStrandId !== '' &&
         (formData.level === 'Basic' || formData.level === 'JHS' || formData.course !== '');
}, [formData]);

const progressPercentage = useMemo(() => {
  const totalFields = (formData.level === 'Basic' || formData.level === 'JHS') ? 6 : 7;
  let filledFields = 0;
  
  if (formData.name.trim()) filledFields++;
  if (formData.level) filledFields++;
  if (formData.class) filledFields++;
  if (formData.subjectId) filledFields++;
  if (formData.strandId) filledFields++;
  if (formData.subStrandId) filledFields++;
  if (formData.level === 'Basic' || formData.level === 'JHS' || formData.course) filledFields++;
  
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
        // For JHS, course is not required, for SHS it is
        if (formData.level === 'JHS' || (formData.level === 'SHS' && formData.course)) {
          await fetchStrands(formData.subjectId, formData.level, formData.class, formData.course);
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
      // For JHS, course is not required, for SHS it is
      if (formData.level === 'JHS' || (formData.level === 'SHS' && formData.course)) {
        fetchStrands(formData.subjectId, formData.level, formData.class, formData.course).catch(err => {
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

  // Reset dependent fields when parent selections change
  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      subjectId: '', 
      subject: '', 
      strandId: '', 
      strand: '',
      subStrandId: '',
      subStrand: ''
    }));
  }, [formData.level, formData.course]);

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      strandId: '', 
      strand: '',
      subStrandId: '',
      subStrand: ''
    }));
  }, [formData.subjectId, formData.class]);

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      subStrandId: '', 
      subStrand: '' 
    }));
  }, [formData.strandId]);

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
        subStrand: ''
      }));
    } else if (name === 'strandId') {
      const selectedStrand = availableStrands.find(strand => strand.id === value);
      setFormData(prev => ({
        ...prev,
        strandId: value,
        strand: selectedStrand?.name || '',
        subStrandId: '',
        subStrand: ''
      }));
    } else if (name === 'subStrandId') {
      const selectedSubStrand = availableSubStrands.find(subStrand => subStrand.id === value);
      setFormData(prev => ({
        ...prev,
        subStrandId: value,
        subStrand: selectedSubStrand?.name || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, [availableSubjects, availableStrands, availableSubStrands]);

const validateForm = useCallback(() => {
  const errors: string[] = [];
  
  if (!formData.name.trim()) {
    errors.push('Content standard name is required');
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

  if (formData.level === 'SHS' && !formData.course) {
    errors.push('Please select a course for SHS');
  }

  return errors;
}, [formData]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    if (!createContentStandard) {
      alert('Create function is not available');
      return;
    }

    const contentStandardInput: CreateContentStandardInput = {
      name: formData.name.trim(),
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
      const result = await createContentStandard(contentStandardInput);
      
      if (result) {
        // Reset form on success
        setFormData(initialFormData);
        setTouchedFields(new Set());
        alert('🎉 Content standard created successfully!');
      }
    } catch (err) {
      console.error('Failed to create content standard:', err);
      alert('Failed to create content standard. Please try again.');
    }
  }, [formData, validateForm, createContentStandard]);

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
        return formData.name.trim() === '' ? 'Content standard name is required' : '';
      case 'subjectId':
        return formData.subjectId === '' ? 'Please select a subject' : '';
      case 'strandId':
        return formData.strandId === '' ? 'Please select a strand' : '';
      case 'subStrandId':
        return formData.subStrandId === '' ? 'Please select a sub-strand' : '';
      case 'course':
        return formData.level === 'SHS' && formData.course === '' ? 'Please select a course' : '';
      default:
        return '';
    }
  }, [formData, touchedFields]);

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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">New Content Standard</h1>
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
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
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
                  <Clipboard className="w-5 h-5 mr-2 text-blue-600" />
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
              {/* Form Summary Content - Same as desktop sidebar */}
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
                        {!formData.name.trim() && <li>• Content standard name</li>}
                        {formData.level === 'SHS' && !formData.course && <li>• Course selection</li>}
                        {!formData.subjectId && <li>• Subject selection</li>}
                        {!formData.strandId && <li>• Strand selection</li>}
                        {!formData.subStrandId && <li>• Sub-strand selection</li>}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Help Text */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Quick Tips
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Fill out all required fields marked with *</li>
                    <li>• Use descriptive names for content standards</li>
                    <li>• Selections are hierarchical - choose in order</li>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Content Standard</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Define specific learning objectives and content standards within your curriculum sub-strands
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
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
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
                  {/* Content Standard Name */}
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                      Content Standard Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Understanding Place Value"
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                          getFieldError('name') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
                  </div>

                  {/* Level Selection */}
<div className="space-y-4">
  <label className="block text-sm font-semibold text-gray-700">
    Education Level *
  </label>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> {/* Changed from grid-cols-2 to grid-cols-3 */}
    {(['Basic', 'JHS', 'SHS'] as const).map((level) => (
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
            ? 'border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-500/20'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}>
          <div className="flex items-center justify-center mb-2">
            {level === 'Basic' ? (
              <BookOpen className={`w-5 h-5 ${formData.level === level ? 'text-blue-700' : 'text-gray-600'}`} />
            ) : level === 'JHS' ? (
              <School className={`w-5 h-5 ${formData.level === level ? 'text-blue-700' : 'text-gray-600'}`} />
            ) : (
              <GraduationCap className={`w-5 h-5 ${formData.level === level ? 'text-blue-700' : 'text-gray-600'}`} />
            )}
          </div>
          <div className={`font-semibold text-sm md:text-base ${formData.level === level ? 'text-blue-700' : 'text-gray-700'}`}>
            {level === 'Basic' ? 'Basic School' : level === 'JHS' ? 'Junior High School' : 'Senior High School'}
          </div>
          <div className={`text-xs md:text-sm ${formData.level === level ? 'text-blue-600' : 'text-gray-500'}`}>
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
  <div className="grid grid-cols-3 gap-3">
    {(formData.level === 'Basic' ? ['4', '5', '6'] : ['1', '2', '3']).map((classNum) => (
      <label key={classNum} className="relative cursor-pointer">
        <input
          type="radio"
          name="class"
          value={classNum}
          checked={formData.class === classNum}
          onChange={handleInputChange}
          className="sr-only"
        />
        <div className={`p-3 border-2 rounded-lg text-center font-medium transition-all duration-200 ${
          formData.class === classNum
            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
            : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
        }`}>
          <div className="text-sm md:text-base">
            {formData.level} {classNum}
          </div>
        </div>
      </label>
    ))}
  </div>
</div>

                  {/* Course Selection (SHS only) */}
                  {formData.level === 'SHS' && (
                    <div className="animate-fadeIn">
                      <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-3">
                        Course *
                      </label>
                      <div className="relative">
                        <select
                          id="course"
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none bg-white ${
                            getFieldError('course') 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                          }`}
                        >
                          <option value="">
                            {availableCourses.length === 0 ? 'Loading courses...' : 'Select a course'}
                          </option>
                          {availableCourses.map((course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
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
                        disabled={availableSubjects.length === 0}
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none bg-white ${
                          getFieldError('subjectId') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                        } ${availableSubjects.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">
                          {availableSubjects.length === 0 
                            ? (formData.level === 'SHS' && !formData.course ? 'Select a course first' : 'Loading subjects...') 
                            : 'Select a subject'
                          }
                        </option>
                        {availableSubjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
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
                        disabled={availableStrands.length === 0}
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none bg-white ${
                          getFieldError('strandId') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                        } ${availableStrands.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">
                          {availableStrands.length === 0 
                            ? (!formData.subjectId ? 'Select a subject first' : 'Loading strands...') 
                            : 'Select a strand'
                          }
                        </option>
                        {availableStrands.map((strand) => (
                          <option key={strand.id} value={strand.id}>
                            {strand.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
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
                        disabled={availableSubStrands.length === 0}
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none bg-white ${
                          getFieldError('subStrandId') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                        } ${availableSubStrands.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">
                          {availableSubStrands.length === 0 
                            ? (!formData.strandId ? 'Select a strand first' : 'Loading sub-strands...') 
                            : 'Select a sub-strand'
                          }
                        </option>
                        {availableSubStrands.map((subStrand) => (
                          <option key={subStrand.id} value={subStrand.id}>
                            {subStrand.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    {getFieldError('subStrandId') && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                        {getFieldError('subStrandId')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isCreating}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isFormValid && !isCreating
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Create Content Standard</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    disabled={isCreating}
                    className="flex-none py-3 px-6 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset Form</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-6 space-y-6">
                {/* Form Summary Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clipboard className="w-5 h-5 mr-2 text-blue-600" />
                    Form Summary
                  </h3>
                  
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
                            {!formData.name.trim() && <li>• Content standard name</li>}
                            {formData.level === 'SHS' && !formData.course && <li>• Course selection</li>}
                            {!formData.subjectId && <li>• Subject selection</li>}
                            {!formData.strandId && <li>• Strand selection</li>}
                            {!formData.subStrandId && <li>• Sub-strand selection</li>}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Quick Tips
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start">
                      <Target className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      Fill out all required fields marked with *
                    </li>
                    <li className="flex items-start">
                      <BookOpen className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      Use descriptive names for content standards
                    </li>
                    <li className="flex items-start">
                      <Link className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      Selections are hierarchical - choose in order
                    </li>
                    <li className="flex items-start">
                      <RotateCcw className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      You can reset the form at any time
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewContentStandard;