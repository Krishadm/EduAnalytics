import api from './axios';
import type { TeacherDashboardStats, StudentDashboardStats } from '../types';

export const getTeacherStats = () =>
  api.get<TeacherDashboardStats>('/api/analytics').then((r) => r.data);

export const getStudentStats = () =>
  api.get<StudentDashboardStats>('/api/analytics/student').then((r) => r.data);
