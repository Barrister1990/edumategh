"use client";

import { motion } from "framer-motion";
import { DivideIcon as LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  index: number;
}

export function DashboardCard({ title, value, icon: Icon, description, index }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary-gradient rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}