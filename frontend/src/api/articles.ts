import api from './axios';
import type { Article } from '../types';

export const getArticles = (params?: { category?: string; search?: string }) =>
  api.get<{ articles: Article[] }>('/api/articles', { params }).then((r) => r.data.articles);

export const getArticle = (id: string) =>
  api.get<Article>(`/api/articles/${id}`).then((r) => r.data);

export const createArticle = (data: Partial<Article>) =>
  api.post<{ article: Article }>('/api/articles', data).then((r) => r.data.article);

export const updateArticle = (id: string, data: Partial<Article>) =>
  api.put<{ article: Article }>(`/api/articles/${id}`, data).then((r) => r.data.article);

export const deleteArticle = (id: string) =>
  api.delete(`/api/articles/${id}`).then((r) => r.data);
