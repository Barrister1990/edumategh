"use client";

import { motion } from 'framer-motion';
import {
    Activity,
    ArrowLeft,
    BarChart3,
    CheckCircle,
    Target,
    Users,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

// Mock data for analytics
const performanceData = [
  { date: 'Mon', responseTime: 120, uptime: 99.9, errors: 2 },
  { date: 'Tue', responseTime: 95, uptime: 99.8, errors: 1 },
  { date: 'Wed', responseTime: 110, uptime: 99.9, errors: 0 },
  { date: 'Thu', responseTime: 85, uptime: 99.9, errors: 1 },
  { date: 'Fri', responseTime: 130, uptime: 99.7, errors: 3 },
  { date: 'Sat', responseTime: 90, uptime: 99.9, errors: 0 },
  { date: 'Sun', responseTime: 100, uptime: 99.9, errors: 1 }
];

const userEngagementData = [
  { hour: '00:00', activeUsers: 120, sessions: 180 },
  { hour: '04:00', activeUsers: 80, sessions: 120 },
  { hour: '08:00', activeUsers: 450, sessions: 680 },
  { hour: '12:00', activeUsers: 1200, sessions: 1800 },
  { hour: '16:00', activeUsers: 980, sessions: 1450 },
  { hour: '20:00', activeUsers: 750, sessions: 1100 },
  { hour: '23:59', activeUsers: 200, sessions: 300 }
];

const subjectPerformanceData = [
  { subject: 'Mathematics', completionRate: 85, avgScore: 78, students: 4500 },
  { subject: 'Science', completionRate: 72, avgScore: 82, students: 3200 },
  { subject: 'English', completionRate: 68, avgScore: 75, students: 2800 },
  { subject: 'History', completionRate: 54, avgScore: 70, students: 2100 },
  { subject: 'Art', completionRate: 61, avgScore: 88, students: 1500 }
];

const deviceUsageData = [
  { device: 'Android', users: 45, color: '#10b981' },
  { device: 'iOS', users: 35, color: '#6366f1' },
  { device: 'Web', users: 15, color: '#f59e0b' },
  { device: 'Other', users: 5, color: '#ef4444' }
];

const systemMetrics = {
  cpuUsage: 23,
  memoryUsage: 67,
  diskUsage: 45,
  networkLatency: 45,
  databaseConnections: 89,
  activeSessions: 1247
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('performance');

  const getMetricColor = (value: number, threshold: number) => {
    if (value >= threshold * 0.9) return 'text-green-600';
    if (value >= threshold * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricStatus = (value: number, threshold: number) => {
    if (value >= threshold * 0.9) return 'Excellent';
    if (value >= threshold * 0.7) return 'Good';
    return 'Needs Attention';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Performance & Analytics
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Monitor system performance and user engagement metrics
              </p>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm inline-block">
            <div className="flex">
              {['1d', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {range === '1d' ? '24 Hours' : 
                   range === '7d' ? '7 Days' : 
                   range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'Response Time', value: '95ms', icon: Zap, color: 'text-blue-600', trend: 'down' },
            { label: 'Uptime', value: '99.9%', icon: CheckCircle, color: 'text-green-600', trend: 'stable' },
            { label: 'Active Users', value: '1,247', icon: Users, color: 'text-indigo-600', trend: 'up' },
            { label: 'Error Rate', value: '0.1%', icon: Activity, color: 'text-red-600', trend: 'down' },
            { label: 'CPU Usage', value: '23%', icon: BarChart3, color: 'text-yellow-600', trend: 'stable' },
            { label: 'Memory', value: '67%', icon: Target, color: 'text-purple-600', trend: 'up' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metric Tabs */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm inline-block">
            <div className="flex">
              {[
                { id: 'performance', label: 'Performance', icon: Zap },
                { id: 'engagement', label: 'Engagement', icon: Users },
                { id: 'system', label: 'System', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMetric(tab.id)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    selectedMetric === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        {selectedMetric === 'performance' && (
          <div className="space-y-6">
            {/* Response Time & Uptime Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Performance Overview
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#6366f1" 
                      fill="#6366f1" 
                      fillOpacity={0.1}
                      name="Response Time (ms)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="uptime" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.1}
                      name="Uptime (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Average Response Time', value: '95ms', target: '100ms', status: 'Excellent' },
                { label: 'System Uptime', value: '99.9%', target: '99.5%', status: 'Excellent' },
                { label: 'Error Rate', value: '0.1%', target: '0.5%', status: 'Excellent' },
                { label: 'Page Load Time', value: '1.2s', target: '2.0s', status: 'Excellent' },
                { label: 'Database Query Time', value: '45ms', target: '100ms', status: 'Excellent' },
                { label: 'API Response Time', value: '120ms', target: '200ms', status: 'Good' }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{metric.label}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</span>
                      <span className="text-sm text-gray-500">Target: {metric.target}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${metric.status === 'Excellent' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {metric.status}
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.status === 'Excellent' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* User Engagement Metrics */}
        {selectedMetric === 'engagement' && (
          <div className="space-y-6">
            {/* User Activity Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                User Activity Throughout the Day
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      name="Active Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Sessions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Engagement Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Performance */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h4>
                <div className="space-y-3">
                  {subjectPerformanceData.map((subject, index) => (
                    <div key={subject.subject} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{subject.subject}</span>
                          <span className="text-sm text-gray-500">{subject.students} students</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-indigo-500"
                            style={{ width: `${subject.completionRate}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                          <span>{subject.completionRate}% completion</span>
                          <span>Avg: {subject.avgScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Usage */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Device Usage</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ device, users }) => `${device}: ${users}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="users"
                      >
                        {deviceUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Metrics */}
        {selectedMetric === 'system' && (
          <div className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'CPU Usage', value: systemMetrics.cpuUsage, unit: '%', threshold: 80, icon: Zap },
                { label: 'Memory Usage', value: systemMetrics.memoryUsage, unit: '%', threshold: 85, icon: Target },
                { label: 'Disk Usage', value: systemMetrics.diskUsage, unit: '%', threshold: 90, icon: BarChart3 },
                { label: 'Network Latency', value: systemMetrics.networkLatency, unit: 'ms', threshold: 100, icon: Activity },
                { label: 'DB Connections', value: systemMetrics.databaseConnections, unit: '', threshold: 100, icon: CheckCircle },
                { label: 'Active Sessions', value: systemMetrics.activeSessions, unit: '', threshold: 2000, icon: Users }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-indigo-600">
                      <metric.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{metric.label}</h4>
                      <p className="text-sm text-gray-500">{getMetricStatus(metric.value, metric.threshold)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold ${getMetricColor(metric.value, metric.threshold)}`}>
                        {metric.value}{metric.unit}
                      </span>
                      <span className="text-sm text-gray-500">Threshold: {metric.threshold}{metric.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.value >= metric.threshold * 0.9 ? 'bg-green-500' :
                          metric.value >= metric.threshold * 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* System Logs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recent System Events</h4>
              <div className="space-y-3">
                {[
                  { time: '2 minutes ago', event: 'Database backup completed successfully', type: 'success' },
                  { time: '5 minutes ago', event: 'New user registration: kwame.asante@email.com', type: 'info' },
                  { time: '10 minutes ago', event: 'API rate limit warning for /api/quiz endpoint', type: 'warning' },
                  { time: '15 minutes ago', event: 'System maintenance completed', type: 'success' },
                  { time: '1 hour ago', event: 'Memory usage optimization applied', type: 'info' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      log.type === 'success' ? 'bg-green-500' :
                      log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{log.event}</p>
                      <p className="text-xs text-gray-500">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
