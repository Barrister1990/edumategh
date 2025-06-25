"use client";

import { uploadToCloudinary } from '@/lib/cloudinary';
import { shsCourses, useAdminCurriculumStore } from '@/stores/curriculum';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    Download,
    Edit3,
    ExternalLink,
    Eye,
    FileText,
    Image,
    Save,
    X
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Type definitions
interface FormData {
  title: string;
  description: string;
  level: 'JHS' | 'SHS';
  class: string;
  course: string;
  subject: string;
  pdfFile: File | null;
  thumbnailFile: File | null;
  pdfUrl: string;
  thumbnailUrl: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  level?: string;
  class?: string;
  course?: string;
  subject?: string;
  pdfFile?: string;
  thumbnailFile?: string;
}

interface DragState {
  pdf: boolean;
  thumbnail: boolean;
}

interface UploadProgress {
  pdf: number;
  thumbnail: number;
}

type FileField = 'pdfFile' | 'thumbnailFile';
type ProgressField = 'pdf' | 'thumbnail';

const EditCurriculum = () => {
  const params = useParams();
  const router = useRouter();
  const curriculumId = params.id as string;

  const {
    fetchDocumentById,
    updateDocument,
    fetchSubjects,
    getSubjectsForLevel,
    checkDuplicateDocument,
    selectedDocument,
    isLoadingDocument,
    isUpdating,
    updateError,
    documentError,
    subjects,
    isLoadingSubjects,
    clearErrors
  } = useAdminCurriculumStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    level: 'JHS',
    class: '',
    course: '',
    subject: '',
    pdfFile: null,
    thumbnailFile: null,
    pdfUrl: '',
    thumbnailUrl: ''
  });

  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDragOver, setIsDragOver] = useState<DragState>({ pdf: false, thumbnail: false });
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ pdf: 0, thumbnail: 0 });
  const [isDuplicateChecking, setIsDuplicateChecking] = useState(false);
  const [hasFileChanges, setHasFileChanges] = useState({ pdf: false, thumbnail: false });

  // Load document data
  useEffect(() => {
    if (curriculumId) {
      fetchDocumentById(curriculumId);
    }
  }, [curriculumId, fetchDocumentById]);

  // Set form data when document is loaded
  useEffect(() => {
    if (selectedDocument) {
      const levelFromClass = selectedDocument.class.split(' ')[0] as 'JHS' | 'SHS';
      const classNumber = selectedDocument.class.split(' ')[1];
      
      const data: FormData = {
        title: selectedDocument.title,
        description: selectedDocument.description,
        level: levelFromClass,
        class: classNumber,
        course: selectedDocument.course || '',
        subject: selectedDocument.subject,
        pdfFile: null,
        thumbnailFile: null,
        pdfUrl: selectedDocument.pdfUrl,
        thumbnailUrl: selectedDocument.thumbnailUrl
      };
      
      setFormData(data);
      setOriginalData(data);
    }
  }, [selectedDocument]);

  // Load subjects when level or course changes
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
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.level) newErrors.level = 'Level is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (formData.level === 'SHS' && !formData.course) newErrors.course = 'Course is required for SHS';

    // Only validate files if they were changed
    if (hasFileChanges.pdf && formData.pdfFile && formData.pdfFile.type !== 'application/pdf') {
      newErrors.pdfFile = 'Please select a valid PDF file';
    }

    if (hasFileChanges.thumbnail && formData.thumbnailFile && !formData.thumbnailFile.type.startsWith('image/')) {
      newErrors.thumbnailFile = 'Please select a valid image file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleInputChange = (field: keyof FormData, value: string): void => {
  setFormData(prev => ({
    ...prev,
    [field]: value,
    // Reset dependent fields
    ...(field === 'level' && { course: '', subject: '' }),
    ...(field === 'course' && { subject: '' })
  }));

  // Clear error for this field (only if it's a field that can have errors)
  if (field in errors && errors[field as keyof FormErrors]) {
    setErrors(prev => ({ ...prev, [field as keyof FormErrors]: '' }));
  }
};

  const handleFileUpload = (field: FileField, file: File | null): void => {
    if (file) {
      const progressField: ProgressField = field === 'pdfFile' ? 'pdf' : 'thumbnail';
      
      // Show immediate feedback
      setUploadProgress(prev => ({ ...prev, [progressField]: 10 }));
      
      // Mark that this file type has changes
      setHasFileChanges(prev => ({ 
        ...prev, 
        [progressField]: true 
      }));

      setFormData(prev => ({ ...prev, [field]: file }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }

      // Complete local processing
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [progressField]: 50 }));
      }, 500);
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
    const progressField: ProgressField = field === 'pdfFile' ? 'pdf' : 'thumbnail';
    setIsDragOver(prev => ({ ...prev, [progressField]: false }));
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(field, files[0]);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
      setHasFileChanges({ pdf: false, thumbnail: false });
      setUploadProgress({ pdf: 0, thumbnail: 0 });
      setErrors({});
    }
    setIsEditing(false);
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm() || !selectedDocument) return;

    try {
      // Check for duplicate document if classification changed
      const classificationChanged = 
        formData.level !== originalData?.level ||
        formData.class !== originalData?.class ||
        formData.subject !== originalData?.subject ||
        formData.course !== originalData?.course;

      if (classificationChanged) {
        setIsDuplicateChecking(true);
        const existingDocument = await checkDuplicateDocument(
          formData.level,
          formData.class,
          formData.subject,
          formData.level === 'SHS' ? formData.course : undefined
        );

        setIsDuplicateChecking(false);

        if (existingDocument && existingDocument.id !== selectedDocument.id) {
          const courseText = formData.level === 'SHS' && formData.course ? ` (${formData.course})` : '';
          alert(
            `A document for ${formData.level} Class ${formData.class} - ${formData.subject}${courseText} already exists.\n\nExisting document: "${existingDocument.title}"\n\nPlease choose different criteria.`
          );
          return;
        }
      }

      let updatedPdfUrl = formData.pdfUrl;
      let updatedThumbnailUrl = formData.thumbnailUrl;

      // Upload PDF only if changed
      if (hasFileChanges.pdf && formData.pdfFile) {
        setUploadProgress(prev => ({ ...prev, pdf: 20 }));
        const pdfUpload = await uploadToCloudinary(formData.pdfFile, 'curriculum/pdfs');
        setUploadProgress(prev => ({ ...prev, pdf: 100 }));
        updatedPdfUrl = pdfUpload.secure_url;
      }

      // Upload thumbnail only if changed
      if (hasFileChanges.thumbnail && formData.thumbnailFile) {
        setUploadProgress(prev => ({ ...prev, thumbnail: 20 }));
        const thumbnailUpload = await uploadToCloudinary(formData.thumbnailFile, 'curriculum/thumbnails');
        setUploadProgress(prev => ({ ...prev, thumbnail: 100 }));
        updatedThumbnailUrl = thumbnailUpload.secure_url;
      }

      const updateData = {
        id: selectedDocument.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        class: `${formData.level} ${formData.class}`,
        subject: formData.subject,
        course: formData.level === 'SHS' ? formData.course : undefined,
        ...(hasFileChanges.pdf && { pdfUrl: updatedPdfUrl }),
        ...(hasFileChanges.thumbnail && { thumbnailUrl: updatedThumbnailUrl })
      };

      const success = await updateDocument(updateData);
      
      if (success) {
        // Update original data and reset states
        const newOriginalData = {
          ...formData,
          pdfUrl: updatedPdfUrl,
          thumbnailUrl: updatedThumbnailUrl
        };
        setOriginalData(newOriginalData);
        setFormData(newOriginalData);
        setHasFileChanges({ pdf: false, thumbnail: false });
        setUploadProgress({ pdf: 0, thumbnail: 0 });
        setIsEditing(false);
        alert('Curriculum document updated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      setUploadProgress({ pdf: 0, thumbnail: 0 });
      setIsDuplicateChecking(false);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const availableSubjects = getSubjectsForLevel(
    formData.level as 'JHS' | 'SHS' | undefined, 
    formData.course
  );

  if (isLoadingDocument) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading curriculum document...</p>
        </div>
      </div>
    );
  }

  if (documentError || !selectedDocument) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600 mb-4">{documentError || 'The requested curriculum document could not be found.'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Edit Curriculum' : 'View Curriculum'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? 'Update curriculum document details' : 'Curriculum document details'}
                </p>
              </div>
            </div>
            
            {!isEditing ? (
              <div className="flex items-center gap-3">
                <a
                  href={formData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View PDF
                </a>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isUpdating || isDuplicateChecking}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDuplicateChecking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className={`px-8 py-6 ${isEditing ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
              <div className="flex items-center gap-3">
                {isEditing ? <Edit3 className="w-6 h-6 text-white" /> : <Eye className="w-6 h-6 text-white" />}
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {isEditing ? 'Edit Document Information' : 'Document Information'}
                  </h2>
                  <p className={`mt-1 ${isEditing ? 'text-orange-100' : 'text-blue-100'}`}>
                    {isEditing ? 'Make changes to the curriculum document' : 'View curriculum document details'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Document Title {isEditing && '*'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                        errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                      } focus:outline-none`}
                      placeholder="Enter document title..."
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      {formData.title}
                    </div>
                  )}
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description {isEditing && '*'}
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none ${
                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                      } focus:outline-none`}
                      placeholder="Describe the curriculum document..."
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px] whitespace-pre-wrap">
                      {formData.description}
                    </div>
                  )}
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
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
                      Level {isEditing && '*'}
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.level ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none`}
                      >
                        <option value="">Select Level</option>
                        <option value="JHS">Junior High School</option>
                        <option value="SHS">Senior High School</option>
                      </select>
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        {formData.level === 'JHS' ? 'Junior High School' : 'Senior High School'}
                      </div>
                    )}
                    {errors.level && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.level}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Class {isEditing && '*'}
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.class}
                        onChange={(e) => handleInputChange('class', e.target.value)}
                        disabled={!formData.level}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.class ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none disabled:bg-gray-100`}
                      >
                        <option value="">Select Class</option>
                        <option value="1">Class 1</option>
                        <option value="2">Class 2</option>
                        <option value="3">Class 3</option>
                      </select>
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        Class {formData.class}
                      </div>
                    )}
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
                        Course {isEditing && '*'}
                      </label>
                      {isEditing ? (
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
                      ) : (
                        <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                          {formData.course}
                        </div>
                      )}
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
                    Subject {isEditing && '*'}
                  </label>
                  {isEditing ? (
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
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      {formData.subject}
                    </div>
                  )}
                  {errors.subject && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Current Files Display */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isEditing ? 'Files (Upload new files to replace)' : 'Document Files'}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* PDF Display/Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      PDF Document
                    </label>
                    {isEditing ? (
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                          isDragOver.pdf 
                            ? 'border-blue-400 bg-blue-50' 
                            : hasFileChanges.pdf
                              ? 'border-green-400 bg-green-50'
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
                                Drop new PDF here or click to browse
                              </p>
                              <p className="text-xs text-gray-500">
                                Current: {selectedDocument?.title} || 'Document'</p>
                            </div>
                          )}
                        </div>
                        {errors.pdfFile && (
                          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.pdfFile}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                              <FileText className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">PDF Document</p>
                              <p className="text-sm text-gray-500">Current document</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={formData.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </a>
                            <a
                              href={formData.pdfUrl}
                              download
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Display/Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thumbnail Image
                    </label>
                    {isEditing ? (
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                          isDragOver.thumbnail 
                            ? 'border-blue-400 bg-blue-50' 
                            : hasFileChanges.thumbnail
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={(e) => handleDragOver(e, 'thumbnail')}
                        onDragLeave={(e) => handleDragLeave(e, 'thumbnail')}
                        onDrop={(e) => handleDrop(e, 'thumbnailFile')}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('thumbnailFile', e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                          {formData.thumbnailFile ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                                <Check className="w-6 h-6 text-green-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-900">{formData.thumbnailFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(formData.thumbnailFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              {uploadProgress.thumbnail > 0 && uploadProgress.thumbnail < 100 && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${uploadProgress.thumbnail}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full">
                                <Image className="w-6 h-6 text-gray-400" />
                              </div>
                              <p className="text-sm font-medium text-gray-700">
                                Drop new image here or click to browse
                              </p>
                              <p className="text-xs text-gray-500">
                                Current thumbnail available
                              </p>
                            </div>
                          )}
                        </div>
                        {errors.thumbnailFile && (
                          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.thumbnailFile}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                              {formData.thumbnailUrl ? (
  <img
    src={formData.thumbnailUrl}
    alt="Thumbnail"
    className="w-full h-full object-cover"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEzLjc5IDkuNzkgMTAuMjEgMTIgOEMxNC4yMSAxMC4yMSAxNC4yMSAxMy43OSAxMiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
    }}
  />
) : (
  <div className="w-full h-full flex items-center justify-center bg-gray-200">
    <Image className="w-6 h-6 text-gray-400" />
  </div>
)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Thumbnail Image</p>
                              <p className="text-sm text-gray-500">Current thumbnail</p>
                            </div>
                          </div>
                          <a
                            href={formData.thumbnailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {updateError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-red-700">{updateError}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons - Mobile */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 sm:hidden">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating || isDuplicateChecking}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDuplicateChecking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Checking...
                      </>
                    ) : isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCurriculum;