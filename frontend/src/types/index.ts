// ─── Auth ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// ─── Article ─────────────────────────────────────────────────────────────────
export type ContentBlockType = 'text' | 'image' | 'video' | '3d';

export interface ContentBlock {
  type: ContentBlockType;
  value: string; // text content OR url
  caption?: string;
}

export type ArticleCategory =
  | 'Science'
  | 'Math'
  | 'English'
  | 'History'
  | 'Technology'
  | 'Other';

export interface Article {
  _id: string;
  title: string;
  category: ArticleCategory;
  contentBlocks: ContentBlock[];
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface AnalyticsEntry {
  _id: string;
  articleId: string | Article;
  studentId: string | User;
  views: number;
  duration: number; // seconds
  createdAt: string;
  updatedAt: string;
}

export interface TeacherDashboardStats {
  articlesCreated: number;
  totalStudentsRead: number;
  topCategories: { category: string; count: number }[];
  articlesVsViews: { title: string; views: number }[];
  dailyEngagement: { date: string; views: number }[];
  categoryDistribution: { category: string; count: number }[];
}

export interface StudentDashboardStats {
  totalArticlesRead: number;
  timePerCategory: { category: string; duration: number }[];
  readArticles: {
    article: Article;
    duration: number;
    views: number;
  }[];
}

// ─── Highlight ────────────────────────────────────────────────────────────────
export interface Highlight {
  _id: string;
  studentId: string;
  articleId: string;
  text: string;
  note?: string;
  timestamp: string;
}

// ─── Tracking ─────────────────────────────────────────────────────────────────
export interface TrackingPayload {
  articleId: string;
  duration?: number;
}

// ─── API Response wrapper ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
