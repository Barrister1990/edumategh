"use client"
import { motion } from "framer-motion";
import { Apple, Award, ChevronRight, Download, PlayCircle, Star, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function DownloadPage() {
  const [activeTab, setActiveTab] = useState("android");
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Auto-rotate through screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreenshot((prev) => (prev + 1) % appScreenshots.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const appScreenshots = [
    {
      src: "/images/Home.jpg",
      alt: "Dashboard screen",
      caption: "Smart Dashboard"
    },
    {
      src: "/images/Lesssons.jpg", 
      alt: "Lesson screen",
      caption: "Interactive Learning"
    },
    {
      src: "/images/quiz.jpg",
      alt: "Quiz screen", 
      caption: "Smart Quizzes"
    },
    {
      src: "/images/result.jpg",
      alt: "Results screen",
      caption: "Track Progress"
    },
    {
      src: "/images/score.jpg",
      alt: "Score screen",
      caption: "Performance Analytics"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 lg:pt-20 lg:pb-12 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-blue-600"
          style={{
            backgroundImage: `url('/images/download.jpg')`
          }}
        />
        
        {/* Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
        
        {/* Subtle Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="container mx-auto px-3 lg:px-6 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* App Logo */}
            <motion.div 
              variants={itemVariants}
              className="mb-6 lg:mb-8"
            >
              <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl flex items-center justify-center mb-4 border border-white/30">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl overflow-hidden flex items-center justify-center relative">
                  <Image 
                    src="/icon.png" 
                    alt="EduMate GH Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="text-white text-sm lg:text-base  font-semibold">EduMate GH</div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 drop-shadow-lg"
            >
              Transform Your Learning
              <span className="block text-2xl sm:text-3xl lg:text-5xl text-yellow-300 mt-2 drop-shadow-lg">
                Download Now
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-base lg:text-xl text-white mb-6 lg:mb-8 max-w-2xl mx-auto px-3 font-medium"
            >
              Join thousands of students already using Ghana&apos;s #1 learning app
            </motion.p>
            
            {/* Quick Stats */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-8"
            >
              <div className="flex items-center gap-2 text-sm lg:text-base bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30 text-white">
                <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-300 fill-current" />
                <span className="font-semibold">4.9</span>
                <span>Rating</span>
              </div>
              <div className="flex items-center gap-2 text-sm lg:text-base bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30 text-white">
                <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                <span><span className="font-semibold">50K+</span> Students</span>
              </div>
              <div className="flex items-center gap-2 text-sm lg:text-base bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30 text-white">
                <Award className="w-4 h-4 lg:w-5 lg:h-5" />
                <span><span className="font-semibold">#1</span> Education App</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* App Store Section */}
      <section className="py-8 lg:py-16 -mt-4 relative z-10">
        <div className="container mx-auto px-3 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Download Options */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4 text-gray-900">
                  Get the App
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  Available on all platforms. Choose your device:
                </p>
              </div>

              {/* Platform Tabs */}
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 lg:mb-8">
                <button
                  onClick={() => handleTabChange("android")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm lg:text-base font-medium transition-all ${
                    activeTab === "android"
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                    Android
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange("ios")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm lg:text-base font-medium transition-all ${
                    activeTab === "ios"
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Apple className="w-4 h-4 lg:w-5 lg:h-5" />
                    iOS
                  </div>
                </button>
              </div>

              {/* Android Content */}
              {activeTab === "android" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4 lg:space-y-6"
                >
                  {/* Play Store Card */}
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden relative flex-shrink-0">
                        <Image 
                          src="/adaptive-icon.png" 
                          alt="EduMate GH Logo" 
                          fill 
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg lg:text-xl text-gray-900 mb-1">EduMate GH</h3>
                        <p className="text-sm lg:text-base text-gray-600 mb-2">Education • Learning</p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-xs lg:text-sm text-gray-600 ml-1">4.9</span>
                          </div>
                          <span className="text-xs lg:text-sm text-gray-600">50K+ downloads</span>
                        </div>
                        <div className="space-y-2 text-xs lg:text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                            Android 7.0+
                          </div>
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                            80 MB • Free with in-app purchases
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-blue-600 text-white py-3 lg:py-4 rounded-xl font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transition-all"
                      onClick={() => window.open('https://play.google.com/store/apps/details?id=com.edumategh.app', '_blank', 'noopener,noreferrer')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                        Get it on Google Play
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* Features Preview */}
                  <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 lg:gap-4">
                    {[
                      { icon: "📚", title: "1000+ Lessons", desc: "All subjects covered" },
                      { icon: "🎯", title: "Smart Quizzes", desc: "Adaptive learning" },
                      { icon: "👥", title: "Study Groups", desc: "Learn together" },
                      { icon: "📱", title: "Offline Mode", desc: "Learn anywhere" }
                    ].map((feature, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-gray-100">
                        <div className="text-xl lg:text-2xl mb-1 lg:mb-2">{feature.icon}</div>
                        <div className="font-semibold text-xs lg:text-sm text-gray-900 mb-1">{feature.title}</div>
                        <div className="text-xs text-gray-600">{feature.desc}</div>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* iOS Content */}
              {activeTab === "ios" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4 lg:space-y-6"
                >
                  {/* App Store Card */}
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden relative flex-shrink-0 bg-blue-600">
                        <Image 
                          src="/icon.png" 
                          alt="App Store Logo" 
                          fill 
                          className="object-contain p-3"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg lg:text-xl text-gray-900 mb-1">EduMate GH</h3>
                        <p className="text-sm lg:text-base text-gray-600 mb-2">Education • Ghana Education Service</p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-xs lg:text-sm text-gray-600 ml-1">4.9</span>
                          </div>
                          <span className="text-xs lg:text-sm text-gray-600">#1 in Education</span>
                        </div>
                        <div className="space-y-2 text-xs lg:text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
                            iOS 12.0+ • iPhone, iPad, iPod touch
                          </div>
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
                            60 MB • Free with in-app purchases
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-blue-600 text-white py-3 lg:py-4 rounded-xl font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transition-all"
                      onClick={() => window.open('https://apps.apple.com/app/id6747842263', '_blank', 'noopener,noreferrer')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                        Download on App Store
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* Features Preview */}
                  <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 lg:gap-4">
                    {[
                      { icon: "🎨", title: "Beautiful UI", desc: "Native iOS design" },
                      { icon: "⚡", title: "Fast & Smooth", desc: "Optimized performance" },
                      { icon: "🔒", title: "Privacy First", desc: "Your data is safe" },
                      { icon: "📊", title: "Progress Sync", desc: "iCloud integration" }
                    ].map((feature, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-gray-100">
                        <div className="text-xl lg:text-2xl mb-1 lg:mb-2">{feature.icon}</div>
                        <div className="font-semibold text-xs lg:text-sm text-gray-900 mb-1">{feature.title}</div>
                        <div className="text-xs text-gray-600">{feature.desc}</div>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Phone Mockup */}
            <motion.div 
              className="order-1 lg:order-2 flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                variants={floatingVariants}
                animate="animate"
                className="relative"
              >
                {/* Subtle Glow Behind Phone */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl scale-150"></div>
                {/* Enhanced Phone Frame */}
                <div className="relative w-64 h-[520px] lg:w-80 lg:h-[640px]">
                  {/* Phone Frame with Enhanced Design */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[3rem] lg:rounded-[4rem] p-2 lg:p-3 shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-gray-700">
                    
                    {/* Enhanced Dynamic Island */}
                    <div className="absolute top-0 left-1/2 w-24 h-6 lg:w-32 lg:h-8 -translate-x-1/2 bg-gradient-to-b from-black via-gray-900 to-gray-800 rounded-b-2xl z-10 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-b-2xl"></div>
                    </div>
                    
                    {/* Enhanced Screen */}
                    <div className="h-full w-full bg-white overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] relative shadow-inner">
                      <div className="relative w-full h-full">
                        {appScreenshots.map((screenshot, index) => (
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
                              src={screenshot.src}
                              alt={screenshot.alt}
                              fill
                              className="object-cover object-center"
                              priority={index < 3}
                            />
                          </motion.div>
                        ))}
                        
                        {/* Enhanced App Interface Overlay with Glass Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/15"></div>
                        
                        {/* Enhanced Screenshot Indicators */}
                        <div className="absolute bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 lg:space-x-2.5">
                          {appScreenshots.map((_, index) => (
                            <motion.div
                              key={index}
                              className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full transition-all duration-300 ${
                                currentScreenshot === index
                                  ? 'bg-white shadow-lg scale-110 ring-2 ring-white/50'
                                  : 'bg-white/60 scale-100'
                              }`}
                              whileHover={{ scale: 1.2 }}
                            />
                          ))}
                        </div>
                        
                        {/* Subtle Screen Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Side Buttons */}
                    <div className="absolute right-0 top-1/4 w-1 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-full"></div>
                    <div className="absolute right-0 top-1/2 w-1 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-full"></div>
                    <div className="absolute right-0 top-3/4 w-1 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-full"></div>
                    
                    {/* Enhanced Volume Buttons */}
                    <div className="absolute left-0 top-1/4 w-1 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-r-full"></div>
                    <div className="absolute left-0 top-1/2 w-1 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-r-full"></div>
                    
                    {/* Enhanced Power Button */}
                    <div className="absolute right-0 top-1/3 w-1 h-16 bg-gradient-to-b from-gray-600 to-gray-800 rounded-l-full"></div>
                  </div>
                </div>
                
                {/* Enhanced Floating Elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-yellow-300/50 backdrop-blur-sm"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Star className="w-6 h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-green-300/50 backdrop-blur-sm"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Award className="w-6 h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-8 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-3 lg:px-6">
          <motion.div 
            className="text-center mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
              Why Students Love EduMate GH
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who are already transforming their learning experience
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
            {[
              {
                emoji: "🚀",
                title: "Boost Grades by 40%",
                description: "Students see significant improvement in their academic performance"
              },
              {
                emoji: "⏰", 
                title: "Save 3 Hours Daily",
                description: "Smart learning paths help you study more efficiently"
              },
              {
                emoji: "🎯",
                title: "Pass Rate 95%",
                description: "Our adaptive system ensures you master every concept"  
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100"
              >
                <div className="text-3xl lg:text-4xl mb-3 lg:mb-4">{feature.emoji}</div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">{feature.title}</h3>
                <p className="text-sm lg:text-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-20 bg-blue-600 relative overflow-hidden">
        <div className="container mx-auto px-3 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-base lg:text-xl text-white/90 mb-6 lg:mb-8">
              Download EduMate GH now and join the learning revolution
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
              href="https://play.google.com/store/apps/details?id=com.edumategh.app"
              target="_blank"
  rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white text-gray-900 py-3 lg:py-4 px-6 lg:px-8 rounded-xl font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Download for Android
                </div>
              </motion.a>
              
              <motion.a
              href='https://apps.apple.com/app/id6747842263'
            target="_blank"
  rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-gray-900 text-white py-3 lg:py-4 px-6 lg:px-8 rounded-xl font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <Apple className="w-5 h-5" />
                  Download for iOS
                </div>
              </motion.a>
            </div>
            
            <div className="flex justify-center items-center gap-6 lg:gap-8 mt-6 lg:mt-8 text-white/80 text-xs lg:text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                <span>4.9 Rating</span>
              </div>
              <div>50K+ Downloads</div>
              <div>Free to Start</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}