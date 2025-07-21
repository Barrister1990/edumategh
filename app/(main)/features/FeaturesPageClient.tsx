'use client';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle,
  Download,
  GraduationCap,
  Play,
  Sparkles,
  Users
} from 'lucide-react';
import React from 'react';

interface HeroFeatures {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  highlight: string; // Fixed: Changed from String to string
}

interface StudentFeatures {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
}

interface TeacherFeatures {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
}

interface AdditionalFeatures {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

interface Stat {
  number: string;
  label: string;
  icon: React.ReactNode;
}

interface FeaturesPageClientProps {
  heroFeatures: HeroFeatures[];
  studentFeatures: StudentFeatures[];
  teacherFeatures: TeacherFeatures[];
  additionalFeatures: AdditionalFeatures[]; // Fixed: Added missing array type
  stats: Stat[];
}

// Fixed: Added additionalFeatures to destructured props
export default function FeaturesPageClient({ 
  heroFeatures, 
  studentFeatures, 
  teacherFeatures, 
  additionalFeatures, 
  stats 
}: FeaturesPageClientProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-xl text-white text-xs md:text-sm font-medium mb-6">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Advanced AI Technology
            </div>
            
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Features That
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Transform Education
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-purple-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Comprehensive AI-powered educational tools designed specifically for Ghana&apos;s curriculum, 
              empowering both students and teachers with cutting-edge technology.
            </p>
          </motion.div>

          {/* Hero Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {heroFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-500"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl md:rounded-2xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    <div className="md:hidden">
                      {/* Fixed: Properly handle ReactNode cloning */}
                      {React.isValidElement(feature.icon) ? 
                        React.cloneElement(feature.icon as React.ReactElement, { className: "h-5 w-5" }) : 
                        feature.icon
                      }
                    </div>
                    <div className="hidden md:block">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <h3 className="text-base md:text-xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <span className="px-2 py-1 md:px-3 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 text-yellow-200 text-xs font-medium rounded-full self-start">
                    {feature.highlight}
                  </span>
                </div>
                
                <p className="text-xs md:text-base text-purple-100 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
            <path fill="white" d="M1200 120L0 16.48V0h1200v120z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-purple-600 dark:text-purple-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-xs md:text-sm font-medium text-purple-700 dark:text-purple-300 mb-6">
              <GraduationCap className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              For Students
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              <span className="text-slate-900 dark:text-white">Powerful Tools for</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent">
                Academic Excellence
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Everything students need to excel in their studies, from interactive lessons to AI tutoring
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {studentFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-slate-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg md:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      <div className="md:hidden">
                        {/* Fixed: Properly handle ReactNode cloning */}
                        {React.isValidElement(feature.icon) ? 
                          React.cloneElement(feature.icon as React.ReactElement, { className: "h-3 w-3" }) : 
                          feature.icon
                        }
                      </div>
                      <div className="hidden md:block">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-xs font-medium text-purple-700 dark:text-purple-300 rounded-full">
                    {feature.category}
                  </span>
                </div>
                
                <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-xs md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Features Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-xs md:text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-6">
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              For Teachers
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              <span className="text-slate-900 dark:text-white">AI-Powered Teaching</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                Assistant & Resources
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Save hours of preparation time with AI-generated content and comprehensive teaching resources
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {teacherFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg md:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      <div className="md:hidden">
                        {/* Fixed: Properly handle ReactNode cloning */}
                        {React.isValidElement(feature.icon) ? 
                          React.cloneElement(feature.icon as React.ReactElement, { className: "h-3 w-3" }) : 
                          feature.icon
                        }
                      </div>
                      <div className="hidden md:block">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-xs font-medium text-indigo-700 dark:text-indigo-300 rounded-full">
                    {feature.category}
                  </span>
                </div>
                
                <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-xs md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              <span className="text-slate-900 dark:text-white">More Amazing</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent">
                Features & Benefits
              </span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-slate-700/50"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-6xl font-black text-white mb-6">
              Experience the Future of
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Ghanaian Education
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-purple-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Join thousands of students and teachers who are already transforming their educational experience with EduMate GH
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
              >
                <Download className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                Start Learning Today
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold rounded-2xl transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
              >
                <Play className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
                Watch Demo
              </motion.button>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-purple-100">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-300" />
                <span className="text-sm md:text-base">Free to download</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-300" />
                <span className="text-sm md:text-base">50,000+ quiz questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-300" />
                <span className="text-sm md:text-base">AI tutor included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}