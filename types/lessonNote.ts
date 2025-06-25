export interface LessonNoteOptions {
  level: 'JHS' | 'SHS';
  class: string;
  subject: string;
  course?: string;
  strand: string;
  subStrand: string;
  indicator: string;
  contentStandard: string;
}

export interface LessonNoteContent {
  title: string;
  description: string;
  pdfUrl: string;
  thumbnailUrl: string;
  keywords: string[];
}

export interface LessonNote {
  id: string;
  options: LessonNoteOptions;
  content: LessonNoteContent;
  createdAt: string;
  updatedAt: string;
}

export interface LessonNoteFormData {
  options: LessonNoteOptions;
  content: LessonNoteContent;
}