"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Play, Star, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 1200);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
              <div className="inline-flex items-center px-2 py-1 lg:px-4 lg:py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-xs lg:text-sm font-medium text-purple-700 dark:text-purple-300 mb-3 lg:mb-4">
                <Star className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 fill-current" />
                #1 in Ghana
              </div>
            </motion.div>
            
            {/* Mobile: Compact headline */}
            <motion.div >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-black tracking-tight leading-tight lg:leading-[0.9]">
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
            
            {/* Mobile: Shorter description */}
            <motion.p 
               
              className="text-sm sm:text-base lg:text-2xl text-slate-600 dark:text-slate-300 max-w-md lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Revolutionary AI learning designed for Ghanaian students. 
              <span className="text-purple-600 dark:text-purple-400 font-semibold block sm:inline"> Personalized & powerful.</span>
            </motion.p>
            
            {/* Mobile: Compact buttons */}
            <motion.div 
             
              className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start pt-2 lg:pt-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="default"
                  className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
                >
                  <Download className="mr-2 lg:mr-3 h-4 w-4 lg:h-6 lg:w-6" />
                  Download Free
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  size="default"
                  onClick={scrollToFeatures}
                  className="group border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-lg font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300 w-full sm:w-auto"
                >
                  <Play className="mr-2 lg:mr-3 h-3 w-3 lg:h-5 lg:w-5 transition-transform group-hover:scale-110" />
                  See Demo
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Mobile: Compact stats */}
            <motion.div>
              <div className="flex justify-center lg:justify-start gap-4 lg:gap-8 text-center lg:text-left">
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <div className="p-1.5 lg:p-2 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg">
                    <Users className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">10K+</p>
                    <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">Students</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <div className="p-1.5 lg:p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
                    <Star className="w-4 h-4 lg:w-6 lg:h-6 text-indigo-600 dark:text-indigo-400 fill-current" />
                  </div>
                  <div>
                    <p className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">4.9★</p>
                    <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
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
            
                className="relative w-[200px] sm:w-[240px] md:w-[280px] lg:w-[350px]"
              >
                {/* Mobile-optimized phone mockup */}
                <div className="relative z-20 rounded-[2rem] lg:rounded-[3rem] overflow-hidden border-4 lg:border-[6px] border-slate-800 shadow-xl lg:shadow-2xl bg-slate-900">
                  <div className="bg-slate-900 h-4 lg:h-6 rounded-t-[1.75rem] lg:rounded-t-[2.5rem] flex items-center justify-center">
                    <div className="w-12 lg:w-20 h-0.5 lg:h-1 bg-slate-700 rounded-full"></div>
                  </div>
                  <Image
                    src="https://images.pexels.com/photos/5905885/pexels-photo-5905885.jpeg"
                    alt="EduMate GH App"
                    width={350}
                    height={700}
                    className="w-full h-auto object-cover"
                  />
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
                className="absolute -right-2 lg:-right-8 top-1/4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-2 lg:p-4 rounded-lg lg:rounded-2xl shadow-lg lg:shadow-xl border border-white/20 dark:border-slate-700/50"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-6 h-6 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-md lg:shadow-lg">
                    <span className="text-white text-xs lg:text-sm font-bold">AI</span>
                  </div>
                  <div className="hidden sm:block lg:block">
                    <p className="text-xs lg:text-base font-bold text-slate-900 dark:text-white">Smart Learning</p>
                    <p className="text-xs lg:text-xs text-slate-600 dark:text-slate-400">Adapts to you</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="absolute -left-2 lg:-left-8 bottom-1/3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-2 lg:p-4 rounded-lg lg:rounded-2xl shadow-lg lg:shadow-xl border border-white/20 dark:border-slate-700/50"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-6 h-6 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-md lg:shadow-lg">
                    <span className="text-white text-xs lg:text-sm font-bold">GH</span>
                  </div>
                  <div className="hidden sm:block lg:block">
                    <p className="text-xs lg:text-base font-bold text-slate-900 dark:text-white">Ghana Syllabus</p>
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