"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Clock, Star, Target, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  // App screenshots - using all available educational/learning themed images
  const screenshots = [
    "/images/Home.jpg",
    "/images/quiz.jpg", 
    "/images/result.jpg",
    "/images/Lesssons.jpg",
    "/images/language.jpg",
    "/images/plan.jpg",
    "/images/past.jpg",
    "/images/score.jpg",
    "/images/AI.jpg"
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Auto-advance slideshow every 3.5 seconds for better engagement
    const slideshowTimer = setInterval(() => {
      setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    }, 3500);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
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
        ease: "easeOut" as const
      } 
    },
  };

  const floatingAnimation = {
    y: ["-8px", "8px", "-8px"],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  // App Store Icon Component
  const AppStoreIcon = () => (
    <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.88C10.15 6.85 11.35 7.72 12.1 7.72C12.81 7.72 14.28 6.66 15.92 6.84C16.61 6.87 18.39 7.16 19.56 8.83C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
    </svg>
  );

  // Google Play Icon Component
  const GooglePlayIcon = () => (
    <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="currentColor">
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
    <section className="relative min-h-screen flex items-center pt-16 lg:pt-20 pb-12 lg:pb-16 px-3 lg:px-4 overflow-hidden bg-white dark:bg-slate-950">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      {/* Floating accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-16 lg:top-20 right-16 lg:right-20 w-24 h-24 lg:w-32 lg:h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={floatingAnimation}
          transition={{ delay: 1 }}
          className="absolute bottom-16 lg:bottom-20 left-16 lg:left-20 w-32 h-32 lg:w-40 lg:h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center lg:text-left space-y-6 lg:space-y-8"
          >
            {/* Badge */}
            <motion.div variants={item}>
              <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-xs lg:text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Star className="w-3 h-3 lg:w-4 lg:h-4 mr-2 fill-current" />
                #1 BECE, NOVDEC & WASSCE App
              </div>
            </motion.div>
            
            {/* Main Headline */}
            <motion.div variants={item}>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[0.9]">
                <span className="block text-slate-900 dark:text-white">
                  AI-Powered
                </span>
                <span className="block text-blue-600 dark:text-blue-400 mt-2">
                  Exam Preparation
                </span>
                <span className="block text-slate-900 dark:text-white mt-2">
                  For Ghana
                </span>
              </h1>
            </motion.div>
            
            {/* Description */}
            <motion.p variants={item} className="text-base lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Master BECE, NOVDEC, and WASSCE with AI-powered lessons, quizzes, and personalized remedial support. 
              Comprehensive curriculum coverage with 24/7 AI tutoring designed for Ghanaian students.
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold"> Start with 500 free coins!</span>
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start pt-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button 
                  onClick={() => window.open('https://apps.apple.com/app/id6747842263', '_blank')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto flex items-center justify-center"
                >
                  <AppStoreIcon />
                  <span className="ml-2 lg:ml-3">Start Exam Prep</span>
                  <ArrowRight className="ml-2 h-3 w-3 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button 
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=com.edumategh.app', '_blank')}
                  className="border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300 w-full sm:w-auto flex items-center justify-center rounded-full"
                >
                  <GooglePlayIcon />
                  <span className="ml-2 lg:ml-3">Download Free</span>
                </button>
              </motion.div>
            </motion.div>
            
            {/* Quick Stats */}
            <motion.div variants={item} className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8 pt-6 lg:pt-8">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">10,000+</div>
                <div className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">Curriculum aligned lessons</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">10,000+</div>
                <div className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">AI Quizzes</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">24/7</div>
                <div className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">AI Support</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-yellow-600 dark:text-yellow-400">500</div>
                <div className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">Free Coins</div>
              </div>
            </motion.div>
            
            {/* Coin System Badge */}
            <motion.div variants={item} className="pt-4">
              <div className="inline-flex items-center px-4 py-2 lg:px-5 lg:py-2.5 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 text-xs lg:text-sm font-medium text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                Get 500 Free Coins on Sign Up!
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right App Preview - iPhone 16 Pro Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Main iPhone 16 Pro Mockup */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
                className="relative z-20"
              >
                <div className="relative w-[260px] sm:w-[300px] lg:w-[400px] h-[540px] sm:h-[640px] lg:h-[820px]">
                  {/* Premium Glow Effect Behind Phone */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 via-purple-400/10 to-pink-400/15 rounded-[3.2rem] lg:rounded-[4rem] blur-3xl scale-105"></div>
                  
                  {/* iPhone 16 Pro Titanium Frame - Natural Titanium Color */}
                  <div className="relative h-full rounded-[3rem] lg:rounded-[3.8rem] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.25),0_2px_16px_rgba(0,0,0,0.1)] bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700">
                    
                    {/* Titanium Frame Outer Edge */}
                    <div className="absolute inset-0 rounded-[3rem] lg:rounded-[3.8rem] border-[3px] border-gradient-to-b from-slate-500 to-slate-600"></div>
                    
                    {/* Inner Frame with Screen Cutout */}
                    <div className="relative h-full m-[3px] rounded-[2.8rem] lg:rounded-[3.6rem] overflow-hidden bg-black">
                      
                      {/* Screen Bezel - Thinner and More Accurate */}
                      <div className="relative h-full inset-[2px] rounded-[2.6rem] lg:rounded-[3.4rem] overflow-hidden bg-white">
                        
                        {/* Top Notch Area with Dynamic Island */}
                        <div className="relative h-8 lg:h-10 bg-black flex items-center justify-center">
                          {/* Dynamic Island - More Accurate Size and Position */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 lg:w-32 h-6 lg:h-7 bg-black rounded-full shadow-inner">
                            <div className="absolute inset-0.5 bg-gradient-to-r from-slate-900 to-black rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Main Screen Content Area */}
                        <div className="relative h-[calc(100%-4rem)] lg:h-[calc(100%-5rem)] bg-white overflow-hidden">
                          <div className="relative w-full h-full">
                            {screenshots.map((screenshot, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{
                                  opacity: currentScreenshot === index ? 1 : 0,
                                  scale: currentScreenshot === index ? 1 : 1.05,
                                }}
                                transition={{
                                  duration: 0.6,
                                  ease: "easeInOut",
                                }}
                                className="absolute inset-0"
                              >
                                <Image
                                  src={screenshot}
                                  alt={`EduMate GH App Screenshot ${index + 1}`}
                                  fill
                                  className="object-cover object-center"
                                  priority={index < 3}
                                />
                              </motion.div>
                            ))}
                            
                            {/* Premium Screen Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10"></div>
                            
                            {/* Screenshot Indicators */}
                            <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                              {screenshots.map((_, index) => (
                                <motion.div
                                  key={index}
                                  className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full transition-all duration-300 ${
                                    currentScreenshot === index
                                      ? 'bg-blue-500 shadow-lg scale-110 ring-2 ring-blue-200'
                                      : 'bg-gray-300 scale-100'
                                  }`}
                                  whileHover={{ scale: 1.2 }}
                                />
                              ))}
                            </div>
                            
                            {/* Premium Screen Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        </div>
                        
                        {/* Bottom Home Indicator Area */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 lg:h-9 bg-black flex items-center justify-center">
                          <div className="w-32 lg:w-36 h-1 lg:h-1.5 bg-white rounded-full opacity-60"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Floating Feature Cards with Better Effects */}
                  <motion.div
                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute -right-2 lg:-right-8 top-1/4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">AI Lessons</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Interactive Learning</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="absolute -left-2 lg:-left-8 bottom-1/3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">Smart Quizzes</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">AI-Generated Tests</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* New Feature Card - Top */}
                  <motion.div
                    initial={{ opacity: 0, y: -30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="absolute -top-2 lg:-top-4 left-1/2 transform -translate-x-1/2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">Instant Results</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Real-time Feedback</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Bottom Feature Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="absolute -bottom-2 lg:-bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                        <Target className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">Remedial Support</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">BECE, NOVDEC, WASSCE</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Right Side Feature Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="absolute -right-2 lg:-right-8 bottom-1/4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                        <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-bold text-slate-900 dark:text-white">24/7 Access</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Always Available</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}