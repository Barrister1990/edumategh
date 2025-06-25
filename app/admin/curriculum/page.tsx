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
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CurriculumPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"all" | "JHS" | "SHS">("all");
  const [selectedClass, setSelectedClass] = useState<"all" | "1" | "2" | "3">("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
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

  const CurriculumCard = ({ curriculum, index }: { curriculum: CurriculumDocument; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={() => handleViewCurriculum(curriculum.id)}
    >
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-2xl" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {curriculum.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {curriculum.class} • {curriculum.subject}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCurriculum(curriculum.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 h-8 w-8 hover:bg-purple-100 dark:hover:bg-purple-900/30"
          >
            <Edit3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </Button>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-5 w-5 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3">
        {curriculum.description}
      </p>

      {/* Tags and Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            <GraduationCap className="h-3 w-3 mr-1" />
            {curriculum.class}
          </span>
          {curriculum.course && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <Target className="h-3 w-3 mr-1" />
              {curriculum.course}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {Math.floor(Math.random() * 50) + 10} Students
            </span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {Math.floor(Math.random() * 20) + 5}h Duration
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(curriculum.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.floor(Math.random() * 40) + 60}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
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
      className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => handleViewCurriculum(curriculum.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {curriculum.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 max-w-2xl">
                  {curriculum.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {Math.floor(Math.random() * 50) + 10}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(Math.random() * 20) + 5}h
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCurriculum(curriculum.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 h-8 w-8 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <Edit3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </Button>
                <ArrowRight className="h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {curriculum.class}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {curriculum.subject}
              </span>
              {curriculum.course && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Curriculum Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Explore and manage your educational curricula
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1 max-w-4xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search curricula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="JHS">JHS</SelectItem>
                  <SelectItem value="SHS">SHS</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="1">Class 1</SelectItem>
                  <SelectItem value="2">Class 2</SelectItem>
                  <SelectItem value="3">Class 3</SelectItem>
                </SelectContent>
              </Select>

              {selectedLevel === "SHS" && (
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-40">
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
                <SelectTrigger className="w-40">
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

          {/* View Toggle */}
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

        {/* Results count and pagination info */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {documents.length} of {pagination.totalCount} curricula 
            (Page {pagination.currentPage} of {pagination.totalPages})
          </span>
          {Object.keys(filters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-purple-600 hover:text-purple-700"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 dark:border-purple-900"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-purple-600 absolute top-0"></div>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No curricula found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {Object.keys(filters).length > 0
              ? "Try adjusting your search criteria or filters."
              : "There are no curricula available at the moment."}
          </p>
        </motion.div>
      ) : (
        <>
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Items per page:</span>
                <Select value={pagination.pageSize.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
                  <SelectTrigger className="w-20">
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

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10"
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
                >
                  Next
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