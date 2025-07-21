"use client";

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
  HelpCircle,
  MessageSquare,
  MoreHorizontal,
  Settings,
  TrendingUp,
  UserPlus,
  Users,
  Zap
} from "lucide-react";
import { useState } from 'react';
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
  
  const stats = mockStats;
  const userActivity = mockUserActivity;
  const subjectEngagement = mockSubjectEngagement;
  const quizCompletion = mockQuizCompletion;
  const revenueData = mockRevenueData;

  const statCards = [
    {
      id: 'total-users',
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
      id: 'active-users',
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
      id: 'premium-users',
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
      id: 'total-revenue',
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
      id: 'quiz-completion',
      title: "Quiz Completion",
      value: `${((stats.completedQuizzes / stats.totalQuizzes) * 100).toFixed(1)}%`,
      change: "+10%",
      icon: FileQuestion,
      description: "Average completion rate"
    },
    {
      id: 'average-score',
      title: "Average Score",
      value: `${stats.averageScore}%`,
      change: "+3%",
      icon: Award,
      description: "Student performance"
    },
    {
      id: 'learning-materials',
      title: "Learning Materials",
      value: stats.curriculumItems.toLocaleString(),
      change: "+5%",
      icon: BookOpen,
      description: "Available resources"
    },
    {
      id: 'subjects-covered',
      title: "Subjects Covered",
      value: subjectEngagement.length.toString(),
      change: "0%",
      icon: BarChart3,
      description: "Core curriculum"
    }
  ];

  const quickActions = [
    {
      id: 'send-notification',
      title: "Send Notification",
      description: "Broadcast to users",
      icon: Bell,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      action: () => alert('Opening notification center...')
    },
    {
      id: 'customer-support',
      title: "Customer Support",
      description: "Help & tickets",
      icon: HelpCircle,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      action: () => alert('Opening support panel...')
    },
    {
      id: 'live-chat',
      title: "Live Chat",
      description: "Active conversations",
      icon: MessageSquare,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      action: () => alert('Opening live chat...')
    },
    {
      id: 'system-settings',
      title: "Settings",
      description: "System config",
      icon: Settings,
      color: "bg-gradient-to-br from-gray-500 to-gray-600",
      action: () => alert('Opening settings...')
    },
    {
      id: 'performance-boost',
      title: "Performance",
      description: "System metrics",
      icon: Zap,
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      action: () => alert('Opening performance dashboard...')
    },
    {
      id: 'analytics',
      title: "Analytics",
      description: "Deep insights",
      icon: BarChart3,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      action: () => alert('Opening analytics...')
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Platform overview
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Last 30 days</span>
                <span className="sm:hidden">30d</span>
              </button>
              <button className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile First */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group cursor-pointer active:scale-95"
              >
                <div className={`p-2 sm:p-3 rounded-xl ${action.color} shadow-lg mb-3 mx-auto w-fit`}>
                  <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          {statCards.map((stat) => (
            <button
              key={stat.id}
              onClick={() => handleCardClick(stat.id)}
              className={`bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group cursor-pointer text-left active:scale-95 ${
                selectedCard === stat.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${stat.color} shadow-lg`}>
                  <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {stat.change.startsWith('+') ? (
                      <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                    ) : (
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
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
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          {performanceMetrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => handleCardClick(metric.id)}
              className={`bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 text-left active:scale-95 ${
                selectedCard === metric.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <metric.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
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
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {metric.description}
              </p>
            </button>
          ))}
        </div>

        {/* Charts Section - Mobile Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* User Activity Chart */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  User Activity
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
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
            <div className="h-[250px] sm:h-[350px]">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Quiz Distribution
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Revenue Growth
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Subject Popularity
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
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
