"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminLessonNoteStore } from '@/stores/lessonNote';
import { ArrowLeft, Calendar, Download, Edit, Eye, FileText, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LessonNoteViewPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    selectedLessonNote,
    isLoading,
    error,
    fetchLessonNoteById,
    deleteLessonNote,
    clearError
  } = useAdminLessonNoteStore();

  useEffect(() => {
    if (noteId) {
      fetchLessonNoteById(noteId);
    }
  }, [noteId, fetchLessonNoteById]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lesson note? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const success = await deleteLessonNote(noteId);
        if (success) {
          router.push('/admin/notes');
        }
      } catch (error) {
        console.error('Error deleting lesson note:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    router.push(`/admin/notes/${noteId}/edit`);
  };

  const handleBack = () => {
    router.push('/admin/notes');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Lesson Note</h3>
            <p className="text-gray-600">Please wait while we fetch the details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Lesson Note</h3>
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

  if (!selectedLessonNote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lesson Note Not Found</h3>
            <p className="text-gray-600 mb-4">The lesson note you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <button 
              onClick={handleBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const note = selectedLessonNote;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lesson Note Details</h1>
                <p className="text-sm text-gray-500 mt-1">View and manage lesson note information</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(note.pdfUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Note Title and Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">{note.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'N/A'}</span>
                  {note.updatedAt && note.updatedAt !== note.createdAt && (
                    <>
                      <span>•</span>
                      <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {note.level} {note.class}
                  </Badge>
                  {note.course && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {note.course}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {note.subject}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Curriculum Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Curriculum Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Strand</label>
                    <p className="text-gray-900 font-medium">{note.strand}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Strand</label>
                    <p className="text-gray-900 font-medium">{note.subStrand}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Standard</label>
                    <p className="text-gray-900 font-medium">{note.contentStandard}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Indicator</label>
                    <p className="text-gray-900 font-medium">{note.indicator}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PDF Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">PDF Document</p>
                  <p className="text-sm text-gray-500 mb-4">Click the download button above to view the full document</p>
                  <Button
                    variant="outline"
                    onClick={() => window.open(note.pdfUrl, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleEdit}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Note
                </Button>
                <Button
                  onClick={() => window.open(note.pdfUrl, '_blank')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full justify-start"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Note'}
                </Button>
              </CardContent>
            </Card>

            {/* Note Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Note Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Level</span>
                  <Badge variant="outline">{note.level}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Class</span>
                  <Badge variant="outline">{note.class}</Badge>
                </div>
                {note.course && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Course</span>
                    <Badge variant="outline">{note.course}</Badge>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subject</span>
                  <Badge variant="outline">{note.subject}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
