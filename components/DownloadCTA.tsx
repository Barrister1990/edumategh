"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadCTAProps {
  className?: string;
}

export function DownloadCTA({ className }: DownloadCTAProps) {
  return (
    <div className={className}>
      <div className="bg-primary-gradient rounded-xl p-8 md:p-12 text-white overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Transform Your Learning Experience Today
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg mb-8 text-white/90"
          >
            Join thousands of students in Ghana who are already using EduMate GH to improve their studies.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="bg-white text-edumate-purple hover:bg-white/90 transition-colors"
            >
              <Download className="mr-2 h-5 w-5" />
              Download for Android
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 transition-colors"
            >
              <Download className="mr-2 h-5 w-5" />
              Download for iOS
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}