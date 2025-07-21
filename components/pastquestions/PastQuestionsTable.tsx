"use client";
import { useAdminPastQuestionStore } from '@/stores/adminPastQuestionStore';
import { Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

const PastQuestionsTable = () => {
  const { pastQuestionPapers, deletePastQuestionPaper } = useAdminPastQuestionStore();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this past question paper?')) {
      await deletePastQuestionPaper(id);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exam Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pastQuestionPapers.map((paper) => (
              <tr key={paper.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paper.exam_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paper.subject_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paper.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paper.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paper.course || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-4">
                    <Link href={`/admin/pastquestions/view/${paper.id}`}>
                      <Eye className="w-5 h-5 text-blue-500 hover:text-blue-700 cursor-pointer" />
                    </Link>
                    <Trash2
                      className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => handleDelete(paper.id!)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastQuestionsTable;
