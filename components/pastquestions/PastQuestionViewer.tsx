"use client";

import { AdminEssayQuestion, AdminPastQuestion, AdminPastQuestionPaper } from '@/stores/adminPastQuestionStore';

interface PastQuestionViewerProps {
  formData: AdminPastQuestionPaper;
}

export const PastQuestionViewer = ({ formData }: PastQuestionViewerProps) => {
  return (
    <div>
      {formData.questions.paper_1 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Paper 1</h2>
          {formData.questions.paper_1.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{section.title}</h3>
              <p className="text-sm text-gray-600 italic mb-4">{section.instructions}</p>
              {section.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold mb-2">Question {question.question_number}: {question.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(question as AdminPastQuestion).options.map((option, optionIndex) => (
                      <p key={optionIndex} className={`p-2 rounded-md ${optionIndex === (question as AdminPastQuestion).answer ? 'bg-green-100 text-green-800' : ''}`}>
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </p>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-700"><strong>Explanation:</strong> {(question as AdminPastQuestion).explanation}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {formData.questions.paper_2 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Paper 2</h2>
          {formData.questions.paper_2.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{section.title}</h3>
              <p className="text-sm text-gray-600 italic mb-4">{section.instructions}</p>
              {section.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold mb-2">Question {question.question_number}: {question.question} ({ (question as AdminEssayQuestion).marks} marks)</p>
                  <div className="prose max-w-none">
                    <p><strong>Sample Answer:</strong></p>
                    <div dangerouslySetInnerHTML={{ __html: (question as AdminEssayQuestion).sample_answer || '' }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
