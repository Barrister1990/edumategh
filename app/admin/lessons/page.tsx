"use client"
import { useAdminLessonStore } from '@/stores/adminLessonStore';
import { BookOpen, ChevronLeft, ChevronRight, Clock, Eye, Filter, Plus, Search, Trash2, Users } from 'lucide-react';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Type definitions
interface LessonFilters {
  level: string;
  course: string;
  class: string;
  subject_id: string;
  substrand_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SearchFilters extends LessonFilters {
  search?: string;
}

const LessonsDashboard: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter()
  const [filters, setFilters] = useState<LessonFilters>({
    level: 'JHS',
    course: '',
    class: '',
    subject_id: '',
    substrand_id: '',
    difficulty: 'medium',
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const {
    lessons,
    subjects,
    subStrands,
    isLoading,
    isDeleting,
    error,
    currentPage,
    totalPages,
    totalLessons,
    fetchLessons,
    fetchSubjects,
    fetchSubStrands,
    deleteLesson,
    clearError,
    setPage,
  } = useAdminLessonStore();

  useEffect(() => {
    fetchLessons();
    fetchSubjects();
  }, [fetchLessons, fetchSubjects]);

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

    fetchLessons(1, searchFilters);
  };

  const handleDelete = async (lessonId: string, lessonTitle: string): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete "${lessonTitle}"? This action cannot be undone.`)) {
      const success = await deleteLesson(lessonId);
      if (success) {
        toast.success('Lesson deleted successfully');
        // Refresh the current page after deletion
        fetchLessons(currentPage);
      }
    }
  };

  const handleView = (lessonId: string): void => {
    console.log("My passing", lessonId)
    router.push(`/admin/lessons/view/${lessonId}`);
  };

  const handleFilterChange = (key: keyof LessonFilters, value: string): void => {
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
    fetchLessons(1);
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
    const courses = Array.from(new Set(shsSubjects.map(subject => subject.course).filter(Boolean)));
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
    
    // Remove this class filter since class shouldn't affect subject fetching
    // if (filters.class && subject.class !== filters.class) {
    //   matches = false;
    // }
    
    return matches;
  });
};

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Lessons Dashboard</h1>
              <p className="text-gray-600 text-sm md:text-base">Manage and organize your educational content</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/admin/lessons/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm self-start md:self-auto"
            >
              <Plus size={16} />
              <span>Create Lesson</span>
            </button>
          </div>

          {/* Stats Cards - Mobile First */}
          <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3 md:gap-6 md:mt-6">
            <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 md:rounded-xl md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 md:w-12 md:h-12">
                  <BookOpen className="w-4 h-4 text-blue-600 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 md:text-sm">Total Lessons</p>
                  <p className="text-lg font-bold text-gray-900 md:text-xl">{totalLessons}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 md:rounded-xl md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 md:w-12 md:h-12">
                  <Users className="w-4 h-4 text-green-600 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 md:text-sm">Subjects</p>
                  <p className="text-lg font-bold text-gray-900 md:text-xl">{subjects.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 md:rounded-xl md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 md:w-12 md:h-12">
                  <Clock className="w-4 h-4 text-purple-600 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 md:text-sm">Avg. Duration</p>
                  <p className="text-lg font-bold text-gray-900 md:text-xl">
                    {lessons.length > 0 
                      ? Math.round(lessons.reduce((acc, lesson) => acc + (lesson.duration_minutes || 0), 0) / lessons.length)
                      : 0}m
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 md:rounded-xl md:p-6 md:mb-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Lessons</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
                
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 md:mt-6 md:pt-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:gap-4">
                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value as string)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                    onChange={(e) => handleFilterChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lessons Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden md:rounded-xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 md:h-64">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 md:h-8 md:w-8"></div>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-3 md:h-12 md:w-12 md:mb-4" />
              <h3 className="text-base font-medium text-gray-900 mb-2 md:text-lg">No lessons found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="block md:hidden">
                <div className="divide-y divide-gray-200">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0 mr-3">
                          <h3 className="text-base font-medium text-gray-900 truncate">{lesson.title}</h3>
                          {lesson.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lesson.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleView(lesson.id as string)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(lesson.id as string, lesson.title)}
                            disabled={isDeleting}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelBadge(lesson.level)}`}>
                          {lesson.level}
                        </span>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {lesson.class}
                        </span>
                        {lesson.difficulty && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(lesson.difficulty)}`}>
                            {lesson.difficulty}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {lesson.duration_minutes ? `${lesson.duration_minutes}m` : 'No duration'}
                        </span>
                        <span>
                          {lesson.created_at ? new Date(lesson.created_at).toLocaleDateString() : 'No date'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lesson
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level & Class
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sub-strand
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
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
                    {lessons.map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                            {lesson.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {lesson.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadge(lesson.level)}`}>
                              {lesson.level}
                            </span>
                            <span className="text-sm text-gray-600">{lesson.class}</span>
                          </div>
                        </td>
                       
                        <td className="px-6 py-4">
                          {lesson.difficulty && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(lesson.difficulty)}`}>
                              {lesson.difficulty}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {lesson.duration_minutes ? `${lesson.duration_minutes}m` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {lesson.created_at ? new Date(lesson.created_at).toLocaleDateString() : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(lesson.id as string)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View lesson"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(lesson.id as string, lesson.title)}
                              disabled={isDeleting}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete lesson"
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
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalLessons)} of {totalLessons} lessons
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

export default LessonsDashboard;
