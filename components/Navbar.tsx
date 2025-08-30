"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { Menu, Smartphone, X, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20 py-2" 
            : "bg-transparent py-2 lg:py-4"
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
        <div className="container mx-auto px-3 lg:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <motion.a 
              href="/" 
              className="flex items-center space-x-2 lg:space-x-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Logo Image */}
              <div className="relative">
                <div className="w-8 h-8 lg:w-12 lg:h-12 relative">
                  <Image
                    src="/icon.png"
                    alt="EduMate GH Logo"
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
              </div>
              
              {/* Logo Text */}
              <div className="flex flex-col">
                <motion.span
                  className="text-base lg:text-xl font-black text-blue-600"
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
              className="hidden lg:flex items-center space-x-1"
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
                          className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl -z-10"
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
                  className="group relative px-6 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="admin/dashboard" className="relative flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Get Started Free
                  </Link>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="lg:hidden relative p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
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
                    <X className="h-4 w-4 text-gray-700 dark:text-gray-200" /> : 
                    <Menu className="h-4 w-4 text-gray-700 dark:text-gray-200" />
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
              className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="container mx-auto px-3 py-3">
                
                {/* Navigation Links */}
                <div className="space-y-1 mb-4">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      variants={mobileItemVariants}
                    >
                      <motion.a
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-center gap-3 p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
                        whileHover={{ x: 8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-base group-hover:scale-110 transition-transform duration-200">
                          {link.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{link.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {link.label === "Home" && "Back to homepage"}
                            {link.label === "Features" && "Explore app features"}
                            {link.label === "Download" && "Get the mobile app"}
                            {link.label === "Contact" && "Get in touch"}
                          </div>
                        </div>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm"
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
                  className="space-y-2"
                  variants={mobileItemVariants}
                >
                  {/* Web App Button */}
                  <motion.button
                    className="w-full group relative overflow-hidden bg-blue-500 text-white rounded-xl p-2.5 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-medium opacity-90">TRY NOW</div>
                          <div className="text-sm font-bold">Web App</div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                    </div>
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