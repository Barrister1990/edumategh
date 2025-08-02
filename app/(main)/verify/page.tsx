"use client";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { ArrowRight, CheckCircle, Mail, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function EmailConfirmationPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationStep, setAnimationStep] = useState(0);

const openApp = () => {
  // This will try to open the app
  window.location.href = 'edumate-gh://';

  // Fallback to /download route after 2 seconds if app isn't installed
  setTimeout(() => {
    window.location.href = '/download';
  }, 5000);
};

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Animation sequence timing
    const timers = [
      setTimeout(() => setAnimationStep(1), 800),
      setTimeout(() => setAnimationStep(2), 1400),
      setTimeout(() => setAnimationStep(3), 2000),
    ];

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        ease: [0.6, -0.05, 0.01, 0.99]
      } 
    },
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    show: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }
    },
  };

  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1]
      }
    }
  };

  // Floating particles animation
  const floatingParticles = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-70"
      animate={{
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        scale: [0, 1, 0],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: [0.4, 0, 0.6, 1]
      }}
      style={{
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`,
      }}
    />
  ));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/30 dark:from-slate-950 dark:via-purple-950/10 dark:to-indigo-950/20 relative overflow-hidden">
      {/* Dynamic background */}
      <div 
        className="absolute inset-0 opacity-20 lg:opacity-30 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.1), transparent 40%)`,
        }}
      />
      
      {/* Animated background elements */}
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
        
        {/* Floating Particles */}
        {floatingParticles}
      </div>

      {/* Main Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-center"
      >
        {/* Success Icon with animated rings */}
        <motion.div className="relative mb-6 lg:mb-8 flex justify-center">
          {/* Animated rings */}
          <motion.div
            variants={pulseVariants}
            animate={animationStep >= 1 ? "pulse" : ""}
            className="absolute inset-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full"
          />
          <motion.div
            variants={pulseVariants}
            animate={animationStep >= 2 ? "pulse" : ""}
            className="absolute inset-2 lg:inset-3 w-20 h-20 lg:w-26 lg:h-26 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full"
            transition={{ delay: 0.3 }}
          />
          
          {/* Main success icon */}
          <motion.div
            variants={iconVariants}
            className="relative z-10 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl lg:shadow-2xl"
          >
            <CheckCircle className="w-12 h-12 lg:w-16 lg:h-16 text-white" strokeWidth={2} />
          </motion.div>
          
          {/* Sparkle effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={animationStep >= 3 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3"
          >
            <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-400 animate-pulse" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={animationStep >= 3 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute -bottom-1 -left-2 lg:-bottom-2 lg:-left-3"
          >
            <Sparkles className="w-4 h-4 lg:w-6 lg:h-6 text-purple-400 animate-pulse" />
          </motion.div>
        </motion.div>

        {/* Main heading */}
        <motion.div variants={item} className="mb-4 lg:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent">
              Email Confirmed!
            </span>
          </h1>
        </motion.div>

        {/* Success message */}
        <motion.div variants={item} className="mb-6 lg:mb-8">
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
            Welcome to EduMate GH! Your account is now verified and ready to revolutionize your learning experience.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div variants={item} className="mb-8 lg:mb-10 space-y-3 lg:space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex items-center justify-center space-x-3 p-3 lg:p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 shadow-lg"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xs lg:text-sm font-bold">AI</span>
            </div>
            <span className="text-sm lg:text-base font-semibold text-slate-900 dark:text-white">
              Personalized AI Learning Activated
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="flex items-center justify-center space-x-3 p-3 lg:p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 shadow-lg"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xs lg:text-sm font-bold">GH</span>
            </div>
            <span className="text-sm lg:text-base font-semibold text-slate-900 dark:text-white">
              Ghana Curriculum Ready
            </span>
          </motion.div>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={item} className="space-y-3 lg:space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg"
              onClick={openApp}
              className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 lg:px-10 lg:py-4 text-base lg:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group w-full sm:w-auto min-w-[200px]"
            >
              <span className="flex items-center justify-center">
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
              <Mail className="w-4 h-4 mr-2" />
              Check your email for additional setup instructions
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="flex items-center justify-center space-x-2 text-xs lg:text-sm text-slate-400 dark:text-slate-500">
            <span>Powered by</span>
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              EduMate AI
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}