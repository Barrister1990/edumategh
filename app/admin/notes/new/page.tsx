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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { uploadToCloudinary } from '@/lib/cloudinary';
import { shsCourses, useAdminLessonNoteStore } from '@/stores/lessonNote';
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, FileText, Image, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  options: z.object({
    level: z.enum(["JHS", "SHS"]),
    class: z.string().min(1, { message: "Class is required." }),
    course: z.string().optional(),
    subjectId: z.string().min(1, { message: "Subject is required." }),
    strandId: z.string().min(1, { message: "Strand is required." }),
    subStrandId: z.string().min(1, { message: "Sub-strand is required." }),
    indicatorId: z.string().min(1, { message: "Indicator is required." }),
  }),
  content: z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    keywords: z.array(z.string()).min(1, { message: "At least one keyword is required." }),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface UploadProgress {
  pdf: number;
  thumbnail: number;
}

export default function AddLessonNotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ pdf: 0, thumbnail: 0 });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const keywordInputRef = useRef<HTMLInputElement>(null);

  // Store state and actions
  const {
    subjects,
    strands,
    subStrands,
    indicators,
    isLoadingSubjects,
    isLoadingStrands,
    isLoadingSubStrands,
    isLoadingIndicators,
    fetchSubjects,
    fetchStrands,
    fetchSubStrands,
    fetchIndicators,
    createLessonNote,
    isCreating,
    getSubjectsForLevel,
    getStrandsForSubject,
    getSubStrandsForStrand,
    getIndicatorsForSubStrand,
    clearCurriculumErrors
  } = useAdminLessonNoteStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      options: {
        level: "JHS",
        class: "1",
        course: "",
        subjectId: "",
        strandId: "",
        subStrandId: "",
        indicatorId: "",
      },
      content: {
        title: "",
        description: "",
        keywords: [],
      },
    },
  });

  const watchedLevel = form.watch("options.level");
  const watchedClass = form.watch("options.class");
  const watchedCourse = form.watch("options.course");
  const watchedSubjectId = form.watch("options.subjectId");
  const watchedStrandId = form.watch("options.strandId");
  const watchedSubStrandId = form.watch("options.subStrandId");
  const watchedIndicatorId = form.watch("options.indicatorId"); 

  // Load subjects when level, class, or course changes
  useEffect(() => {
    if (watchedLevel && watchedClass) {
      const course = watchedLevel === 'SHS' ? watchedCourse : undefined;
      if (watchedLevel === 'SHS' && !course) return; // Wait for course selection for SHS
      
      fetchSubjects(watchedLevel, watchedClass, course);
      
      // Reset dependent fields
      form.setValue("options.subjectId", "");
      form.setValue("options.strandId", "");
      form.setValue("options.subStrandId", "");
      form.setValue("options.indicatorId", "");
    }
  }, [watchedLevel, watchedClass, watchedCourse, fetchSubjects, form]);

  // Load strands when subject changes
useEffect(() => {
  if (watchedSubjectId && watchedLevel && watchedClass) {
    const course = watchedLevel === 'SHS' ? watchedCourse : undefined;
    fetchStrands(watchedSubjectId, watchedLevel, watchedClass, course);
    
    // Reset dependent fields
    form.setValue("options.strandId", "");
    form.setValue("options.subStrandId", "");
    form.setValue("options.indicatorId", "");
  }
}, [watchedSubjectId, watchedLevel, watchedClass, watchedCourse, fetchStrands, form]);

  // Load sub-strands when strand changes
  useEffect(() => {
    if (watchedStrandId) {
      fetchSubStrands(watchedStrandId);
      
      // Reset dependent fields
      form.setValue("options.subStrandId", "");
      form.setValue("options.indicatorId", "");
    }
  }, [watchedStrandId, fetchSubStrands, form]);

  // Load indicators when sub-strand changes
  useEffect(() => {
    if (watchedSubStrandId) {
      fetchIndicators(watchedSubStrandId);
      
      // Reset dependent field
      form.setValue("options.indicatorId", "");
    }
  }, [watchedSubStrandId, fetchIndicators, form]);

  // Clear errors when component mounts
  useEffect(() => {
    clearCurriculumErrors();
  }, [clearCurriculumErrors]);

  // Get filtered data based on current selections
  const availableSubjects = getSubjectsForLevel(watchedLevel, watchedCourse);
  const availableStrands = getStrandsForSubject(watchedSubjectId, watchedLevel, watchedClass, watchedCourse);
  const availableSubStrands = getSubStrandsForStrand(watchedStrandId);
  const availableIndicators = getIndicatorsForSubStrand(watchedSubStrandId);

  // Get selected item details for form submission
  const getSelectedSubject = () => availableSubjects.find(s => s.id === watchedSubjectId);
  const getSelectedStrand = () => availableStrands.find(s => s.id === watchedStrandId);
  const getSelectedSubStrand = () => availableSubStrands.find(s => s.id === watchedSubStrandId);
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

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      setUploadProgress(prev => ({ ...prev, thumbnail: 0 }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
    }
  };

  const handleAddKeyword = () => {
    const input = keywordInputRef.current;
    const keyword = input?.value.trim();
    
    if (keyword && !keywords.includes(keyword)) {
      const newKeywords = [...keywords, keyword];
      setKeywords(newKeywords);
      form.setValue("content.keywords", newKeywords);
      if (input) input.value = '';
    }
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = keywords.filter((k) => k !== keyword);
    setKeywords(newKeywords);
    form.setValue("content.keywords", newKeywords);
  };

  const removePdfFile = () => {
    setPdfFile(null);
    setUploadProgress(prev => ({ ...prev, pdf: 0 }));
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const removeThumbnailFile = () => {
    setThumbnailFile(null);
    setUploadProgress(prev => ({ ...prev, thumbnail: 0 }));
    setPreviewUrl("");
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  async function handleSubmit(data: FormData) {
    if (!pdfFile || !thumbnailFile) {
      toast({
        title: "Missing files",
        description: "Please upload both PDF and thumbnail files.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload PDF to Cloudinary
      setUploadProgress(prev => ({ ...prev, pdf: 20 }));
      const pdfUpload = await uploadToCloudinary(pdfFile, 'curriculum/pdfs');
      setUploadProgress(prev => ({ ...prev, pdf: 60 }));

      // Upload thumbnail to Cloudinary
      setUploadProgress(prev => ({ ...prev, thumbnail: 20 }));
      const thumbnailUpload = await uploadToCloudinary(thumbnailFile, 'curriculum/thumbnails');
      setUploadProgress(prev => ({ ...prev, thumbnail: 60 }));

      // Complete progress
      setUploadProgress({ pdf: 100, thumbnail: 100 });

      // Get selected item details
      const selectedSubject = getSelectedSubject();
      const selectedStrand = getSelectedStrand();
      const selectedSubStrand = getSelectedSubStrand();
      const selectedIndicator = getSelectedIndicator();

      if (!selectedSubject || !selectedStrand || !selectedSubStrand || !selectedIndicator) {
        throw new Error("Missing curriculum data");
      }

      // Prepare lesson note data for store
      const lessonNoteData = {
        title: data.content.title,
        description: data.content.description,
        pdfUrl: pdfUpload.secure_url,
        thumbnailUrl: thumbnailUpload.secure_url,
        level: data.options.level,
        class: data.options.class,
        course: data.options.level === 'SHS' ? data.options.course : undefined,
        subject: selectedSubject.name,
        subjectId: selectedSubject.id,
        strand: selectedStrand.name,
        strandId: selectedStrand.id,
        subStrand: selectedSubStrand.name,
        indicator: selectedIndicator.name,
        indicatorId: selectedIndicator.id,
      };

      // Create lesson note using store
      const result = await createLessonNote(lessonNoteData);
      
      if (result) {
        toast({
          title: "Success",
          description: "Lesson note added successfully!",
        });

        // Reset form and navigate
        form.reset();
        setKeywords([]);
        setPdfFile(null);
        setThumbnailFile(null);
        setPreviewUrl("");
        setUploadProgress({ pdf: 0, thumbnail: 0 });
        
        // Navigate back or to lesson notes list
        router.push('/admin/notes'); // Adjust path as needed
      } else {
        throw new Error("Failed to create lesson note");
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to add lesson note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Lesson Note</h1>
        <p className="text-gray-600">Create a new lesson note with detailed information and resources.</p>
      </div>

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
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Class 1</SelectItem>
                          <SelectItem value="2">Class 2</SelectItem>
                          <SelectItem value="3">Class 3</SelectItem>
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
                        disabled={isLoadingSubjects || availableSubjects.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
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
                  name="options.indicatorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicator *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={isLoadingIndicators || availableIndicators.length === 0 || !watchedSubStrandId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              !watchedSubStrandId ? "Select sub-strand first" :
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

              <FormField
                control={form.control}
                name="content.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of what students will learn from this note"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Keywords Section */}
              <div className="space-y-3">
                <FormLabel>Keywords *</FormLabel>
                <div className="flex flex-wrap gap-2 mb-3">
                  {keywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center text-sm border border-blue-200"
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    ref={keywordInputRef}
                    placeholder="Add relevant keywords (e.g., fractions, algebra)"
                    onKeyPress={handleKeywordKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddKeyword}
                  >
                    Add
                  </Button>
                </div>
                {form.formState.errors.content?.keywords && (
                  <p className="text-sm text-red-600">{form.formState.errors.content.keywords.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upload Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* PDF Upload */}
              <div className="space-y-3">
                <FormLabel>PDF File *</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {!pdfFile ? (
                    <div 
                      className="text-center cursor-pointer"
                      onClick={() => pdfInputRef.current?.click()}
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload PDF file</p>
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
                        onClick={removePdfFile}
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

              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <FormLabel>Thumbnail Image *</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {!thumbnailFile ? (
                    <div 
                      className="text-center cursor-pointer"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload thumbnail image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Image className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">{thumbnailFile.name}</p>
                            <p className="text-sm text-gray-500">{(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeThumbnailFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {previewUrl && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <img 
                            src={previewUrl} 
                            alt="Thumbnail preview" 
                            className="h-32 w-48 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {uploadProgress.thumbnail > 0 && uploadProgress.thumbnail < 100 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uploading thumbnail...</span>
                        <span>{uploadProgress.thumbnail}%</span>
                      </div>
                      <Progress value={uploadProgress.thumbnail} className="w-full" />
                    </div>
                  )}
                  
                  {uploadProgress.thumbnail === 100 && (
                    <div className="mt-4 flex items-center text-green-600 text-sm">
                      <Check className="h-4 w-4 mr-2" />
                      Thumbnail uploaded successfully
                    </div>
                  )}
                </div>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
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
              disabled={isSubmitting || isCreating}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isCreating || !pdfFile || !thumbnailFile}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            >
             {isSubmitting || isCreating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSubmitting ? 'Uploading...' : 'Creating...'}
                </span>
              ) : (
                'Add Lesson Note'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
                  