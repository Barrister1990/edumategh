"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { BookOpen, Menu, Smartphone, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/features", label: "Features", icon: "✨" },
    { href: "/download", label: "Download", icon: "📱" },
    { href: "/contact", label: "Contact", icon: "💬" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  const mobileMenuVariants: Variants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const mobileItemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      x: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      x: -30,
      filter: "blur(4px)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {/* Backdrop blur overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20 py-2" 
            : "bg-transparent py-4"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.1
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <motion.a 
              href="/" 
              className="flex items-center space-x-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <BookOpen className="h-5 w-5 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-2 h-2 text-white" />
                  </motion.div>
                </div>
              </motion.div>
              
              <div className="flex flex-col">
                <motion.span
                  className="text-xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  EduMate GH
                </motion.span>
                <motion.span
                  className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Learn Smarter
                </motion.span>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <motion.div 
              className="hidden md:flex items-center space-x-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  variants={itemVariants}
                  className="relative"
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <motion.a
                    href={link.href}
                    className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                    
                    {/* Hover background */}
                    <AnimatePresence>
                      {hoveredLink === link.href && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl -z-10"
                          layoutId="navHover"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.a>
                </motion.div>
              ))}

              {/* Desktop CTA Button */}
              <motion.div
                variants={itemVariants}
                className="ml-4"
              >
                <motion.button
                  className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Get Started Free
                  </span>
                  
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "200%"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden relative p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
              onClick={toggleMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? "close" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? 
                    <X className="h-6 w-6 text-gray-700 dark:text-gray-200" /> : 
                    <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                  }
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="container mx-auto px-4 py-6">
                
                {/* Navigation Links */}
                <div className="space-y-1 mb-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      variants={mobileItemVariants}
                    >
                      <motion.a
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-center gap-4 p-4 rounded-2xl text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 group"
                        whileHover={{ x: 8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                          {link.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{link.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {link.label === "Home" && "Back to homepage"}
                            {link.label === "Features" && "Explore app features"}
                            {link.label === "Download" && "Get the mobile app"}
                            {link.label === "Contact" && "Get in touch"}
                          </div>
                        </div>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.div>
                      </motion.a>
                    </motion.div>
                  ))}
                </div>

                {/* Download Buttons */}
                <motion.div
                  className="space-y-3"
                  variants={mobileItemVariants}
                >
                 

                  {/* Web App Button */}
                  <motion.button
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-medium opacity-90">TRY NOW</div>
                          <div className="text-lg font-bold">Web App</div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                    </div>
                    
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "200%"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 4,
                        delay: 2,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.button>
                </motion.div>


              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}