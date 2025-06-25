"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
  className?: string;
}

export function FeatureCard({ icon, title, description, index, className }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "relative group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden",
        className
      )}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-gradient rounded-full opacity-5 group-hover:opacity-10 transition-opacity" />

      <div className="relative z-10">
        <div className="mb-4 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-edumate-purple">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}