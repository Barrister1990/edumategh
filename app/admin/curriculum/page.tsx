"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CurriculumDocument, shsCourses, useAdminCurriculumStore } from "@/stores/curriculum";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit3,
    GraduationCap,
    Grid3X3,
    List,
    Search,
    Target,
    Trash2,
    Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CurriculumPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"all" | "KG" | "Basic" | "JHS" | "SHS">("all");
  const [selectedClass, setSelectedClass] = useState<"all" | "KG 1" | "KG 2" | "Basic 1" | "Basic 2" | "Basic 3" | "Basic 4" | "Basic 5" | "Basic 6" | "JHS 1" | "JHS 2" | "JHS 3" | "SHS 1" | "SHS 2" | "SHS 3">("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    documents,
    subjects,
    filters,
    pagination,
    isLoading,
    isLoadingSubjects,
    fetchDocuments,
    fetchSubjects,
    fetchDocumentById,
    deleteDocument,
    deleteManyDocuments,
    setFilters,
    clearFilters,
    setPage,
    setPageSize,
    getSubjectsForLevel,
    setSelectedDocument
  } = useAdminCurriculumStore();
  
  const router = useRouter();

  useEffect(() => {
    // Fetch initial data
    fetchDocuments();
    fetchSubjects();
  }, [fetchDocuments, fetchSubjects]);

  useEffect(() => {
    // Update store filters when local state changes
    const newFilters: any = {};
    
    if (selectedLevel !== "all") {
      newFilters.level = selectedLevel;
    }
    
    if (selectedClass !== "all") {
      newFilters.class = selectedClass;
    }
    
    if (selectedSubject !== "all") {
      newFilters.subject = selectedSubject;
    }
    
    if (selectedCourse !== "all") {
      newFilters.course = selectedCourse;
    }
    
    if (searchTerm) {
      newFilters.searchTerm = searchTerm;
    }

    setFilters(newFilters);
    // Clear selection when filters change
    setSelectedItems([]);
  }, [selectedLevel, selectedClass, selectedSubject, selectedCourse, searchTerm, setFilters]);

  useEffect(() => {
    // Fetch documents when filters change
    fetchDocuments();
  }, [filters, fetchDocuments]);

  // Get subjects for the selected level and course
  const availableSubjects = getSubjectsForLevel(
    selectedLevel === "all" ? undefined : selectedLevel,
    selectedCourse === "all" ? undefined : selectedCourse
  );

  const handleEditCurriculum = async (curriculumId: string) => {
    // Fetch the curriculum document and set it as selected
    const document = await fetchDocumentById(curriculumId);
    if (document) {
      setSelectedDocument(document);
      router.push(`/admin/curriculum/edit/${curriculumId}`);
    }
  };

  const handleViewCurriculum = async (curriculumId: string) => {
    // Fetch the curriculum document and set it as selected
    const document = await fetchDocumentById(curriculumId);
    if (document) {
      setSelectedDocument(document);
      router.push(`/admin/curriculum/edit/${curriculumId}`);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedLevel("all");
    setSelectedClass("all");
    setSelectedSubject("all");
    setSelectedCourse("all");
    clearFilters();
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  // Delete functionality
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === documents.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(documents.map(doc => doc.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    const confirmMessage = selectedItems.length === 1 
      ? `Are you sure you want to delete this curriculum document?`
      : `Are you sure you want to delete ${selectedItems.length} curriculum documents?`;
    
    if (!confirm(confirmMessage)) return;

    setIsDeleting(true);
    try {
      const success = await deleteManyDocuments(selectedItems);
      if (success) {
        setSelectedItems([]);
        // Refresh documents
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error deleting documents:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this curriculum document?')) return;
    
    try {
      const success = await deleteDocument(id);
      if (success) {
        // Refresh documents
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const CurriculumCard = ({ curriculum, index }: { curriculum: CurriculumDocument; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={selectedItems.includes(curriculum.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectItem(curriculum.id);
          }}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-lg" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1 min-w-0 ml-6">
          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md flex-shrink-0">
            <BookOpen className="h-3 w-3 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate cursor-pointer"
                onClick={() => handleViewCurriculum(curriculum.id)}>
              {curriculum.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {curriculum.class} • {curriculum.subject}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCurriculum(curriculum.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-6 w-6 hover:bg-purple-100 dark:hover:bg-purple-900/30"
          >
            <Edit3 className="h-3 w-3 text-purple-600 dark:text-purple-400" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSingle(curriculum.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-3 w-3 text-purple-500" />
          </div>
        </div>
      </div>



      {/* Tags and Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            <GraduationCap className="h-2 w-2 mr-1" />
            {curriculum.class}
          </span>
          {curriculum.course && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <Target className="h-2 w-2 mr-1" />
              {curriculum.course}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              <Users className="h-2 w-2 mr-1" />
              {Math.floor(Math.random() * 50) + 10}
            </span>
            <span className="flex items-center">
              <Clock className="h-2 w-2 mr-1" />
              {Math.floor(Math.random() * 20) + 5}h
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-2 w-2 mr-1" />
            {new Date(curriculum.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.floor(Math.random() * 40) + 60}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
          />
        </div>
      </div>
    </motion.div>
  );

  const CurriculumListItem = ({ curriculum, index }: { curriculum: CurriculumDocument; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Selection Checkbox */}
          <input
            type="checkbox"
            checked={selectedItems.includes(curriculum.id)}
            onChange={(e) => {
              e.stopPropagation();
              handleSelectItem(curriculum.id);
            }}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex-shrink-0">
            <BookOpen className="h-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate cursor-pointer"
                    onClick={() => handleViewCurriculum(curriculum.id)}>
                  {curriculum.title}
                </h3>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                <span className="hidden sm:flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {Math.floor(Math.random() * 50) + 10}
                </span>
                <span className="hidden sm:flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.floor(Math.random() * 20) + 5}h
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCurriculum(curriculum.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-6 w-6 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <Edit3 className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSingle(curriculum.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <ArrowRight className="h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {curriculum.class}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {curriculum.subject}
              </span>
              {curriculum.course && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {curriculum.course}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4 p-3 sm:p-6 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Curriculum Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1 sm:mt-2">
            Explore and manage your educational curricula
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search curricula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-auto"
              />
            </div>
            
            <div className="grid grid-cols-2 sm:flex gap-2">
              <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as any)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="JHS">JHS</SelectItem>
                  <SelectItem value="SHS">SHS</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value as any)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="KG 1">KG 1</SelectItem>
                  <SelectItem value="KG 2">KG 2</SelectItem>
                  <SelectItem value="Basic 1">Basic 1</SelectItem>
                  <SelectItem value="Basic 2">Basic 2</SelectItem>
                  <SelectItem value="Basic 3">Basic 3</SelectItem>
                  <SelectItem value="Basic 4">Basic 4</SelectItem>
                  <SelectItem value="Basic 5">Basic 5</SelectItem>
                  <SelectItem value="Basic 6">Basic 6</SelectItem>
                  <SelectItem value="JHS 1">JHS 1</SelectItem>
                  <SelectItem value="JHS 2">JHS 2</SelectItem>
                  <SelectItem value="JHS 3">JHS 3</SelectItem>
                  <SelectItem value="SHS 1">SHS 1</SelectItem>
                  <SelectItem value="SHS 2">SHS 2</SelectItem>
                  <SelectItem value="SHS 3">SHS 3</SelectItem>
                </SelectContent>
              </Select>

              {selectedLevel === "SHS" && (
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="h-9 text-sm col-span-2 sm:col-span-1">
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {shsCourses.map((course) => (
                      <SelectItem key={course} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={isLoadingSubjects}>
                <SelectTrigger className="h-9 text-sm col-span-2 sm:col-span-1">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* View Toggle - Hidden on mobile */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Select All Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedItems.length === documents.length && documents.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Select All
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Select All - Visible on mobile */}
          <div className="sm:hidden flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.length === documents.length && documents.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Select All
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count and pagination info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {documents.length} of {pagination.totalCount} curricula 
          </span>
          {Object.keys(filters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-purple-600 hover:text-purple-700 text-sm self-start sm:self-auto"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.length === documents.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                  className="text-blue-700 border-blue-300 hover:bg-blue-50"
                >
                  Clear Selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40 sm:h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-purple-200 dark:border-purple-900"></div>
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-transparent border-t-purple-600 absolute top-0"></div>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 sm:py-16"
        >
          <div className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No curricula found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base px-4">
            {Object.keys(filters).length > 0
              ? "Try adjusting your search criteria or filters."
              : "There are no curricula available at the moment."}
          </p>
        </motion.div>
      ) : (
        <>
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
              : "space-y-3 sm:space-y-4"
          }>
            {documents.map((curriculum, index) => 
              viewMode === "grid" ? (
                <CurriculumCard key={curriculum.id} curriculum={curriculum} index={index} />
              ) : (
                <CurriculumListItem key={curriculum.id} curriculum={curriculum} index={index} />
              )
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Items per page:</span>
                <Select value={pagination.pageSize.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="h-8 px-2 sm:px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="h-8 px-2 sm:px-3"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}