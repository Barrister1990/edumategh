import { create } from 'zustand';
import { DashboardState } from '@/types/dashboard';

export const useDashboardStore = create<DashboardState>()((set) => ({
  stats: {
    totalUsers: 20000,
    activeUsers: 15000,
    totalSubscriptions: 12000,
    premiumUsers: 8000,
    totalRevenue: 250000,
    curriculumItems: 2500,
    totalQuizzes: 10000,
    completedQuizzes: 75000,
    averageScore: 78,
  },
  userActivity: [
    { date: '2024-03-01', activeUsers: 12000, newUsers: 500 },
    { date: '2024-03-02', activeUsers: 12500, newUsers: 450 },
    { date: '2024-03-03', activeUsers: 13000, newUsers: 600 },
    { date: '2024-03-04', activeUsers: 13500, newUsers: 550 },
    { date: '2024-03-05', activeUsers: 14000, newUsers: 700 },
    { date: '2024-03-06', activeUsers: 14500, newUsers: 650 },
    { date: '2024-03-07', activeUsers: 15000, newUsers: 800 },
  ],
  subjectEngagement: [
    { subject: 'Mathematics', students: 15000, completionRate: 85, averageScore: 82 },
    { subject: 'English', students: 14000, completionRate: 80, averageScore: 78 },
    { subject: 'Science', students: 13000, completionRate: 75, averageScore: 76 },
    { subject: 'Social Studies', students: 12000, completionRate: 70, averageScore: 80 },
  ],
  quizCompletion: [
    { subject: 'Mathematics', completed: 25000, total: 30000 },
    { subject: 'English', completed: 20000, total: 25000 },
    { subject: 'Science', completed: 18000, total: 22000 },
    { subject: 'Social Studies', completed: 15000, total: 18000 },
  ],
  revenueData: [
    { month: 'Jan', amount: 20000 },
    { month: 'Feb', amount: 25000 },
    { month: 'Mar', amount: 30000 },
    { month: 'Apr', amount: 35000 },
    { month: 'May', amount: 40000 },
    { month: 'Jun', amount: 45000 },
  ],
  isLoading: false,
  error: null,
}));