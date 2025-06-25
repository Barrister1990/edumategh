import { pageConfigs, seoConfig } from "@/config/seo";
import {
  Award,
  BadgeCheck,
  BarChart,
  BookMarked,
  BookOpen,
  Brain,
  Download,
  FilePenLine,
  FileText,
  Globe,
  Headphones,
  Library,
  LineChart,
  MessageSquare,
  PenTool,
  Printer,
  School,
  Share2,
  Users
} from 'lucide-react';
import type { Metadata } from 'next';
import FeaturesPageClient from './FeaturesPageClient';

export const metadata: Metadata = {
  ...seoConfig,
  ...pageConfigs.features,
  alternates: {
    canonical: 'https://edumategh.com/features'
  }
};

const FeaturesPage = () => {
  // Updated comprehensive features matching your description
  const heroFeatures = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "50,000+ Quiz Questions",
      description: "Vetted questions across all subjects for Basic and SHS curriculum, perfectly aligned with GES standards",
      gradient: "from-purple-500 to-indigo-600",
      highlight: "50K+ Questions"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Built-in Tutor AI",
      description: "Personal AI tutor available 24/7 to help students understand lessons and solve problems",
      gradient: "from-indigo-500 to-purple-600",
      highlight: "AI Powered"
    },
    {
      icon: <School className="h-8 w-8" />,
      title: "Curriculum-Aligned Lessons",
      description: "Real-life crafted lessons organized by strand, sub-strand, content standards & indicators",
      gradient: "from-purple-600 to-pink-600",
      highlight: "GES Aligned"
    }
  ];

  const studentFeatures = [
    {
      icon: <BookMarked className="h-6 w-6" />,
      title: "Interactive Lesson Library",
      description: "Access thousands of interactive lessons crafted according to curriculum sub-strands with real-life examples and applications.",
      category: "Learning"
    },
    {
      icon: <FilePenLine className="h-6 w-6" />,
      title: "Smart Quiz System",
      description: "Practice with 50,000+ vetted quiz questions across all subjects, with instant feedback and progress tracking.",
      category: "Assessment"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "24/7 AI Tutor",
      description: "Get instant help from our built-in AI tutor that explains concepts, solves problems, and guides your learning.",
      category: "Support"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Voice Learning Mode",
      description: "Convert any lesson to audio with natural Ghanaian accent options. Learn while commuting or exercising.",
      category: "Accessibility"
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Progress Analytics",
      description: "Detailed insights into your learning journey with performance metrics and personalized recommendations.",
      category: "Analytics"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Exam Preparation",
      description: "Specialized modules for BECE, WASSCE preparation with past questions and prediction models.",
      category: "Certification"
    }
  ];

  const teacherFeatures = [
    {
      icon: <PenTool className="h-6 w-6" />,
      title: "AI Lesson Note Generator",
      description: "Generate comprehensive lesson notes aligned with specific strands, sub-strands, content standards, and indicators in seconds.",
      category: "Planning"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Exam Question Generator",
      description: "Create custom examination questions with answer keys, ready to print directly from the platform.",
      category: "Assessment"
    },
    {
      icon: <Printer className="h-6 w-6" />,
      title: "Direct Print Integration",
      description: "Print lesson notes, exam questions, and worksheets directly from the app with professional formatting.",
      category: "Productivity"
    },
    {
      icon: <Library className="h-6 w-6" />,
      title: "Ready-Made Resources",
      description: "Access prepared lesson notes, curriculum documents, and textbooks for all subjects - ready to download.",
      category: "Resources"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Class Management",
      description: "Track student progress, assign homework, and provide individualized feedback through the teacher portal.",
      category: "Management"
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Performance Dashboard",
      description: "Monitor class performance with detailed analytics and generate reports for school administration.",
      category: "Analytics"
    }
  ];

  const additionalFeatures = [
    {
      icon: <Download className="h-6 w-6" />,
      title: "Offline Access",
      description: "Download lessons, quizzes, and resources for offline use when internet connectivity is limited.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multilingual Support",
      description: "Access content in English and major Ghanaian languages for enhanced comprehension.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Collaborative Learning",
      description: "Form study groups, share notes, and collaborate on assignments with classmates.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: "Quality Assurance",
      description: "All content is vetted by education experts and aligned with Ghana Education Service goals.",
      gradient: "from-purple-500 to-indigo-600"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Quiz Questions", icon: <FilePenLine className="h-5 w-5" /> },
    { number: "100%", label: "GES Aligned", icon: <BadgeCheck className="h-5 w-5" /> },
    { number: "24/7", label: "AI Tutor Support", icon: <Brain className="h-5 w-5" /> },
    { number: "All", label: "Subjects Covered", icon: <BookOpen className="h-5 w-5" /> }
  ];

  return (
    <FeaturesPageClient
      heroFeatures={heroFeatures}
      studentFeatures={studentFeatures}
      teacherFeatures={teacherFeatures}
      additionalFeatures={additionalFeatures}
      stats={stats}
    />
  );
};

export default FeaturesPage;