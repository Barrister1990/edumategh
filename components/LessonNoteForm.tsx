"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { LessonNoteFormData } from "@/types/lessonNote";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  options: z.object({
    level: z.enum(["JHS", "SHS"]),
    class: z.string().min(1, { message: "Class is required." }),
    subject: z.string().min(1, { message: "Subject is required." }),
    course: z.string().optional(),
    strand: z.string().min(1, { message: "Strand is required." }),
    subStrand: z.string().min(1, { message: "Sub-strand is required." }),
    indicator: z.string().min(1, { message: "Indicator is required." }),
    contentStandard: z.string().min(1, { message: "Content standard is required." }),
  }),
  content: z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    pdfUrl: z.string().url({ message: "Please enter a valid URL." }),
    thumbnailUrl: z.string().url({ message: "Please enter a valid URL." }),
    keywords: z.array(z.string()).min(1, { message: "At least one keyword is required." }),
  }),
});

interface LessonNoteFormProps {
  initialData?: LessonNoteFormData;
  onSubmit: (data: LessonNoteFormData) => Promise<void>;
  onCancel: () => void;
}

export function LessonNoteForm({ initialData, onSubmit, onCancel }: LessonNoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(initialData?.content.keywords || []);

  const form = useForm<LessonNoteFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      options: {
        level: "JHS",
        class: "",
        subject: "",
        course: "",
        strand: "",
        subStrand: "",
        indicator: "",
        contentStandard: "",
      },
      content: {
        title: "",
        description: "",
        pdfUrl: "",
        thumbnailUrl: "",
        keywords: [],
      },
    },
  });

  async function handleSubmit(data: LessonNoteFormData) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: initialData ? "Lesson note updated successfully" : "Lesson note added successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lesson note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAddKeyword = (keyword: string) => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      const newKeywords = [...keywords, keyword.trim()];
      setKeywords(newKeywords);
      form.setValue("content.keywords", newKeywords);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = keywords.filter((k) => k !== keyword);
    setKeywords(newKeywords);
    form.setValue("content.keywords", newKeywords);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Note Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="options.level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="JHS">JHS</SelectItem>
                      <SelectItem value="SHS">SHS</SelectItem>
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
                  <FormLabel>Class</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., JHS 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="options.subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="options.course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Core Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="options.strand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strand</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="options.subStrand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-strand</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Operations on Numbers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="options.indicator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indicator</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., B7.1.1.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="options.contentStandard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Standard</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Demonstrate understanding of operations"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Note Content</h3>
          <FormField
            control={form.control}
            name="content.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter note title" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter note description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content.pdfUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PDF URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter PDF URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content.thumbnailUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter thumbnail URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Keywords</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {keywords.map((keyword) => (
                <div
                  key={keyword}
                  className="bg-edumate-purple/10 text-edumate-purple px-2 py-1 rounded-md flex items-center"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 text-edumate-purple hover:text-edumate-purple/80"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add keyword"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  handleAddKeyword(input.value);
                  input.value = '';
                }}
              >
                Add
              </Button>
            </div>
            <FormMessage>{form.formState.errors.content?.keywords?.message}</FormMessage>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary-gradient hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              initialData ? "Update Note" : "Add Note"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}