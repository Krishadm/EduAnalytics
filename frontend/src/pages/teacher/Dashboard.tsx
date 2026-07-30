import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Skeleton, Chip,
} from '@mui/material';
import { Article, People, Category, TrendingUp, Visibility, BarChart as BarIcon } from '@mui/icons-material';
import { getTeacherStats } from '../../api/analytics';
import type { TeacherDashboardStats } from '../../types';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';
import { useAuth } from '../../context/AuthContext';

const cardSx = {
  bgcolor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 2,
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', fontSize: { xs: 18, sm: 22 } }}>
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </Typography>
        <Typography sx={{ color: '#64748b', mt: 0.5, fontSize: 14 }}>
          Here's an overview of your platform analytics.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        {[
          { label: 'Articles Created', value: stats?.articlesCreated, icon: <Article />, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Students Read', value: stats?.totalStudentsRead, icon: <People />, color: '#0d9488', bg: '#ccfbf1' },
          { label: 'Top Categoryy', value: stats?.topCategories?.[0]?.category || '—', icon: <Category />, color: '#d97706', bg: '#fef3c7' },
          { label: 'Total Views', value: stats?.articlesVsViews?.reduce((a, b) => a + b.views, 0), icon: <Visibility />, color: '#dc2626', bg: '#fee2e2' },
        ].map((s) => (
          <Card key={s.label} sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: '#64748b', fontSize: { xs: 10, sm: 12 }, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
                    {s.label}
                  </Typography>
                  {loading ? (
                    <Skeleton variant="text" width={60} height={36} />
                  ) : (
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', fontSize: { xs: 18, sm: 22 } }}>
                      {s.value ?? '—'}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: s.bg, color: s.color, flexShrink: 0 }}>
                  {s.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts Row 1 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 2.5, mb: 2.5 }}>
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <BarIcon sx={{ color: '#2563eb', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>Articles vs Views</Typography>
            </Box>
            {loading ? (
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
            ) : (
              <BarChart
                labels={stats?.articlesVsViews?.map((a) => a.title.slice(0, 16) + (a.title.length > 16 ? '…' : '')) || []}
                data={stats?.articlesVsViews?.map((a) => a.views) || []}
              />
            )}
          </CardContent>
        </Card>
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <Category sx={{ color: '#0d9488', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>Category Distribution</Typography>
            </Box>
            {loading ? (
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} />
            ) : (
              <PieChart
                labels={stats?.categoryDistribution?.map((c) => c.category) || []}
                data={stats?.categoryDistribution?.map((c) => c.count) || []}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Charts Row 2 */}
      <Box sx={{ mb: 2.5 }}>
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <TrendingUp sx={{ color: '#d97706', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>Daily Engagement Trends</Typography>
            </Box>
            {loading ? (
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
            ) : (
              <LineChart
                labels={stats?.dailyEngagement?.map((d) => d.date) || []}
                data={stats?.dailyEngagement?.map((d) => d.views) || []}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Top Categories */}
      {stats?.topCategories && stats.topCategories.length > 0 && (
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: 15, mb: 2 }}>Top Categories</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {stats.topCategories.slice(0, 3).map((cat) => (
                <Chip
                  key={cat.category}
                  label={`${cat.category} — ${cat.count} articles`}
                  sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 600, fontSize: 13, height: 32, border: '1px solid #e2e8f0' }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
