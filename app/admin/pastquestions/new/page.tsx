"use client";
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { AdminEssayQuestion, AdminEssaySubQuestion, AdminPaper2Section, AdminPastQuestion, AdminPastQuestionSection } from '@/stores/adminPastQuestionStore';
import { useAdminPastQuestionStore } from '@/stores/adminPastQuestionStore';
import { produce } from 'immer';
import { ArrowDown, ArrowUp, Edit3, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const AddNewPastQuestionPage = () => {
  const router = useRouter();
  const {
    createPastQuestionPaper,
    subjects,
    fetchSubjects,
    examTypes,
    availableCourses,
    fetchAvailableCourses,
    isSaving,
    error,
    clearError
  } = useAdminPastQuestionStore();

  const [formData, setFormData] = useState({
    exam_type: '',
    subject_name: '',
    subject_id: '',
    year: new Date().getFullYear(),
    course: '',
    level: 'JHS',
    questions_count: 0,
    coin_price: 0,
    has_paper_1: true,
    has_paper_2: false,
    questions: {
      paper_1: {
        title: '',
        sections: [] as AdminPastQuestionSection[],
        total_marks: 0,
        duration: '1 hour',
        instructions: 'Answer ALL questions.'
      },
      paper_2: {
        title: '',
        sections: [] as AdminPaper2Section[],
        total_marks: 0,
        duration: '1 hour 30 minutes',
        instructions: 'Answer ALL questions in this section.'
      }
    }
  });

  const [activePaper, setActivePaper] = useState<1 | 2>(1);
  const [currentSection, setCurrentSection] = useState<any>({
    title: '',
    section: '',
    questions: [],
    instructions: ''
  });
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [dialog, setDialog] = useState({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  const renumberQuestions = useCallback((paperKey: 'paper_1' | 'paper_2') => {
    setFormData(produce((draft: typeof formData) => {
      let questionCounter = 1;
      draft.questions[paperKey].sections.forEach(section => {
        section.questions.forEach(question => {
          question.question_number = questionCounter++;
        });
      });
    }));
  }, []);

  useEffect(() => {
    fetchSubjects(formData.level);
    if (formData.level === 'SHS') {
      fetchAvailableCourses(formData.level);
    }
  }, [fetchSubjects, fetchAvailableCourses, formData.level]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(produce((draft: typeof formData) => {
      (draft as any)[field] = value;
    }));
  };

  const handleSectionChange = (field: string, value: any) => {
    setCurrentSection((prev: any) => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    if (!currentSection.title || !currentSection.section) {
      alert('Please fill in section title and identifier');
      return;
    }
    const paperKey = `paper_${activePaper}` as const;
    const newSection = { ...currentSection, questions: [] };
    setFormData(produce((draft: typeof formData) => {
      if (editingSectionIndex !== null) {
        draft.questions[paperKey].sections[editingSectionIndex] = newSection;
      } else {
        draft.questions[paperKey].sections.push(newSection);
      }
    }));
    setEditingSectionIndex(null);
    setCurrentSection({ title: '', section: '', questions: [], instructions: '' });
    setShowSectionForm(false);
  };

  const editSection = (index: number) => {
    const paperKey = `paper_${activePaper}` as const;
    setCurrentSection(formData.questions[paperKey].sections[index]);
    setEditingSectionIndex(index);
    setShowSectionForm(true);
  };

  const deleteSection = (index: number) => {
    setDialog({
      isOpen: true,
      title: 'Delete Section',
      description: 'Are you sure you want to delete this section and all its questions?',
      onConfirm: () => {
        const paperKey = `paper_${activePaper}` as const;
        setFormData(produce((draft: typeof formData) => {
          draft.questions[paperKey].sections.splice(index, 1);
        }));
        renumberQuestions(paperKey);
      }
    });
  };

  const reorderSection = (index: number, direction: 'up' | 'down') => {
    const paperKey = `paper_${activePaper}` as const;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    setFormData(produce((draft: typeof formData) => {
      const sections = draft.questions[paperKey].sections;
      if (newIndex >= 0 && newIndex < sections.length) {
        [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      }
    }));
    renumberQuestions(paperKey);
  };

  const addQuestionToSection = (sectionIndex: number) => {
    const paperKey = `paper_${activePaper}` as const;
    setFormData(produce((draft: typeof formData) => {
      const section = draft.questions[paperKey].sections[sectionIndex];
      let newQuestion;
      if (activePaper === 1) {
        newQuestion = {
          question_number: 0, // Will be re-numbered
          question: '',
          options: ['', '', '', ''],
          answer: 0,
          explanation: ''
        };
      } else {
        newQuestion = {
          question_number: 0, // Will be re-numbered
          question: '',
          marks: 10,
          sample_answer: '',
          sub_questions: []
        };
      }
      section.questions.push(newQuestion as any);
    }));
    renumberQuestions(paperKey);
  };

  const updateQuestion = (path: (string | number)[], field: string, value: any) => {
    setFormData(produce((draft: typeof formData) => {
      let target: any = draft;
      path.forEach(p => {
        target = target[p];
      });
      target[field] = value;
    }));
  };

  const updateQuestionOption = (sectionIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    setFormData(produce((draft: typeof formData) => {
      draft.questions.paper_1.sections[sectionIndex].questions[questionIndex].options[optionIndex] = value;
    }));
  };

  const deleteQuestion = (path: (string | number)[]) => {
    setDialog({
      isOpen: true,
      title: 'Delete Question',
      description: 'Are you sure you want to delete this question?',
      onConfirm: () => {
        const paperKey = `paper_${activePaper}` as const;
        setFormData(produce((draft: typeof formData) => {
          const parentPath = path.slice(0, -1);
          const indexToDelete = path[path.length - 1] as number;
          
          let parent: any = draft;
          parentPath.forEach(p => {
            parent = parent[p];
          });

          if (Array.isArray(parent)) {
            parent.splice(indexToDelete, 1);
          }
        }));
        renumberQuestions(paperKey);
      }
    });
  };

  const reorderQuestion = (path: (string | number)[], direction: 'up' | 'down') => {
    const paperKey = `paper_${activePaper}` as const;
    setFormData(produce((draft: typeof formData) => {
      const parentPath = path.slice(0, -1);
      const index = path[path.length - 1] as number;
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      let parent: any = draft;
      parentPath.forEach(p => {
        parent = parent[p];
      });

      if (Array.isArray(parent) && newIndex >= 0 && newIndex < parent.length) {
        [parent[index], parent[newIndex]] = [parent[newIndex], parent[index]];
      }
    }));
    renumberQuestions(paperKey);
  };

  const addSubQuestion = (path: (string | number)[]) => {
    setFormData(produce((draft: typeof formData) => {
      let target: any = draft;
      path.forEach(p => {
        target = target[p];
      });
      if (!target.sub_questions) {
        target.sub_questions = [];
      }
      target.sub_questions.push({
        sub_letter: '',
        question: '',
        marks: 5,
        sample_answer: '',
        sub_questions: []
      });
    }));
  };

  const calculateTotalQuestions = () => {
    let total = 0;
    if (formData.has_paper_1) {
      total += formData.questions.paper_1.sections.reduce((sum, section) => sum + section.questions.length, 0);
    }
    if (formData.has_paper_2) {
      total += formData.questions.paper_2.sections.reduce((sum, section) => sum + section.questions.length, 0);
    }
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalQuestions = calculateTotalQuestions();
    if (totalQuestions === 0) {
      setDialog({
        isOpen: true,
        title: 'No Questions Added',
        description: 'Please add at least one question to the selected papers before saving.',
        onConfirm: () => {}
      });
      return;
    }

    const paperData = {
      ...formData,
      questions_count: totalQuestions,
      questions: {
        paper_1: formData.has_paper_1 ? {
          ...formData.questions.paper_1,
          title: `${formData.exam_type} ${formData.subject_name} ${formData.year} - Paper 1`,
          total_marks: formData.questions.paper_1.sections.reduce((sum, s) => sum + s.questions.length, 0)
        } : undefined,
        paper_2: formData.has_paper_2 ? {
          ...formData.questions.paper_2,
          title: `${formData.exam_type} ${formData.subject_name} ${formData.year} - Paper 2`,
          total_marks: formData.questions.paper_2.sections.reduce((sum, s) => sum + s.questions.reduce((qSum, q) => qSum + (q.marks || 0), 0), 0)
        } : undefined,
      }
    };

    const newPaperId = await createPastQuestionPaper(paperData as any);
    if (newPaperId) {
      router.push(`/admin/pastquestions/view/${newPaperId}`);
    }
  };

const renderSubQuestionForm = (subQuestion: AdminEssaySubQuestion, path: (string | number)[], parentArray: any[]) => {
  const index = path[path.length - 1] as number;
  return (
    <div key={path.join('-')} className="ml-2 sm:ml-4 pl-2 sm:pl-4 border-l-2 border-blue-200 mt-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            placeholder="e.g., a or i" 
            value={subQuestion.sub_letter} 
            onChange={e => updateQuestion(path, 'sub_letter', e.target.value)} 
            className="w-16 px-2 py-1 border rounded text-sm" 
          />
          <input 
            type="number" 
            placeholder="Marks" 
            value={subQuestion.marks} 
            onChange={e => updateQuestion(path, 'marks', parseInt(e.target.value))} 
            className="w-20 px-2 py-1 border rounded text-sm" 
          />
        </div>
        <textarea 
          placeholder="Sub-question text" 
          value={subQuestion.question} 
          onChange={e => updateQuestion(path, 'question', e.target.value)} 
          className="w-full px-3 py-2 border rounded text-sm" 
          rows={2} 
        />
        <div className="flex items-center space-x-1 self-start sm:self-center">
          <button 
            type="button" 
            onClick={() => reorderQuestion(path, 'up')} 
            disabled={index === 0} 
            className="p-1 disabled:opacity-50"
          >
            <ArrowUp size={14} />
          </button>
          <button 
            type="button" 
            onClick={() => reorderQuestion(path, 'down')} 
            disabled={index === parentArray.length - 1} 
            className="p-1 disabled:opacity-50"
          >
            <ArrowDown size={14} />
          </button>
          <button 
            type="button" 
            onClick={() => deleteQuestion(path)} 
            className="text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <textarea 
        placeholder="Suggested answer" 
        value={subQuestion.sample_answer} 
        onChange={e => updateQuestion(path, 'sample_answer', e.target.value)} 
        className="w-full px-3 py-2 border rounded text-sm" 
        rows={3} 
      />
      <button 
        type="button" 
        onClick={() => addSubQuestion(path)} 
        className="text-xs text-blue-600 font-semibold"
      >
        + Add Nested Sub-question
      </button>
      {subQuestion.sub_questions?.map((nestedSub, index) => 
        renderSubQuestionForm(nestedSub, [...path, 'sub_questions', index], subQuestion.sub_questions!)
      )}
    </div>
  );
};

const renderQuestionForm = (sectionIndex: number, question: any, questionIndex: number) => {
  const basePath = ['questions', `paper_${activePaper}`, 'sections', sectionIndex, 'questions', questionIndex];
  if (activePaper === 1) {
    const mcq = question as AdminPastQuestion;
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
          <textarea 
            value={mcq.question} 
            onChange={(e) => updateQuestion(basePath, 'question', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm" 
            rows={2} 
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {['A', 'B', 'C', 'D'].map((label, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Option {label}</label>
              <input 
                type="text" 
                value={mcq.options[i]} 
                onChange={(e) => updateQuestionOption(sectionIndex, questionIndex, i, e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm" 
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
          <select 
            value={mcq.answer} 
            onChange={(e) => updateQuestion(basePath, 'answer', parseInt(e.target.value))} 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value={0}>A</option>
            <option value={1}>B</option>
            <option value={2}>C</option>
            <option value={3}>D</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
          <textarea 
            value={mcq.explanation} 
            onChange={(e) => updateQuestion(basePath, 'explanation', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm" 
            rows={3} 
          />
        </div>
      </div>
    );
  } else {
    const essay = question as AdminEssayQuestion;
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
          <textarea 
            value={essay.question} 
            onChange={(e) => updateQuestion(basePath, 'question', e.target.value)} 
            className="w-full px-3 py-2 border rounded text-sm" 
            rows={3} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
          <input 
            type="number" 
            value={essay.marks} 
            onChange={(e) => updateQuestion(basePath, 'marks', parseInt(e.target.value))} 
            className="w-full px-3 py-2 border rounded text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Answer</label>
          <textarea 
            value={essay.sample_answer} 
            onChange={(e) => updateQuestion(basePath, 'sample_answer', e.target.value)} 
            className="w-full px-3 py-2 border rounded text-sm" 
            rows={4} 
          />
        </div>
        <div className="mt-2">
          <h5 className="text-sm font-semibold">Sub-questions</h5>
          {essay.sub_questions?.map((sub, subIndex) => 
            renderSubQuestionForm(sub, [...basePath, 'sub_questions', subIndex], essay.sub_questions!)
          )}
          <button 
            type="button" 
            onClick={() => addSubQuestion(basePath)} 
            className="mt-2 text-sm text-blue-600 font-semibold"
          >
            + Add Sub-question
          </button>
        </div>
      </div>
    );
  }
};

return (
  <div className="p-3 sm:p-6 lg:p-10 bg-gray-50 min-h-screen">
    <ConfirmDialog {...dialog} onClose={() => setDialog({ ...dialog, isOpen: false })} />
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Add New Past Question
      </h1>
      
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <select 
            value={formData.exam_type} 
            onChange={(e) => handleInputChange('exam_type', e.target.value)} 
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base" 
            required
          >
            <option value="">Select Exam Type</option>
            {examTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          
          <select 
            value={formData.level} 
            onChange={(e) => handleInputChange('level', e.target.value)} 
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base" 
            required
          >
            <option value="JHS">JHS</option>
            <option value="SHS">SHS</option>
          </select>
          
          <select 
            value={formData.subject_id} 
            onChange={(e) => {
              const subject = subjects.find(s => s.id === e.target.value);
              setFormData(produce(draft => {
                draft.subject_id = e.target.value;
                draft.subject_name = subject ? subject.name : '';
              }));
            }} 
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base" 
            required
          >
            <option value="">Select Subject</option>
            {subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
          </select>
          
          <input 
            type="number" 
            placeholder="Year"
            value={formData.year} 
            onChange={(e) => handleInputChange('year', parseInt(e.target.value))} 
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base" 
            required 
          />
          
          {formData.level === 'SHS' && (
            <select 
              value={formData.course} 
              onChange={(e) => handleInputChange('course', e.target.value)} 
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base"
            >
              <option value="">Select Course</option>
              {availableCourses.map(course => <option key={course} value={course}>{course}</option>)}
            </select>
          )}
          
          <input 
            type="number" 
            placeholder="Coin Price"
            value={formData.coin_price} 
            onChange={(e) => handleInputChange('coin_price', parseInt(e.target.value))} 
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base" 
            required 
            min="0" 
          />
          
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={formData.has_paper_1} 
                onChange={(e) => handleInputChange('has_paper_1', e.target.checked)} 
                className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 border-gray-300 rounded" 
              />
              <span className="text-sm sm:text-base">Has Paper 1 (Objectives)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={formData.has_paper_2} 
                onChange={(e) => handleInputChange('has_paper_2', e.target.checked)} 
                className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 border-gray-300 rounded" 
              />
              <span className="text-sm sm:text-base">Has Paper 2 (Essay)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex border-b mb-4 overflow-x-auto">
        {formData.has_paper_1 && (
          <button 
            onClick={() => setActivePaper(1)} 
            className={`px-4 py-2 text-sm sm:text-base whitespace-nowrap ${
              activePaper === 1 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            Paper 1
          </button>
        )}
        {formData.has_paper_2 && (
          <button 
            onClick={() => setActivePaper(2)} 
            className={`px-4 py-2 text-sm sm:text-base whitespace-nowrap ${
              activePaper === 2 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            Paper 2
          </button>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Paper {activePaper} Sections
          </h2>
          <button 
            type="button" 
            onClick={() => setShowSectionForm(true)} 
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Section
          </button>
        </div>

        {showSectionForm && (
          <div className="border rounded-lg p-4 mb-4 bg-gray-50">
            <h3 className="font-medium mb-3 text-sm sm:text-base">
              {editingSectionIndex !== null ? 'Edit Section' : 'Add New Section'}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input 
                type="text" 
                value={currentSection.title} 
                onChange={(e) => handleSectionChange('title', e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" 
                placeholder="e.g., Section A" 
              />
              <input 
                type="text" 
                value={currentSection.section} 
                onChange={(e) => handleSectionChange('section', e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" 
                placeholder="e.g., Answer all questions" 
              />
              <textarea 
                value={currentSection.instructions} 
                onChange={(e) => handleSectionChange('instructions', e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" 
                rows={2} 
                placeholder="Section-specific instructions..." 
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
              <button 
                type="button" 
                onClick={() => { 
                  setShowSectionForm(false); 
                  setEditingSectionIndex(null); 
                  setCurrentSection({ title: '', section: '', questions: [], instructions: '' }); 
                }} 
                className="px-4 py-2 text-sm bg-gray-200 rounded-lg w-full sm:w-auto"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={addSection} 
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg w-full sm:w-auto"
              >
                {editingSectionIndex !== null ? 'Update Section' : 'Add Section'}
              </button>
            </div>
          </div>
        )}

        {formData.questions[`paper_${activePaper}`].sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border rounded-lg p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 space-y-2 sm:space-y-0">
              <div className="flex-1">
                <h3 className="font-medium text-sm sm:text-base">{section.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{section.section}</p>
                <p className="text-xs text-gray-500">{section.questions.length} questions</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  type="button" 
                  onClick={() => reorderSection(sectionIndex, 'up')} 
                  disabled={sectionIndex === 0} 
                  className="p-1 disabled:opacity-50"
                >
                  <ArrowUp size={16} />
                </button>
                <button 
                  type="button" 
                  onClick={() => reorderSection(sectionIndex, 'down')} 
                  disabled={sectionIndex === formData.questions[`paper_${activePaper}`].sections.length - 1} 
                  className="p-1 disabled:opacity-50"
                >
                  <ArrowDown size={16} />
                </button>
                <button 
                  type="button" 
                  onClick={() => addQuestionToSection(sectionIndex)} 
                  className="px-2 py-1 text-xs text-white bg-blue-600 rounded flex items-center"
                >
                  <Plus size={12} className="mr-1" />Add Question
                </button>
                <button 
                  type="button" 
                  onClick={() => editSection(sectionIndex)} 
                  className="p-1 text-white bg-yellow-600 rounded"
                >
                  <Edit3 size={12} />
                </button>
                <button 
                  type="button" 
                  onClick={() => deleteSection(sectionIndex)} 
                  className="p-1 text-white bg-red-600 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {section.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border rounded p-3 mb-3 bg-white">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                  <h4 className="font-medium text-sm sm:text-base">Question {question.question_number}</h4>
                  <div className="flex items-center space-x-1">
                    <button 
                      type="button" 
                      onClick={() => reorderQuestion(['questions', `paper_${activePaper}`, 'sections', sectionIndex, 'questions', questionIndex], 'up')} 
                      disabled={questionIndex === 0} 
                      className="p-1 disabled:opacity-50"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => reorderQuestion(['questions', `paper_${activePaper}`, 'sections', sectionIndex, 'questions', questionIndex], 'down')} 
                      disabled={questionIndex === section.questions.length - 1} 
                      className="p-1 disabled:opacity-50"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => deleteQuestion(['questions', `paper_${activePaper}`, 'sections', sectionIndex, 'questions', questionIndex])} 
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {renderQuestionForm(sectionIndex, question, questionIndex)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="px-6 py-3 text-sm bg-gray-200 rounded-lg w-full sm:w-auto"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={isSaving} 
          className="flex items-center justify-center px-6 py-3 text-sm text-white bg-blue-600 rounded-lg disabled:opacity-50 w-full sm:w-auto"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Past Question Paper'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  </div>
);
}

export default AddNewPastQuestionPage;
