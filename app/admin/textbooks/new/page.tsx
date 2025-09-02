"use client"
import { useAdminTextbookStore } from '@/stores/useTexbookStore';
import {
    AlertCircle,
    ArrowLeft,
    BookMarked,
    BookOpen,
    Building,
    Calendar,
    Check,
    FileText,
    GraduationCap,
    Image as ImageIcon,
    Loader2,
    Target,
    Upload,
    User,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Type definitions
interface UploadProgressBarProps {
  progress: number;
  label: string;
}

interface ModernFileUploadProps {
  label: string;
  accept: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemove: () => void;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  description: string;
  error?: string;
  uploadProgress?: number;
}

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  required?: boolean;
  className?: string;
}

interface ModernSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

interface FormData {
  title: string;
  author: string;
  description: string;
  publisher: string;
  year: string;
  level: string;
  class: string;
  course: string;
  subject: string;
}

interface ValidationErrors {
  title?: string;
  author?: string;
  description?: string;
  publisher?: string;
  year?: string;
  level?: string;
  class?: string;
  course?: string;
  subject?: string;
  pdf?: string;
  cover?: string;
}

// Progress bar component for file uploads
const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ progress, label }) => {
  if (progress === 0) return null;
  
  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Modern file upload component with enhanced styling
const ModernFileUpload: React.FC<ModernFileUploadProps> = ({ 
  label, 
  accept, 
  onFileSelect, 
  selectedFile, 
  onRemove, 
  icon: Icon,
  placeholder,
  description,
  error,
  uploadProgress = 0
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-slate-600" />
        <label className="text-sm font-semibold text-slate-700">{label}</label>
      </div>
      
      <div
        className={`relative group border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'border-blue-400 bg-blue-50/50 scale-[1.02]'
            : selectedFile
            ? 'border-emerald-400 bg-emerald-50/50'
            : error
            ? 'border-red-300 bg-red-50/30'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Icon className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-slate-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`mx-auto p-4 rounded-full transition-colors ${
              isDragOver ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-slate-200'
            }`}>
              <Upload className={`h-8 w-8 transition-colors ${
                isDragOver ? 'text-blue-600' : 'text-slate-500'
              }`} />
            </div>
            <div>
              <label htmlFor={`file-${label}`} className="cursor-pointer">
                <span className="text-base font-semibold text-slate-700 hover:text-slate-900">
                  {placeholder}
                </span>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
              </label>
              <input
                id={`file-${label}`}
                type="file"
                className="sr-only"
                accept={accept}
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Upload Progress */}
      {uploadProgress > 0 && (
        <UploadProgressBar progress={uploadProgress} label={`Uploading ${label.toLowerCase()}`} />
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// Modern input field component
const ModernInput: React.FC<ModernInputProps> = ({ 
  label, 
  icon: Icon, 
  error, 
  required = false, 
  className = "", 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-slate-600" />}
        <label className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      <div className="relative">
        <input
          {...props}
          className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            error ? 'border-red-300 bg-red-50/30' : 'hover:border-slate-400'
          } ${className}`}
        />
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// Modern select component
const ModernSelect: React.FC<ModernSelectProps> = ({ 
  label, 
  icon: Icon, 
  error, 
  required = false, 
  children, 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-slate-600" />}
        <label className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      <select
        {...props}
        className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-300 bg-red-50/30' : 'hover:border-slate-400'
        }`}
      >
        {children}
      </select>
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// Main page component
export default function NewTextbookPage() {
  const router = useRouter();
  
  // Use the store
  const { 
    createTextbook, 
    fetchSubjects, 
    fetchAllSubjects,
    getAvailableCourses,
    getFilteredSubjects,
    subjects,
    courses,
    isCreating, 
    isLoadingSubjects,
    uploadProgress,
    error, 
    clearError,
    resetUploadProgress 
  } = useAdminTextbookStore();
  
  // Initial form state
  const initialFormData: FormData = {
    title: '',
    author: '',
    description: '',
    publisher: '',
    year: new Date().getFullYear().toString(),
    level: '',
    class: '',
    course: '',
    subject: ''
  };
  
  // Form state
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // File states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | undefined>(undefined);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  // Function to reset all form fields and states
  const resetForm = () => {
    setFormData(initialFormData);
    setPdfFile(null);
    setCoverFile(undefined);
    setValidationErrors({});
    clearError();
    resetUploadProgress();
  };
  
  // Generate year options (past 10 years + current + future 5 years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 5; i++) {
      years.push(i.toString());
    }
    return years.reverse();
  };

  // Fetch subjects when level and class change
useEffect(() => {
  if (formData.level) {
    if (formData.level === 'KG' || formData.level === 'Basic' || formData.level === 'JHS') {
      fetchSubjects(formData.level);
    } else if (formData.level === 'SHS' && formData.course) {
      fetchSubjects(formData.level, formData.course);
    }
  }
}, [formData.level, formData.course, fetchSubjects]);

  // Fetch courses when level is SHS
  useEffect(() => {
    if (formData.level === 'SHS') {
      fetchAllSubjects();
    }
  }, [formData.level, fetchAllSubjects]);

  // Reset subject and course when level or class changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      subject: '',
      course: (prev.level === 'KG' || prev.level === 'Basic' || prev.level === 'JHS') ? '' : prev.course
    }));
  }, [formData.level, formData.class]);

  // Clear upload progress on unmount
  useEffect(() => {
    return () => {
      resetUploadProgress();
    };
  }, [resetUploadProgress]);

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // File upload handlers
  const handlePdfUpload = (file: File) => {
    if (file.type !== 'application/pdf') {
      setValidationErrors(prev => ({ ...prev, pdf: 'Please select a PDF file' }));
      return;
    }
    setPdfFile(file);
    setValidationErrors(prev => ({ ...prev, pdf: undefined }));
  };

  const handleCoverUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setValidationErrors(prev => ({ ...prev, cover: 'Please select an image file' }));
      return;
    }
    setCoverFile(file);
    setValidationErrors(prev => ({ ...prev, cover: undefined }));
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.publisher.trim()) errors.publisher = 'Publisher is required';
    if (!formData.year) errors.year = 'Year is required';
    if (!formData.level) errors.level = 'Level is required';
    if (!formData.class) errors.class = 'Class is required';
    if (!formData.subject) errors.subject = 'Subject is required';
    if (formData.level === 'SHS' && !formData.course) errors.course = 'Course is required for SHS';
    if (!pdfFile) errors.pdf = 'PDF file is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle back navigation
  const handleBack = () => {
    router.push('/admin/textbooks');
  };

  // Handle success callback
  const handleSuccess = () => {
    router.push('/admin/textbooks');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      clearError();
      
      // Show loading toast
      const loadingToast = toast.loading('Creating textbook...', {
        duration: Infinity,
      });
      
      // Prepare textbook data
      const textbookData = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        publisher: formData.publisher,
        year: formData.year,
        level: formData.level as string,
        class: formData.class as string,
        course: formData.level === 'SHS' ? formData.course : undefined,
        subject: formData.subject
      };
      
      // Create textbook using store method
      const success = await createTextbook(textbookData, pdfFile!, coverFile);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (success) {
        // Show success toast
        toast.success('🎉 Textbook created successfully!', {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        });
        
        // Reset the form
        resetForm();
        
        // Call onSuccess callback
        handleSuccess();
      } else {
        // Show error toast if creation failed
        toast.error('Failed to create textbook. Please try again.', {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error creating textbook:', error);
      
      // Show error toast
      toast.error('An unexpected error occurred. Please try again.', {
        duration: 4000,
      });
    }
  };

  // Memoize the available courses to prevent unnecessary recalculations
  const availableCourses = useMemo(() => {
    if (formData.level !== 'SHS') return [];
    return getAvailableCourses('SHS');
  }, [formData.level, subjects, getAvailableCourses]);
  
  const availableSubjects = getFilteredSubjects(formData.level, formData.course);
  
  // Debug: Log the available courses
  console.log('Available courses in component:', availableCourses);
  console.log('Form data level:', formData.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
          <Toaster />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Add New Textbook</h1>
              <p className="text-slate-500 mt-1">Create and upload a new textbook to the library</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookMarked className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ModernInput
                label="Title"
                icon={BookOpen}
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter textbook title"
                error={validationErrors.title}
              />

              <ModernInput
                label="Author"
                icon={User}
                required
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Enter author name"
                error={validationErrors.author}
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-slate-600" />
                <label className="text-sm font-semibold text-slate-700">
                  Description <span className="text-red-500">*</span>
                </label>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                  validationErrors.description ? 'border-red-300 bg-red-50/30' : 'hover:border-slate-400'
                }`}
                placeholder="Enter a detailed description of the textbook"
              />
              {validationErrors.description && (
                <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationErrors.description}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <ModernInput
                label="Publisher"
                icon={Building}
                required
                value={formData.publisher}
                onChange={(e) => handleInputChange('publisher', e.target.value)}
                placeholder="Enter publisher name"
                error={validationErrors.publisher}
              />

              <ModernSelect
                label="Publication Year"
                icon={Calendar}
                required
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                error={validationErrors.year}
              >
                <option value="">Select year</option>
                {generateYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </ModernSelect>
            </div>
          </div>

          {/* Academic Classification Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Academic Classification</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ModernSelect
                label="Education Level"
                icon={GraduationCap}
                required
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value as string)}
                error={validationErrors.level}
              >
                <option value="">Select level</option>
  <option value="KG">KG (Kindergarten)</option>
  <option value="Basic">Basic (Primary School)</option>
  <option value="JHS">JHS (Junior High School)</option>
  <option value="SHS">SHS (Senior High School)</option>
              </ModernSelect>

<ModernSelect
  label="Class"
  icon={Target}
  required
  value={formData.class}
  onChange={(e) => handleInputChange('class', e.target.value)}
  error={validationErrors.class}
  disabled={!formData.level}
>
  <option value="">Select class</option>
  {formData.level === 'KG' ? (
    <>
      <option value="1">KG 1</option>
      <option value="2">KG 2</option>
    </>
  ) : formData.level === 'Basic' ? (
    <>
      <option value="1">Basic 1</option>
      <option value="2">Basic 2</option>
      <option value="3">Basic 3</option>
      <option value="4">Basic 4</option>
      <option value="5">Basic 5</option>
      <option value="6">Basic 6</option>
    </>
  ) : (
    <>
      <option value="1">Class 1</option>
      <option value="2">Class 2</option>
      <option value="3">Class 3</option>
    </>
  )}
</ModernSelect>
            </div>

            {formData.level === 'SHS' && (
              <div className="mt-6">
                <ModernSelect
                  label="Course"
                  icon={BookMarked}
                  required
                  value={formData.course}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  error={validationErrors.course}
                  disabled={isLoadingSubjects || availableCourses.length === 0}
                >
                  <option value="">
                    {isLoadingSubjects 
                      ? 'Loading courses...' 
                      : availableCourses.length === 0 
                        ? 'No courses available' 
                        : 'Select course'
                    }
                  </option>
                  {availableCourses.map(course => (
                    <option key={course.name} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </ModernSelect>
                {formData.level === 'SHS' && availableCourses.length === 0 && !isLoadingSubjects && (
                  <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    No courses found for SHS level. Please ensure subjects with courses are available.
                  </p>
                )}
              </div>
            )}

            <div className="mt-6">
              <ModernSelect
                label="Subject"
                icon={BookOpen}
                required
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                error={validationErrors.subject}
                disabled={!formData.level || (formData.level === 'SHS' && !formData.course) || isLoadingSubjects}
              >
                <option value="">
                  {isLoadingSubjects 
                    ? 'Loading subjects...' 
                    : !formData.level 
                      ? 'Select level first'
                      : formData.level === 'SHS' && !formData.course
                        ? 'Select course first'
                        : availableSubjects.length === 0
                          ? 'No subjects available'
                          : 'Select subject'
                  }
                </option>
                {availableSubjects.map(subject => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </ModernSelect>
              {formData.level && formData.level !== 'SHS' && availableSubjects.length === 0 && !isLoadingSubjects && (
                <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  No subjects found for {formData.level} level. Please ensure subjects are available.
                </p>
              )}
              {formData.level === 'SHS' && formData.course && availableSubjects.length === 0 && !isLoadingSubjects && (
                <p className="text-sm text-amber-600 mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  No subjects found for {formData.course} course. Please ensure subjects are available.
                </p>
              )}
            </div>
          </div>

          {/* File Upload Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">File Uploads</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ModernFileUpload
                label="PDF Document"
                accept=".pdf"
                onFileSelect={handlePdfUpload}
                selectedFile={pdfFile}
                onRemove={() => setPdfFile(null)}
                icon={FileText}
                placeholder="Upload PDF file"
                description="Drag and drop your PDF file here, or click to browse"
                error={validationErrors.pdf}
                uploadProgress={uploadProgress?.pdf || 0}
              />

              <ModernFileUpload
                label="Cover Image"
                accept="image/*"
                onFileSelect={handleCoverUpload}
                selectedFile={coverFile || null}
                onRemove={() => setCoverFile(undefined)}
                icon={ImageIcon}
                placeholder="Upload cover image"
                description="Optional: Add a cover image for the textbook"
                error={validationErrors.cover}
                uploadProgress={uploadProgress?.cover || 0}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  <span>Create Textbook</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}