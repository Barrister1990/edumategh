export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSubscriptions: number;
  premiumUsers: number;
  totalRevenue: number;
  curriculumItems: number;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
}

export interface UserActivity {
  date: string;
  activeUsers: number;
  newUsers: number;
}

export interface SubjectEngagement {
  subject: string;
  students: number;
  completionRate: number;
  averageScore: number;
}

export interface QuizCompletion {
  subject: string;
  completed: number;
  total: number;
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
  isLoading: boolean;
  error: string | null;
}