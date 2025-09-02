"use client"
import { useAdminQuizStore } from '@/stores/adminQuizStore';
import { BookOpen, ChevronLeft, ChevronRight, Clock, Eye, Filter, Plus, Search, Trash2, Users } from 'lucide-react';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Type definitions
interface Question {
  type: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  level: string;
  class: string;
  subject: string;
  substrand?: string;
  difficulty?: string;
  duration_minutes?: number;
  questions: Question[];
  created_at?: string;
}

interface QuizFilters {
  level: string;
  course: string;
  class: string;
  subject_id: string;
  substrand_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SearchFilters extends QuizFilters {
  search?: string;
}

const QuizzesDashboard: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter()
  const [filters, setFilters] = useState<QuizFilters>({
    level: 'JHS',
    course: '',
    class: '',
    subject_id: '',
    substrand_id: '',
    difficulty: 'medium',
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const {
    quizzes,
    subjects,
    subStrands,
    isLoading,
    isDeleting,
    error,
    currentPage,
    totalPages,
    totalQuizzes,
    fetchQuizzes,
    fetchSubjects,
    fetchSubStrands,
    deleteQuiz,
    clearError,
    setPage,
  } = useAdminQuizStore();

  useEffect(() => {
    fetchQuizzes();
    fetchSubjects();
  }, [fetchQuizzes, fetchSubjects]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

useEffect(() => {
  if (filters.level) {
    // Reset dependent filters when level changes
    if (filters.level === 'JHS' && filters.course) {
      setFilters(prev => ({ ...prev, course: '', subject_id: '', substrand_id: '' }));
    }
    
    // Fetch subjects based on level only
    fetchSubjects(filters.level);
  }
}, [filters.level, fetchSubjects]);

  // Fetch sub-strands when subject changes
useEffect(() => {
  if (filters.subject_id) {
    // Pass the class filter to fetchSubStrands since class affects sub-strands
    fetchSubStrands(filters.subject_id, filters.class || undefined);
  } else {
    // Clear sub-strands if no subject is selected
    setFilters(prev => ({ ...prev, substrand_id: '' }));
  }
}, [filters.subject_id, filters.class, fetchSubStrands]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const searchFilters: SearchFilters = {
      ...filters,
      search: searchTerm || undefined,
    };
    
    // Remove empty filters
    Object.keys(searchFilters).forEach((key) => {
      const filterKey = key as keyof SearchFilters;
      if (!searchFilters[filterKey]) {
        delete searchFilters[filterKey];
      }
    });

    fetchQuizzes(1, searchFilters);
  };

  const handleDelete = async (quizId: string, quizTitle: string): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`)) {
      const success = await deleteQuiz(quizId);
      if (success) {
        toast.success('Quiz deleted successfully');
        // Refresh the current page after deletion
        fetchQuizzes(currentPage);
      }
    }
  };

  const handleView = (quizId: string): void => {
    console.log("My passing", quizId)
    router.push(`/admin/quizzes/view/${quizId}`);
  };

  const handleFilterChange = (key: keyof QuizFilters, value: string): void => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Reset dependent filters when parent changes
      if (key === 'level') {
        newFilters.course = '';
        newFilters.subject_id = '';
        newFilters.substrand_id = '';
      } else if (key === 'course') {
        newFilters.subject_id = '';
        newFilters.substrand_id = '';
      } else if (key === 'subject_id') {
        newFilters.substrand_id = '';
      }
      
      return newFilters;
    });
  };

  const resetFilters = (): void => {
    setFilters({
      level: 'JHS',
      course: '',
      class: '',
      subject_id: '',
      substrand_id: '',
      difficulty: 'medium',
    });
    setSearchTerm('');
    fetchQuizzes(1);
  };

  const getDifficultyBadge = (difficulty: string): string => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getLevelBadge = (level: string): string => {
    return level === 'JHS' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  // Get unique courses from subjects for SHS level
  const getCoursesForSHS = () => {
    const shsSubjects = subjects.filter(subject => subject.level === 'SHS');
    const courses = Array.from(new Set(
      shsSubjects
        .map(subject => subject.course)
        .filter(Boolean)
        .flat() // Flatten arrays to strings
        .filter((course): course is string => typeof course === 'string')
    ));
    return courses;
  };

  // Get subjects filtered by level, course, and class
const getFilteredSubjects = () => {
  return subjects.filter(subject => {
    let matches = true;
    
    if (filters.level && subject.level !== filters.level) {
      matches = false;
    }
    
    if (filters.course && subject.course !== filters.course) {
      matches = false;
    }
    
    return matches;
  });
};

  // Calculate average questions per quiz
  const getAverageQuestions = () => {
    if (quizzes.length === 0) return 0;
    const totalQuestions = quizzes.reduce((acc, quiz) => acc + (quiz.questions?.length || 0), 0);
    return Math.round(totalQuestions / quizzes.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quizzes Dashboard</h1>
              <p className="text-gray-600">Manage and organize your quiz questions</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/admin/quizzes/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Create Quiz
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalQuizzes}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{getAverageQuestions()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch}>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Quizzes</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title or description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter size={20} />
                Filters
              </button>
              
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value as string | '')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="JHS">JHS</option>
                    <option value="SHS">SHS</option>
                  </select>
                </div>

                {/* Course Filter - Only for SHS */}
                {filters.level === 'SHS' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    <select
                      value={filters.course}
                      onChange={(e) => handleFilterChange('course', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Courses</option>
                      {getCoursesForSHS().map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Class Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={filters.class}
                    onChange={(e) => handleFilterChange('class', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Classes</option>
                    {filters.level === 'JHS' ? (
                      <>
                        <option value="JHS 1">JHS 1</option>
                        <option value="JHS 2">JHS 2</option>
                        <option value="JHS 3">JHS 3</option>
                      </>
                    ) : filters.level === 'SHS' ? (
                      <>
                        <option value="SHS 1">SHS 1</option>
                        <option value="SHS 2">SHS 2</option>
                        <option value="SHS 3">SHS 3</option>
                      </>
                    ) : (
                      <>
                        <option value="JHS 1">JHS 1</option>
                        <option value="JHS 2">JHS 2</option>
                        <option value="JHS 3">JHS 3</option>
                        <option value="SHS 1">SHS 1</option>
                        <option value="SHS 2">SHS 2</option>
                        <option value="SHS 3">SHS 3</option>
                      </>
                    )}
                  </select>
                </div>
                
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={filters.subject_id}
                    onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!filters.level || (filters.level === 'SHS' && !filters.course)}
                  >
                    <option value="">All Subjects</option>
                    {getFilteredSubjects().map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-strand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-strand</label>
                  <select
                    value={filters.substrand_id}
                    onChange={(e) => handleFilterChange('substrand_id', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!filters.subject_id}
                  >
                    <option value="">All Sub-strands</option>
                    {subStrands.map((subStrand) => (
                      <option key={subStrand.id} value={subStrand.id}>
                        {subStrand.sub_strand}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard' | '')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSearch({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quizzes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level & Class
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sub-strand
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizzes.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                            {quiz.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {quiz.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadge(quiz.level)}`}>
                              {quiz.level}
                            </span>
                            <span className="text-sm text-gray-600">{quiz.class}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{quiz.subject}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{quiz.substrand || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          {quiz.difficulty && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(quiz.difficulty)}`}>
                              {quiz.difficulty}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {quiz.questions?.length || 0} questions
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(quiz.id as string)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View quiz"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(quiz.id as string, quiz.title)}
                              disabled={isDeleting}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete quiz"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalQuizzes)} of {totalQuizzes} quizzes
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page: number;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => setPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizzesDashboard;