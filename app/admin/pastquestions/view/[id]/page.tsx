"use client";
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PastQuestionEditor } from '@/components/pastquestions/PastQuestionEditor';
import { PastQuestionViewer } from '@/components/pastquestions/PastQuestionViewer';
import { useAdminPastQuestionStore } from '@/stores/adminPastQuestionStore';
import { produce } from 'immer';
import { Edit3, Eye, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const ViewPastQuestionPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    currentPaper,
    fetchPastQuestionById,
    updatePastQuestionPaper,
    subjects,
    fetchSubjects,
    examTypes,
    availableCourses,
    fetchAvailableCourses,
    isSaving,
    isLoading,
    error,
    clearError
  } = useAdminPastQuestionStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [activePaper, setActivePaper] = useState<1 | 2>(1);
  const [dialog, setDialog] = useState({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  useEffect(() => {
    if (id) {
      fetchPastQuestionById(id as string);
    }
    return () => clearError();
  }, [id, fetchPastQuestionById, clearError]);

  useEffect(() => {
    if (currentPaper) {
      setFormData(currentPaper);
      fetchSubjects(currentPaper.level);
      if (currentPaper.level === 'SHS') {
        fetchAvailableCourses(currentPaper.level);
      }
    }
  }, [currentPaper, fetchSubjects, fetchAvailableCourses]);

  const renumberQuestions = useCallback((paperKey: 'paper_1' | 'paper_2') => {
    setFormData(produce((draft: any) => {
      if (!draft) return;
      let questionCounter = 1;
      draft.questions[paperKey].sections.forEach((section: any) => {
        section.questions.forEach((question: any) => {
          question.question_number = questionCounter++;
        });
      });
    }));
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(produce((draft: any) => {
      draft[field] = value;
    }));
  };


  const handleSave = async () => {
    if (!formData) return;
    const success = await updatePastQuestionPaper(formData.id, formData);
    if (success) {
      setIsEditMode(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!formData) return <div className="p-6">Past question paper not found.</div>;

  return (
    <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
      <ConfirmDialog {...dialog} onClose={() => setDialog({ ...dialog, isOpen: false })} />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{formData.subject_name} - {formData.year}</h1>
          <button onClick={() => setIsEditMode(!isEditMode)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
            {isEditMode ? <Eye className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditMode ? 'View Mode' : 'Edit Mode'}
          </button>
        </div>

        {isEditMode ? (
          <div>
            {/* EDIT MODE FORM */}
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select value={formData.exam_type} onChange={(e) => handleInputChange('exam_type', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                  <option value="">Select Exam Type</option>
                  {examTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <select value={formData.level} onChange={(e) => handleInputChange('level', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                  <option value="JHS">JHS</option>
                  <option value="SHS">SHS</option>
                </select>
                <select value={formData.subject_id} onChange={(e) => {
                  const subject = subjects.find(s => s.id === e.target.value);
                  setFormData(produce((draft: any) => {
                    draft.subject_id = e.target.value;
                    draft.subject_name = subject ? subject.name : '';
                  }));
                }} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                  <option value="">Select Subject</option>
                  {subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                </select>
                <input type="number" value={formData.year} onChange={(e) => handleInputChange('year', parseInt(e.target.value))} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                {formData.level === 'SHS' && (
                  <select value={formData.course} onChange={(e) => handleInputChange('course', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    <option value="">Select Course</option>
                    {availableCourses.map(course => <option key={course} value={course}>{course}</option>)}
                  </select>
                )}
                <input type="number" value={formData.coin_price} onChange={(e) => handleInputChange('coin_price', parseInt(e.target.value))} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required min="0" />
              </div>
            </div>
            <div className="flex border-b mb-4">
              {formData.has_paper_1 && <button onClick={() => setActivePaper(1)} className={`px-4 py-2 ${activePaper === 1 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Paper 1</button>}
              {formData.has_paper_2 && <button onClick={() => setActivePaper(2)} className={`px-4 py-2 ${activePaper === 2 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Paper 2</button>}
            </div>
            <PastQuestionEditor
              formData={formData}
              setFormData={setFormData}
              activePaper={activePaper}
              renumberQuestions={renumberQuestions}
            />
            <div className="flex justify-end mt-8">
              <button onClick={handleSave} disabled={isSaving} className="flex items-center px-6 py-3 text-sm text-white bg-blue-600 rounded-lg disabled:opacity-50">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* VIEW MODE */}
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Exam Type:</strong> {formData.exam_type}</p>
                <p><strong>Level:</strong> {formData.level}</p>
                <p><strong>Subject:</strong> {formData.subject_name}</p>
                <p><strong>Year:</strong> {formData.year}</p>
                {formData.course && <p><strong>Course:</strong> {formData.course}</p>}
                <p><strong>Price:</strong> {formData.coin_price} coins</p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
              <PastQuestionViewer formData={formData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPastQuestionPage;
