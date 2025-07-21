"use client";
import { useAdminPastQuestionStore } from '@/stores/adminPastQuestionStore';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Edit3,
  Eye,
  Filter,
  GraduationCap,
  LayoutGrid,
  List,
  Menu,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
  XCircle
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
const AdminPastQuestionsPage = () => {
  const {
    pastQuestionPapers,
    subjects,
    examTypes,
    availableYears,
    availableCourses,
    stats,
    isLoading,
    isSaving,
    error,
    filters,
    pagination,
    fetchPastQuestionPapers,
    fetchSubjects,
    fetchExamTypes,
    fetchAvailableYears,
    fetchAvailableCourses,
    fetchStats,
    deletePastQuestionPaper,
    duplicatePastQuestionPaper,
    setFilters,
    setPagination,
    searchPastQuestions,
    clearError
  } = useAdminPastQuestionStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const router = useRouter()
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchPastQuestionPapers(filters),
        fetchSubjects(),
        fetchExamTypes(),
        fetchAvailableYears(),
        fetchAvailableCourses(),
        fetchStats()
      ]);
    };
    initializeData();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        searchPastQuestions(searchTerm);
      } else {
        fetchPastQuestionPapers(filters);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value === '' ? undefined : value });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this past question paper? This action cannot be undone.')) {
      await deletePastQuestionPaper(id);
    }
  };

  const handleDuplicate = async (id: string) => {
    const year = prompt('Enter the year for the duplicated paper:');
    if (year && !isNaN(Number(year))) {
      await duplicatePastQuestionPaper(id, Number(year));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPapers.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedPapers.length} selected papers?`)) {
      for (const id of selectedPapers) {
        await deletePastQuestionPaper(id);
      }
      setSelectedPapers([]);
    }
  };

  const togglePaperSelection = (id: string) => {
    setSelectedPapers(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const selectAllPapers = () => {
    setSelectedPapers(
      selectedPapers.length === pastQuestionPapers.length 
        ? [] 
        : pastQuestionPapers.map(p => p.id!)
    );
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCards(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (paper: any) => {
    const hasBothPapers = paper.has_paper_1 && paper.has_paper_2;
    return hasBothPapers ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Complete
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <XCircle className="w-3 h-3 mr-1" />
        Partial
      </span>
    );
  };

    const handleView = (id: string): void => {
    console.log("My passing", id)
    router.push(`/admin/pastquestions/view/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Past Questions</h1>
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <button
                onClick={() => {/* Handle add new */}}
                className="w-full flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Paper
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => {/* Handle export */}}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
                <button
                  onClick={() => {/* Handle import */}}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Import
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Past Questions Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage exam papers and questions for different subjects and years
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => {/* Handle export */}}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => {/* Handle import */}}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
              <button
                onClick={() => {/* Navigate to create new */}}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Paper
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-5">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-3 lg:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
                  </div>
                  <div className="ml-3 lg:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Papers</dt>
                      <dd className="text-sm lg:text-lg font-medium text-gray-900">{stats.totalPastQuestions}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-3 lg:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <GraduationCap className="h-5 w-5 lg:h-6 lg:w-6 text-green-400" />
                  </div>
                  <div className="ml-3 lg:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Subjects</dt>
                      <dd className="text-sm lg:text-lg font-medium text-gray-900">{stats.totalSubjects}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-3 lg:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Eye className="h-5 w-5 lg:h-6 lg:w-6 text-purple-400" />
                  </div>
                  <div className="ml-3 lg:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Views</dt>
                      <dd className="text-sm lg:text-lg font-medium text-gray-900">{stats.totalUnlocks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-3 lg:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-orange-400" />
                  </div>
                  <div className="ml-3 lg:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs lg:text-sm font-medium text-gray-500 truncate">Years</dt>
                      <dd className="text-sm lg:text-lg font-medium text-gray-900">{availableYears.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-4 lg:p-6">
            <div className="space-y-4">
              {/* Search and Controls Row */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-9 lg:pl-10 pr-3 py-2 lg:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Search papers..."
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4 mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>

                  {/* View Mode Toggle - Hidden on mobile */}
                  <div className="hidden lg:flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => fetchPastQuestionPapers(filters)}
                    disabled={isLoading}
                    className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                      <select
                        value={filters.examType || ''}
                        onChange={(e) => handleFilterChange('examType', e.target.value)}
                        className="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      >
                        <option value="">All Types</option>
                        {examTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select
                        value={filters.subject || ''}
                        onChange={(e) => handleFilterChange('subject', e.target.value)}
                        className="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      >
                        <option value="">All Subjects</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.name}>{subject.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <select
                        value={filters.year || ''}
                        onChange={(e) => handleFilterChange('year', e.target.value ? Number(e.target.value) : null)}
                        className="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      >
                        <option value="">All Years</option>
                        {availableYears.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                      <select
                        value={filters.level || ''}
                        onChange={(e) => handleFilterChange('level', e.target.value)}
                        className="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      >
                        <option value="">All Levels</option>
                        <option value="JHS">JHS</option>
                        <option value="SHS">SHS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                      <select
                        value={filters.course || ''}
                        onChange={(e) => handleFilterChange('course', e.target.value)}
                        className="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      >
                        <option value="">All Courses</option>
                        {availableCourses.map((course) => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => setFilters({})}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 sm:px-6 lg:px-8 mt-4 lg:mt-6">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={clearError}
                    className="text-sm font-medium text-red-800 hover:text-red-600"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedPapers.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 mt-4 lg:mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <span className="text-sm text-blue-800">
                {selectedPapers.length} paper{selectedPapers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedPapers([])}
                  className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 mt-4 lg:mt-6 pb-8">
        {isLoading ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-12 text-center">
              <RefreshCw className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
              <p className="mt-2 text-sm text-gray-600">Loading past questions...</p>
            </div>
          </div>
        ) : pastQuestionPapers.length === 0 ? (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No past questions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first past question paper.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {/* Navigate to create new */}}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Past Question Paper
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {pastQuestionPapers.length} Papers
                  </span>
                  <button
                    onClick={selectAllPapers}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedPapers.length === pastQuestionPapers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {pastQuestionPapers.map((paper) => {
                  if (!paper.id) return null;
                  const isExpanded = expandedCards.includes(paper.id);
                  return (
                    <div key={paper.id} className="p-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedPapers.includes(paper.id)}
                          onChange={() => paper.id && togglePaperSelection(paper.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {paper.exam_type}
                                </span>{getStatusBadge(paper)}
                              </div>
                              <h3 className="mt-1 text-sm font-medium text-gray-900 truncate">
                                {paper.subject_name} - {paper.year}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {paper.level} • {paper.course} • {paper.questions_count} questions
                              </p>
                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                Updated {formatDate(paper.updated_at as string)}
                              </div>
                            </div>
                            <button
                              onClick={() => paper.id && toggleCardExpansion(paper.id)}
                              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-gray-500">Papers Available:</span>
                                  <div className="mt-1 space-y-1">
                                    <div className={`flex items-center ${paper.has_paper_1 ? 'text-green-600' : 'text-gray-400'}`}>
                                      {paper.has_paper_1 ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                      Paper 1
                                    </div>
                                    <div className={`flex items-center ${paper.has_paper_2 ? 'text-green-600' : 'text-gray-400'}`}>
                                      {paper.has_paper_2 ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                      Paper 2
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Coin Price:</span>
                                  <p className="mt-1 font-medium text-gray-900">{paper.coin_price} coins</p>
                                </div>
                              </div>

                              <div className="mt-4 flex space-x-2">
                                <button
                                  onClick={() => {/* Handle edit */}}
                                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => paper.id && handleDuplicate(paper.id)}
                                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Duplicate
                                </button>
                                <button
                                  onClick={() => paper.id && handleDelete(paper.id)}
                                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedPapers.length === pastQuestionPapers.length && pastQuestionPapers.length > 0}
                      onChange={selectAllPapers}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {pastQuestionPapers.length} Papers
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="updated_at">Updated</option>
                      <option value="subject_name">Subject</option>
                      <option value="year">Year</option>
                      <option value="exam_type">Exam Type</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                          <input
                            type="checkbox"
                            checked={selectedPapers.length === pastQuestionPapers.length && pastQuestionPapers.length > 0}
                            onChange={selectAllPapers}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject & Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Papers
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Questions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pastQuestionPapers.map((paper) => (
                        <tr key={paper.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={!!paper.id && selectedPapers.includes(paper.id)}
                              onChange={() => paper.id && togglePaperSelection(paper.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {paper.subject_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {paper.exam_type} • {paper.year} • {paper.level} • {paper.course}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                paper.has_paper_1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                P1
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                paper.has_paper_2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                P2
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {paper.questions_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {paper.coin_price} coins
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(paper.updated_at as string)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(paper)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => paper.id && handleView(paper.id)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                              onClick={() => paper.id && handleView(paper.id)}
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => paper.id && handleDuplicate(paper.id)}
                                className="text-gray-600 hover:text-gray-900 p-1"
                                title="Duplicate"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => paper.id && handleDelete(paper.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Grid View
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {pastQuestionPapers.map((paper) => (
                      <div key={paper.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <input
                              type="checkbox"
                              checked={!!paper.id && selectedPapers.includes(paper.id)}
                              onChange={() => paper.id && togglePaperSelection(paper.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex items-center space-x-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {paper.exam_type}
                              </span>
                              {getStatusBadge(paper)}
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {paper.subject_name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {paper.year} • {paper.level} • {paper.course}
                            </p>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Questions:</span>
                              <span className="font-medium text-gray-900">{paper.questions_count}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Price:</span>
                              <span className="font-medium text-gray-900">{paper.coin_price} coins</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Papers:</span>
                              <div className="flex space-x-1">
                                <span className={`w-2 h-2 rounded-full ${paper.has_paper_1 ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                                <span className={`w-2 h-2 rounded-full ${paper.has_paper_2 ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Updated {formatDate(paper.updated_at as string)}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex space-x-2">
                            <button
                              onClick={() => {/* Handle edit */}}
                              className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => paper.id && handleDuplicate(paper.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => paper.id && handleDelete(paper.id)}
                              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="mt-6 bg-white px-4 py-3 border border-gray-200 rounded-lg sm:px-6">
            <div className="flex-1 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{Math.min(pagination.limit, pagination.total)}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPastQuestionsPage;
