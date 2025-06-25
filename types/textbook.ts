export interface TextbookOptions {
  level: 'JHS' | 'SHS';
  class: string;
  subject: string;
  course?: string;
  term: '1' | '2' | '3';
  publisher: string;
  isbn: string;
  year: string;
}

export interface TextbookContent {
  title: string;
  description: string;
  authors: string[];
  coverUrl: string;
  pdfUrl: string;
  totalPages: number;
  keywords: string[];
}

export interface Textbook {
  id: string;
  options: TextbookOptions;
  content: TextbookContent;
  createdAt: string;
  updatedAt: string;
}

export interface TextbookFormData {
  options: TextbookOptions;
  content: TextbookContent;
}