"use client";

import { useDashboardStore } from "@/stores/dashboard";
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Download,
  Eye,
  FileQuestion,
  MoreHorizontal,
  TrendingUp,
  UserPlus,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const { stats, userActivity, subjectEngagement, quizCompletion, revenueData } = useDashboardStore();

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      changeValue: "+2,543",
      icon: Users,
      description: "vs last month",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: "+8%",
      changeValue: "+1,234",
      icon: UserPlus,
      description: "last 30 days",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers.toLocaleString(),
      change: "+15%",
      changeValue: "+456",
      icon: CreditCard,
      description: "conversion rate 12%",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Total Revenue",
      value: `GH₵${stats.totalRevenue.toLocaleString()}`,
      change: "+20%",
      changeValue: "+GH₵12,543",
      icon: TrendingUp,
      description: "this quarter",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      lightColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400"
    }
  ];

  const performanceMetrics = [
    {
      title: "Quiz Completion",
      value: `${((stats.completedQuizzes / stats.totalQuizzes) * 100).toFixed(1)}%`,
      change: "+10%",
      icon: FileQuestion,
      description: "Average completion rate"
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      change: "+3%",
      icon: Award,
      description: "Student performance"
    },
    {
      title: "Learning Materials",
      value: stats.curriculumItems.toLocaleString(),
      change: "+5%",
      icon: BookOpen,
      description: "Available resources"
    },
    {
      title: "Subjects Covered",
      value: subjectEngagement.length.toString(),
      change: "0%",
      icon: BarChart3,
      description: "Core curriculum"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back! Here's what's happening with your platform today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </button>
              <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {stat.change.startsWith('+') ? (
                      <ChevronUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${
                      stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.changeValue}
                  </span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
              
              <div className="mt-4 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${stat.color} rounded-full transition-all duration-1000 group-hover:w-full`} style={{width: '70%'}}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <div
              key={metric.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <metric.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* User Activity Chart - Takes 2 columns */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  User Activity Trends
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Daily active users and new registrations
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Eye className="h-4 w-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userActivity}>
                  <defs>
                    <linearGradient id="activeUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="newUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#activeUsers)"
                    name="Active Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#newUsers)"
                    name="New Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quiz Completion Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Quiz Distribution
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Completion by subject
                </p>
              </div>
            </div>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quizCompletion}
                    dataKey="completed"
                    nameKey="subject"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {quizCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {quizCompletion.map((item, index) => (
                <div key={item.subject} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.subject}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.completed}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Revenue Growth
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monthly revenue trends
                </p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#6366f1" 
                    name="Revenue (GH₵)" 
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Engagement */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Subject Popularity
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Student engagement by subject
                </p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={subjectEngagement} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    dataKey="subject" 
                    type="category" 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="students" 
                    fill="#10b981" 
                    name="Students" 
                    radius={[0, 4, 4, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}