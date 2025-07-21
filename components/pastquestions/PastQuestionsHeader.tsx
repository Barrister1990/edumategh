"use client";
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

const PastQuestionsHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Past Questions</h1>
      <Link href="/admin/pastquestions/new">
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New
        </button>
      </Link>
    </div>
  );
};

export default PastQuestionsHeader;
