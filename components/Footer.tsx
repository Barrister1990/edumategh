"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Code2,
  ExternalLink,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Twitter,
  Youtube
} from "lucide-react";
import { useState } from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const socialLinks = [
    { 
      href: "https://facebook.com", 
      icon: Facebook, 
      label: "Facebook",
      color: "from-blue-600 to-blue-700",
      hoverColor: "hover:text-blue-600"
    },
    { 
      href: "https://twitter.com", 
      icon: Twitter, 
      label: "Twitter",
      color: "from-sky-500 to-sky-600",
      hoverColor: "hover:text-sky-500"
    },
    { 
      href: "https://instagram.com", 
      icon: Instagram, 
      label: "Instagram",
      color: "from-pink-500 via-red-500 to-yellow-500",
      hoverColor: "hover:text-pink-500"
    },
    { 
      href: "https://youtube.com", 
      icon: Youtube, 
      label: "YouTube",
      color: "from-red-600 to-red-700",
      hoverColor: "hover:text-red-600"
    },
  ];

  const quickLinks = [
    { href: "/features", label: "Features", description: "Explore app features" },
    { href: "/about", label: "About Us", description: "Our story and mission" },
    { href: "/download", label: "Download App", description: "Get the mobile app" },
    { href: "/contact", label: "Contact Us", description: "Get in touch" },
    { href: "/privacy", label: "Privacy Policy", description: "Your data protection" },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      text: "Accra, Ghana",
      color: "text-green-500"
    },
    {
      icon: Mail,
      text: "hello@edumate.gh",
      color: "text-blue-500"
    },
    {
      icon: Phone,
      text: "+233 20 123 4567",
      color: "text-purple-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-pink-200/20 to-yellow-200/20 dark:from-pink-900/20 dark:to-yellow-900/20 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          
          {/* About Section */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            variants={itemVariants}
          >
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="relative"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <BookOpen className="h-6 w-6 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-2 h-2 text-white" />
                  </motion.div>
                </div>
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  EduMate GH
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium -mt-1">
                  Learn Smarter
                </span>
              </div>
            </motion.div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Empowering students in Ghana with AI-powered educational tools that make learning personalized, accessible, and engaging.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={`relative p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-500 dark:text-gray-400 ${social.hoverColor} transition-all duration-300 group`}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredSocial(social.label)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <social.icon size={20} />
                  <span className="sr-only">{social.label}</span>
                  
                  {/* Hover glow effect */}
                  <AnimatePresence>
                    {hoveredSocial === social.label && (
                      <motion.div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${social.color} opacity-20 -z-10`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.2, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links & Contact - Mobile: Same Row, Desktop: Separate Columns */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Quick Links */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  ⚡
                </motion.div>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.a
                      href={link.href}
                      className="group flex items-start gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                      whileHover={{ x: 4, scale: 1.01 }}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1"
                        animate={hoveredLink === link.href ? { x: [0, 3, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {link.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {link.description}
                        </div>
                      </div>
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📞
                </motion.div>
                Contact Us
              </h3>
              <ul className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3 group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 2 }}
                  >
                    <motion.div
                      className={`p-2 rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 ${contact.color} shadow-sm group-hover:shadow-md transition-all duration-300`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <contact.icon size={16} />
                    </motion.div>
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors flex-1">
                      {contact.text}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Developer Website */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Code2 className="w-5 h-5 text-purple-500" />
              </motion.div>
              Developer
            </h3>
            
            <motion.a
              href="https://developer-website.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl transition-all duration-300"
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                boxShadow: "0 20px 40px -10px rgba(147, 51, 234, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg"
                    whileHover={{ rotate: 15 }}
                  >
                    <Code2 className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100">Portfolio</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">View our work</div>
                  </div>
                </div>
                <motion.div
                  className="text-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ExternalLink className="w-5 h-5" />
                </motion.div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                Discover more innovative projects and solutions crafted with passion and precision.
              </p>
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                animate={{
                  x: ["-100%", "200%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
            </motion.a>
          </motion.div>
        </motion.div>
        
        {/* Separator */}
        <motion.div 
          className="my-12 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        
        {/* Footer Bottom */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            whileHover={{ scale: 1.02 }}
          >
            <span>&copy; {currentYear} EduMate GH. Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </motion.div>
            <span>in Ghana</span>
          </motion.div>
          
          <div className="flex space-x-6">
            <motion.a 
              href="/terms" 
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              whileHover={{ y: -1 }}
            >
              Terms of Service
            </motion.a>
            <motion.a 
              href="/privacy" 
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
              whileHover={{ y: -1 }}
            >
              Privacy Policy
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}