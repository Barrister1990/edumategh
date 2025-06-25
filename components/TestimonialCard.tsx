"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  imageSrc: string;
  index: number;
  className?: string;
}

export function TestimonialCard({ 
  content, 
  author, 
  role, 
  imageSrc, 
  index, 
  className 
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700",
        className
      )}
    >
      <Quote className="h-8 w-8 text-edumate-purple opacity-30 mb-4" />
      
      <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
        "{content}"
      </p>
      
      <div className="flex items-center">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src={imageSrc}
            alt={`${author} profile`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{author}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}