"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { uploadToCloudinary } from '@/lib/cloudinary';
import { shsCourses, useAdminLessonNoteStore } from '@/stores/lessonNote';
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, FileText, Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  options: z.object({
    level: z.enum(["Basic", "JHS", "SHS"]),
    class: z.string().min(1, { message: "Class is required." }),
    course: z.string().optional(),
    subjectId: z.string().min(1, { message: "Subject is required." }),
    strandId: z.string().min(1, { message: "Strand is required." }),
    subStrandId: z.string().min(1, { message: "Sub-strand is required." }),
    contentStandardId: z.string().min(1, { message: "Content standard is required." }),
    indicatorId: z.string().min(1, { message: "Indicator is required." }),
  }),
  content: z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface UploadProgress {
  pdf: number;
}

// Class options for each level
const classOptions = {
  Basic: ['Basic 4', 'Basic 5', 'Basic 6'],
  JHS: ['JHS 1', 'JHS 2', 'JHS 3'],
  SHS: ['SHS 1', 'SHS 2', 'SHS 3']
};

export default function EditLessonNotePage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ pdf: 0 });
  
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Store state and actions
  const {
    selectedLessonNote,
    subjects,
    strands,
    subStrands,
    contentStandards,
    indicators,
    isLoading,
    isLoadingSubjects,
    isLoadingStrands,
    isLoadingSubStrands,
    isLoadingContentStandards,
    isLoadingIndicators,
    fetchLessonNoteById,
    fetchSubjects,
    fetchStrands,
    fetchSubStrands,
    fetchContentStandards,
    fetchIndicators,
    updateLessonNote,
    isUpdating,
    getSubjectsForLevel,
    getStrandsForSubject,
    getSubStrandsForStrand,
    getContentStandardsForSubStrand,
    getIndicatorsForContentStandard,
    clearCurriculumErrors
  } = useAdminLessonNoteStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      options: {
        level: "Basic",
        class: "",
        course: "",
        subjectId: "",
        strandId: "",
        subStrandId: "",
        contentStandardId: "",
        indicatorId: "",
      },
      content: {
        title: "",
      },
    },
  });

  const watchedLevel = form.watch("options.level");
  const watchedClass = form.watch("options.class");
  const watchedCourse = form.watch("options.course");
  const watchedSubjectId = form.watch("options.subjectId");
  const watchedStrandId = form.watch("options.strandId");
  const watchedSubStrandId = form.watch("options.subStrandId");
  const watchedContentStandardId = form.watch("options.contentStandardId");
  const watchedIndicatorId = form.watch("options.indicatorId");

  // Load lesson note data when component mounts
  useEffect(() => {
    if (noteId) {
      fetchLessonNoteById(noteId);
    }
  }, [noteId, fetchLessonNoteById]);

  // Populate form when lesson note data is loaded
  useEffect(() => {
    if (selectedLessonNote) {
      form.reset({
        options: {
          level: selectedLessonNote.level as "Basic" | "JHS" | "SHS",
          class: selectedLessonNote.class,
          course: selectedLessonNote.course || "",
          subjectId: selectedLessonNote.subjectId,
          strandId: selectedLessonNote.strandId,
          subStrandId: "", // Will be populated after fetching curriculum data
          contentStandardId: selectedLessonNote.contentStandardId || "",
          indicatorId: selectedLessonNote.indicatorId,
        },
        content: {
          title: selectedLessonNote.title,
        },
      });
    }
  }, [selectedLessonNote, form]);

  // Load subjects when level, class, or course changes
  useEffect(() => {
    if (watchedLevel && watchedClass) {
      const course = watchedLevel === 'SHS' ? watchedCourse : undefined;
      if (watchedLevel === 'SHS' && !course) return; // Wait for course selection for SHS
      
      fetchSubjects(watchedLevel, watchedClass, course);
    }
  }, [watchedLevel, watchedClass, watchedCourse, fetchSubjects]);

  // Load strands when subject changes
  useEffect(() => {
    if (watchedSubjectId && watchedLevel && watchedClass) {
      const course = watchedLevel === 'SHS' ? watchedCourse : undefined;
      fetchStrands(watchedSubjectId, watchedLevel, watchedClass, course);
    }
  }, [watchedSubjectId, watchedLevel, watchedClass, watchedCourse, fetchStrands]);

  // Load sub-strands when strand changes
  useEffect(() => {
    if (watchedStrandId) {
      fetchSubStrands(watchedStrandId);
    }
  }, [watchedStrandId, fetchSubStrands]);

  // Load content standards when sub-strand changes
  useEffect(() => {
    if (watchedSubStrandId) {
      fetchContentStandards(watchedSubStrandId);
    }
  }, [watchedSubStrandId, fetchContentStandards]);

  // Load indicators when content standard changes
  useEffect(() => {
    if (watchedContentStandardId) {
      fetchIndicators(watchedContentStandardId);
    }
  }, [watchedContentStandardId, fetchIndicators]);

  // Clear errors when component mounts
  useEffect(() => {
    clearCurriculumErrors();
  }, [clearCurriculumErrors]);

  // Get filtered data based on current selections
  const availableSubjects = getSubjectsForLevel(watchedLevel, watchedCourse);
  const availableStrands = getStrandsForSubject(watchedSubjectId);
  const availableSubStrands = getSubStrandsForStrand(watchedStrandId);
  const availableContentStandards = getContentStandardsForSubStrand(watchedSubStrandId);
  const availableIndicators = getIndicatorsForContentStandard(watchedContentStandardId);

  // Get available classes for the selected level
  const availableClasses = watchedLevel ? classOptions[watchedLevel as keyof typeof classOptions] : [];

  // Get selected item details for form submission
  const getSelectedSubject = () => availableSubjects.find(s => s.id === watchedSubjectId);
  const getSelectedStrand = () => availableStrands.find(s => s.id === watchedStrandId);
  const getSelectedSubStrand = () => availableSubStrands.find(s => s.id === watchedSubStrandId);
  const getSelectedContentStandard = () => availableContentStandards.find(cs => cs.id === watchedContentStandardId);
  const getSelectedIndicator = () => availableIndicators.find(i => i.id === watchedIndicatorId);

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setUploadProgress(prev => ({ ...prev, pdf: 0 }));
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleRemovePdfFile = () => {
    setPdfFile(null);
    setUploadProgress(prev => ({ ...prev, pdf: 0 }));
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const handleSubmit = async (data: FormData) => {
    // Validate form data
    if (!data.options.level || !data.options.class || !data.options.subjectId || 
        !data.options.strandId || !data.options.subStrandId || !data.options.contentStandardId || !data.options.indicatorId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate SHS course selection
    if (data.options.level === 'SHS' && !data.options.course) {
      toast({
        title: "Missing course",
        description: "Please select a course for Senior High School.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      let pdfUrl = selectedLessonNote?.pdfUrl;

      // Upload new PDF if one was selected
      if (pdfFile) {
        setUploadProgress(prev => ({ ...prev, pdf: 20 }));
        const pdfUpload = await uploadToCloudinary(pdfFile, 'curriculum/pdfs');
        setUploadProgress(prev => ({ ...prev, pdf: 60 }));
        pdfUrl = pdfUpload.secure_url;
        setUploadProgress({ pdf: 100 });
      }

      // Get selected item details
      const selectedSubject = getSelectedSubject();
      const selectedStrand = getSelectedStrand();
      const selectedSubStrand = getSelectedSubStrand();
      const selectedContentStandard = getSelectedContentStandard();
      const selectedIndicator = getSelectedIndicator();

      if (!selectedSubject || !selectedStrand || !selectedSubStrand || !selectedContentStandard || !selectedIndicator) {
        throw new Error("Missing curriculum data");
      }

      // Prepare lesson note data for store
      const lessonNoteData = {
        id: noteId,
        title: data.content.title,
        pdfUrl: pdfUrl!,
        level: data.options.level,
        class: data.options.class,
        course: data.options.level === 'SHS' ? data.options.course : undefined,
        strand: selectedStrand.name,
        subStrand: selectedSubStrand.name,
        contentStandard: selectedContentStandard.name,
        indicator: selectedIndicator.name,
        subject: selectedSubject.name,
        subjectId: selectedSubject.id,
        strandId: selectedStrand.id,
        contentStandardId: selectedContentStandard.id,
        indicatorId: selectedIndicator.id,
      };

      // Update lesson note using store
      const result = await updateLessonNote(lessonNoteData);
      
      if (result) {
        toast({
          title: "Success",
          description: "Lesson note updated successfully!",
        });

        // Navigate back to view page
        router.push(`/admin/notes/${noteId}`);
      } else {
        throw new Error("Failed to update lesson note");
      }

    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update lesson note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/notes/${noteId}`);
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

  if (!selectedLessonNote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lesson Note Not Found</h3>
            <p className="text-gray-600 mb-4">The lesson note you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => router.push('/admin/notes')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
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
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Lesson Note</h1>
                <p className="text-sm text-gray-500 mt-1">Modify lesson note information and resources</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            
            {/* Note Options Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Note Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="options.level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic School</SelectItem>
                            <SelectItem value="JHS">Junior High School (JHS)</SelectItem>
                            <SelectItem value="SHS">Senior High School (SHS)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="options.class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={!watchedLevel}>
                              <SelectValue placeholder={
                                !watchedLevel ? "Select level first" : "Select class"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableClasses.map((cls) => (
                              <SelectItem key={cls} value={cls}>
                                {cls}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedLevel === 'SHS' && (
                    <FormField
                      control={form.control}
                      name="options.course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {shsCourses.map((course) => (
                                <SelectItem key={course} value={course}>
                                  {course}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="options.subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isLoadingSubjects || availableSubjects.length === 0 || !watchedLevel || !watchedClass || (watchedLevel === 'SHS' && !watchedCourse)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                !watchedLevel ? "Select level first" :
                                !watchedClass ? "Select class first" :
                                watchedLevel === 'SHS' && !watchedCourse ? "Select course first" :
                                isLoadingSubjects ? "Loading subjects..." : 
                                availableSubjects.length === 0 ? "No subjects available" :
                                "Select subject"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSubjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="options.strandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Strand *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isLoadingStrands || availableStrands.length === 0 || !watchedSubjectId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                !watchedSubjectId ? "Select subject first" :
                                isLoadingStrands ? "Loading strands..." : 
                                availableStrands.length === 0 ? "No strands available" :
                                "Select strand"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableStrands.map((strand) => (
                              <SelectItem key={strand.id} value={strand.id}>
                                {strand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="options.subStrandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-strand *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isLoadingSubStrands || availableSubStrands.length === 0 || !watchedStrandId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                !watchedStrandId ? "Select strand first" :
                                isLoadingSubStrands ? "Loading sub-strands..." : 
                                availableSubStrands.length === 0 ? "No sub-strands available" :
                                "Select sub-strand"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSubStrands.map((subStrand) => (
                              <SelectItem key={subStrand.id} value={subStrand.id}>
                                {subStrand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="options.contentStandardId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Standard *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isLoadingContentStandards || availableContentStandards.length === 0 || !watchedSubStrandId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                !watchedSubStrandId ? "Select sub-strand first" :
                                isLoadingContentStandards ? "Loading content standards..." : 
                                availableContentStandards.length === 0 ? "No content standards available" :
                                "Select content standard"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableContentStandards.map((contentStandard) => (
                              <SelectItem key={contentStandard.id} value={contentStandard.id}>
                                {contentStandard.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="options.indicatorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicator *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isLoadingIndicators || availableIndicators.length === 0 || !watchedContentStandardId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                !watchedContentStandardId ? "Select content standard first" :
                                isLoadingIndicators ? "Loading indicators..." : 
                                availableIndicators.length === 0 ? "No indicators available" :
                                "Select indicator"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableIndicators.map((indicator) => (
                              <SelectItem key={indicator.id} value={indicator.id}>
                                {indicator.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Note Content Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Note Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="content.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter an engaging title for the lesson note" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Update PDF File (Optional)</CardTitle>
                <p className="text-sm text-gray-600">Leave unchanged to keep the existing PDF file</p>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Current PDF Display */}
                <div className="space-y-3">
                  <FormLabel>Current PDF</FormLabel>
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-red-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Current PDF File</p>
                        <p className="text-sm text-gray-500">Click the link below to view the current PDF</p>
                        <a 
                          href={selectedLessonNote.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View Current PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New PDF Upload */}
                <div className="space-y-3">
                  <FormLabel>New PDF File (Optional)</FormLabel>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {!pdfFile ? (
                      <div 
                        className="text-center cursor-pointer"
                        onClick={() => pdfInputRef.current?.click()}
                      >
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload new PDF file</p>
                        <p className="text-sm text-gray-500">Maximum file size: 50MB</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-red-600" />
                          <div>
                            <p className="font-medium text-gray-900">{pdfFile.name}</p>
                            <p className="text-sm text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemovePdfFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {uploadProgress.pdf > 0 && uploadProgress.pdf < 100 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uploading PDF...</span>
                          <span>{uploadProgress.pdf}%</span>
                        </div>
                        <Progress value={uploadProgress.pdf} className="w-full" />
                      </div>
                    )}
                    
                    {uploadProgress.pdf === 100 && (
                      <div className="mt-4 flex items-center text-green-600 text-sm">
                        <Check className="h-4 w-4 mr-2" />
                        PDF uploaded successfully
                      </div>
                    )}
                  </div>
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting || isUpdating}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting || 
                  isUpdating || 
                  !watchedLevel || 
                  !watchedClass || 
                  !watchedSubjectId || 
                  !watchedStrandId || 
                  !watchedSubStrandId || 
                  !watchedContentStandardId ||
                  !watchedIndicatorId ||
                  (watchedLevel === 'SHS' && !watchedCourse)
                }
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
              >
               {isSubmitting || isUpdating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSubmitting ? 'Uploading...' : 'Updating...'}
                  </span>
                ) : (
                  'Update Lesson Note'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 
