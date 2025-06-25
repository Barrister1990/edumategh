"use client";

import { useCurriculumStore } from '@/stores/curriculumStrand';
import { BookOpen, ChevronDown, FileText, Filter, Layers, Search, Target, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// SHS Courses from your store
const shsCourses = [
  'Core Subject',
  'General Science',
  'General Arts',
  'Business',
  'Home Economics',
  'Visual Arts',
  'Agricultural Science',
  'Technical'
];

const GESCurriculumPage = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [levelFilter, setLevelFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [strandFilter, setStrandFilter] = useState('all');
  const [substrandFilter, setSubstrandFilter] = useState('all');
  const [contentStandardFilter, setContentStandardFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  // Get store data and functions
  const {
    subjects, strands, subStrands, contentStandards, indicators,
    isLoadingSubjects, isLoadingStrands, isLoadingSubStrands, isLoadingContentStandards, isLoadingIndicators,
    subjectsError, strandsError, subStrandsError, contentStandardsError, indicatorsError,
    fetchAllSubjects, fetchSubjects, fetchStrands, fetchSubStrands, fetchContentStandards, fetchIndicators,
    clearAllErrors
  } = useCurriculumStore();

  // Fetch initial data on component mount
  useEffect(() => {
    clearAllErrors();
    fetchAllSubjects();
  }, []);

  // Fetch subjects when level or course filter changes
  useEffect(() => {
    if (levelFilter === 'all') {
      fetchAllSubjects();
    } else if (levelFilter === 'JHS') {
      fetchSubjects('JHS');
    } else if (levelFilter === 'SHS') {
      if (courseFilter !== 'all') {
        fetchSubjects('SHS', courseFilter);
      } else {
        fetchSubjects('SHS');
      }
    }
  }, [levelFilter, courseFilter]);

  // Fetch strands when subject filter changes
  useEffect(() => {
    if (subjectFilter !== 'all') {
      const selectedSubject = subjects.find(s => s.id === subjectFilter);
      if (selectedSubject) {
        const classLevel = classFilter !== 'all' ? classFilter.split(' ')[1] : '1';
        fetchStrands(
          subjectFilter, 
          selectedSubject.level, 
          classLevel, 
          selectedSubject.course || undefined
        );
      }
    }
  }, [subjectFilter, classFilter, subjects]);

  // Fetch sub-strands when strand filter changes
  useEffect(() => {
    if (strandFilter !== 'all') {
      fetchSubStrands(strandFilter);
    }
  }, [strandFilter]);

  // Fetch content standards when sub-strand filter changes
  useEffect(() => {
    if (substrandFilter !== 'all') {
      fetchContentStandards(substrandFilter);
    }
  }, [substrandFilter]);

  // Fetch indicators when content standard filter changes
  useEffect(() => {
    if (contentStandardFilter !== 'all') {
      fetchIndicators(contentStandardFilter);
    }
  }, [contentStandardFilter]);

  const levels = ['all', 'JHS', 'SHS'] as const;
  const courses = ['all', ...shsCourses] as const;
  const classes = ['all', 'JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3'] as const;

  // RELATIONAL FILTERING - Using IDs to create proper hierarchical relationships
  const filteredData = useMemo(() => {
    // Step 1: Filter subjects based on level and course
    let filteredSubjects = subjects;
    if (levelFilter !== 'all') {
      filteredSubjects = subjects.filter(subject => subject.level === levelFilter);
      
      // If SHS is selected and course filter is applied
      if (levelFilter === 'SHS' && courseFilter !== 'all') {
        filteredSubjects = filteredSubjects.filter(subject => subject.course === courseFilter);
      }
    }

    // Step 2: Filter strands based on selected subject(s) and class
    let filteredStrands = strands;
    let relevantSubjectIds = new Set<string>();
    
    if (subjectFilter !== 'all') {
      // Single subject selected
      relevantSubjectIds.add(subjectFilter);
      filteredStrands = strands.filter(strand => strand.subjectId === subjectFilter);
    } else {
      // Use all filtered subjects
      relevantSubjectIds = new Set(filteredSubjects.map(s => s.id));
      filteredStrands = strands.filter(strand => relevantSubjectIds.has(strand.subjectId));
    }

    // Apply class filter to strands
    if (classFilter !== 'all') {
      filteredStrands = filteredStrands.filter(strand => strand.class === classFilter);
    }

    // Step 3: Filter sub-strands based on selected strand(s)
    let filteredSubstrands = subStrands;
    let relevantStrandIds = new Set<string>();
    
    if (strandFilter !== 'all') {
      // Single strand selected
      relevantStrandIds.add(strandFilter);
      filteredSubstrands = subStrands.filter(substrand => substrand.strandId === strandFilter);
    } else {
      // Use all filtered strands
      relevantStrandIds = new Set(filteredStrands.map(s => s.id));
      filteredSubstrands = subStrands.filter(substrand => relevantStrandIds.has(substrand.strandId));
    }

    // Step 4: Filter content standards based on selected sub-strand(s)
    let filteredContentStandards = contentStandards;
    let relevantSubstrandIds = new Set<string>();
    
    if (substrandFilter !== 'all') {
      // Single sub-strand selected
      relevantSubstrandIds.add(substrandFilter);
      filteredContentStandards = contentStandards.filter(cs => cs.subStrandId === substrandFilter);
    } else {
      // Use all filtered sub-strands
      relevantSubstrandIds = new Set(filteredSubstrands.map(s => s.id));
      filteredContentStandards = contentStandards.filter(cs => relevantSubstrandIds.has(cs.subStrandId));
    }

    // Step 5: Filter indicators based on selected content standard(s)
    let filteredIndicators = indicators;
    let relevantContentStandardIds = new Set<string>();
    
    if (contentStandardFilter !== 'all') {
      // Single content standard selected
      relevantContentStandardIds.add(contentStandardFilter);
      filteredIndicators = indicators.filter(indicator => indicator.contentStandardId === contentStandardFilter);
    } else {
      // Use all filtered content standards
      relevantContentStandardIds = new Set(filteredContentStandards.map(cs => cs.id));
      filteredIndicators = indicators.filter(indicator => relevantContentStandardIds.has(indicator.contentStandardId));
    }

    // Step 6: Apply search filter to all data types
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredSubjects = filteredSubjects.filter(item => item.name.toLowerCase().includes(query));
      filteredStrands = filteredStrands.filter(item => item.name.toLowerCase().includes(query));
      filteredSubstrands = filteredSubstrands.filter(item => item.name.toLowerCase().includes(query));
      filteredContentStandards = filteredContentStandards.filter(item => item.name.toLowerCase().includes(query));
      filteredIndicators = filteredIndicators.filter(item => item.name.toLowerCase().includes(query));
    }

    return {
      subjects: filteredSubjects,
      strands: filteredStrands,
      substrands: filteredSubstrands,
      contentStandards: filteredContentStandards,
      indicators: filteredIndicators
    };
  }, [
    subjects, strands, subStrands, contentStandards, indicators,
    levelFilter, courseFilter, subjectFilter, strandFilter, 
    substrandFilter, contentStandardFilter, classFilter, searchQuery
  ]);

  // Available options for dropdowns based on filtered data
  const availableSubjects = useMemo(() => 
    filteredData.subjects.map(subject => ({ id: subject.id, name: subject.name })),
    [filteredData.subjects]
  );

  const availableStrands = useMemo(() => {
    let strandsToShow = strands;
    
    // Filter strands based on selected subjects
    if (subjectFilter !== 'all') {
      strandsToShow = strands.filter(strand => strand.subjectId === subjectFilter);
    } else {
      // Show strands for all currently filtered subjects
      const subjectIds = new Set(filteredData.subjects.map(s => s.id));
      strandsToShow = strands.filter(strand => subjectIds.has(strand.subjectId));
    }
    
    // Apply class filter
    if (classFilter !== 'all') {
      strandsToShow = strandsToShow.filter(strand => strand.class === classFilter);
    }
    
    return strandsToShow.map(strand => ({ id: strand.id, name: strand.name }));
  }, [strands, filteredData.subjects, subjectFilter, classFilter]);

  const availableSubstrands = useMemo(() => {
    let substrandsToShow = subStrands;
    
    if (strandFilter !== 'all') {
      substrandsToShow = subStrands.filter(substrand => substrand.strandId === strandFilter);
    } else {
      // Show sub-strands for all currently available strands
      const strandIds = new Set(availableStrands.map(s => s.id));
      substrandsToShow = subStrands.filter(substrand => strandIds.has(substrand.strandId));
    }
    
    return substrandsToShow.map(substrand => ({ id: substrand.id, name: substrand.name }));
  }, [subStrands, availableStrands, strandFilter]);

  const availableContentStandards = useMemo(() => {
    let contentStandardsToShow = contentStandards;
    
    if (substrandFilter !== 'all') {
      contentStandardsToShow = contentStandards.filter(cs => cs.subStrandId === substrandFilter);
    } else {
      // Show content standards for all currently available sub-strands
      const substrandIds = new Set(availableSubstrands.map(s => s.id));
      contentStandardsToShow = contentStandards.filter(cs => substrandIds.has(cs.subStrandId));
    }
    
    return contentStandardsToShow.map(cs => ({ id: cs.id, name: cs.name }));
  }, [contentStandards, availableSubstrands, substrandFilter]);

  // Reset dependent filters when parent filter changes
  const handleLevelFilterChange = (level: string) => {
    setLevelFilter(level);
    if (level !== 'SHS') {
      setCourseFilter('all');
    }
    setSubjectFilter('all');
    setStrandFilter('all');
    setSubstrandFilter('all');
    setContentStandardFilter('all');
  };

  const handleCourseFilterChange = (course: string) => {
    setCourseFilter(course);
    setSubjectFilter('all');
    setStrandFilter('all');
    setSubstrandFilter('all');
    setContentStandardFilter('all');
  };

  const handleSubjectFilterChange = (subjectId: string) => {
    setSubjectFilter(subjectId);
    setStrandFilter('all');
    setSubstrandFilter('all');
    setContentStandardFilter('all');
  };

  const handleStrandFilterChange = (strandId: string) => {
    setStrandFilter(strandId);
    setSubstrandFilter('all');
    setContentStandardFilter('all');
  };

  const handleSubstrandFilterChange = (substrandId: string) => {
    setSubstrandFilter(substrandId);
    setContentStandardFilter('all');
  };

  const handleClassFilterChange = (classValue: string) => {
    setClassFilter(classValue);
    // Reset strand and below since class affects strand filtering
    setStrandFilter('all');
    setSubstrandFilter('all');
    setContentStandardFilter('all');
  };

  const clearAllFilters = () => {
    setLevelFilter('all');
    setCourseFilter('all');
    setSubjectFilter('all');
    setStrandFilter('all');
    setSubstrandFilter('all');
    setContentStandardFilter('all');
    setClassFilter('all');
    setSearchQuery('');
  };

  const isLoading = isLoadingSubjects || isLoadingStrands || isLoadingSubStrands || 
                   isLoadingContentStandards || isLoadingIndicators;

  const hasError = subjectsError || strandsError || subStrandsError || 
                  contentStandardsError || indicatorsError;

  const tabs = [
    { key: 'subjects', label: 'Subjects', count: filteredData.subjects.length, icon: BookOpen, color: 'blue' },
    { key: 'strands', label: 'Strands', count: filteredData.strands.length, icon: Layers, color: 'emerald' },
    { key: 'substrands', label: 'Sub-strands', count: filteredData.substrands.length, icon: Target, color: 'purple' },
    { key: 'contentStandards', label: 'Content Standards', count: filteredData.contentStandards.length, icon: FileText, color: 'orange' },
    { key: 'indicators', label: 'Indicators', count: filteredData.indicators.length, icon: Users, color: 'pink' },
  ];

  const activeFilter = tabs.find(tab => tab.key === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {tabs.map((tab) => (
            <div key={tab.key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1" onClick={() => setActiveTab(tab.key)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{tab.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{tab.count}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${tab.color}-100`}>
                  <tab.icon className={`h-6 w-6 text-${tab.color}-600`} />
                </div>
              </div>
              <div className={`mt-4 h-1 rounded-full bg-${tab.color}-200`}>
                <div className={`h-1 rounded-full bg-${tab.color}-500 transition-all duration-300`} style={{ width: activeTab === tab.key ? '100%' : '60%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search curriculum content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={clearAllFilters}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={levelFilter}
                    onChange={(e) => handleLevelFilterChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>
                        {level === 'all' ? 'All Levels' : level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Filter */}
                {levelFilter === 'SHS' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    <select
                      value={courseFilter}
                      onChange={(e) => handleCourseFilterChange(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {courses.map(course => (
                        <option key={course} value={course}>
                          {course === 'all' ? 'All Courses' : course}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Class Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={classFilter}
                    onChange={(e) => handleClassFilterChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>
                        {cls === 'all' ? 'All Classes' : cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={subjectFilter}
                    onChange={(e) => handleSubjectFilterChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
                    disabled={availableSubjects.length === 0}
                  >
                    <option value="all">All Subjects</option>
                    {availableSubjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Strand</label>
                  <select
                    value={strandFilter}
                    onChange={(e) => handleStrandFilterChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
                    disabled={availableStrands.length === 0}
                  >
                    <option value="all">All Strands</option>
                    {availableStrands.map(strand => (
                      <option key={strand.id} value={strand.id}>
                        {strand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-strand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-strand</label>
                  <select
                    value={substrandFilter}
                    onChange={(e) => handleSubstrandFilterChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
                    disabled={availableSubstrands.length === 0}
                  >
                    <option value="all">All Sub-strands</option>
                    {availableSubstrands.map(substrand => (
                      <option key={substrand.id} value={substrand.id}>
                        {substrand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content Standard Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Standard</label>
                  <select
                    value={contentStandardFilter}
                    onChange={(e) => setContentStandardFilter(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
                    disabled={availableContentStandards.length === 0}
                  >
                    <option value="all">All Content Standards</option>
                    {availableContentStandards.map(cs => (
                      <option key={cs.id} value={cs.id}>
                        {cs.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {hasError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <h3 className="text-red-800 font-medium mb-2">Error Loading Data</h3>
            <div className="text-red-700 text-sm space-y-1">
              {subjectsError && <p>Subjects: {subjectsError}</p>}
              {strandsError && <p>Strands: {strandsError}</p>}
              {subStrandsError && <p>Sub-strands: {subStrandsError}</p>}
              {contentStandardsError && <p>Content Standards: {contentStandardsError}</p>}
              {indicatorsError && <p>Indicators: {indicatorsError}</p>}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-blue-800 font-medium">Loading curriculum data...</span>
            </div>
          </div>
        )}

        {/* Content Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Tab Header */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {activeFilter && (
                  <>
                    <div className={`p-2 rounded-lg bg-${activeFilter.color}-100`}>
                      <activeFilter.icon className={`h-5 w-5 text-${activeFilter.color}-600`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{activeFilter.label}</h2>
                      <p className="text-sm text-gray-500">{activeFilter.count} items found</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'subjects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.subjects.map(subject => (
                  <div key={subject.id} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${subject.level === 'JHS' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                        {subject.level}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{subject.name}</h3>
                    {subject.course && (
                      <p className="text-sm text-blue-600 font-medium">{subject.course}</p>
                    )}
                  </div>
                ))}
                {filteredData.subjects.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No subjects found with current filters</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'strands' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.strands.map(strand => (
                  <div key={strand.id} className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <Layers className="h-6 w-6 text-emerald-600" />
                      <div className="flex space-x-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {strand.level}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {strand.class}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{strand.name}</h3>
                    <p className="text-emerald-700 text-sm font-medium mb-1">Subject: {strand.subject}</p>
                    {strand.course && <p className="text-emerald-600 text-sm">Course: {strand.course}</p>}
                  </div>
                ))}
                {filteredData.strands.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No strands found with current filters</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'substrands' && (
              <div className="space-y-4">
                {filteredData.substrands.map(substrand => (
                  <div key={substrand.id} className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <Target className="h-6 w-6 text-purple-600" />
                      {/* Removed level and class badges since substrands don't have these properties */}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">{substrand.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-purple-700">Strand:</span>
                        <p className="text-gray-600">{substrand.strand}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700">Subject:</span>
                        <p className="text-gray-600">{substrand.subject}</p>
                      </div>
                      {/* Removed course section since substrands don't have course property */}
                    </div>
                  </div>
                ))}
                {filteredData.substrands.length === 0 && (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No sub-strands found with current filters</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contentStandards' && (
              <div className="space-y-4">
                {filteredData.contentStandards.map(cs => (
                  <div key={cs.id} className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <FileText className="h-6 w-6 text-orange-600" />
                     
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">{cs.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                     
                      <div>
                        <span className="font-medium text-orange-700">Strand:</span>
                        <p className="text-gray-600">{cs.strand}</p>
                      </div>
                      <div>
                        <span className="font-medium text-orange-700">Subject:</span>
                        <p className="text-gray-600">{cs.subject}</p>
                      </div>
                    
                    </div>
                  </div>
                ))}
                {filteredData.contentStandards.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No content standards found with current filters</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'indicators' && (
              <div className="space-y-4">
                {filteredData.indicators.map(indicator => (
                  <div key={indicator.id} className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <Users className="h-6 w-6 text-pink-600" />
                     
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">{indicator.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-pink-700">Content Standard:</span>
                        <p className="text-gray-600">{indicator.contentStandard}</p>
                      </div>
                      <div>
                        <span className="font-medium text-pink-700">Sub-strand:</span>
                        <p className="text-gray-600">{indicator.subStrand}</p>
                      </div>
                      <div>
                        <span className="font-medium text-pink-700">Strand:</span>
                        <p className="text-gray-600">{indicator.strand}</p>
                      </div>
                      <div>
                        <span className="font-medium text-pink-700">Subject:</span>
                        <p className="text-gray-600">{indicator.subject}</p>
                      </div>
                     
                    </div>
                  </div>
                ))}
                {filteredData.indicators.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No indicators found with current filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GESCurriculumPage;