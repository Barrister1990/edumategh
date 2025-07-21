"use client";

import { AdminEssayQuestion, AdminPastQuestion, AdminPastQuestionPaper } from '@/stores/adminPastQuestionStore';
import { produce } from 'immer';
import { PlusCircle, Trash2 } from 'lucide-react';

interface PastQuestionEditorProps {
  formData: AdminPastQuestionPaper;
  setFormData: (updater: (draft: AdminPastQuestionPaper) => void) => void;
  activePaper: 1 | 2;
  renumberQuestions: (paperKey: 'paper_1' | 'paper_2') => void;
}

export const PastQuestionEditor = ({ formData, setFormData, activePaper, renumberQuestions }: PastQuestionEditorProps) => {
  const paperKey = `paper_${activePaper}` as const;
  const paperData = formData.questions[paperKey];

  const handleSectionChange = (sectionIndex: number, field: string, value: any) => {
    setFormData(produce((draft) => {
      draft.questions[paperKey]!.sections[sectionIndex][field] = value;
    }));
  };

  const addSection = () => {
    setFormData(produce((draft) => {
      const newSection = activePaper === 1 
        ? { title: 'New Section', section: 'A', questions: [], instructions: '' }
        : { title: 'New Section', section: 'A', questions: [], instructions: '', question_selection: 'Answer all questions' };
      draft.questions[paperKey]!.sections.push(newSection as any);
    }));
  };

  const deleteSection = (sectionIndex: number) => {
    if (window.confirm('Are you sure you want to delete this section and all its questions?')) {
      setFormData(produce((draft) => {
        draft.questions[paperKey]!.sections.splice(sectionIndex, 1);
      }));
      renumberQuestions(paperKey);
    }
  };

  const handleQuestionChange = (sectionIndex: number, questionIndex: number, field: string, value: any) => {
    setFormData(produce((draft) => {
      draft.questions[paperKey]!.sections[sectionIndex].questions[questionIndex][field] = value;
    }));
  };

  const addQuestion = (sectionIndex: number) => {
    setFormData(produce((draft) => {
      const section = draft.questions[paperKey]!.sections[sectionIndex];
      const newQuestion = activePaper === 1
        ? { question_number: 0, question: '', options: ['', '', '', ''], answer: 0, explanation: '' }
        : { question_number: 0, question: '', marks: 10, sample_answer: '', sub_questions: [] };
      section.questions.push(newQuestion as any);
    }));
    renumberQuestions(paperKey);
  };

  const deleteQuestion = (sectionIndex: number, questionIndex: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setFormData(produce((draft) => {
        draft.questions[paperKey]!.sections[sectionIndex].questions.splice(questionIndex, 1);
      }));
      renumberQuestions(paperKey);
    }
  };
  
  const handleOptionChange = (sectionIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    setFormData(produce((draft) => {
        const question = draft.questions[paperKey]!.sections[sectionIndex].questions[questionIndex] as AdminPastQuestion;
        question.options[optionIndex] = value;
    }));
  };

  if (!paperData) {
    return <div className="text-center p-8 bg-gray-100 rounded-lg">This paper has not been set up yet.</div>;
  }

  return (
    <div>
      {paperData.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8 p-6 bg-white shadow-md rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-700">Section {section.section}</h3>
            <button onClick={() => deleteSection(sectionIndex)} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
              placeholder="Section Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={section.section}
              onChange={(e) => handleSectionChange(sectionIndex, 'section', e.target.value)}
              placeholder="Section Identifier (e.g., A, B)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <textarea
            value={section.instructions}
            onChange={(e) => handleSectionChange(sectionIndex, 'instructions', e.target.value)}
            placeholder="Section Instructions"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            rows={2}
          />

          {section.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="p-4 mb-4 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-800">Question {question.question_number}</p>
                <button onClick={() => deleteQuestion(sectionIndex, questionIndex)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={question.question}
                onChange={(e) => handleQuestionChange(sectionIndex, questionIndex, 'question', e.target.value)}
                placeholder="Question Text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                rows={3}
              />
              {activePaper === 1 && (
                <div>
                  {(question as AdminPastQuestion).options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={`q${questionIndex}-answer`}
                        checked={(question as AdminPastQuestion).answer === optionIndex}
                        onChange={() => handleQuestionChange(sectionIndex, questionIndex, 'answer', optionIndex)}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(sectionIndex, questionIndex, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                  <textarea
                    value={(question as AdminPastQuestion).explanation}
                    onChange={(e) => handleQuestionChange(sectionIndex, questionIndex, 'explanation', e.target.value)}
                    placeholder="Explanation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                </div>
              )}
              {activePaper === 2 && (
                <div>
                  <input
                    type="number"
                    value={(question as AdminEssayQuestion).marks}
                    onChange={(e) => handleQuestionChange(sectionIndex, questionIndex, 'marks', parseInt(e.target.value))}
                    placeholder="Marks"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  />
                  <textarea
                    value={(question as AdminEssayQuestion).sample_answer}
                    onChange={(e) => handleQuestionChange(sectionIndex, questionIndex, 'sample_answer', e.target.value)}
                    placeholder="Sample Answer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                  />
                </div>
              )}
            </div>
          ))}
          <button onClick={() => addQuestion(sectionIndex)} className="flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Question
          </button>
        </div>
      ))}
      <button onClick={addSection} className="flex items-center mt-6 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Section
      </button>
    </div>
  );
};
