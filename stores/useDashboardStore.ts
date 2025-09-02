import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  activeUsers: number;
  premiumUsers: number;
  revenueByCurrency: { [key: string]: number };
  completedQuizzes: number;
  totalQuizzes: number;
  averageScore: number;
  curriculumItems: number;
  totalLessons: number;
  completedLessons: number;
  averageLessonScore: number;
}

export interface UserActivity {
  date: string;
  activeUsers: number;
  newUsers: number;
}

export interface SubjectEngagement {
  subject: string;
  students: number;
}

export interface QuizCompletion {
  subject: string;
  completed: number;
}

export interface RevenueData {
  month: string;
  amount: number;
}

export interface DashboardState {
  stats: DashboardStats;
  userActivity: UserActivity[];
  subjectEngagement: SubjectEngagement[];
  quizCompletion: QuizCompletion[];
  revenueData: RevenueData[];
  dateFilter: '7d' | '30d' | '90d' | '1y' | 'all';
  loading: boolean;
  error: string | null;
  
  // Actions
  setDateFilter: (filter: '7d' | '30d' | '90d' | '1y' | 'all') => void;
  fetchDashboardData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const getDateRange = (filter: string) => {
  const now = new Date();
  let startDate: Date;

  switch (filter) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date('2020-01-01'); // All time
  }

  return {
    start: startDate.toISOString(),
    end: now.toISOString()
  };
};

const convertToUSD = async (amount: number, currency: string = 'GHS') => {
  // For now, using a simple conversion rate
  // In production, you'd want to use a real-time currency API
  const conversionRates: { [key: string]: number } = {
    'GHS': 0.067, // 1 GHS = 0.067 USD (approximate)
    'USD': 1,
    'NGN': 0.00067, // 1 NGN = 0.00067 USD (approximate)
  };
  
  return amount * (conversionRates[currency] || 1);
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: {
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    revenueByCurrency: {},
    completedQuizzes: 0,
    totalQuizzes: 0,
    averageScore: 0,
    curriculumItems: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageLessonScore: 0,
  },
  userActivity: [],
  subjectEngagement: [],
  quizCompletion: [],
  revenueData: [],
  dateFilter: '30d',
  loading: false,
  error: null,

  setDateFilter: (filter) => {
    set({ dateFilter: filter });
    get().fetchDashboardData();
  },

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    
    try {
      const { dateFilter } = get();
      const { start, end } = getDateRange(dateFilter);

      // Fetch all data in parallel
      const [
        totalUsersResult,
        totalStudentsResult,
        totalTeachersResult,
        activeUsersResult,
        premiumUsersResult,
        revenueResult,
        quizResults,
        curriculumResult,
        lessonsResult,
        lessonProgressResult,
        userActivityResult,
        subjectEngagementResult,
        quizCompletionResult,
        revenueDataResult
      ] = await Promise.all([
        // Total users (all users including teachers and students)
        supabase
          .from('users')
          .select('id', { count: 'exact' }),

        // Total students
        supabase
          .from('users')
          .select('id', { count: 'exact' })
          .eq('role', 'student'),

        // Total teachers
        supabase
          .from('users')
          .select('id', { count: 'exact' })
          .eq('role', 'teacher'),

        // Active users (all users who logged in within date range)
        Promise.all([
          // Students who logged in
          supabase
            .from('student_daily_logins')
            .select('student_id')
            .gte('login_date', start.split('T')[0])
            .lte('login_date', end.split('T')[0]),
          // Teachers who logged in
          supabase
            .from('teacher_daily_logins')
            .select('teacher_id')
            .gte('login_date', start.split('T')[0])
            .lte('login_date', end.split('T')[0])
        ]).then(([studentsResult, teachersResult]) => {
          const studentIds = new Set(studentsResult.data?.map(login => login.student_id) || []);
          const teacherIds = new Set(teachersResult.data?.map(login => login.teacher_id) || []);
          const allActiveUserIds = new Set(Array.from(studentIds).concat(Array.from(teacherIds)));
          return { data: Array.from(allActiveUserIds).map(id => ({ user_id: id })), count: allActiveUserIds.size };
        }),

        // Premium users (unique users who have made coin transactions)
        supabase
          .from('coin_transactions')
          .select('user_id')
          .eq('status', 'completed')
          .gte('purchased_at', start)
          .lte('purchased_at', end),

        // Total revenue from coin transactions (by currency)
        supabase
          .from('coin_transactions')
          .select('price, currency_code')
          .eq('status', 'completed')
          .gte('purchased_at', start)
          .lte('purchased_at', end),

        // Quiz completion data
        supabase
          .from('quiz_results')
          .select('score, questions_count, subject')
          .gte('completed_at', start)
          .lte('completed_at', end),

        // Curriculum items
        supabase
          .from('curriculum_documents')
          .select('id', { count: 'exact' }),

        // Total lessons
        supabase
          .from('lessons')
          .select('id', { count: 'exact' }),

        // Lesson progress data
        supabase
          .from('lesson_progress')
          .select('user_id, completed, lesson_score')
          .eq('completed', true)
          .gte('created_at', start)
          .lte('created_at', end),

        // User activity data (daily logins)
        supabase
          .from('student_daily_logins')
          .select('login_date, student_id')
          .gte('login_date', start.split('T')[0])
          .lte('login_date', end.split('T')[0])
          .order('login_date'),

        // Subject engagement (from quiz results)
        supabase
          .from('quiz_results')
          .select('subject, user_id')
          .gte('completed_at', start)
          .lte('completed_at', end),

        // Quiz completion by subject
        supabase
          .from('quiz_results')
          .select('subject, score, questions_count')
          .gte('completed_at', start)
          .lte('completed_at', end),

        // Revenue data by month
        supabase
          .from('coin_transactions')
          .select('price, currency_code, purchased_at')
          .eq('status', 'completed')
          .gte('purchased_at', start)
          .lte('purchased_at', end)
          .order('purchased_at')
      ]);

      // Process the data
      const totalUsers = totalUsersResult.count || 0;
      const totalStudents = totalStudentsResult.count || 0;
      const totalTeachers = totalTeachersResult.count || 0;
      const activeUsers = activeUsersResult.count || 0;
      
      // Get unique premium users (users who have made coin transactions)
      const uniquePremiumUsers = new Set(premiumUsersResult.data?.map(transaction => transaction.user_id) || []);
      const premiumUsers = uniquePremiumUsers.size;

      // Calculate total revenue by currency
      const revenueByCurrency: { [key: string]: number } = {};
      if (revenueResult.data) {
        for (const transaction of revenueResult.data) {
          const currency = transaction.currency_code;
          const amount = Number(transaction.price);
          revenueByCurrency[currency] = (revenueByCurrency[currency] || 0) + amount;
        }
      }

      // Calculate quiz statistics
      const completedQuizzes = quizResults.count || 0;
      const totalQuizzes = await supabase
        .from('quizzes')
        .select('id', { count: 'exact' })
        .then(result => result.count || 0);

      let averageScore = 0;
      if (quizResults.data && quizResults.data.length > 0) {
        const totalScore = quizResults.data.reduce((sum, result) => {
          const percentage = (result.score / result.questions_count) * 100;
          return sum + percentage;
        }, 0);
        averageScore = Math.round(totalScore / quizResults.data.length);
      }

      const curriculumItems = curriculumResult.count || 0;
      const totalLessons = lessonsResult.count || 0;
      const completedLessons = lessonProgressResult.count || 0;

      // Calculate average lesson score
      let averageLessonScore = 0;
      if (lessonProgressResult.data && lessonProgressResult.data.length > 0) {
        const validScores = lessonProgressResult.data
          .filter(progress => progress.lesson_score && !isNaN(Number(progress.lesson_score)))
          .map(progress => Number(progress.lesson_score));
        
        if (validScores.length > 0) {
          const totalScore = validScores.reduce((sum, score) => sum + score, 0);
          averageLessonScore = Math.round(totalScore / validScores.length);
        }
      }

      // Process user activity data
      const userActivityMap = new Map<string, { activeUsers: Set<string>, newUsers: Set<string> }>();
      
      if (userActivityResult.data) {
        // Get all users created in the date range for new users calculation
        const newUsersResult = await supabase
          .from('users')
          .select('id, created_at')
          .eq('role', 'student')
          .gte('created_at', start)
          .lte('created_at', end);

        const newUsersSet = new Set(newUsersResult.data?.map(u => u.id) || []);

        userActivityResult.data.forEach(login => {
          const date = login.login_date;
          if (!userActivityMap.has(date)) {
            userActivityMap.set(date, { activeUsers: new Set(), newUsers: new Set() });
          }
          userActivityMap.get(date)!.activeUsers.add(login.student_id);
          if (newUsersSet.has(login.student_id)) {
            userActivityMap.get(date)!.newUsers.add(login.student_id);
          }
        });
      }

      const userActivity = Array.from(userActivityMap.entries()).map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        activeUsers: data.activeUsers.size,
        newUsers: data.newUsers.size
      }));

      // Process subject engagement
      const subjectEngagementMap = new Map<string, Set<string>>();
      if (subjectEngagementResult.data) {
        subjectEngagementResult.data.forEach(result => {
          if (!subjectEngagementMap.has(result.subject)) {
            subjectEngagementMap.set(result.subject, new Set());
          }
          subjectEngagementMap.get(result.subject)!.add(result.user_id);
        });
      }

      const subjectEngagement = Array.from(subjectEngagementMap.entries()).map(([subject, students]) => ({
        subject,
        students: students.size
      })).sort((a, b) => b.students - a.students).slice(0, 5);

      // Process quiz completion by subject
      const quizCompletionMap = new Map<string, { total: number, completed: number }>();
      if (quizCompletionResult.data) {
        quizCompletionResult.data.forEach(result => {
          if (!quizCompletionMap.has(result.subject)) {
            quizCompletionMap.set(result.subject, { total: 0, completed: 0 });
          }
          const data = quizCompletionMap.get(result.subject)!;
          data.total++;
          if (result.score >= result.questions_count * 0.6) { // 60% completion threshold
            data.completed++;
          }
        });
      }

      const quizCompletion = Array.from(quizCompletionMap.entries()).map(([subject, data]) => ({
        subject,
        completed: Math.round((data.completed / data.total) * 100)
      })).sort((a, b) => b.completed - a.completed).slice(0, 5);

      // Process revenue data by month (keeping original currencies)
      const revenueMap = new Map<string, { [currency: string]: number }>();
      if (revenueDataResult.data) {
        for (const transaction of revenueDataResult.data) {
          const month = new Date(transaction.purchased_at).toLocaleDateString('en-US', { month: 'short' });
          const currency = transaction.currency_code;
          const amount = Number(transaction.price);
          
          if (!revenueMap.has(month)) {
            revenueMap.set(month, {});
          }
          const monthData = revenueMap.get(month)!;
          monthData[currency] = (monthData[currency] || 0) + amount;
        }
      }

      const revenueData = Array.from(revenueMap.entries()).map(([month, currencies]) => ({
        month,
        amount: Object.values(currencies).reduce((sum, amount) => sum + amount, 0), // Total for chart
        currencies // Keep individual currencies for detailed view
      })).sort((a, b) => {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });

      set({
        stats: {
          totalUsers,
          totalStudents,
          totalTeachers,
          activeUsers,
          premiumUsers,
          revenueByCurrency,
          completedQuizzes,
          totalQuizzes,
          averageScore,
          curriculumItems,
          totalLessons,
          completedLessons,
          averageLessonScore,
        },
        userActivity,
        subjectEngagement,
        quizCompletion,
        revenueData,
        loading: false,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
        loading: false 
      });
    }
  },

  refreshData: async () => {
    await get().fetchDashboardData();
  },
}));
