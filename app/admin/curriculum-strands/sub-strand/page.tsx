"use client";
import { CreateSubStrandInput, useCurriculumStore } from '@/stores/curriculumStrand';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Define Subject interface
interface Subject {
  id: string;
  name: string;
  level: string;
  course?: string;
}

// Define Strand interface
interface Strand {
  id: string;
  name: string;
  subjectId: string;
  subject: string;
  level: string;
  class: string;
  course?: string;
}

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
}

const initialFormData: FormData = {
  name: '',
  level: 'JHS',
  class: '1',
  course: '',
  subjectId: '',
  subject: '',
  strandId: '',
  strand: ''
};

const AddNewSubStrand = () => {
  const {
    subjects = [],
    strands = [],
    isCreating = false,
    error,
    fetchSubjects,
    fetchStrands,
    createSubStrand,
    clearError
  } = useCurriculumStore();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
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

const isFormValid = useMemo(() => {
  return formData.name.trim() !== '' && 
         formData.subjectId !== '' && 
         formData.strandId !== '' &&
         (formData.level === 'KG' || formData.level === 'Basic' || formData.level === 'JHS' || formData.course !== '');
}, [formData]);


const progressPercentage = useMemo(() => {
  const totalFields = (formData.level === 'KG' || formData.level === 'Basic' || formData.level === 'JHS') ? 5 : 6;
  let filledFields = 0;
  
  if (formData.name.trim()) filledFields++;
  if (formData.level) filledFields++;
  if (formData.class) filledFields++;
  if (formData.subjectId) filledFields++;
  if (formData.strandId) filledFields++;
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

  // Reset course when level changes from SHS to JHS


  // Reset dependent fields when parent selections change
useEffect(() => {
  setFormData(prev => ({ 
    ...prev, 
    subjectId: '', 
    subject: '', 
    strandId: '', 
    strand: '' 
  }));
}, [formData.level, formData.course]);

useEffect(() => {
  setFormData(prev => ({ ...prev, strandId: '', strand: '' }));
}, [formData.subjectId, formData.class]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, strandId: '', strand: '' }));
  }, [formData.subjectId, formData.class]);

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
        strand: ''
      }));
    } else if (name === 'strandId') {
      const selectedStrand = availableStrands.find(strand => strand.id === value);
      setFormData(prev => ({
        ...prev,
        strandId: value,
        strand: selectedStrand?.name || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, [availableSubjects, availableStrands]);

const validateForm = useCallback(() => {
  const errors: string[] = [];
  
  if (!formData.name.trim()) {
    errors.push('Sub-strand name is required');
  }
  
  if (!formData.subjectId) {
    errors.push('Please select a subject');
  }

  if (!formData.strandId) {
    errors.push('Please select a strand');
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

    if (!createSubStrand) {
      alert('Create function is not available');
      return;
    }

    const subStrandInput: CreateSubStrandInput = {
      name: formData.name.trim(),
      strandId: formData.strandId,
      strand: formData.strand,
      subjectId: formData.subjectId,
      subject: formData.subject
    };

    try {
      const result = await createSubStrand(subStrandInput);
      
      if (result) {
        // Reset form on success
        setFormData(initialFormData);
        setTouchedFields(new Set());
        alert('🎉 Sub-strand created successfully!');
      }
    } catch (err) {
      console.error('Failed to create sub-strand:', err);
      alert('Failed to create sub-strand. Please try again.');
    }
  }, [formData, validateForm, createSubStrand]);

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
        return formData.name.trim() === '' ? 'Sub-strand name is required' : '';
      case 'subjectId':
        return formData.subjectId === '' ? 'Please select a subject' : '';
      case 'strandId':
        return formData.strandId === '' ? 'Please select a strand' : '';
      case 'course':
        return formData.level === 'SHS' && formData.course === '' ? 'Please select a course' : '';
      default:
        return '';
    }
  }, [formData, touchedFields]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading curriculum data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Sub-Strand</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Add detailed sub-components to your curriculum strands for comprehensive learning structure
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Form Progress</span>
            <span>{progressPercentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {/* Sub-Strand Name */}
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                    Sub-Strand Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Addition and Subtraction"
                      className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                        getFieldError('name') 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-purple-500 hover:border-gray-300'
                      }`}
                    />
                    {formData.name && (
                      <div className="absolute right-3 top-3">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {getFieldError('name') && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {getFieldError('name')}
                    </p>
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
            ? 'border-purple-500 bg-purple-50 shadow-lg ring-4 ring-purple-500/20'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}>
          <div className={`font-semibold ${formData.level === level ? 'text-purple-700' : 'text-gray-700'}`}>
            {level === 'KG' ? 'Kindergarten' : level === 'Basic' ? 'Basic School' : level === 'JHS' ? 'Junior High School' : 'Senior High School'}
          </div>
          <div className={`text-sm ${formData.level === level ? 'text-purple-600' : 'text-gray-500'}`}>
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
    {formData.level === 'KG'
      ? ['1', '2'].map((classNum) => (
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
                ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}>
              KG {classNum}
            </div>
          </label>
        ))
      : formData.level === 'Basic' 
      ? ['1', '2', '3', '4', '5', '6'].map((classNum) => (
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
                ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}>
              Basic {classNum}
            </div>
          </label>
        ))
      : ['1', '2', '3'].map((classNum) => (
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
                ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}>
              {formData.level} {classNum}
            </div>
          </label>
        ))
    }
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
                        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 appearance-none bg-white ${
                          getFieldError('course') 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-purple-500 hover:border-gray-300'
                        }`}
                      >
                        <option value="">
                          {availableCourses.length === 0 ? '⏳ Loading courses...' : '📚 Select a course'}
                        </option>
                        {availableCourses.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {getFieldError('course') && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
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
                      className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 appearance-none bg-white ${
                        availableSubjects.length === 0 
                          ? 'bg-gray-50 cursor-not-allowed' 
                          : getFieldError('subjectId')
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-purple-500 hover:border-gray-300'
                      }`}
                    >
                      <option value="">
                        {availableSubjects.length === 0 
                          ? (formData.level === 'SHS' && !formData.course 
                              ? '👆 Please select a course first' 
                              : '⏳ Loading subjects...')
                          : '🎯 Select a subject'
                        }
                      </option>
                      {availableSubjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {getFieldError('subjectId') && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {getFieldError('subjectId')}
                    </p>
                  )}
                </div>

                {/* Strand Selection */}
                <div>
                  <label htmlFor="strandId" className="block text-sm font-semibold text-gray-700 mb-3">
                    Parent Strand *
                  </label>
                  <div className="relative">
                    <select
                      id="strandId"
                      name="strandId"
                      value={formData.strandId}
                      onChange={handleInputChange}
                      disabled={availableStrands.length === 0}
                      className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 appearance-none bg-white ${
                        availableStrands.length === 0 
                          ? 'bg-gray-50 cursor-not-allowed' 
                          : getFieldError('strandId')
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-purple-500 hover:border-gray-300'
                      }`}
                    >
                      <option value="">
                        {availableStrands.length === 0 
                          ? (!formData.subjectId 
                              ? '👆 Please select a subject first' 
                              : '⏳ Loading strands...')
                          : '🔗 Select a parent strand'
                        }
                      </option>
                      {availableStrands.map((strand) => (
                        <option key={strand.id} value={strand.id}>
                          {strand.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {getFieldError('strandId') && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {getFieldError('strandId')}
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCreating}
                  >
                    🔄 Reset Form
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isCreating || !isFormValid}
                    className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 border border-transparent rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Sub-Strand...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Sub-Strand
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-500 ${
                isFormValid ? 'opacity-100 transform translate-y-0' : 'opacity-50 transform translate-y-4'
              }`}>
                <div className="p-6">
                    <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-3">Sub-Strand Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">
                            {formData.name || 'Not specified'}
                          </span>
                        </div>
                        <div className="flex justify-between">
  <span className="text-gray-600">Level:</span>
  <span className="font-medium text-gray-900">
    {formData.level === 'KG' ? 'Kindergarten' : formData.level === 'Basic' ? 'Basic School' : formData.level === 'JHS' ? 'Junior High School' : 'Senior High School'}
  </span>
</div>
                        <div className="flex justify-between">
  <span className="text-gray-600">Class:</span>
  <span className="font-medium text-gray-900">
    {formData.level === 'KG' ? `KG ${formData.class}` : formData.level === 'Basic' ? `Basic ${formData.class}` : `${formData.level} ${formData.class}`}
  </span>
</div>
                        {formData.level === 'SHS' && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Course:</span>
                            <span className="font-medium text-gray-900">
                              {formData.course || 'Not selected'}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subject:</span>
                          <span className="font-medium text-gray-900">
                            {formData.subject || 'Not selected'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Parent Strand:</span>
                          <span className="font-medium text-gray-900">
                            {formData.strand || 'Not selected'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Form Status
                      </h4>
                      <div className="text-sm">
                        <div className="flex justify-between mb-2">
                          <span className="text-purple-600">Completion:</span>
                          <span className="font-medium text-purple-800">{progressPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-600">Ready to Submit:</span>
                          <span className={`font-medium ${isFormValid ? 'text-green-600' : 'text-orange-600'}`}>
                            {isFormValid ? '✅ Yes' : '⏳ No'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Quick Tips
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Use descriptive names for sub-strands</li>
                        <li>• Select the correct parent strand</li>
                        <li>• Ensure all required fields are filled</li>
                        <li>• Review details before submitting</li>
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

export default AddNewSubStrand;