import api from './axios';
import type { User } from '../types';

interface LoginPayload { email: string; password: string }
interface RegisterPayload { name: string; email: string; password: string; role: 'teacher' | 'student' }
interface AuthResponse { token: string; user: User }

export const login = (data: LoginPayload) =>
  api.post<AuthResponse>('/api/auth/login', data).then((r) => r.data);

export const register = (data: RegisterPayload) =>
  api.post<AuthResponse>('/api/auth/register', data).then((r) => r.data);
