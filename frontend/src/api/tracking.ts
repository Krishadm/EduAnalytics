import api from './axios';
import type { TrackingPayload } from '../types';

export const logView = (data: TrackingPayload) =>
  api.post('/api/analytics/tracking', { ...data, action: 'view' }).then((r) => r.data);

export const logDuration = (data: TrackingPayload) =>
  api.post('/api/analytics/tracking', { ...data, action: 'duration' }).then((r) => r.data);
