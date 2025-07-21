"use client";
import { useAdminPastQuestionStore } from '@/stores/adminPastQuestionStore';

const PastQuestionsFilters = () => {
  const { filters, setFilters, examTypes, availableYears, availableCourses } = useAdminPastQuestionStore();

  const handleFilterChange = (filter: string, value: any) => {
    setFilters({ ...filters, [filter]: value });
  };

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <select
        value={filters.examType || ''}
        onChange={(e) => handleFilterChange('examType', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Exam Types</option>
        {examTypes.map(type => <option key={type} value={type}>{type}</option>)}
      </select>
      <select
        value={filters.year || ''}
        onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Years</option>
        {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
      </select>
      <select
        value={filters.level || ''}
        onChange={(e) => handleFilterChange('level', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Levels</option>
        <option value="JHS">JHS</option>
        <option value="SHS">SHS</option>
      </select>
      {filters.level === 'SHS' && (
        <select
          value={filters.course || ''}
          onChange={(e) => handleFilterChange('course', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Courses</option>
          {availableCourses.map(course => <option key={course} value={course}>{course}</option>)}
        </select>
      )}
    </div>
  );
};

export default PastQuestionsFilters;
