export interface Curriculum {
  id: string;
  title: string;
  description: string;
  level: 'JHS' | 'SHS';
  class: string;
  subject: string;
  course?: string;
  pdfUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumFormData {
  title: string;
  description: string;
  level: 'JHS' | 'SHS';
  class: string;
  subject: string;
  course?: string;
  pdfUrl: string;
  thumbnailUrl: string;
}