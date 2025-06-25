import { pageConfigs, seoConfig } from "@/config/seo";
import {
  FilePenLine,
  Headphones,
  LineChart,
  School,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import type { Metadata } from 'next';
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  ...seoConfig,
  ...pageConfigs.home,
  alternates: {
    canonical: 'https://edumategh.com'
  }
};

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "AI Lesson Generation",
      description: "Generate comprehensive lesson notes instantly, perfectly aligned with Ghana's GES curriculum standards.",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Headphones className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Voice Learning",
      description: "Listen to lessons with natural AI voices. Learn while commuting, exercising, or relaxing.",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: <FilePenLine className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Smart Quizzes",
      description: "Adaptive quizzes that focus on your weak areas. Practice online and offline with instant feedback.",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <School className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "GES Curriculum Aligned",
      description: "Every lesson follows Ghana's official curriculum: strands, sub-strands, content standards & indicators.",
      gradient: "from-indigo-600 to-blue-600"
    },
    {
      icon: <Users className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Teacher Resources",
      description: "Generate exam questions, lesson plans, and access prepared teaching materials instantly.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <LineChart className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Progress Analytics",
      description: "Track learning journey with detailed insights, performance metrics, and personalized recommendations.",
      gradient: "from-purple-500 to-indigo-500"
    }
  ];

  const benefits = [
    {
      number: "01",
      title: "Classroom Experience at Home",
      description: "Experience the same quality education as in Ghana's best schools. Our AI delivers personalized lessons that adapt to your learning style and pace.",
      highlight: "Self-paced learning"
    },
    {
      number: "02", 
      title: "Offline-First Design",
      description: "Download lessons, quizzes, and resources for offline access. Learn anywhere, anytime - even without internet connection.",
      highlight: "Works offline"
    },
    {
      number: "03",
      title: "Teachers' Ultimate Toolkit",
      description: "Generate lesson notes, create exam questions, and access textbooks with one click. Save hours of preparation time every week.",
      highlight: "One-click generation"
    }
  ];

  const testimonials = [
    {
      content: "EduMate GH has revolutionized my teaching. I can generate complete lesson plans in seconds that used to take me hours. My students love the interactive content!",
      author: "Sarah Mensah",
      role: "Senior Science Teacher, Wesley Girls' High School",
      rating: 5,
      imageSrc: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      content: "The voice learning feature is a game-changer! I listen to my math lessons during my commute to school. My grades have improved from C to A in just 3 months.",
      author: "Kwame Osei",
      role: "Form 2 Student, Prempeh College",
      rating: 5,
      imageSrc: "https://images.pexels.com/photos/8617769/pexels-photo-8617769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      content: "As a parent, I'm amazed by my daughter's progress. She's more confident, her grades improved, and she actually enjoys studying now. Worth every pesewa!",
      author: "Abena Frimpong",
      role: "Parent & Business Executive, Accra",
      rating: 5,
      imageSrc: "https://images.pexels.com/photos/6504215/pexels-photo-6504215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  const stats = [
    { number: "50K+", label: "Students Learning", icon: <Users className="h-5 w-5" /> },
    { number: "2K+", label: "Teachers Using", icon: <School className="h-5 w-5" /> },
    { number: "95%", label: "Grade Improvement", icon: <LineChart className="h-5 w-5" /> },
    { number: "4.9★", label: "App Store Rating", icon: <Star className="h-5 w-5 fill-current" /> }
  ];

  return (
    <HomePageClient 
      features={features}
      benefits={benefits}
      testimonials={testimonials}
      stats={stats}
    />
  );
}