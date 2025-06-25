"use client";
import MathToolbar from '@/components/MathToolbar';
import { useAdminQuizStore } from '@/stores/adminQuizStore';
import { ArrowLeft, Edit, Eye, HelpCircle, Lock, Save, Trash2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface FormData {
  title: string;
  level: 'JHS' | 'SHS';
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

export interface QuizQuestion {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
}

const ViewEditQuiz = () => {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.quizId as string;

  const {
    subjects,
    subStrands,
    currentQuiz,
    isUpdating,
    isLoading,
    error,
    fetchQuizById,
    updateQuiz,
    fetchSubjects,
    fetchSubStrands,
    setCurrentQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    clearError
  } = useAdminQuizStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [originalQuiz, setOriginalQuiz] = useState<any>(null);
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
    duration_minutes: 30,
    difficulty: 'medium'
  });

  const [activeQuestionEditor, setActiveQuestionEditor] = useState<number | null>(null);
  const [showMathToolbar, setShowMathToolbar] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentFocusedField, setCurrentFocusedField] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number } | null>(null);

  // Store refs for all textareas to track focus and cursor position
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement }>({});

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

  // Class options
  const jhsClasses = ['JHS 1', 'JHS 2', 'JHS 3'];
  const shsClasses = ['SHS 1', 'SHS 2', 'SHS 3'];

  useEffect(() => {
    console.log("recieved id", quizId)
    if (quizId) {
      fetchQuizById(quizId);
      fetchSubjects();
    }
  }, [quizId, fetchQuizById, fetchSubjects]);

  useEffect(() => {
    if (currentQuiz && !originalQuiz) {
      // Store original quiz data for cancel functionality
      setOriginalQuiz(JSON.parse(JSON.stringify(currentQuiz)));
      
      // Set form data from current quiz
      setFormData({
        title: currentQuiz.title || '',
        level: currentQuiz.level || 'JHS',
        course: currentQuiz.course || '',
        subject: currentQuiz.subject || '',
        sub_strand: currentQuiz.substrand || '',
        subject_id: currentQuiz.subject_id || '',
        substrand_id: currentQuiz.substrand_id || '',
        class: currentQuiz.class || '',
        description: currentQuiz.description || '',
        duration_minutes: currentQuiz.duration_minutes || 30,
        difficulty: currentQuiz.difficulty || 'medium'
      });
    }
  }, [currentQuiz, originalQuiz]);

  useEffect(() => {
    if (formData.level === 'JHS') {
      fetchSubjects('JHS');
    }
  }, [formData.level, formData.class, fetchSubjects]);

  useEffect(() => {
    if (formData.course && formData.level === 'SHS') {
      fetchSubjects('SHS');
    }
  }, [formData.course, formData.level, fetchSubjects]);

  useEffect(() => {
    if (formData.subject_id && formData.class) {
      fetchSubStrands(formData.subject_id, formData.class);
    }
  }, [formData.subject_id, formData.class, fetchSubStrands]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    if (field === 'subject_id') {
      const selectedSubject = getAvailableSubjects().find(s => s.id === value);
      setFormData(prev => ({ 
        ...prev, 
        [field]: value as string,
        subject: selectedSubject ? selectedSubject.name : '',
        substrand_id: '',
        sub_strand: ''
      }));
    } else if (field === 'substrand_id') {
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

  const addNewQuestion = (type: 'multiple_choice' | 'true_false' | 'short_answer') => {
    const newQuestion: Omit<QuizQuestion, 'id'> = {
      type,
      question: '',
      correct_answer: '',
      explanation: '',
      ...(type === 'multiple_choice' && {
        options: ['', '', '', '']
      }),
      ...(type === 'true_false' && {
        options: ['True', 'False']
      })
    };
    addQuestion(newQuestion);
  };

  const updateQuestionField = (questionId: number, field: keyof QuizQuestion, value: string | string[]) => {
    updateQuestion(questionId, { [field]: value });
  };

  // Handle textarea focus and track cursor position
  const handleTextareaFocus = (fieldId: string, questionId: number) => {
    setCurrentFocusedField(fieldId);
    setActiveQuestionEditor(questionId);
    
    // Store cursor position when field gains focus
    const textarea = textareaRefs.current[fieldId];
    if (textarea) {
      setCursorPosition({
        start: textarea.selectionStart,
        end: textarea.selectionEnd
      });
    }
  };

  // Handle cursor position changes
  const handleTextareaSelectionChange = (fieldId: string) => {
    const textarea = textareaRefs.current[fieldId];
    if (textarea && fieldId === currentFocusedField) {
      setCursorPosition({
        start: textarea.selectionStart,
        end: textarea.selectionEnd
      });
    }
  };

  // Store textarea ref
  const setTextareaRef = (fieldId: string, element: HTMLTextAreaElement | null) => {
    if (element) {
      textareaRefs.current[fieldId] = element;
    } else {
      delete textareaRefs.current[fieldId];
    }
  };

  const insertMathSymbol = (latex: string) => {
    if (!currentFocusedField || !activeQuestionEditor || !cursorPosition) {
      alert('Please click in a text field first');
      return;
    }

    const textarea = textareaRefs.current[currentFocusedField];
    if (!textarea) return;

    const start = cursorPosition.start;
    const end = cursorPosition.end;
    const currentContent = textarea.value;
    const newContent = currentContent.substring(0, start) + `$${latex}$` + currentContent.substring(end);
    
    // Parse field ID to determine what to update
    const [fieldType, questionIdStr, optionIndexStr] = currentFocusedField.split('-');
    const questionId = parseInt(questionIdStr);

    if (fieldType === 'question') {
      updateQuestionField(questionId, 'question', newContent);
    } else if (fieldType === 'option') {
      const optionIndex = parseInt(optionIndexStr);
      const question = currentQuiz?.questions.find(q => q.id === questionId);
      if (question && question.options) {
        const newOptions = [...question.options];
        newOptions[optionIndex] = newContent;
        updateQuestionField(questionId, 'options', newOptions);
      }
    } else if (fieldType === 'answer') {
      updateQuestionField(questionId, 'correct_answer', newContent);
    } else if (fieldType === 'explanation') {
      updateQuestionField(questionId, 'explanation', newContent);
    }
    
    // Update cursor position and focus
    setTimeout(() => {
      const newCursorPos = start + latex.length + 2;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      setCursorPosition({ start: newCursorPos, end: newCursorPos });
    }, 0);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    if (originalQuiz) {
      setCurrentQuiz(originalQuiz);
      setFormData({
        title: originalQuiz.title || '',
        level: originalQuiz.level || 'JHS',
        course: originalQuiz.course || '',
        subject: originalQuiz.subject || '',
        sub_strand: originalQuiz.substrand || '',
        subject_id: originalQuiz.subject_id || '',
        substrand_id: originalQuiz.substrand_id || '',
        class: originalQuiz.class || '',
        description: originalQuiz.description || '',
        duration_minutes: originalQuiz.duration_minutes || 30,
        difficulty: originalQuiz.difficulty || 'medium'
      });
    }
    setIsEditMode(false);
    setPreviewMode(false);
    setShowMathToolbar(false);
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (!currentQuiz?.questions || currentQuiz.questions.length === 0) {
    alert('Please add at least one question');
    return;
  }

  if (!currentQuiz.id) {
    alert('Quiz ID is missing');
    return;
  }

  // Validate questions
  for (const question of currentQuiz.questions) {
    if (!question.question.trim()) {
      alert('All questions must have content');
      return;
    }
    if (!question.correct_answer.trim()) {
      alert('All questions must have a correct answer');
      return;
    }
    if (question.type === 'multiple_choice' && (!question.options || question.options.some(opt => !opt.trim()))) {
      alert('All multiple choice questions must have all options filled');
      return;
    }
  }

  const quizData = {
    id: currentQuiz.id, // Now TypeScript knows this is definitely a string
    ...formData,
    questions: currentQuiz.questions
  };

  const success = await updateQuiz(quizData);
  if (success) {
    alert('Quiz updated successfully!');
    setIsEditMode(false);
    setOriginalQuiz(JSON.parse(JSON.stringify(currentQuiz)));
  }
};

  const renderQuestionPreview = (question: QuizQuestion) => {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">
          {question.type === 'multiple_choice' ? 'Multiple Choice' : 
           question.type === 'true_false' ? 'True/False' : 'Short Answer'}
        </h4>
        <p className="font-medium mb-3" dangerouslySetInnerHTML={{ 
          __html: question.question.replace(/\$([^$]+)\$/g, '<span class="math-inline bg-blue-100 px-1 rounded">$1</span>') 
        }} />
        
        {question.type === 'multiple_choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option: string, idx: number) => (
              <div key={idx} className={`p-2 rounded ${option === question.correct_answer ? 'bg-green-100 border border-green-300' : 'bg-gray-50'}`}>
                {String.fromCharCode(65 + idx)}. <span dangerouslySetInnerHTML={{ 
                  __html: option.replace(/\$([^$]+)\$/g, '<span class="math-inline bg-blue-100 px-1 rounded">$1</span>') 
                }} />
              </div>
            ))}
          </div>
        )}

        {question.type === 'true_false' && (
          <div className="space-y-2">
            <div className={`p-2 rounded ${'True' === question.correct_answer ? 'bg-green-100 border border-green-300' : 'bg-gray-50'}`}>
              True
            </div>
            <div className={`p-2 rounded ${'False' === question.correct_answer ? 'bg-green-100 border border-green-300' : 'bg-gray-50'}`}>
              False
            </div>
          </div>
        )}

        {question.type === 'short_answer' && (
          <div className="bg-green-100 border border-green-300 p-2 rounded">
            <strong>Answer:</strong> <span dangerouslySetInnerHTML={{ 
              __html: question.correct_answer.replace(/\$([^$]+)\$/g, '<span class="math-inline bg-blue-100 px-1 rounded">$1</span>') 
            }} />
          </div>
        )}

        {question.explanation && (
          <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
            <strong>Explanation:</strong> <span dangerouslySetInnerHTML={{ 
              __html: question.explanation.replace(/\$([^$]+)\$/g, '<span class="math-inline bg-blue-100 px-1 rounded">$1</span>') 
            }} />
          </div>
        )}
      </div>
    );
  };

  const renderViewOnlyField = (label: string, value: string | number, className = "") => {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800">
          {value || 'Not specified'}
        </div>
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
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz not found</h2>
          <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => router.back()}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Quiz' : 'View Quiz'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {isEditMode 
                      ? 'Make changes to your quiz and save when ready'
                      : 'Review quiz details and questions'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {previewMode ? 'Edit Mode' : 'Preview Mode'}
                  </button>
                )}
                {!isEditMode ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
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

          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {!isEditMode ? (
                <>
                  {renderViewOnlyField('Quiz Title', formData.title, 'lg:col-span-2')}
                  {renderViewOnlyField('Level', formData.level === 'JHS' ? 'Junior High School (JHS)' : 'Senior High School (SHS)')}
                  {renderViewOnlyField('Class', formData.class)}
                  {formData.level === 'SHS' && renderViewOnlyField('Course', formData.course)}
                  {renderViewOnlyField('Subject', formData.subject)}
                  {renderViewOnlyField('Sub-strand', formData.sub_strand)}
                  {renderViewOnlyField('Duration (minutes)', formData.duration_minutes)}
                  {renderViewOnlyField('Difficulty', formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1))}
                  {renderViewOnlyField('Description', formData.description, 'lg:col-span-2')}
                </>
              ) : (
                <>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter quiz title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="JHS">Junior High School (JHS)</option>
                      <option value="SHS">Senior High School (SHS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <select
                      value={formData.class}
                      onChange={(e) => handleInputChange('class', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Class</option>
                      {(formData.level === 'JHS' ? jhsClasses : shsClasses).map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  {formData.level === 'SHS' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 30)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="180"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Brief description of the quiz..."
                    />
                  </div>
                </>
              )}
            </div>

            {/* Quiz Questions */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  Quiz Questions
                  {!isEditMode && <Lock className="w-5 h-5 ml-2 text-gray-400" />}
                </h2>
                {isEditMode && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => addNewQuestion('multiple_choice')}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Multiple Choice
                    </button>
                    <button
                      type="button"
                      onClick={() => addNewQuestion('true_false')}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      True/False
                    </button>
                    <button
                      type="button"
                      onClick={() => addNewQuestion('short_answer')}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Short Answer
                    </button>
                  </div>
                )}
              </div>

              {/* Math Toolbar */}
              {showMathToolbar && activeQuestionEditor && isEditMode && (
                <MathToolbar
                  activeContentEditor={activeQuestionEditor}
                  insertMathSymbol={insertMathSymbol}
                  onClose={() => setShowMathToolbar(false)}
                  isVisible={showMathToolbar}
                />
              )}

              {/* Questions */}
              <div className="space-y-6">
                {currentQuiz?.questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            {question.type === 'multiple_choice' ? 'Multiple Choice' : 
                             question.type === 'true_false' ? 'True/False' : 'Short Answer'}
                          </span>
                        </div>
                      </div>
                      {isEditMode && (
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowMathToolbar(!showMathToolbar)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Math Tools"
                          >
                            <span className="text-sm">∑</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteQuestion(question.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {previewMode && isEditMode ? (
                      renderQuestionPreview(question)
                    ) : (
                      <div className="space-y-4">
                        {/* Question Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question
                          </label>
                          {!isEditMode ? (
                            <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 min-h-[60px]">
                              <span dangerouslySetInnerHTML={{ 
                                __html: question.question.replace(/\$([^$]+)\$/g, '<span class="math-inline bg-blue-100 px-1 rounded">$1</span>') 
                              }} />
                            </div>
                          ) : (
                            <textarea
                              ref={(el) => setTextareaRef(`question-${question.id}`, el)}
                              value={question.question}
                              onChange={(e) => updateQuestionField(question.id, 'question', e.target.value)}
                              onFocus={() => handleTextareaFocus(`question-${question.id}`, question.id)}
                              onSelect={() => handleTextareaSelectionChange(`question-${question.id}`)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                              rows={3}
                              placeholder="Enter your question here..."
                              required
                            />
                          )}
                        </div>

                        {/* Options for Multiple Choice */}
                        {question.type === 'multiple_choice' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Options
                            </label>
                            <div className="space-y-2">
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </div>
                                  {!isEditMode ? (
                                    <div className={`flex-1 px-4 py-2 border rounded-lg ${
                                      option === question.correct_answer 
                                        ? 'bg-green-50 border-green-300 text-green-800' 
                                        : 'bg-white border-gray-300 text-gray-800'
                                    }`}>
                                      <span dangerouslySetInnerHTML={{ 
                                        __html: option.replace(/\$([^$]+)\$/g, '<span class="math-inline bg-blue-100 px-1 rounded">$1</span>') 
                                      }} />
                                    </div>
                                  ) : (
                                    <textarea
                                      ref={(el) => setTextareaRef(`option-${question.id}-${optionIndex}`, el)}
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...(question.options || [])];
                                        newOptions[optionIndex] = e.target.value;
                                        updateQuestionField(question.id, 'options', newOptions);
                                      }}
                                      onFocus={() => handleTextareaFocus(`option-${question.id}-${optionIndex}`, question.id)}
                                      onSelect={() => handleTextareaSelectionChange(`option-${question.id}-${optionIndex}`)}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                      rows={2}
                                      placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                      required
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Correct Answer */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correct Answer
                          </label>
                          {!isEditMode ? (
                            <div className="w-full px-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-800">
                              <span dangerouslySetInnerHTML={{ 
                                __html: question.correct_answer.replace(/\$([^$]+)\$/g, '<span class="math-inline bg-blue-100 px-1 rounded">$1</span>') 
                              }} />
                            </div>
                          ) : question.type === 'multiple_choice' ? (
                            <select
                              value={question.correct_answer}
                              onChange={(e) => updateQuestionField(question.id, 'correct_answer', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            >
                              <option value="">Select correct answer</option>
                              {question.options?.map((option, optionIndex) => (
                                <option key={optionIndex} value={option}>
                                  {String.fromCharCode(65 + optionIndex)}. {option.substring(0, 50)}{option.length > 50 ? '...' : ''}
                                </option>
                              ))}
                            </select>
                          ) : question.type === 'true_false' ? (
                            <select
                              value={question.correct_answer}
                              onChange={(e) => updateQuestionField(question.id, 'correct_answer', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            >
                              <option value="">Select correct answer</option>
                              <option value="True">True</option>
                              <option value="False">False</option>
                            </select>
                          ) : (
                            <textarea
                              ref={(el) => setTextareaRef(`answer-${question.id}`, el)}
                              value={question.correct_answer}
                              onChange={(e) => updateQuestionField(question.id, 'correct_answer', e.target.value)}
                              onFocus={() => handleTextareaFocus(`answer-${question.id}`, question.id)}
                              onSelect={() => handleTextareaSelectionChange(`answer-${question.id}`)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                              rows={2}
                              placeholder="Enter the correct answer..."
                              required
                            />
                          )}
                        </div>

                        {/* Explanation */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Explanation (Optional)
                          </label>
                          {!isEditMode ? (
                            <div className="w-full px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 min-h-[60px]">
                              {question.explanation ? (
                                <span dangerouslySetInnerHTML={{ 
                                  __html: question.explanation.replace(/\$([^$]+)\$/g, '<span class="math-inline bg-blue-100 px-1 rounded">$1</span>') 
                                }} />
                              ) : (
                                <span className="text-gray-500 italic">No explanation provided</span>
                              )}
                            </div>
                          ) : (
                            <textarea
                              ref={(el) => setTextareaRef(`explanation-${question.id}`, el)}
                              value={question.explanation || ''}
                              onChange={(e) => updateQuestionField(question.id, 'explanation', e.target.value)}
                              onFocus={() => handleTextareaFocus(`explanation-${question.id}`, question.id)}
                              onSelect={() => handleTextareaSelectionChange(`explanation-${question.id}`)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                              rows={3}
                              placeholder="Explain why this is the correct answer..."
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* No Questions Message */}
                {(!currentQuiz?.questions || currentQuiz.questions.length === 0) && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                    <p className="text-gray-600 mb-4">
                      {isEditMode 
                        ? "Add your first question to get started with this quiz."
                        : "This quiz doesn't have any questions yet."
                      }
                    </p>
                    {isEditMode && (
                      <div className="flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => addNewQuestion('multiple_choice')}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Multiple Choice
                        </button>
                        <button
                          type="button"
                          onClick={() => addNewQuestion('true_false')}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Add True/False
                        </button>
                        <button
                          type="button"
                          onClick={() => addNewQuestion('short_answer')}
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Add Short Answer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            {isEditMode && (
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewEditQuiz;