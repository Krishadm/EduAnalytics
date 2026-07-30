import api from './axios';
import type { Highlight } from '../types';

interface HighlightPayload { articleId: string; text: string; note?: string }

export const saveHighlight = (data: HighlightPayload) =>
  api.post<{ highlight: Highlight }>('/api/student/highlights', data).then((r) => r.data.highlight);

export const getHighlights = (articleId?: string) =>
  api
    .get<Highlight[]>('/api/student/highlights', { params: articleId ? { articleId } : undefined })
    .then((r) => r.data);
