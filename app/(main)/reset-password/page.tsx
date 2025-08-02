"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase"; // Add your Supabase client import
import { motion, Variants } from "framer-motion";
import { ArrowRight, CheckCircle, Eye, EyeOff, Lock, Shield, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationStep, setAnimationStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionRestored, setSessionRestored] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Parse tokens from URL hash fragment
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '?'));

    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          setVerifying(false);
          if (error) {
            console.error('Session restore failed:', error.message);
            setError('This password reset link is invalid or has expired.');
          } else {
            console.log('Session restored');
            setSessionRestored(true);
          }
        });
    } else {
      setVerifying(false);
      setError('Missing reset token. Please request a new link.');
    }
  }, []);

  const openApp = () => {
    // This will try to open the app
    window.location.href = 'edumate-gh://';

    // Fallback to /download route after 2 seconds if app isn't installed
    setTimeout(() => {
      window.location.href = '/download';
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call Supabase to update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (error) {
      setError('An error occurred while resetting the password');
      setLoading(false);
    }
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

  // Floating particles animation with blue/teal theme
  const floatingParticles = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-70"
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

  // Show verification screen while checking the reset link
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/30 dark:from-slate-950 dark:via-blue-950/10 dark:to-teal-950/20 relative overflow-hidden">
        {/* Dynamic background */}
        <div 
          className="absolute inset-0 opacity-20 lg:opacity-30 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          }}
        />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-40 h-40 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-400/10 to-teal-400/10 lg:from-blue-400/20 lg:to-teal-400/20 rounded-full blur-2xl lg:blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-48 h-48 lg:w-96 lg:h-96 bg-gradient-to-tr from-teal-400/10 to-blue-400/10 lg:from-teal-400/20 lg:to-blue-400/20 rounded-full blur-2xl lg:blur-3xl"
          />
          
          {/* Floating Particles */}
          {floatingParticles}
        </div>

        {/* Verification Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-center"
        >
          {/* App Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative z-10 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl lg:shadow-2xl mx-auto mb-6 overflow-hidden"
          >
            <Image
              src="/icon.png"
              alt="EduMate GH Logo"
              width={32}
              height={32}
              className="lg:w-10 lg:h-10 object-contain"
              priority
            />
          </motion.div>

          {/* Loading spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
          />

          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Verifying Reset Link
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please wait while we verify your password reset link...
          </p>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/30 dark:from-slate-950 dark:via-blue-950/10 dark:to-teal-950/20 relative overflow-hidden">
        {/* Dynamic background */}
        <div 
          className="absolute inset-0 opacity-20 lg:opacity-30 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          }}
        />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-40 h-40 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-400/10 to-teal-400/10 lg:from-blue-400/20 lg:to-teal-400/20 rounded-full blur-2xl lg:blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-48 h-48 lg:w-96 lg:h-96 bg-gradient-to-tr from-teal-400/10 to-blue-400/10 lg:from-teal-400/20 lg:to-blue-400/20 rounded-full blur-2xl lg:blur-3xl"
          />
          
          {/* Floating Particles */}
          {floatingParticles}
        </div>

        {/* Success Content */}
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
              animate="pulse"
              className="absolute inset-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full"
            />
            <motion.div
              variants={pulseVariants}
              animate="pulse"
              className="absolute inset-2 lg:inset-3 w-20 h-20 lg:w-26 lg:h-26 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-full"
              transition={{ delay: 0.3 }}
            />
            
            {/* Main success icon */}
            <motion.div
              variants={iconVariants}
              className="relative z-10 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl lg:shadow-2xl"
            >
              <CheckCircle className="w-12 h-12 lg:w-16 lg:h-16 text-white" strokeWidth={2} />
            </motion.div>
            
            {/* Sparkle effects */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3"
            >
              <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-400 animate-pulse" />
            </motion.div>
          </motion.div>

          {/* Main heading */}
          <motion.div variants={item} className="mb-4 lg:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Password Reset!
              </span>
            </h1>
          </motion.div>

          {/* Success message */}
          <motion.div variants={item} className="mb-6 lg:mb-8">
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
              Your password has been successfully updated. You can now access your EduMate GH account with your new password.
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
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <span className="text-sm lg:text-base font-semibold text-slate-900 dark:text-white">
                Account Security Enhanced
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="flex items-center justify-center space-x-3 p-3 lg:p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 shadow-lg"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
                <Image
                  src="/icon.png"
                  alt="EduMate GH"
                  width={20}
                  height={20}
                  className="lg:w-5 lg:h-5 object-contain"
                />
              </div>
              <span className="text-sm lg:text-base font-semibold text-slate-900 dark:text-white">
                Ready to Continue Learning
              </span>
            </motion.div>
          </motion.div>

          {/* Action button */}
          <motion.div variants={item}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg"
                onClick={openApp}
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 lg:px-10 lg:py-4 text-base lg:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group w-full sm:w-auto min-w-[200px]"
              >
                <span className="flex items-center justify-center">
                  Open EduMate GH
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
          </motion.div>

          {/* Bottom decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="flex items-center justify-center space-x-2 text-xs lg:text-sm text-slate-400 dark:text-slate-500">
              <span>Powered by</span>
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                EduMate AI
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Show error screen if verification failed
  if (error && !sessionRestored) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/30 dark:from-slate-950 dark:via-blue-950/10 dark:to-teal-950/20 relative overflow-hidden">
        {/* Dynamic background */}
        <div 
          className="absolute inset-0 opacity-20 lg:opacity-30 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          }}
        />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-40 h-40 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-400/10 to-teal-400/10 lg:from-blue-400/20 lg:to-teal-400/20 rounded-full blur-2xl lg:blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-48 h-48 lg:w-96 lg:h-96 bg-gradient-to-tr from-teal-400/10 to-blue-400/10 lg:from-teal-400/20 lg:to-blue-400/20 rounded-full blur-2xl lg:blur-3xl"
          />
          
          {/* Floating Particles */}
          {floatingParticles}
        </div>

        {/* Error Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-center"
        >
          {/* App Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative z-10 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl lg:shadow-2xl mx-auto mb-6 overflow-hidden"
          >
            <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </motion.div>

          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Invalid Reset Link
          </h2>
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Please request a new password reset link from the app or website.
          </p>
          
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
          >
            Go to Homepage
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50/20 to-teal-50/30 dark:from-slate-950 dark:via-blue-950/10 dark:to-teal-950/20 relative overflow-hidden">
      {/* Dynamic background */}
      <div 
        className="absolute inset-0 opacity-20 lg:opacity-30 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
        }}
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-40 h-40 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-400/10 to-teal-400/10 lg:from-blue-400/20 lg:to-teal-400/20 rounded-full blur-2xl lg:blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-48 h-48 lg:w-96 lg:h-96 bg-gradient-to-tr from-teal-400/10 to-blue-400/10 lg:from-teal-400/20 lg:to-blue-400/20 rounded-full blur-2xl lg:blur-3xl"
        />
        
        {/* Floating Particles */}
        {floatingParticles}
      </div>

      {/* Main Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg mx-auto"
      >
        {/* Header with App Logo */}
        <motion.div className="relative mb-6 lg:mb-8 text-center">
          {/* App Logo */}
          <motion.div
            variants={iconVariants}
            className="relative z-10 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl lg:shadow-2xl mx-auto mb-4 overflow-hidden"
          >
            <Image
              src="/icon.png"
              alt="EduMate GH Logo"
              width={32}
              height={32}
              className="lg:w-10 lg:h-10 object-contain"
              priority
            />
          </motion.div>
          
          <motion.div variants={item}>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              <span className="block bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Reset Password
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              Create a new secure password for your account
            </p>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        {error && sessionRestored && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <motion.div variants={item}>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="block w-full pl-10 pr-12 py-3 lg:py-4 text-sm lg:text-base border border-slate-300 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div variants={item}>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="block w-full pl-10 pr-12 py-3 lg:py-4 text-sm lg:text-base border border-slate-300 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Password Requirements */}
          <motion.div variants={item}>
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-lg p-3 lg:p-4">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Password Requirements:</h4>
              <ul className="text-xs lg:text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-slate-300'}`} />
                  At least 6 characters long
                </li>
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${newPassword === confirmPassword && newPassword.length > 0 ? 'bg-green-500' : 'bg-slate-300'}`} />
                  Passwords match
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={item}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit"
                size="lg"
                disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-8 py-4 lg:px-10 lg:py-4 text-base lg:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group w-full"
              >
                <span className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-slate-200/50 dark:border-slate-700/50 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-xs lg:text-sm text-slate-400 dark:text-slate-500">
            <span>Powered by</span>
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              EduMate AI
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}