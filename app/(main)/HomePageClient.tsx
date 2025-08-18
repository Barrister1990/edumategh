'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Download,
  Globe,
  Play,
  Star,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "../../components/HeroSection";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface Benefit {
  number: string;
  title: string;
  description: string;
  highlight: string;
}

interface Testimonial {
  content: string;
  author: string;
  role: string;
  rating: number;
  imageSrc: string;
}

interface Stat {
  number: string;
  label: string;
  icon: React.ReactNode;
}

interface HomePageClientProps {
  features: Feature[];
  benefits: Benefit[];
  testimonials: Testimonial[];
  stats: Stat[];
}

export default function HomePageClient({ features, benefits, testimonials, stats }: HomePageClientProps) {
  return (
    <>
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-8 md:py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl lg:rounded-2xl mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-blue-600 dark:text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-xl lg:text-3xl font-black text-slate-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-12 md:mb-16"
          >
            <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-medium text-blue-700 dark:text-blue-300 mb-4 lg:mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 lg:mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-800 bg-clip-text text-transparent">
                Revolutionary Features
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">
                That Transform Learning
              </span>
            </h2>
            <p className="text-base lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Experience education like never before with AI-powered tools designed specifically for Ghana&apos;s curriculum
            </p>
          </motion.div>
          
          {/* Updated grid: 2 columns on mobile, 2 on md, 3 on lg+ */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl md:rounded-2xl lg:rounded-3xl p-3 md:p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-slate-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${feature.color} rounded-lg md:rounded-xl lg:rounded-2xl mb-2 md:mb-3 lg:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-sm md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2 lg:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-xs md:text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 md:line-clamp-none">
                  {feature.description}
                </p>
                
                <div className="absolute top-2 md:top-4 right-2 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-blue-500" />
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 lg:mt-12 text-center"
          >
            <Link href="/features">
              <Button variant="outline" className="group border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300">
                Explore All Features
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-12 md:py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-4 lg:mb-6">
                <Globe className="w-4 h-4 mr-2" />
                Made for Ghana
              </div>
              
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-6 lg:mb-8">
                Why <span className="text-blue-500">EduMate GH</span>
                <br />
                <span className="text-slate-900 dark:text-white">Works So Well</span>
              </h2>
              
              <div className="space-y-6 lg:space-y-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="group flex items-start space-x-4 lg:space-x-6"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-500 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-lg lg:text-xl font-black">{benefit.number}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 lg:mb-3">
                        <h3 className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {benefit.title}
                        </h3>
                        <span className="px-2 py-1 lg:px-3 lg:py-1.5 bg-blue-100 dark:bg-blue-900/30 text-xs lg:text-sm font-medium text-blue-700 dark:text-blue-300 rounded-full">
                          {benefit.highlight}
                        </span>
                      </div>
                      <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative">
              <div className="relative z-10 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group">
                <Image
                  src="https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Ghanaian students using EduMate GH for enhanced learning"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-blue-900/20" />
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: ["-10px", "10px", "-10px"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 lg:-top-6 -right-4 lg:-right-6 w-20 h-20 lg:w-32 lg:h-32 bg-blue-400/20 rounded-full blur-xl lg:blur-2xl"
              />
              <motion.div
                animate={{ y: ["10px", "-10px", "10px"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 lg:-bottom-6 -left-4 lg:-left-6 w-24 h-24 lg:w-40 lg:h-40 bg-indigo-400/20 rounded-full blur-xl lg:blur-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-12 md:mb-16"
          >
            <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-medium text-blue-700 dark:text-blue-300 mb-4 lg:mb-6">
              <Star className="w-4 h-4 mr-2 fill-current" />
              5-Star Rated
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 lg:mb-6">
              <span className="text-slate-900 dark:text-white">Real Stories from</span>
              <br />
              <span className="text-blue-600">
                Ghana&apos;s Educators
              </span>
            </h2>
            <p className="text-base lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              See how EduMate GH is transforming education across Ghana
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-slate-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center gap-1 mb-3 lg:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-sm lg:text-base text-slate-700 dark:text-slate-300 mb-4 lg:mb-6 leading-relaxed italic">
                 &apos;{testimonial.content}&apos;
                </blockquote>
                
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <Image
                    src={testimonial.imageSrc}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm lg:text-base">
                      {testimonial.author}
                    </div>
                    <div className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-12 md:py-20 bg-blue-600 relative overflow-hidden">
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
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-white mb-4 lg:mb-6">
              Ready to Transform
              <br />
              <span className="text-yellow-300">
                Your Education?
              </span>
            </h2>
            
            <p className="text-base lg:text-xl text-blue-100 mb-6 lg:mb-8 leading-relaxed max-w-2xl mx-auto">
              Join thousands of Ghanaian students and teachers who are already experiencing the future of education
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-6 lg:mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                >
                  <Download className="mr-2 lg:mr-3 h-4 w-4 lg:h-6 lg:w-6" />
                  Download Free Now
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-bold rounded-xl lg:rounded-2xl transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
                  >
                  <Play className="mr-2 lg:mr-3 h-4 w-4 lg:h-6 lg:w-6" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8 text-blue-100">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-300" />
                <span className="text-sm lg:text-base">Free to download</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-300" />
                <span className="text-sm lg:text-base">Works offline</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-300" />
                <span className="text-sm lg:text-base">GES curriculum aligned</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
       </>
  );
}