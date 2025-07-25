"use client";
import MathToolbar, { MathButton } from '@/components/MathToolbar';
import { useAdminLessonStore } from '@/stores/adminLessonStore';
import { ArrowLeft, Edit, Eye, FileText, HelpCircle, Image, Move, Save, Trash2, Video, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FormData {
  title: string;
  level: string;
  course: string;
  subject: string;
  sub_strand: string;
  subject_id: string;
  substrand_id: string;
  class: string;
  description: string;
  duration_minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizContent {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ContentSection {
  id: number;
  type: 'text' | 'image' | 'video' | 'quiz';
  content: string;
  explanation?: string;
  quiz?: QuizContent;
}

const ViewEditLesson = () => {
const router = useRouter();
const params = useParams();
const lessonId = params?.lessonId as string;
  
  const {
    subjects,
    subStrands,
    currentLesson,
    isUpdating,
    isLoading,
    error,
    updateLesson,
    fetchLessonById,
    fetchSubjects,
    fetchSubStrands,
    addContentSection,
    updateContentSection,
    deleteContentSection,
    reorderContentSections,
    clearError
  } = useAdminLessonStore();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    level: 'JHS',
    course: '',
    subject: "",
    sub_strand: '',
    subject_id: '',
    substrand_id: '',
    class: '',
    description: '',
    duration_minutes: 45,
    difficulty: 'medium'
  });

  const [activeContentEditor, setActiveContentEditor] = useState<number | null>(null);
  const [showMathToolbar, setShowMathToolbar] = useState(false);
  const [previewMode, setPreviewMode] = useState(true); // Start in preview mode
  const [editMode, setEditMode] = useState(false);

  // Course options for SHS
  const shsCourses = [
    'General Science',
    'General Arts',
    'Business',
    'Visual Arts',
    'Home Economics',
    'Technical',
    'Agricultural Science'
  ];


  const jhsClasses = ['JHS 1', 'JHS 2', 'JHS 3'];
  const shsClasses = ['SHS 1', 'SHS 2', 'SHS 3'];
  const basicClasses = ['Basic 4', 'Basic 5', 'Basic 6'];

  useEffect(() => {
    console.log("My id",lessonId)
    if (lessonId) {
      fetchLessonById(lessonId);
      fetchSubjects();
    }
  }, [lessonId, fetchLessonById, fetchSubjects]);


  useEffect(() => {
    if (currentLesson) {
      setFormData({
        title: currentLesson.title || '',
        level: currentLesson.level || 'JHS',
        course: currentLesson?.course || '',
        subject: currentLesson?.subject || '',
        sub_strand: currentLesson?.substrand || '',
        subject_id: currentLesson.subject_id || '',
        substrand_id: currentLesson.substrand_id || '',
        class: currentLesson.class || '',
        description: currentLesson.description || '',
        duration_minutes: currentLesson.duration_minutes || 45,
        difficulty: currentLesson.difficulty || 'medium'
      });
    }
  }, [currentLesson]);

  useEffect(() => {
    if (formData.subject_id && formData.class) {
      fetchSubStrands(formData.subject_id, formData.class);
    }
  }, [formData.subject_id, formData.class, fetchSubStrands]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    if (field === 'subject_id') {
      // When subject_id changes, also update the subject name and clear substrand
      const selectedSubject = getAvailableSubjects().find(s => s.id === value);
      setFormData(prev => ({ 
        ...prev, 
        [field]: value as string,
        subject: selectedSubject ? selectedSubject.name : '',
        substrand_id: '', // Clear substrand when subject changes
        sub_strand: ''
      }));
    } else if (field === 'substrand_id') {
      // When substrand_id changes, also update the sub_strand name
      const selectedSubStrand = subStrands.find(s => s.id === value);
      setFormData(prev => ({ 
        ...prev, 
        [field]: value as string,
        sub_strand: selectedSubStrand ? selectedSubStrand.sub_strand : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addNewContentSection = (type: 'text' | 'image' | 'video' | 'quiz') => {
    const newContent = {
      type,
      content: type === 'quiz' ? 'New Quiz Question' : `New ${type} content`,
      explanation: '',
      ...(type === 'quiz' && {
        quiz: {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }
      })
    };
    addContentSection(newContent);
  };

  const updateContent = (sectionId: number, field: string, value: string) => {
    updateContentSection(sectionId, { [field]: value });
  };

  const updateQuizContent = (sectionId: number, field: keyof QuizContent, value: string | number | string[]) => {
    const section = currentLesson?.content.find(c => c.id === sectionId);
    if (section && section.quiz) {
      const updatedQuiz = { ...section.quiz, [field]: value };
      updateContentSection(sectionId, { quiz: updatedQuiz });
    }
  };

  const insertMathSymbol = (latex: string, contentId: number) => {
    const textarea = document.getElementById(`content-${contentId}`) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = textarea.value;
      const newContent = currentContent.substring(0, start) + `$${latex}$` + currentContent.substring(end);
      updateContent(contentId, 'content', newContent);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + latex.length + 2, start + latex.length + 2);
      }, 0);
    }
  };

  const handleImageUpload = (contentId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageContent = `![Image](${e.target?.result})`;
        updateContent(contentId, 'content', imageContent);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (contentId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const videoContent = `<video controls src="${e.target?.result}" style="width: 100%; max-width: 600px;"></video>`;
        updateContent(contentId, 'content', videoContent);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentLesson?.content || currentLesson.content.length === 0) {
      alert('Please add at least one content section');
      return;
    }

    const lessonData = {
      ...formData,
      id: lessonId,
      content: currentLesson.content
    };

    const success = await updateLesson(lessonData);
    if (success) {
      alert('Lesson updated successfully!');
      setEditMode(false);
      setPreviewMode(true);
    }
  };

  const renderContentPreview = (content: ContentSection) => {
    if (content.type === 'quiz') {
      return (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Quiz Question</h4>
          <p className="font-medium mb-3">{content.quiz?.question}</p>
          <div className="space-y-2">
            {content.quiz?.options.map((option: string, idx: number) => (
              <div key={idx} className={`p-2 rounded ${idx === content.quiz?.correctAnswer ? 'bg-green-100 border border-green-300' : 'bg-gray-50'}`}>
                {String.fromCharCode(65 + idx)}. {option}
              </div>
            ))}
          </div>
          {content.quiz?.explanation && (
            <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
              <strong>Explanation:</strong> {content.quiz.explanation}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content.content.replace(/\$([^$]+)\$/g, '<span class="math-inline bg-blue-100 px-1 rounded">$1</span>') }} />
        {content.explanation && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
            <strong>Explanation:</strong> {content.explanation}
          </div>
        )}
      </div>
    );
  };

  const getAvailableSubjects = () => {
    if (formData.level === 'JHS') {
      return subjects.filter(s => s.level === 'JHS');
    } else {
      return subjects.filter(s => s.level === 'SHS' && (!formData.course || s.course === formData.course));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Lesson not found</p>
          <button
            onClick={() => router.push('/admin/lessons')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4 mb-4 sm:mb-0">
                <button
                  onClick={() => router.push('/admin/lessons')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editMode ? 'Edit Lesson' : 'View Lesson'}
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    {editMode ? 'Make changes to your lesson content' : 'Review lesson details and content'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 self-end sm:self-center">
                {!editMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                      {previewMode ? 'Raw View' : 'Preview'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(true);
                        setPreviewMode(false);
                      }}
                      className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1 sm:mr-2" />
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                      {previewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel editing? Any unsaved changes will be lost.')) {
                          setEditMode(false);
                          setPreviewMode(true);
                          // Reset form data to original lesson data
                          if (currentLesson) {
                            setFormData({
                              title: currentLesson.title || '',
                              level: currentLesson.level || 'JHS',
                              course: currentLesson.course || '',
                              subject: currentLesson?.subject || '',
                              sub_strand: currentLesson?.substrand || '',
                              subject_id: currentLesson.subject_id || '',
                              substrand_id: currentLesson.substrand_id || '',
                              class: currentLesson.class || '',
                              description: currentLesson.description || '',
                              duration_minutes: currentLesson.duration_minutes || 45,
                              difficulty: currentLesson.difficulty || 'medium'
                            });
                          }
                        }
                      }}
                      className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-600 text-sm">{error}</div>
                <button
                  onClick={clearError}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Lesson Title
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter lesson title..."
                    required
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.title || 'No title'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Level
                </label>
                {editMode ? (
                  <select
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Basic">Upper Primary</option>
                    <option value="JHS">Junior High School (JHS)</option>
                    <option value="SHS">Senior High School (SHS)</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.level === 'JHS' ? 'Junior High School (JHS)' : 'Senior High School (SHS)'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Class
                </label>
                {editMode ? (
                 <select
  value={formData.class}
  onChange={(e) => handleInputChange('class', e.target.value)}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  required
>
  <option value="">Select Class</option>
  {(formData.level === 'JHS'
    ? jhsClasses
    : formData.level === 'SHS'
    ? shsClasses
    : basicClasses
  ).map(cls => (
    <option key={cls} value={cls}>{cls}</option>
  ))}
</select>

                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.class || 'No class selected'}
                  </div>
                )}
              </div>

              {formData.level === 'SHS' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Course
                  </label>
                  {editMode ? (
                    <select
                      value={formData.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Course</option>
                      {shsCourses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      {formData.course || 'No course selected'}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Subject
                </label>
                {editMode ? (
                  <select
                    value={formData.subject_id}
                    onChange={(e) => handleInputChange('subject_id', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={formData.level === 'SHS' && !formData.course}
                  >
                    <option value="">Select Subject</option>
                    {getAvailableSubjects().map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.subject || 'No subject selected'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Sub-strand
                </label>
                {editMode ? (
                  <select
                    value={formData.substrand_id}
                    onChange={(e) => handleInputChange('substrand_id', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={!formData.subject_id}
                  >
                    <option value="">Select Sub-strand</option>
                    {subStrands.map(strand => (
                      <option key={strand.id} value={strand.id}>{strand.sub_strand}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.sub_strand || 'No sub-strand selected'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Duration (minutes)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 45)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="180"
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.duration_minutes} minutes
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Difficulty
                </label>
                {editMode ? (
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      formData.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      formData.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Description
                </label>
                {editMode ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the lesson..."
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {formData.description || 'No description provided'}
                  </div>
                )}
              </div>
            </div>

            {/* Content Management */}
            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Lesson Content</h2>
                {editMode && (
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addNewContentSection('text')}
                      className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-1 sm:mr-2" />
                      <span>Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addNewContentSection('image')}
                      className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Image className="w-4 h-4 mr-1 sm:mr-2" />
                      <span>Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addNewContentSection('video')}
                      className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Video className="w-4 h-4 mr-1 sm:mr-2" />
                      <span>Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addNewContentSection('quiz')}
                      className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 mr-1 sm:mr-2" />
                      <span>Quiz</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Math Toolbar */}
              {showMathToolbar && activeContentEditor && editMode && (
                <MathToolbar
                  activeContentEditor={activeContentEditor}
                  insertMathSymbol={insertMathSymbol}
                  onClose={() => setShowMathToolbar(false)}
                  isVisible={showMathToolbar}
                />
              )}

              {/* Content Sections */}
              <div className="space-y-4 sm:space-y-6">
                {currentLesson?.content?.map((section, index) => (
                  <div key={section.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {editMode && index > 0 && (
                            <button
                              type="button"
                              onClick={() => reorderContentSections(index, index - 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Move className="w-4 h-4" />
                            </button>
                          )}
                          <span className="text-sm font-medium text-gray-500">Section {index + 1}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          section.type === 'text' ? 'bg-blue-100 text-blue-800' :
                          section.type === 'image' ? 'bg-green-100 text-green-800' :
                          section.type === 'video' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {section.type}
                        </span>
                      </div>
                      {editMode && (
                        <div className="flex items-center space-x-2">
                          {section.type === 'text' && (
                            <MathButton
                              onClick={() => {
                                setActiveContentEditor(section.id);
                                setShowMathToolbar(!showMathToolbar);
                              }}
                              active={showMathToolbar && activeContentEditor === section.id}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => deleteContentSection(section.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content Editor/Viewer */}
                    {previewMode ? (
                      renderContentPreview(section)
                    ) : (
                      <div className="space-y-4">
                        {section.type === 'quiz' ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question
                              </label>
                              {editMode ? (
                                <textarea
                                  value={section.quiz?.question || ''}
                                  onChange={(e) => updateQuizContent(section.id, 'question', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={3}
                                  placeholder="Enter quiz question..."
                                />
                              ) : (
                                <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg">
                                  {section.quiz?.question || 'No question set'}
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Options
                              </label>
                              <div className="space-y-2">
                                {section.quiz?.options.map((option, idx) => (
                                  <div key={idx} className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-gray-600 w-6">
                                      {String.fromCharCode(65 + idx)}.
                                    </span>
                                    {editMode ? (
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...(section.quiz?.options || [])];
                                          newOptions[idx] = e.target.value;
                                          updateQuizContent(section.id, 'options', newOptions);
                                        }}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                      />
                                    ) : (
                                      <div className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                                        {option || `Option ${String.fromCharCode(65 + idx)} not set`}
                                      </div>
                                    )}
                                    {editMode && (
                                      <label className="flex items-center">
                                        <input
                                          type="radio"
                                          name={`correct-${section.id}`}
                                          checked={section.quiz?.correctAnswer === idx}
                                          onChange={() => updateQuizContent(section.id, 'correctAnswer', idx)}
                                          className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Correct</span>
                                      </label>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Explanation (Optional)
                              </label>
                              {editMode ? (
                                <textarea
                                  value={section.quiz?.explanation || ''}
                                  onChange={(e) => updateQuizContent(section.id, 'explanation', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={2}
                                  placeholder="Optional explanation for the correct answer..."
                                />
                              ) : (
                                <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg">
                                  {section.quiz?.explanation || 'No explanation provided'}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Content
                            </label>
                            {editMode ? (
                              <div className="space-y-2">
                                <textarea
                                  id={`content-${section.id}`}
                                  value={section.content}
                                  onChange={(e) => updateContent(section.id, 'content', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={6}
                                  placeholder={`Enter ${section.type} content...`}
                                />
                                {section.type === 'image' && (
                                  <div>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(section.id, e)}
                                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                      Upload an image or use markdown syntax: ![Alt text](image-url)
                                    </p>
                                  </div>
                                )}
                                {section.type === 'video' && (
                                  <div>
                                    <input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => handleVideoUpload(section.id, e)}
                                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                      Upload a video or use HTML syntax: &lt;video controls src= &apos;video-url &apos;&gt;&lt;/video&gt;
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg font-mono text-sm">
                                {section.content || 'No content'}
                              </div>
                            )}
                          </div>
                        )}

                        {section.type !== 'quiz' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Explanation (Optional)
                            </label>
                            {editMode ? (
                              <textarea
                                value={section.explanation || ''}
                                onChange={(e) => updateContent(section.id, 'explanation', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={2}
                                placeholder="Optional explanation or notes for this section..."
                              />
                            ) : (
                              <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg">
                                {section.explanation || 'No explanation provided'}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {(!currentLesson?.content || currentLesson.content.length === 0) && (
                  <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No content sections yet</h3>
                    <p className="text-gray-600 mb-4">
                      {editMode ? 'Add your first content section to start building your lesson.' : 'This lesson has no content sections.'}
                    </p>
                    {editMode && (
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => addNewContentSection('text')}
                          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Add Text Section
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {editMode && (
              <div className="border-t border-gray-200 pt-6 mt-8">
                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel editing? Any unsaved changes will be lost.')) {
                        setEditMode(false);
                        setPreviewMode(true);
                      }
                    }}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewEditLesson;
