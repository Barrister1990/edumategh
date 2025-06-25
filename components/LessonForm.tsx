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
import { LessonFormData } from "@/types/lesson";
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
    topic: z.string().min(1, { message: "Topic is required." }),
    subtopic: z.string().optional(),
  }),
  content: z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    content: z.string().min(50, { message: "Content must be at least 50 characters." }),
    videoUrl: z.string().url().optional(),
    attachments: z.array(z.string().url()).optional(),
  }),
});

interface LessonFormProps {
  initialData?: LessonFormData;
  onSubmit: (data: LessonFormData) => Promise<void>;
  onCancel: () => void;
}

export function LessonForm({ initialData, onSubmit, onCancel }: LessonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LessonFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      options: {
        level: "JHS",
        class: "",
        subject: "",
        course: "",
        topic: "",
        subtopic: "",
      },
      content: {
        title: "",
        description: "",
        content: "",
        videoUrl: "",
        attachments: [],
      },
    },
  });

  async function handleSubmit(data: LessonFormData) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: initialData ? "Lesson updated successfully" : "Lesson added successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Lesson Options</h3>
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
              name="options.topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Algebra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="options.subtopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtopic (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Linear Equations" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Lesson Content</h3>
          <FormField
            control={form.control}
            name="content.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter lesson title" {...field} />
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
                    placeholder="Enter lesson description"
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
            name="content.content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter lesson content"
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content.videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter video URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              initialData ? "Update Lesson" : "Add Lesson"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}