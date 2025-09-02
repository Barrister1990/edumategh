"use client";
import { AdminTextbook, useAdminTextbookStore, useBulkTextbookOperations } from '@/stores/useTexbookStore';
import {
    AlertCircle,
    BookOpen,
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Copy,
    Edit3,
    Eye,
    Filter,
    GraduationCap,
    RefreshCw,
    Search,
    Trash2,
    User,
    X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Type definitions
interface Textbook {
  id: string; // Changed from string | number to string for consistency
  title: string;
  description: string;
  author: string;
  publisher: string;
  year: string;
  subject: string;
  level: string;
  class: string;
  course?: string;
  cover_url?: string | null;
  pdf_url: string;
  created_at: string;
  updated_at: string;
}

interface Filters {
  search?: string;
  level?: string;
  class?: string;
  subject?: string;
}

const AdminTextbooksPage: React.FC = () => {
  const {
    textbooks,
    isLoading,
    error,
    filters,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    selectedTextbook,
    fetchTextbooks,
    setFilters,
    clearFilters,
    setCurrentPage,
    setItemsPerPage,
    setSelectedTextbook,
    deleteTextbook,
    duplicateTextbook,
    clearError
  } = useAdminTextbookStore();

  const { bulkDelete } = useBulkTextbookOperations();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set()); // Changed from Set<string | number>
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(null);

  // Fetch textbooks on component mount
  useEffect(() => {
    fetchTextbooks(1);
  }, [fetchTextbooks]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchTerm || undefined });
      fetchTextbooks(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setFilters, fetchTextbooks]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters({ [key]: value || undefined });
    fetchTextbooks(1);
  }, [setFilters, fetchTextbooks]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchTextbooks(page);
  }, [setCurrentPage, fetchTextbooks]);

  // Handle item selection
const toggleSelectItem = useCallback((id: string) => { // Changed from string | number
  const newSelected = new Set(selectedItems);
  if (newSelected.has(id)) {
    newSelected.delete(id);
  } else {
    newSelected.add(id);
  }
  setSelectedItems(newSelected);
}, [selectedItems]);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.size === textbooks.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(textbooks.map((book: AdminTextbook) => book.id)));
    }
  }, [selectedItems.size, textbooks]);

  // Handle actions
 const handleViewDetails = useCallback((textbook: AdminTextbook) => {
    setSelectedTextbook(textbook);
    setShowViewModal(true);
  }, [setSelectedTextbook]);

const handleDelete = useCallback(async (id: string) => { // Changed from string | number
  if (window.confirm('Are you sure you want to delete this textbook?')) {
    await deleteTextbook(id);
  }
}, [deleteTextbook]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedItems.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} textbook(s)?`)) {
      await bulkDelete(Array.from(selectedItems));
      setSelectedItems(new Set());
    }
  }, [selectedItems, bulkDelete]);

const handleDuplicate = useCallback(async (id: string) => { // Changed from string | number
  await duplicateTextbook(id);
}, [duplicateTextbook]);

  // Get level badge color
  const getLevelBadgeColor = useCallback((level: string): string => {
    switch (level) {
      case 'KG':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Basic':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'JHS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHS':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchTextbooks(currentPage);
  }, [fetchTextbooks, currentPage]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    clearFilters();
    setSearchTerm('');
  }, [clearFilters]);

  // Calculate pagination range
  const getPaginationRange = useCallback((): number[] => {
    const range: number[] = [];
    const maxPages = Math.min(5, totalPages);
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxPages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                Textbook Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your educational textbooks collection</p>
            </div>
           
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
              <div className="text-sm text-gray-600">Total Textbooks</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-yellow-600">
                {textbooks.filter((b: AdminTextbook) => b.level === 'KG').length}
              </div>
              <div className="text-sm text-gray-600">KG Textbooks</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">
                {textbooks.filter((b: AdminTextbook) => b.level === 'Basic').length}
              </div>
              <div className="text-sm text-gray-600">Basic Textbooks</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">
                {textbooks.filter((b: AdminTextbook) => b.level === 'JHS').length}
              </div>
              <div className="text-sm text-gray-600">JHS Textbooks</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">
                {textbooks.filter((b: AdminTextbook) => b.level === 'SHS').length}
              </div>
              <div className="text-sm text-gray-600">SHS Textbooks</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-indigo-600">{selectedItems.size}</div>
              <div className="text-sm text-gray-600">Selected Items</div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 flex-1">{error}</p>
            <button 
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search textbooks..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {selectedItems.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedItems.size})
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  showFilters 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                type="button"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                type="button"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.level || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    handleFilterChange('level', e.target.value)
                  }
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="KG">KG</option>
                  <option value="Basic">Basic</option>
                  <option value="JHS">JHS</option>
                  <option value="SHS">SHS</option>
                </select>
                <select
                  value={filters.class || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    handleFilterChange('class', e.target.value)
                  }
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Classes</option>
                  <option value="KG 1">KG 1</option>
                  <option value="KG 2">KG 2</option>
                  <option value="Basic 1">Basic 1</option>
                  <option value="Basic 2">Basic 2</option>
                  <option value="Basic 3">Basic 3</option>
                  <option value="Basic 4">Basic 4</option>
                  <option value="Basic 5">Basic 5</option>
                  <option value="Basic 6">Basic 6</option>
                  <option value="JHS 1">JHS 1</option>
                  <option value="JHS 2">JHS 2</option>
                  <option value="JHS 3">JHS 3</option>
                  <option value="SHS 1">SHS 1</option>
                  <option value="SHS 2">SHS 2</option>
                  <option value="SHS 3">SHS 3</option>
                </select>
                <input
                  type="text"
                  placeholder="Subject"
                  value={filters.subject || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleFilterChange('subject', e.target.value)
                  }
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  type="button"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Textbooks Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedItems.size === textbooks.length && textbooks.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedItems.size > 0 ? `${selectedItems.size} selected` : 'Select all'}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Loading textbooks...</span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && textbooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No textbooks found</h3>
              <p className="text-gray-500">Get started by adding your first textbook</p>
            </div>
          )}

          {/* Textbooks List */}
          {!isLoading && textbooks.length > 0 && (
            <div className="divide-y divide-gray-200">
              {textbooks.map((textbook: AdminTextbook) => (
                <div key={textbook.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.has(textbook.id)}
                      onChange={() => toggleSelectItem(textbook.id)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mt-1"
                    />

                    {/* Cover Image */}
                    <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={textbook.cover_url || 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg'}
                        alt={textbook.title}
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {textbook.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {textbook.description}
                          </p>
                          
                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {textbook.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {textbook.publisher}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {textbook.year}
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              {textbook.subject}
                            </div>
                          </div>
                        </div>

                        {/* Badges and Actions */}
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelBadgeColor(textbook.level)}`}>
                              {textbook.level} Class {textbook.class}
                            </span>
                            {textbook.course && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                {textbook.course}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewDetails(textbook)}
                              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="View Details"
                              type="button"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                              type="button"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(textbook.id)}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Duplicate"
                              type="button"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(textbook.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                              type="button"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {getPaginationRange().map((page: number) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      type="button"
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {showViewModal && selectedTextbook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Textbook Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-6 mb-6">
                <img
                  src={selectedTextbook.cover_url || 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg'}
                  alt={selectedTextbook.title}
                  className="w-24 h-32 object-cover rounded-lg"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTextbook.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedTextbook.description}</p>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelBadgeColor(selectedTextbook.level)}`}>
                      {selectedTextbook.level} Class {selectedTextbook.class}
                    </span>
                    {selectedTextbook.course && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {selectedTextbook.course}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Author</label>
                  <p className="text-gray-900">{selectedTextbook.author}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Publisher</label>
                  <p className="text-gray-900">{selectedTextbook.publisher}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Year</label>
                  <p className="text-gray-900">{selectedTextbook.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subject</label>
                  <p className="text-gray-900">{selectedTextbook.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{new Date(selectedTextbook.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Updated</label>
                  <p className="text-gray-900">{new Date(selectedTextbook.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <a
                    href={selectedTextbook.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    View PDF
                  </a>
                  <button 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    type="button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDuplicate(selectedTextbook.id)}
                    className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    type="button"
                  >
                    Duplicate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTextbooksPage;