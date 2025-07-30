"use client";
import MathToolbar, { MathButton } from '@/components/MathToolbar';
import TextEditor from '@/components/TextEditor';
import { useAdminLessonStore } from '@/stores/adminLessonStore';
import { Eye, FileText, HelpCircle, Image, Move, Save, Trash2, Video, X } from 'lucide-react';
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

const AddNewLesson = () => {
  const {
    subjects,
    subStrands,
    currentLesson,
    isCreating,
    isLoading,
    error,
    createLesson,
    fetchSubjects,
    fetchSubStrands,
    setCurrentLesson,
    addContentSection,
    updateContentSection,
    deleteContentSection,
    reorderContentSections,
    clearError,
    addContentSectionAtIndex
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
  const [previewMode, setPreviewMode] = useState(false);
const [activeTextEditor, setActiveTextEditor] = useState<number | string | null>(null);
  
  // Course options for SHS
  const shsCourses = [
    'General Science',
    'Core Subject',
    'General Arts',
    'Business',
    'Visual Arts',
    'Home Economics',
    'Technical',
    'Agricultural Science'
  ];
console.log(subjects)
  // Class options
  const jhsClasses = ['JHS 1', 'JHS 2', 'JHS 3'];
  const shsClasses = ['SHS 1', 'SHS 2', 'SHS 3'];
  const basicClasses = ['Basic 4', 'Basic 5', 'Basic 6'];

// Initial setup
useEffect(() => {
  // Fetch initial subjects based on default level
  fetchSubjects(formData.level);
  // Initialize empty lesson
  setCurrentLesson({
    title: '',
    subject_id: '',
    substrand_id: '',
    substrand:'',
    subject:'',
    course:'',
    level: 'Basic',
    class: '',
    content: [],
    description: '',
    duration_minutes: 45,
    difficulty: 'medium'
  });
}, [fetchSubjects, setCurrentLesson]); // Remove formData.level from dependency

// Handle level changes
useEffect(() => {
  console.log('Level changed to:', formData.level);
  
  // Fetch subjects for the new level
  if (formData.level === 'JHS' || formData.level === 'Basic') {
    fetchSubjects(formData.level);
    // Clear course, subject, and sub_strand when switching to JHS/Basic
    setFormData(prev => ({ 
      ...prev, 
      course: '', 
      subject: '', 
      sub_strand: '',
      subject_id: '',
      substrand_id: ''
    }));
  } else if (formData.level === 'SHS') {
    // For SHS, we need to wait for course selection
    setFormData(prev => ({ 
      ...prev, 
      subject: '', 
      sub_strand: '',
      subject_id: '',
      substrand_id: ''
    }));
  }
}, [formData.level, fetchSubjects]);

// Handle SHS course changes
useEffect(() => {
  if (formData.level === 'SHS' && formData.course) {
    console.log('Fetching SHS subjects for course:', formData.course);
    
    // Check if your fetchSubjects function accepts a course parameter
    // If it does, use this:
    // fetchSubjects('SHS', formData.course);
    
    // If it doesn't, you might need to call it like this:
    fetchSubjects('SHS');
    
    // Clear dependent fields
    setFormData(prev => ({ 
      ...prev, 
      subject: '', 
      sub_strand: '',
      subject_id: '',
      substrand_id: ''
    }));
  }
}, [formData.course, formData.level, fetchSubjects]);

// Handle subject changes for fetching substrands
useEffect(() => {
  if (formData.subject_id && formData.class) {
    console.log('Fetching substrands for subject:', formData.subject_id, 'class:', formData.class);
    fetchSubStrands(formData.subject_id, formData.class);
  }
}, [formData.subject_id, formData.class, fetchSubStrands]);

const handleInputChange = (field: keyof FormData, value: string | number) => {
  console.log(`Changing ${field} to:`, value);
  
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

const addNewContentSection = (type: 'text' | 'image' | 'video' | 'quiz', index?: number) => {
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
  if (index !== undefined) {
    addContentSectionAtIndex(newContent, index);
  } else {
    addContentSection(newContent);
  }
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
    content: currentLesson.content
  };

  const success = await createLesson(lessonData);
  if (success) {
    alert('Lesson created successfully!');
    // Reset form
    setFormData({
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
    setCurrentLesson({
      title: '',
      subject_id: '',
      substrand_id: '',
      substrand: '',
      subject: '',
      course: '',
      level: 'JHS' as const,
      class: '',
      content: [],
      description: '',
      duration_minutes: 45,
      difficulty: 'medium'
    });
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
  console.log('Getting available subjects for level:', formData.level, 'course:', formData.course);
  console.log('All subjects:', subjects);
  
  if (formData.level === 'Basic') {
    const filtered = subjects.filter(s => s.level === 'Basic');
    console.log('Filtered Basic subjects:', filtered);
    return filtered;
  } else if (formData.level === 'JHS') {
    const filtered = subjects.filter(s => s.level === 'JHS');
    console.log('Filtered JHS subjects:', filtered);
    return filtered;
  } else if (formData.level === 'SHS') {
    // Make sure the filtering logic matches your data structure
    const filtered = subjects.filter(s => {
      console.log('Checking subject:', s, 'against level:', s.level, 'course:', s.course);
      return s.level === 'SHS' && (!formData.course || s.course === formData.course);
    });
    console.log('Filtered SHS subjects for course', formData.course, ':', filtered);
    return filtered;
  }
  
  return [];
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Lesson</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Build comprehensive lessons with rich content, equations, and interactive quizzes</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit Mode' : 'Preview Mode'}
                </button>
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
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter lesson title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Level
                </label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Class
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => handleInputChange('class', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Class</option>
                   {(formData.level === 'Basic'
    ? basicClasses
    : formData.level === 'JHS'
    ? jhsClasses
    : shsClasses
  ).map(cls => (
    <option key={cls} value={cls}>{cls}</option>
  ))}
                </select>
              </div>

              {formData.level === 'SHS' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Course
                  </label>
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
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Subject
                </label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Sub-strand
                </label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 45)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="180"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of the lesson..."
                />
              </div>
            </div>

            {/* Content Management */}
            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Lesson Content</h2>
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
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Add Quiz
                  </button>
                </div>
              </div>

              {/* Math Toolbar */}
              {showMathToolbar && activeContentEditor && (
                <MathToolbar
                  activeContentEditor={activeContentEditor}
                  insertMathSymbol={insertMathSymbol}
                  onClose={() => setShowMathToolbar(false)}
                  isVisible={showMathToolbar}
                />
              )}

              {/* Content Sections */}
              <div className="space-y-4 sm:space-y-6">
                {currentLesson?.content.map((section, index) => (
                  <div key={section.id}>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => reorderContentSections(index, index - 1)}
                              className={`p-1 text-gray-400 hover:text-gray-600 ${index === 0 ? 'invisible' : ''}`}
                            >
                              <Move className="w-4 h-4 transform rotate-180" />
                            </button>
                            <button
                              type="button"
                              onClick={() => reorderContentSections(index, index + 1)}
                              className={`p-1 text-gray-400 hover:text-gray-600 ${index === currentLesson.content.length - 1 ? 'invisible' : ''}`}
                            >
                              <Move className="w-4 h-4" />
                            </button>
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
                      <div className="flex items-center space-x-2">
                        {section.type === 'text' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setActiveTextEditor(activeTextEditor === section.id ? null : section.id)}
                              className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Toggle Text Editor"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <MathButton
                              onClick={() => {
                                setActiveContentEditor(section.id);
                                setShowMathToolbar(!showMathToolbar);
                              }}
                              active={showMathToolbar && activeContentEditor === section.id}
                            />
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteContentSection(section.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {previewMode ? (
                      renderContentPreview(section)
                    ) : (
                      <>
                        {section.type === 'text' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content (Supports Markdown & LaTeX)
                              </label>
                              
                              {/* Toggle button for text editor */}
                              <div className="mb-2">
                                <button
                                  type="button"
                                  onClick={() => setActiveTextEditor(activeTextEditor === section.id ? null : section.id)}
                                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {activeTextEditor === section.id ? 'Hide' : 'Show'} Text Editor
                                </button>
                              </div>

                              {/* Text Editor Component */}
                              <TextEditor
                                value={section.content}
                                onChange={(value) => updateContent(section.id, 'content', value)}
                                placeholder="Enter your content here... Use $LaTeX$ for math equations"
                                contentId={section.id.toString()}
                                isVisible={activeTextEditor === section.id}
                                onClose={() => setActiveTextEditor(null)}
                                rows={8}
                              />

                              {/* Fallback textarea when editor is hidden */}
                              {activeTextEditor !== section.id && (
                                <textarea
                                  id={`content-${section.id}`}
                                  value={section.content}
                                  onChange={(e) => updateContent(section.id, 'content', e.target.value)}
                                  onFocus={() => setActiveContentEditor(section.id)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                  rows={8}
                                  placeholder="Enter your content here... Use $LaTeX$ for math equations"
                                />
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Explanation (Optional)
                              </label>
                              
                              {/* Optional: Add text editor for explanation too */}
                              <div className="mb-2">
                                <button
                                  type="button"
                                  onClick={() => setActiveTextEditor(activeTextEditor === `${section.id}-explanation` ? null : `${section.id}-explanation`)}
                                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {activeTextEditor === `${section.id}-explanation` ? 'Hide' : 'Show'} Text Editor
                                </button>
                              </div>

                              <TextEditor
                                value={section.explanation || ''}
                                onChange={(value) => updateContent(section.id, 'explanation', value)}
                                placeholder="Additional explanation for this section..."
                                contentId={`${section.id}-explanation`}
                                isVisible={activeTextEditor === `${section.id}-explanation`}
                                onClose={() => setActiveTextEditor(null)}
                                rows={3}
                              />

                              {activeTextEditor !== `${section.id}-explanation` && (
                                <textarea
                                  value={section.explanation || ''}
                                  onChange={(e) => updateContent(section.id, 'explanation', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={3}
                                  placeholder="Additional explanation for this section..."
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {section.type === 'image' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content (Supports Markdown & Images)
                              </label>
                              <TextEditor
                                value={section.content}
                                onChange={(value) => updateContent(section.id, 'content', value)}
                                placeholder="Enter your content here... Use the toolbar to add images."
                                contentId={section.id.toString()}
                                isVisible={true}
                                onClose={() => {}}
                                rows={8}
                              />
                            </div>
                          </div>
                        )}

                        {section.type === 'video' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Video or Enter URL
                              </label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleVideoUpload(section.id, e)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                              />
                              <input
                                type="url"
                                value={section.content}
                                onChange={(e) => updateContent(section.id, 'content', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Or enter video URL (YouTube, Vimeo, etc.)"
                              />
                            </div>
                            </div>
                        )}

                        {section.type === 'quiz' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quiz Question
                              </label>
                              <textarea
                                value={section.quiz?.question || ''}
                                onChange={(e) => updateQuizContent(section.id, 'question', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="Enter quiz question..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Answer Options
                              </label>
                              <div className="space-y-2">
                                {section.quiz?.options.map((option, idx) => (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name={`correct-${section.id}`}
                                      checked={section.quiz?.correctAnswer === idx}
                                      onChange={() => updateQuizContent(section.id, 'correctAnswer', idx)}
                                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-medium text-gray-700 w-8">
                                      {String.fromCharCode(65 + idx)}.
                                    </label>
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
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Explanation (Optional)
                              </label>
                              <textarea
                                value={section.quiz?.explanation || ''}
                                onChange={(e) => updateQuizContent(section.id, 'explanation', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="Explain why this is the correct answer..."
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => addNewContentSection('text', index + 1)}
                        className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-1 sm:mr-2" />
                        <span>Text</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addNewContentSection('image', index + 1)}
                        className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Image className="w-4 h-4 mr-1 sm:mr-2" />
                        <span>Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addNewContentSection('video', index + 1)}
                        className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Video className="w-4 h-4 mr-1 sm:mr-2" />
                        <span>Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addNewContentSection('quiz', index + 1)}
                        className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Add Quiz
                      </button>
                    </div>
                  </div>
                ))}

                {currentLesson?.content.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No content sections yet</p>
                    <p className="text-gray-400 text-sm">Add text, images, videos, or quiz sections to build your lesson</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {currentLesson?.content.length || 0} content section(s) added
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      // Reset form
                      setFormData({
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
                      setCurrentLesson({
                        title: '',
                        subject_id: '',
                        substrand_id: '',
                        substrand: '',
                        subject: '',
                        course: '',
                        level: 'JHS' as const,
                        class: '',
                        content: [],
                        description: '',
                        duration_minutes: 45,
                        difficulty: 'medium'
                      });
                    }}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isLoading}
                    className="flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Lesson
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewLesson;
