"use client";
import { CreateStrandInput, useCurriculumStore } from '@/stores/curriculumStrand';
import React, { useEffect, useState } from 'react';

// Define Subject interface
interface Subject {
  id: string;
  name: string;
  level: string;
  course?: string;
}

const AddNewStrand = () => {
  const {
    subjects,
    isCreating,
    error,
    fetchSubjects,
    createStrand,
    clearError
  } = useCurriculumStore();

  const [formData, setFormData] = useState({
    name: '',
    level: 'Basic' as string,
    class: '4',
    course: '',
    subjectId: '',
    subject: ''
  });

  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);

  // Fetch all subjects when component mounts or when level changes
  useEffect(() => {
    const loadAllSubjects = async () => {
      await fetchSubjects(formData.level);
    };
    loadAllSubjects();
  }, [formData.level, fetchSubjects]);

  // Get unique courses for SHS when level is SHS
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

  // Filter subjects based on level and course
  useEffect(() => {
    if (formData.level === 'Basic' || formData.level === 'JHS') {
      const levelSubjects = subjects.filter(subject => subject.level === formData.level);
      setAvailableSubjects(levelSubjects);
    } else if (formData.level === 'SHS') {
      if (formData.course) {
        const shsSubjects = subjects.filter(
          subject => 
  subject.level === 'SHS' &&
  Array.isArray(subject.course) &&
  subject.course.includes(formData.course)
        );
        setAvailableSubjects(shsSubjects);
      } else {
        setAvailableSubjects([]);
      }
    }
  }, [formData.level, formData.course, subjects]);

  // Reset subject when level or course changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, subjectId: '', subject: '' }));
  }, [formData.level, formData.course]);

  // Reset class when level changes to appropriate default
  useEffect(() => {
    let defaultClass = '1';
    if (formData.level === 'Basic') {
      defaultClass = '4';
    } else if (formData.level === 'JHS' || formData.level === 'SHS') {
      defaultClass = '1';
    }
    setFormData(prev => ({ ...prev, class: defaultClass }));
  }, [formData.level]);

  // Form validation
  useEffect(() => {
    const isValid = formData.name.trim() !== '' && 
                   formData.subjectId !== '' && 
                   (formData.level !== 'SHS' || formData.course !== '');
    setIsFormValid(isValid);
    setShowPreview(isValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouchedFields(prev => new Set(Array.from(prev).concat([name])));
    
    if (name === 'subjectId') {
      const selectedSubject = availableSubjects.find(subject => subject.id === value);
      setFormData(prev => ({
        ...prev,
        subjectId: value,
        subject: selectedSubject ? selectedSubject.name : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a strand name');
      return;
    }
    
    if (!formData.subjectId) {
      alert('Please select a subject');
      return;
    }

    if (formData.level === 'SHS' && !formData.course) {
      alert('Please select a course for SHS');
      return;
    }

    const strandInput: CreateStrandInput = {
      name: formData.name.trim(),
      subjectId: formData.subjectId,
      subject: formData.subject,
      level: formData.level,
      class: `${formData.level} ${formData.class}`,
      course: formData.level === 'SHS' ? formData.course : undefined
    };

    const result = await createStrand(strandInput);
    
    if (result) {
      // Reset form on success
      setFormData({
        name: '',
        level: 'Basic',
        class: '4',
        course: '',
        subjectId: '',
        subject: ''
      });
      setTouchedFields(new Set());
      alert('🎉 Strand created successfully!');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      level: 'Basic',
      class: '4',
      course: '',
      subjectId: '',
      subject: ''
    });
    setTouchedFields(new Set());
    clearError();
  };

  const getFieldError = (fieldName: string) => {
    if (!touchedFields.has(fieldName)) return '';
    
    switch (fieldName) {
      case 'name':
        return formData.name.trim() === '' ? 'Strand name is required' : '';
      case 'subjectId':
        return formData.subjectId === '' ? 'Please select a subject' : '';
      case 'course':
        return formData.level === 'SHS' && formData.course === '' ? 'Please select a course' : '';
      default:
        return '';
    }
  };

  const getProgressPercentage = () => {
    const totalFields = formData.level === 'SHS' ? 5 : 4; // name, level, class, subject, (+course for SHS)
    let filledFields = 0;
    
    if (formData.name.trim()) filledFields++;
    if (formData.level) filledFields++;
    if (formData.class) filledFields++;
    if (formData.subjectId) filledFields++;
    if (formData.level !== 'SHS' || formData.course) filledFields++;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  const getClassOptions = () => {
    switch (formData.level) {
      case 'Basic':
        return ['4', '5', '6'];
      case 'JHS':
      case 'SHS':
        return ['1', '2', '3'];
      default:
        return ['1', '2', '3'];
    }
  };

  const getLevelDisplayName = (level: string) => {
    switch (level) {
      case 'Basic':
        return 'Basic School';
      case 'JHS':
        return 'Junior High School';
      case 'SHS':
        return 'Senior High School';
      default:
        return level;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Strand</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build a comprehensive curriculum strand tailored to your educational needs
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Form Progress</span>
            <span>{getProgressPercentage()}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-pulse">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {/* Strand Name */}
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                    Strand Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Numbers and Operations"
                      className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                        getFieldError('name') 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Basic', 'JHS', 'SHS'].map((level) => (
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
                          <div className={`font-semibold ${formData.level === level ? 'text-blue-700' : 'text-gray-700'}`}>
                            {getLevelDisplayName(level)}
                          </div>
                          <div className={`text-sm ${formData.level === level ? 'text-blue-600' : 'text-gray-500'}`}>
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
                    {getClassOptions().map((classNum) => (
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
                          {formData.level} {classNum}
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
                      className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none bg-white ${
                        availableSubjects.length === 0 
                          ? 'bg-gray-50 cursor-not-allowed' 
                          : getFieldError('subjectId')
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
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
                    className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Strand...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Strand
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
                showPreview ? 'opacity-100 transform translate-y-0' : 'opacity-50 transform translate-y-4'
              }`}>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  </div>
                  
                  {showPreview ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Strand Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-900">{formData.name || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subject:</span>
                            <span className="font-medium text-gray-900">{formData.subject || 'Not selected'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Level:</span>
                            <span className="font-medium text-gray-900">{formData.level}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Class:</span>
                            <span className="font-medium text-gray-900">{formData.level} {formData.class}</span>
                          </div>
                          {formData.level === 'SHS' && formData.course && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Course:</span>
                              <span className="font-medium text-gray-900">{formData.course}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Ready to create
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <p className="text-sm">Fill out the form to see a preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewStrand;