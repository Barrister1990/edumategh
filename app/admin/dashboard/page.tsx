"use client";

import { useDashboardStore } from '@/stores/useDashboardStore';
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

// Mock data for the dashboard
const mockStats = {
  totalUsers: 25843,
  activeUsers: 18234,
  premiumUsers: 3456,
  totalRevenue: 87500,
  completedQuizzes: 1250,
  totalQuizzes: 1500,
  averageScore: 78,
  curriculumItems: 245
};

const mockUserActivity = [
  { date: "Mon", activeUsers: 2400, newUsers: 240 },
  { date: "Tue", activeUsers: 1398, newUsers: 139 },
  { date: "Wed", activeUsers: 9800, newUsers: 980 },
  { date: "Thu", activeUsers: 3908, newUsers: 390 },
  { date: "Fri", activeUsers: 4800, newUsers: 480 },
  { date: "Sat", activeUsers: 3800, newUsers: 380 },
  { date: "Sun", activeUsers: 4300, newUsers: 430 }
];

const mockSubjectEngagement = [
  { subject: "Math", students: 4500 },
  { subject: "Science", students: 3200 },
  { subject: "English", students: 2800 },
  { subject: "History", students: 2100 },
  { subject: "Art", students: 1500 }
];

const mockQuizCompletion = [
  { subject: "Math", completed: 85 },
  { subject: "Science", completed: 72 },
  { subject: "English", completed: 68 },
  { subject: "History", completed: 54 },
  { subject: "Art", completed: 61 }
];

const mockRevenueData = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 15000 },
  { month: "Mar", amount: 18000 },
  { month: "Apr", amount: 22000 },
  { month: "May", amount: 25000 },
  { month: "Jun", amount: 28000 }
];

export default function AdminDashboard() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const router = useRouter();
  
  const {
    stats,
    userActivity,
    subjectEngagement,
    quizCompletion,
    revenueData,
    dateFilter,
    loading,
    error,
    setDateFilter,
    fetchDashboardData
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statCards = [
    {
      id: 'total-users',
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: loading ? "..." : `${stats.totalStudents.toLocaleString()} students`,
      changeValue: loading ? "..." : `${stats.totalTeachers.toLocaleString()} teachers`,
      icon: Users,
      description: loading ? "Loading..." : "All platform users",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: 'active-users',
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: loading ? "..." : `${Math.round((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100)}%`,
      changeValue: loading ? "..." : `of ${stats.totalUsers.toLocaleString()} total`,
      icon: UserPlus,
      description: loading ? "Loading..." : `Last ${dateFilter === 'all' ? 'all time' : dateFilter}`,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      id: 'premium-users',
      title: "Premium Users",
      value: stats.premiumUsers.toLocaleString(),
      change: loading ? "..." : `${Math.round((stats.premiumUsers / Math.max(stats.totalUsers, 1)) * 100)}%`,
      changeValue: loading ? "..." : `unique users`,
      icon: CreditCard,
      description: loading ? "Loading..." : "Users with coin purchases",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      id: 'total-revenue',
      title: "Total Revenue",
      value: loading ? "..." : Object.entries(stats.revenueByCurrency).length > 0 
        ? Object.entries(stats.revenueByCurrency)
            .map(([currency, amount]) => `${currency} ${amount.toLocaleString()}`)
            .join(', ')
        : "No revenue",
      change: loading ? "..." : Object.keys(stats.revenueByCurrency).length > 0 
        ? `${Object.keys(stats.revenueByCurrency).length} currencies`
        : "No data",
      changeValue: loading ? "..." : "coin transactions",
      icon: TrendingUp,
      description: loading ? "Loading..." : "From coin transactions",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      lightColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      id: 'curriculum-materials',
      title: "Curriculum Materials",
      value: stats.curriculumItems.toLocaleString(),
      change: loading ? "..." : "documents",
      changeValue: loading ? "..." : "available",
      icon: BookOpen,
      description: loading ? "Loading..." : "Educational resources",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      lightColor: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400"
    }
  ];

  const performanceMetrics = [
    {
      id: 'quiz-attempts',
      title: "Quiz Attempts",
      value: loading ? "..." : `${stats.completedQuizzes.toLocaleString()}`,
      change: loading ? "..." : `from ${stats.totalQuizzes.toLocaleString()} quizzes`,
      icon: FileQuestion,
      description: loading ? "Loading..." : "Quiz results recorded"
    },
    {
      id: 'quiz-average-score',
      title: "Quiz Average Score",
      value: loading ? "..." : `${stats.averageScore}%`,
      change: loading ? "..." : `${stats.completedQuizzes.toLocaleString()} attempts`,
      icon: Award,
      description: loading ? "Loading..." : "Student performance"
    },
    {
      id: 'lesson-completions',
      title: "Lesson Completions",
      value: loading ? "..." : `${stats.completedLessons.toLocaleString()}`,
      change: loading ? "..." : `from ${stats.totalLessons.toLocaleString()} lessons`,
      icon: BookOpen,
      description: loading ? "Loading..." : "Lessons completed"
    },
    {
      id: 'lesson-average-score',
      title: "Lesson Average Score",
      value: loading ? "..." : `${stats.averageLessonScore}%`,
      change: loading ? "..." : `${stats.completedLessons.toLocaleString()} completions`,
      icon: TrendingUp,
      description: loading ? "Loading..." : "Lesson performance"
    }
  ];

  const quickActions = [
    {
      id: 'send-notification',
      title: "Send Notification",
      description: "Broadcast to users",
      icon: Bell,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      action: () => router.push('/admin/dashboard/notifications')
    },
    // {
    //   id: 'customer-support',
    //   title: "Customer Support",
    //   description: "Help & tickets",
    //   icon: HelpCircle,
    //   color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    //   action: () => router.push('/admin/dashboard/support')
    // },
    // {
    //   id: 'live-chat',
    //   title: "Live Chat",
    //   description: "Active conversations",
    //   icon: MessageSquare,
    //   color: "bg-gradient-to-br from-green-500 to-green-600",
    //   action: () => router.push('/admin/dashboard/livechat')
    // },
    {
      id: 'analytics',
      title: "Analytics",
      description: "Deep insights",
      icon: BarChart3,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      action: () => router.push('/admin/dashboard/analytics')
    },
    {
      id: 'curriculum',
      title: "Curriculum",
      description: "Manage content",
      icon: BookOpen,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      action: () => router.push('/admin/curriculum')
    },
    {
      id: 'textbooks',
      title: "Textbooks",
      description: "Educational resources",
      icon: FileQuestion,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      action: () => router.push('/admin/textbooks')
    },
    {
      id: 'quizzes',
      title: "Quizzes",
      description: "Assessment tools",
      icon: Award,
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
      action: () => router.push('/admin/quizzes')
    },
    {
      id: 'lessons',
      title: "Lessons",
      description: "Learning materials",
      icon: Calendar,
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      action: () => router.push('/admin/lessons')
    },
    {
      id: 'lesson-notes',
      title: "Lesson Notes",
      description: "Teaching guides",
      icon: FileQuestion,
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      action: () => router.push('/admin/notes')
    },
    {
      id: 'past-questions',
      title: "Past Questions",
      description: "Exam papers",
      icon: Award,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      action: () => router.push('/admin/pastquestions')
    },
    {
      id: 'curriculum-strands',
      title: "Curriculum Strands",
      description: "Content structure",
      icon: BookOpen,
      color: "bg-gradient-to-br from-violet-500 to-violet-600",
      action: () => router.push('/admin/curriculum-strands')
    }
  ];

  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId === selectedCard ? null : cardId);
    // Add your card click logic here
    console.log('Card clicked:', cardId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile-First Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Platform overview
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="appearance-none flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm pr-6 sm:pr-8"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="all">All time</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-700 dark:text-blue-300">Loading dashboard data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-700 dark:text-red-300">Error: {error}</span>
              <button 
                onClick={fetchDashboardData}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions - Mobile First */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-10 gap-2 sm:gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group cursor-pointer active:scale-95"
              >
                <div className={`p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl ${action.color} shadow-lg mb-2 sm:mb-3 mx-auto w-fit`}>
                  <action.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1 text-center">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats Cards - Mobile First (2 per row) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          {statCards.map((stat) => (
            <button
              key={stat.id}
              onClick={() => handleCardClick(stat.id)}
              className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group cursor-pointer text-left active:scale-95 ${
                selectedCard === stat.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className={`p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl ${stat.color} shadow-lg`}>
                  <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {stat.change.startsWith('+') ? (
                      <ChevronUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-500" />
                    ) : (
                      <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-500" />
                    )}
                    <span className={`text-xs sm:text-sm font-semibold ${
                      stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                    {stat.changeValue}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {stat.description}
              </p>
              
              <div className="mt-3 sm:mt-4 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${stat.color} rounded-full transition-all duration-1000 group-hover:w-full`} style={{width: '70%'}}></div>
              </div>
              
              <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Performance Metrics - Mobile First */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          {performanceMetrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => handleCardClick(metric.id)}
              className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 text-left active:scale-95 ${
                selectedCard === metric.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <metric.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {metric.title}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {metric.description}
              </p>
            </button>
          ))}
        </div>

        {/* Charts Section - Mobile Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
          {/* User Activity Chart */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  User Activity
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Daily active users and registrations
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
            <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Quiz Distribution
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Completion by subject
                </p>
              </div>
            </div>
            <div className="h-[150px] sm:h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quizCompletion}
                    dataKey="completed"
                    nameKey="subject"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
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

        {/* Bottom Charts - Mobile Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Revenue Growth
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Monthly revenue trends
                </p>
              </div>
            </div>
            <div className="h-[250px] sm:h-[300px]">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Subject Popularity
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Student engagement by subject
                </p>
              </div>
            </div>
            <div className="h-[250px] sm:h-[300px]">
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
                    width={60}
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
