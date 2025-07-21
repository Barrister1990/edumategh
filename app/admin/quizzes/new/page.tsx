"use client";
import MathToolbar, { MathButton } from '@/components/MathToolbar';
import TextEditor from '@/components/TextEditor';
import { useAdminQuizStore } from '@/stores/adminQuizStore';
import { Eye, HelpCircle, Move, Save, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FormData {
  title: string;
  level: string;
  course: string;
  subject: string;
  sub_strand: string;
  subject_id: string;
  substrand_id: string;
  class: string;
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

const AddNewQuiz = () => {
  const {
    subjects,
    subStrands,
    currentQuiz,
    isCreating,
    isLoading,
    error,
    createQuiz,
    fetchSubjects,
    fetchSubStrands,
    setCurrentQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    clearError
  } = useAdminQuizStore();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    level: 'JHS',
    course: '',
    subject: "",
    sub_strand: '',
    subject_id: '',
    substrand_id: '',
    class: '',
    duration_minutes: 30,
    difficulty: 'medium'
  });

  const [activeQuestionEditor, setActiveQuestionEditor] = useState<number | null>(null);
  const [showMathToolbar, setShowMathToolbar] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentFocusedField, setCurrentFocusedField] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number } | null>(null);
  const [activeTextEditor, setActiveTextEditor] = useState<string | null>(null);

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
  const basicClasses = ['Basic 4', 'Basic 5', 'Basic 6'];

  useEffect(() => {
    fetchSubjects();
    // Initialize empty quiz
    setCurrentQuiz({
      title: '',
      subject_id: '',
      substrand_id: '',
      substrand: '',
      subject: '',
      course: '',
      level: 'JHS',
      class: '',
      questions: [],
      duration_minutes: 30,
      difficulty: 'medium'
    });
  }, [fetchSubjects, setCurrentQuiz]);

  useEffect(() => {
    if (formData.level === 'JHS') {
      fetchSubjects('JHS');
      setFormData(prev => ({ ...prev, course: '', subject: '', sub_strand: '' }));
    }
  }, [formData.level, formData.class, fetchSubjects]);
    useEffect(() => {
    if (formData.level === 'Basic') {
      fetchSubjects('Basic');
      setFormData(prev => ({ ...prev, course: '', subject: '', sub_strand: '' }));
    }
  }, [formData.level, formData.class, fetchSubjects]);

  useEffect(() => {
    if (formData.course && formData.level === 'SHS') {
      fetchSubjects('SHS');
      setFormData(prev => ({ ...prev, subject: '', sub_strand: '' }));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentQuiz?.questions || currentQuiz.questions.length === 0) {
      alert('Please add at least one question');
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
      ...formData,
      questions: currentQuiz.questions
    };

    const success = await createQuiz(quizData);
    if (success) {
      alert('Quiz created successfully!');
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
        duration_minutes: 30,
        difficulty: 'medium'
      });
      setCurrentQuiz({
        title: '',
        subject_id: '',
        substrand_id: '',
        substrand: '',
        subject: '',
        course: '',
        level: 'JHS' as const,
        class: '',
        questions: [],
        duration_minutes: 30,
        difficulty: 'medium'
      });
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

  const getAvailableSubjects = () => {
    if (formData.level === 'JHS') {
      return subjects.filter(s => s.level === 'JHS');
    } else {
      return subjects.filter(s => s.level === 'SHS' && (!formData.course || s.course === formData.course));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Quiz</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Build interactive quizzes with multiple choice, true/false, and short answer questions</p>
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
                  onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 30)}
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

            </div>

            {/* Quiz Questions Management */}
            <div className="border-t border-gray-200 pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Quiz Questions</h2>
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addNewQuestion('multiple_choice')}
                    className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 mr-1 sm:mr-2" />
                    <span>MCQ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addNewQuestion('true_false')}
                    className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 mr-1 sm:mr-2" />
                    <span>T/F</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addNewQuestion('short_answer')}
                    className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Short Answer
                  </button>
                </div>
              </div>

              {/* Math Toolbar */}
              {showMathToolbar && activeQuestionEditor && (
                <MathToolbar
                  activeContentEditor={activeQuestionEditor}
                  insertMathSymbol={insertMathSymbol}
                  onClose={() => setShowMathToolbar(false)}
                  isVisible={showMathToolbar}
                />
              )}

              {/* Questions */}
              <div className="space-y-4 sm:space-y-6">
                {currentQuiz?.questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => reorderQuestions(index, index - 1)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Move className="w-4 h-4" />
                            </button>
                          )}
                          <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          question.type === 'multiple_choice' ? 'bg-blue-100 text-blue-800' :
                          question.type === 'true_false' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {question.type === 'multiple_choice' ? 'Multiple Choice' : 
                           question.type === 'true_false' ? 'True/False' : 'Short Answer'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MathButton
                          onClick={() => {
                            setShowMathToolbar(!showMathToolbar);
                          }}
                          active={showMathToolbar && activeQuestionEditor === question.id}
                        />
                        <button
                          type="button"
                          onClick={() => setActiveTextEditor(activeTextEditor === `question-${question.id}` ? null : `question-${question.id}`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Text Editor"
                        >
                          <span className="text-sm">T</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteQuestion(question.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {previewMode ? (
                      renderQuestionPreview(question)
                    ) : (
                      <div className="space-y-4">
                        {/* Question Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question (Supports LaTeX)
                          </label>
                          <TextEditor
                            value={question.question}
                            onChange={(value) => updateQuestionField(question.id, 'question', value)}
                            placeholder="Enter your question here... Use $LaTeX$ for math equations"
                            contentId={`question-${question.id}`}
                            isVisible={activeTextEditor === `question-${question.id}`}
                            onClose={() => setActiveTextEditor(null)}
                          />
                          <textarea
                            ref={(el) => setTextareaRef(`question-${question.id}`, el)}
                            value={question.question}
                            onChange={(e) => updateQuestionField(question.id, 'question', e.target.value)}
                            onFocus={() => handleTextareaFocus(`question-${question.id}`, question.id)}
                            onSelect={() => handleTextareaSelectionChange(`question-${question.id}`)}
                            onKeyUp={() => handleTextareaSelectionChange(`question-${question.id}`)}
                            onClick={() => handleTextareaSelectionChange(`question-${question.id}`)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            rows={3}
                            placeholder="Enter your question here... Use $LaTeX$ for math equations"
                            required
                          />
                        </div>

                        {/* Multiple Choice Options */}
                        {question.type === 'multiple_choice' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Answer Options
                            </label>
                            <div className="space-y-2">
                              {question.options?.map((option, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={option === question.correct_answer}
                                    onChange={() => updateQuestionField(question.id, 'correct_answer', option)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                  <span className="text-sm font-medium text-gray-700 min-w-0">
                                    {String.fromCharCode(65 + idx)}.
                                  </span>
                                  <TextEditor
                                    value={option}
                                    onChange={(value) => {
                                      const newOptions = [...(question.options || [])];
                                      newOptions[idx] = value;
                                      updateQuestionField(question.id, 'options', newOptions);
                                    }}
                                    placeholder={`Option ${String.fromCharCode(65 + idx)} (supports LaTeX)`}
                                    contentId={`option-${question.id}-${idx}`}
                                    isVisible={activeTextEditor === `option-${question.id}-${idx}`}
                                    onClose={() => setActiveTextEditor(null)}
                                  />
                                  <textarea
                                    ref={(el) => setTextareaRef(`option-${question.id}-${idx}`, el)}
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || [])];
                                      newOptions[idx] = e.target.value;
                                      updateQuestionField(question.id, 'options', newOptions);
                                    }}
                                    onFocus={() => handleTextareaFocus(`option-${question.id}-${idx}`, question.id)}
                                    onSelect={() => handleTextareaSelectionChange(`option-${question.id}-${idx}`)}
                                    onKeyUp={() => handleTextareaSelectionChange(`option-${question.id}-${idx}`)}
                                    onClick={() => handleTextareaSelectionChange(`option-${question.id}-${idx}`)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                    placeholder={`Option ${String.fromCharCode(65 + idx)} (supports LaTeX)`}
                                    rows={2}
                                    required
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* True/False Options */}
                        {question.type === 'true_false' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Correct Answer
                            </label>
                            <div className="flex space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`} checked={question.correct_answer === 'True'}
                                  onChange={() => updateQuestionField(question.id, 'correct_answer', 'True')}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">True</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={question.correct_answer === 'False'}
                                  onChange={() => updateQuestionField(question.id, 'correct_answer', 'False')}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">False</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Short Answer */}
                        {question.type === 'short_answer' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Correct Answer (Supports LaTeX)
                            </label>
                            <TextEditor
                              value={question.correct_answer}
                              onChange={(value) => updateQuestionField(question.id, 'correct_answer', value)}
                              placeholder="Enter the correct answer... Use $LaTeX$ for math equations"
                              contentId={`answer-${question.id}`}
                              isVisible={activeTextEditor === `answer-${question.id}`}
                              onClose={() => setActiveTextEditor(null)}
                            />
                            <textarea
                              ref={(el) => setTextareaRef(`answer-${question.id}`, el)}
                              value={question.correct_answer}
                              onChange={(e) => updateQuestionField(question.id, 'correct_answer', e.target.value)}
                              onFocus={() => handleTextareaFocus(`answer-${question.id}`, question.id)}
                              onSelect={() => handleTextareaSelectionChange(`answer-${question.id}`)}
                              onKeyUp={() => handleTextareaSelectionChange(`answer-${question.id}`)}
                              onClick={() => handleTextareaSelectionChange(`answer-${question.id}`)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                              rows={2}
                              placeholder="Enter the correct answer... Use $LaTeX$ for math equations"
                              required
                            />
                          </div>
                        )}

                        {/* Explanation */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Explanation (Optional - Supports LaTeX)
                          </label>
                          <TextEditor
                            value={question.explanation || ''}
                            onChange={(value) => updateQuestionField(question.id, 'explanation', value)}
                            placeholder="Provide an explanation for the answer... Use $LaTeX$ for math equations"
                            contentId={`explanation-${question.id}`}
                            isVisible={activeTextEditor === `explanation-${question.id}`}
                            onClose={() => setActiveTextEditor(null)}
                          />
                          <textarea
                            ref={(el) => setTextareaRef(`explanation-${question.id}`, el)}
                            value={question.explanation || ''}
                            onChange={(e) => updateQuestionField(question.id, 'explanation', e.target.value)}
                            onFocus={() => handleTextareaFocus(`explanation-${question.id}`, question.id)}
                            onSelect={() => handleTextareaSelectionChange(`explanation-${question.id}`)}
                            onKeyUp={() => handleTextareaSelectionChange(`explanation-${question.id}`)}
                            onClick={() => handleTextareaSelectionChange(`explanation-${question.id}`)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            rows={3}
                            placeholder="Provide an explanation for the answer... Use $LaTeX$ for math equations"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty State */}
                {(!currentQuiz?.questions || currentQuiz.questions.length === 0) && (
                  <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                    <p className="text-gray-500 mb-4">Add your first question to get started</p>
                    <div className="flex justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => addNewQuestion('multiple_choice')}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Multiple Choice
                      </button>
                      <button
                        type="button"
                        onClick={() => addNewQuestion('true_false')}
                        className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        True/False
                      </button>
                      <button
                        type="button"
                        onClick={() => addNewQuestion('short_answer')}
                        className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        Short Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {currentQuiz?.questions.length || 0} question{(currentQuiz?.questions.length || 0) !== 1 ? 's' : ''} added
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                        setFormData({
                          title: '',
                          level: 'JHS',
                          course: '',
                          subject: "",
                          sub_strand: '',
                          subject_id: '',
                          substrand_id: '',
                          class: '',
                          duration_minutes: 30,
                          difficulty: 'medium'
                        });
                        setCurrentQuiz({
                          title: '',
                          subject_id: '',
                          substrand_id: '',
                          substrand: '',
                          subject: '',
                          course: '',
                          level: 'JHS' as const,
                          class: '',
                          questions: [],
                          duration_minutes: 30,
                          difficulty: 'medium'
                        });
                      }
                    }}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isLoading || !currentQuiz?.questions?.length}
                    className="flex items-center px-8 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isCreating ? 'Creating Quiz...' : 'Create Quiz'}
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

export default AddNewQuiz;
