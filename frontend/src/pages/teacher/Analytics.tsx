import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from '@mui/material';
import { getTeacherStats } from '../../api/analytics';
import type { TeacherDashboardStats } from '../../types';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';

const cardSx = {
  bgcolor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 2,
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
};

export default function TeacherAnalytics() {
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  const skel = <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', fontSize: { xs: 18, sm: 22 } }}>Analytics Overview</Typography>
        <Typography sx={{ color: '#64748b', fontSize: 14 }}>Detailed engagement metrics across all your articles.</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' }, gap: 2.5, mb: 2.5 }}>
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2.5, fontSize: 15 }}>Articles vs Views</Typography>
            {loading ? skel : <BarChart labels={stats?.articlesVsViews?.map((a) => a.title.slice(0, 14)) || []} data={stats?.articlesVsViews?.map((a) => a.views) || []} />}
          </CardContent>
        </Card>
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2.5, fontSize: 15 }}>Category Distribution</Typography>
            {loading ? <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} /> : <PieChart labels={stats?.categoryDistribution?.map((c) => c.category) || []} data={stats?.categoryDistribution?.map((c) => c.count) || []} />}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2.5, fontSize: 15 }}>Daily Engagement Trends</Typography>
            {loading ? skel : <LineChart labels={stats?.dailyEngagement?.map((d) => d.date) || []} data={stats?.dailyEngagement?.map((d) => d.views) || []} />}
          </CardContent>
        </Card>
      </Box>

      {/* Per-Article Table */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2.5, fontSize: 15 }}>Article-Level Stats</Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableHead>
                  <TableRow>
                    {['Article Title', 'Views', 'Rank'].map((h) => (
                      <TableCell key={h} sx={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(stats?.articlesVsViews || []).sort((a, b) => b.views - a.views).map((a, i) => (
                    <TableRow key={a.title} sx={{ '& td': { borderBottom: '1px solid #f1f5f9' }, '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell sx={{ color: '#0f172a', fontSize: 14, fontWeight: 500 }}>{a.title}</TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: 14, whiteSpace: 'nowrap' }}>{a.views}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip label={`#${i + 1}`} size="small" sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 600, fontSize: 11, height: 22 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
