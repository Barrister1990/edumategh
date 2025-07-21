"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  // Array of app screenshots - using educational/learning themed stock images
  const screenshots = [
    "https://images.pexels.com/photos/5905885/pexels-photo-5905885.jpeg",
    "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg",
    "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg",
    "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg",
    "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    "https://images.pexels.com/photos/414628/pexels-photo-414628.jpeg",
    "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg",
    "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg",
    "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg",
    "https://images.pexels.com/photos/4050302/pexels-photo-4050302.jpeg",
    "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg",
    "https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg",
    "https://images.pexels.com/photos/4050477/pexels-photo-4050477.jpeg",
    "https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg",
    "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 1200);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Auto-advance slideshow every 3 seconds
    const slideshowTimer = setInterval(() => {
      setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    }, 3000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      clearInterval(slideshowTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [screenshots.length]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" // Changed from numeric array to string
      } 
    },
  };

  const floatingAnimation = {
    y: ["-4px", "4px", "-4px"],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // App Store SVG Component
  const AppStoreIcon = () => (
    <svg className="w-5 h-5 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.88C10.15 6.85 11.35 7.72 12.1 7.72C12.81 7.72 14.28 6.66 15.92 6.84C16.61 6.87 18.39 7.16 19.56 8.83C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
    </svg>
  );

  // Google Play SVG Component
  const GooglePlayIcon = () => (
    <svg className="w-5 h-5 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
    </svg>
  );

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-12 px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-purple-950/10 dark:to-indigo-950/20">
      {/* Simplified background for mobile */}
      <div 
        className="absolute inset-0 opacity-20 lg:opacity-30"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.1), transparent 40%)`,
        }}
      />
      
      {/* Minimal background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-40 h-40 lg:w-80 lg:h-80 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 lg:from-purple-400/20 lg:to-indigo-400/20 rounded-full blur-2xl lg:blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-48 h-48 lg:w-96 lg:h-96 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 lg:from-indigo-400/20 lg:to-purple-400/20 rounded-full blur-2xl lg:blur-3xl"
        />
      </div>
      
      <div className="container mx-auto relative z-10 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Mobile-First Text Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center lg:text-left space-y-4 lg:space-y-8 order-2 lg:order-1"
          >
            {/* Mobile: Small badge */}
            <motion.div>
              <div className="inline-flex items-center px-2 py-1 lg:px-3 lg:py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-xs lg:text-sm font-medium text-purple-700 dark:text-purple-300 mb-3 lg:mb-4">
                <Star className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 fill-current" />
                #1 in Ghana
              </div>
            </motion.div>
            
            {/* Mobile: Compact headline - reduced desktop font size */}
            <motion.div >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight lg:leading-[0.9]">
                <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <span className="block text-slate-900 dark:text-white">
                  Education
                </span>
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                  For Ghana
                </span>
              </h1>
            </motion.div>
            
            {/* Mobile: Shorter description - reduced desktop font size */}
            <motion.p 
               
              className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-md lg:max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Revolutionary AI learning designed for Ghanaian students. 
              <span className="text-purple-600 dark:text-purple-400 font-semibold block sm:inline"> Personalized & powerful.</span>
            </motion.p>
            
            {/* Mobile: Store buttons - reduced desktop button size */}
            <motion.div 
             
              className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start pt-2 lg:pt-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="default"
                  onClick={() => window.open('https://apps.apple.com/app/your-app-id', '_blank')}
                  className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 lg:px-6 lg:py-3 text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
                >
                  <AppStoreIcon />
                  <span className="ml-2 lg:ml-3">App Store</span>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  size="default"
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=your.package.name', '_blank')}
                  className="group border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 px-6 py-3 lg:px-6 lg:py-3 text-sm lg:text-base font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300 w-full sm:w-auto"
                >
                  <GooglePlayIcon />
                  <span className="ml-2 lg:ml-3">Google Play</span>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Mobile: Compact stats */}

          </motion.div>
          
          {/* Mobile-First App Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center order-1 lg:order-2"
          >
            <div className="relative">
              <motion.div
            
                className="relative w-[160px] sm:w-[200px] md:w-[240px] lg:w-[320px]"
              >
                {/* Mobile-optimized phone mockup */}
<div className="relative z-20 rounded-[2rem] lg:rounded-[3rem] overflow-hidden border-4 lg:border-[6px] border-slate-800 shadow-xl lg:shadow-2xl bg-slate-900">
  {/* Phone notch/dynamic island */}
  <div className="bg-slate-900 h-6 lg:h-8 rounded-t-[1.75rem] lg:rounded-t-[2.5rem] flex items-center justify-center">
    <div className="w-16 lg:w-24 h-1 lg:h-1.5 bg-slate-700 rounded-full"></div>
  </div>
  
  {/* Phone screen content with slideshow - Reduced height */}
  <div className="relative aspect-[9/16] bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
    <div className="relative w-full h-full">
      {screenshots.map((screenshot, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: currentScreenshot === index ? 1 : 0,
            scale: currentScreenshot === index ? 1 : 1.1,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            opacity: { duration: 0.6 }
          }}
          className="absolute inset-0"
        >
          <Image
            src={screenshot}
            alt={`EduMate GH App Screenshot ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index < 3} // Preload first 3 images for smooth start
          />
        </motion.div>
      ))}
      
      {/* App-like overlay with subtle branding */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-indigo-900/10"></div>
      
      {/* Optional: Screenshot indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {screenshots.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              currentScreenshot === index
                ? 'bg-white shadow-lg'
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  </div>
  
  {/* Phone bottom bezel */}
  <div className="bg-slate-900 h-3 lg:h-4 rounded-b-[1.75rem] lg:rounded-b-[2.5rem]"></div>
</div>
                
                {/* Simplified decorative elements for mobile */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 lg:-top-12 -right-6 lg:-right-12 w-24 h-24 lg:w-48 lg:h-48 bg-gradient-to-br from-purple-400/20 lg:from-purple-400/30 to-indigo-400/20 lg:to-indigo-400/30 rounded-full blur-xl lg:blur-3xl"
                />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-4 lg:-bottom-8 -left-4 lg:-left-8 w-20 h-20 lg:w-40 lg:h-40 bg-gradient-to-tr from-indigo-400/20 lg:from-indigo-400/30 to-purple-400/20 lg:to-purple-400/30 rounded-full blur-lg lg:blur-2xl"
                />
              </motion.div>
              
              {/* Mobile: Smaller feature highlights */}
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -right-2 lg:-right-8 top-1/4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-2 lg:p-3 rounded-lg lg:rounded-xl shadow-lg lg:shadow-xl border border-white/20 dark:border-slate-700/50"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-6 h-6 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md lg:shadow-lg">
                    <span className="text-white text-xs lg:text-sm font-bold">AI</span>
                  </div>
                  <div className="hidden sm:block lg:block">
                    <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">Smart Learning</p>
                    <p className="text-xs lg:text-xs text-slate-600 dark:text-slate-400">Adapts to you</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="absolute -left-2 lg:-left-8 bottom-1/3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-2 lg:p-3 rounded-lg lg:rounded-xl shadow-lg lg:shadow-xl border border-white/20 dark:border-slate-700/50"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-6 h-6 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md lg:shadow-lg">
                    <span className="text-white text-xs lg:text-sm font-bold">GH</span>
                  </div>
                  <div className="hidden sm:block lg:block">
                    <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">Ghana Syllabus</p>
                    <p className="text-xs lg:text-xs text-slate-600 dark:text-slate-400">100% aligned</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}