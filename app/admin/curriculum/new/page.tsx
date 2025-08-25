"use client";

import { uploadToCloudinary } from '@/lib/cloudinary';
import { shsCourses, useAdminCurriculumStore } from '@/stores/curriculum';
import { AlertCircle, ArrowLeft, Check, FileText, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

// Type definitions
interface FormData {
  title: string;
  level: 'Basic' | 'JHS' | 'SHS' | '';
  class: string;
  course: string;
  subject: string;
  pdfFile: File | null;
}

interface FormErrors {
  title?: string;
  level?: string;
  class?: string;
  course?: string;
  subject?: string;
  pdfFile?: string;
}

interface DragState {
  pdf: boolean;
}

interface UploadProgress {
  pdf: number;
}

type FileField = 'pdfFile';
type ProgressField = 'pdf';

// Class options for each level
const classOptions = {
  Basic: ['Basic 4', 'Basic 5', 'Basic 6'],
  JHS: ['JHS 1', 'JHS 2', 'JHS 3'],
  SHS: ['SHS 1', 'SHS 2', 'SHS 3']
};

const AddNewCurriculum = () => {
  const {
    createDocument,
    fetchSubjects,
    getSubjectsForLevel,
    isCreating,
    createError,
    checkDuplicateDocument,
    clearErrors,
    subjects,
    isLoadingSubjects
  } = useAdminCurriculumStore();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    level: '',
    class: '',
    course: '',
    subject: '',
    pdfFile: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isDragOver, setIsDragOver] = useState<DragState>({ pdf: false });
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ pdf: 0 });
  const [isDuplicateChecking, setIsDuplicateChecking] = useState(false);

  useEffect(() => {
    if (formData.level) {
      fetchSubjects(formData.level, formData.course || undefined);
    }
  }, [formData.level, formData.course, fetchSubjects]);

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.level) newErrors.level = 'Level is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (formData.level === 'SHS' && !formData.course) newErrors.course = 'Course is required for SHS';
    if (!formData.pdfFile) newErrors.pdfFile = 'PDF file is required';

    if (formData.pdfFile && formData.pdfFile.type !== 'application/pdf') {
      newErrors.pdfFile = 'Please select a valid PDF file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset dependent fields
      ...(field === 'level' && { class: '', course: '', subject: '' }),
      ...(field === 'course' && { subject: '' })
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Enhanced handleFileUpload function with immediate progress feedback
  const handleFileUpload = (field: FileField, file: File | null): void => {
    if (file) {
      // Show immediate feedback
      setUploadProgress(prev => ({ ...prev, pdf: 10 }));
      
      // Simulate validation progress
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, pdf: 30 }));
      }, 200);

      setFormData(prev => ({ ...prev, [field]: file }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }

      // Complete local processing
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, pdf: 50 }));
      }, 500);
    }
  };

  // Alternative: Upload files immediately when selected (optional)
  const handleFileUploadImmediate = async (field: FileField, file: File | null): Promise<void> => {
    if (!file) return;
    
    try {
      setUploadProgress(prev => ({ ...prev, pdf: 10 }));
      
      const folder = 'curriculum/pdfs';
      const uploadResult = await uploadToCloudinary(file, folder);
      
      setUploadProgress(prev => ({ ...prev, pdf: 100 }));
      
      // Store both file and URL for later use
      setFormData(prev => ({ 
        ...prev, 
        [field]: file,
        [`${field}Url`]: uploadResult.secure_url // You'd need to add these to FormData interface
      }));
      
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
      setUploadProgress(prev => ({ ...prev, pdf: 0 }));
      setErrors(prev => ({ 
        ...prev, 
        [field]: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, field: ProgressField): void => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, field: ProgressField): void => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [field]: false }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, field: FileField): void => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, pdf: false }));
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(field, files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Ensure files exist
    if (!formData.pdfFile) {
      return;
    }

    try {
      // Check for duplicate document first
      setIsDuplicateChecking(true);
      const existingDocument = await checkDuplicateDocument(
        formData.level,
        formData.class, // Pass full class name
        formData.subject,
        formData.level === 'SHS' ? formData.course : undefined
      );

      setIsDuplicateChecking(false);

      if (existingDocument) {
        const courseText = formData.level === 'SHS' && formData.course ? ` (${formData.course})` : '';
        alert(
          `A document for ${formData.level} ${formData.class} - ${formData.subject}${courseText} already exists.\n\nExisting document: "${existingDocument.title}"\n\nPlease choose different criteria or update the existing document instead.`
        );
        return;
      }

      // Update progress for PDF
      setUploadProgress({ pdf: 0 });

      // Upload PDF to Cloudinary
      setUploadProgress(prev => ({ ...prev, pdf: 20 }));
      const pdfUpload = await uploadToCloudinary(formData.pdfFile, 'curriculum/pdfs');
      setUploadProgress(prev => ({ ...prev, pdf: 60 }));

      // Complete progress
      setUploadProgress({ pdf: 100 });

      const documentData = {
        title: formData.title.trim(),
        class: formData.class, // Pass full class name
        subject: formData.subject,
        level: formData.level,
        course: formData.level === 'SHS' ? formData.course : undefined,
        pdfUrl: pdfUpload.secure_url
      };

      const success = await createDocument(documentData);
      
      if (success) {
        // Reset form
        setFormData({
          title: '',
          level: '',
          class: '',
          course: '',
          subject: '',
          pdfFile: null
        });
        setUploadProgress({ pdf: 0 });
        alert('Curriculum document created successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      setUploadProgress({ pdf: 0 });
      setIsDuplicateChecking(false);
      
      if (error instanceof Error && error.message.includes('duplicate') || error instanceof Error && error.message.includes('existing')) {
        alert(`Cannot create document: ${error.message}`);
      } else {
        alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    }
  };

  const availableSubjects = getSubjectsForLevel(formData.level as 'Basic' | 'JHS' | 'SHS' | undefined, formData.course);
  
  // Get available classes for the selected level
  const availableClasses = formData.level ? classOptions[formData.level as keyof typeof classOptions] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Curriculum</h1>
              <p className="text-gray-600 mt-1">Create a new curriculum document for students</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h2 className="text-xl font-semibold text-white">Document Information</h2>
              <p className="text-blue-100 mt-1">Fill in the details for your curriculum document</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                    } focus:outline-none`}
                    placeholder="Enter document title..."
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>


              </div>

              {/* Classification */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Level *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                        errors.level ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                      } focus:outline-none`}
                    >
                      <option value="">Select Level</option>
                      <option value="Basic">Basic School</option>
                      <option value="JHS">Junior High School</option>
                      <option value="SHS">Senior High School</option>
                    </select>
                    {errors.level && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.level}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Class *
                    </label>
                    <select
                      value={formData.class}
                      onChange={(e) => handleInputChange('class', e.target.value)}
                      disabled={!formData.level}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                        errors.class ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                      } focus:outline-none disabled:bg-gray-100`}
                    >
                      <option value="">Select Class</option>
                      {availableClasses.map(className => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>
                    {errors.class && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.class}
                      </p>
                    )}
                  </div>

                  {formData.level === 'SHS' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course *
                      </label>
                      <select
                        value={formData.course}
                        onChange={(e) => handleInputChange('course', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.course ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none`}
                      >
                        <option value="">Select Course</option>
                        {shsCourses.map(course => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                      {errors.course && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.course}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    disabled={!formData.level || (formData.level === 'SHS' && !formData.course) || isLoadingSubjects}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                      errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                    } focus:outline-none disabled:bg-gray-100`}
                  >
                    <option value="">
                      {isLoadingSubjects ? 'Loading subjects...' : 'Select Subject'}
                    </option>
                    {availableSubjects.map(subject => (
                      <option key={subject.id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">File Upload</h3>
                <div className="grid grid-cols-1 gap-6">
                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      PDF Document *
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                        isDragOver.pdf 
                          ? 'border-blue-400 bg-blue-50' 
                          : errors.pdfFile 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={(e) => handleDragOver(e, 'pdf')}
                      onDragLeave={(e) => handleDragLeave(e, 'pdf')}
                      onDrop={(e) => handleDrop(e, 'pdfFile')}
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload('pdfFile', e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center">
                        {formData.pdfFile ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                              <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">{formData.pdfFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            {uploadProgress.pdf > 0 && uploadProgress.pdf < 100 && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${uploadProgress.pdf}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full">
                              <FileText className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                              Drop PDF file here or click to browse
                            </p>
                            <p className="text-xs text-gray-500">Maximum file size: 50MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.pdfFile && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.pdfFile}
                      </p>
                    )}
                  </div>


                </div>
              </div>

              {/* Error Display */}
              {createError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 font-medium">Error creating document</p>
                  </div>
                  <p className="text-red-700 mt-1">{createError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isCreating || isDuplicateChecking}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {isDuplicateChecking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Checking for duplicates...
                    </>
                  ) : isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Document...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Create Curriculum Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewCurriculum;