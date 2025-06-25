"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDashboardStore } from "@/stores/dashboard";
import {
  Users,
  UserPlus,
  CreditCard,
  BookOpen,
  FileQuestion,
  TrendingUp,
  Award,
  BarChart,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ['#667eea', '#764ba2', '#63b3ed', '#48bb78'];

export default function AdminDashboard() {
  const { stats, userActivity, subjectEngagement, quizCompletion, revenueData } = useDashboardStore();

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      icon: Users,
      description: "Total registered users",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: "+8%",
      icon: UserPlus,
      description: "Users active in last 30 days",
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers.toLocaleString(),
      change: "+15%",
      icon: CreditCard,
      description: "Subscribed premium users",
    },
    {
      title: "Total Revenue",
      value: `GH₵${stats.totalRevenue.toLocaleString()}`,
      change: "+20%",
      icon: TrendingUp,
      description: "Total revenue generated",
    },
    {
      title: "Curriculum Items",
      value: stats.curriculumItems.toLocaleString(),
      change: "+5%",
      icon: BookOpen,
      description: "Available learning materials",
    },
    {
      title: "Quiz Completion",
      value: `${((stats.completedQuizzes / stats.totalQuizzes) * 100).toFixed(1)}%`,
      change: "+10%",
      icon: FileQuestion,
      description: "Average quiz completion rate",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      change: "+3%",
      icon: Award,
      description: "Average student score",
    },
    {
      title: "Subject Coverage",
      value: subjectEngagement.length.toString(),
      change: "0%",
      icon: BarChart,
      description: "Core subjects covered",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-gradient rounded-lg">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stat.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-6">User Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#667eea"
                  strokeWidth={2}
                  name="Active Users"
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#764ba2"
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#667eea" name="Revenue (GH₵)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-6">Subject Engagement</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={subjectEngagement} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="subject" type="category" />
                <Tooltip />
                <Bar dataKey="students" fill="#667eea" name="Students" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quiz Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-6">Quiz Completion by Subject</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={quizCompletion}
                  dataKey="completed"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {quizCompletion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4">
            <div className="grid grid-cols-2 gap-4">
              {quizCompletion.map((item, index) => (
                <div key={item.subject} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.subject}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}