import { pageConfigs, seoConfig } from "@/config/seo";
import {
  BookOpen,
  Bot,
  FilePenLine,
  Headphones,
  LineChart,
  School,
  Sparkles,
  Star,
  Users,
  Zap
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
      title: "AI-Powered Lessons",
      description:
        "Interactive lessons aligned with the GES curriculum for all BECE, NOVDEC, and WASSCE subjects, enriched with AI-generated explanations and real-world examples.",
      color: "bg-blue-500",
    },
    {
      icon: <FilePenLine className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Smart Exam Quizzes",
      description:
        "Curriculum-based quizzes for BECE, NOVDEC, and WASSCE with adaptive difficulty, instant feedback, and step-by-step AI guidance.",
      color: "bg-purple-500",
    },
    {
      icon: <School className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Remedial Support",
      description:
        "Targeted remedial lessons for difficult subjects, helping students catch up with personalized learning paths and progress tracking.",
      color: "bg-indigo-500",
    },
    {
      icon: <BookOpen className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />, // new icon
      title: "Past Questions & Solutions",
      description:
        "Practice past BECE, NOVDEC, and WASSCE exam questions with detailed, AI-generated solutions and explanations.",
      color: "bg-teal-500",
    },
    {
      icon: <Headphones className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Voice Learning",
      description:
        "Listen to lessons, notes, and quizzes with natural AI voices. Learn hands-free while commuting or relaxing.",
      color: "bg-pink-500",
    },
    {
      icon: <LineChart className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Performance Analytics",
      description:
        "Track learning progress with AI-powered insights, performance breakdowns, and personalized study recommendations.",
      color: "bg-green-500",
    },
    {
      icon: <Users className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Offline Access",
      description:
        "Download lessons, quizzes, and past questions for offline study. Learn anywhere, anytime without internet.",
      color: "bg-orange-500",
    },
    {
      icon: <Bot className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />, // new icon
      title: "In-Built AI Tutor",
      description:
        "Ask questions and get instant explanations from your personal AI tutor, available 24/7 for all subjects.",
      color: "bg-red-500",
    },
    {
      icon: <Zap className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />,
      title: "Coin Reward System",
      description:
        "Earn coins through daily tasks, watching ads, and completing challenges. Use coins to unlock premium content and AI generations.",
      color: "bg-yellow-500",
    },
  ];
  

  const benefits = [
    {
      number: "01",
      title: "Comprehensive Exam Coverage",
      description: "Master BECE, NOVDEC, and WASSCE with AI-powered lessons covering all subjects and topics in Ghana's curriculum.",
      highlight: "10000+ resources"
    },
    {
      number: "02", 
      title: "Personalized Remedial Learning",
      description: "AI identifies your weak areas and provides targeted remedial lessons to improve your performance in challenging subjects.",
      highlight: "Smart Remediation"
    },
    {
      number: "03",
      title: "Practice Makes Perfect",
      description: "Access thousands of AI-generated quizzes and practice tests to build confidence and improve your exam scores.",
      highlight: "1000+ Quizzes"
    }
  ];

  const testimonials = [
    {
      content: "EduMate GH helped me pass my BECE with flying colors! The AI quizzes were so helpful, and I could study offline during power outages. Highly recommended!",
      author: "Bernice Osei",
      role: "BECE Graduate, ",
      rating: 5,
      imageSrc: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      content: "I was struggling with Mathematics in NOVDEC, but the remedial lessons in EduMate GH turned my C grade to an A. The AI explanations are so clear!",
      author: "Kwame Addo",
      role: "NOVDEC Student, Kumasi",
      rating: 5,
      imageSrc: "https://images.pexels.com/photos/8617769/pexels-photo-8617769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      content: "My daughter used EduMate GH for WASSCE preparation and improved from 6 passes to 8 passes. The AI lessons made difficult topics easy to understand!",
      author: "Abena Frimpong",
      role: "Parent, Accra",
      rating: 5,
      imageSrc: "https://images.pexels.com/photos/6504215/pexels-photo-6504215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];

  const stats = [
    { number: "100000+", label: "Lessons", icon: <School className="h-5 w-5" /> },
    { number: "1000+", label: "AI Quizzes", icon: <FilePenLine className="h-5 w-5" /> },
    { number: "500", label: "Free Coins", icon: <Zap className="h-5 w-5" /> },
    { number: "4.9★", label: "App Rating", icon: <Star className="h-5 w-5" fill="currentColor" /> }
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