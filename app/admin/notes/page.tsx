"use client";

import { LessonNote, useAdminLessonNoteStore } from '@/stores/lessonNote';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Eye, FileText, Filter, Grid, List, MoreVertical, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LessonNoteCardProps {
  note: LessonNote;
}

interface LessonNoteRowProps {
  note: LessonNote;
}

const LessonNotesList = () => {
  const {
    lessonNotes,
    totalCount,
    currentPage,
    pageSize,
    isLoading,
    isDeleting,
    error,
    filters,
    fetchLessonNotes,
    deleteLessonNote,
    setFilters,
    clearFilters,
    setCurrentPage,
    setPageSize,
    clearError
  } = useAdminLessonNoteStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchLessonNotes(currentPage, pageSize);
  }, [currentPage, pageSize, filters, fetchLessonNotes]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, setFilters]);

  const handleSelectNote = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleSelectAll = () => {
    setSelectedNotes(
      selectedNotes.length === lessonNotes.length 
        ? [] 
        : lessonNotes.map(note => note.id!).filter(Boolean)
    );
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson note?')) {
      await deleteLessonNote(noteId);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const LessonNoteCard: React.FC<LessonNoteCardProps> = ({ note }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group overflow-hidden">
      <div className="relative">
        <img 
          src={note.thumbnailUrl} 
          alt={note.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {note.level} {note.class}
          </span>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-1">
            <button className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-colors">
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
            <button 
              onClick={() => note.id && handleDeleteNote(note.id)}
              className="bg-white/90 hover:bg-red-50 p-1.5 rounded-full shadow-md transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
            {note.title}
          </h3>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {note.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen className="w-4 h-4" />
            <span>{note.subject}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span className="truncate">{note.strand}</span>
          </div>
          {note.course && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{note.course}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={note.id ? selectedNotes.includes(note.id) : false}
              onChange={() => note.id && handleSelectNote(note.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const LessonNoteRow: React.FC<LessonNoteRowProps> = ({ note }) => (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex items-center p-4 gap-4">
        <input
          type="checkbox"
          checked={note.id ? selectedNotes.includes(note.id) : false}
          onChange={() => note.id && handleSelectNote(note.id)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        
        <img 
          src={note.thumbnailUrl} 
          alt={note.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate pr-4">
                {note.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                {note.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {note.level} {note.class}
                </span>
                <span>{note.subject}</span>
                {note.course && <span>{note.course}</span>}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={() => note.id && handleDeleteNote(note.id)}
                className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Lesson Notes</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={clearError}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lesson Notes</h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalCount} total notes
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search lesson notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selection Bar */}
        {selectedNotes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedNotes.length === lessonNotes.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-900">
                  {selectedNotes.length} of {lessonNotes.length} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Delete Selected
                </button>
                <button 
                  onClick={() => setSelectedNotes([])}
                  className="text-blue-700 hover:text-blue-800 px-4 py-2 text-sm font-medium"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : lessonNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No lesson notes found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first lesson note.</p>
          </div>
        ) : (
          <>
            {/* Notes Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lessonNotes.map((note) => (
                  <LessonNoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {lessonNotes.map((note) => (
                  <LessonNoteRow key={note.id} note={note} />
                ))}
              </div>
            )}

       

{/* Pagination */}
{totalPages > 1 && (
  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
    <div className="text-sm text-gray-600">
      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
    </div>
    
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      
      <div className="flex items-center gap-1">
        {(() => {
          const maxVisiblePages = 5;
          const halfVisible = Math.floor(maxVisiblePages / 2);
          
          let startPage = Math.max(1, currentPage - halfVisible);
          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
          
          // Adjust start page if we're near the end
          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }
          
          const pageNumbers = [];
          for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
          }
          
          return pageNumbers.map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                pageNum === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          ));
        })()}
      </div>
      
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
)}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonNotesList;