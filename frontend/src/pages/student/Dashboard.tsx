import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar,
} from '@mui/material';
import { MenuBook, AccessTime, Bookmark } from '@mui/icons-material';
import { getStudentStats } from '../../api/analytics';
import { getHighlights } from '../../api/highlights';
import type { StudentDashboardStats, Highlight } from '../../types';
import PieChart from '../../components/charts/PieChart';
import { useAuth } from '../../context/AuthContext';

const cardSx = {
  bgcolor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 2,
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStudentStats().then(setStats),
      getHighlights().then(setHighlights),
    ]).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalTime = stats?.timePerCategory?.reduce((a, b) => a + b.duration, 0) || 0;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', fontSize: { xs: 18, sm: 22 } }}>
          My Learning Dashboard
        </Typography>
        <Typography sx={{ color: '#64748b', mt: 0.5, fontSize: 14 }}>
          Welcome back, {user?.name?.split(' ')[0]}. Here is your study progress.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        {[
          { label: 'Articles Read', value: stats?.totalArticlesRead, icon: <MenuBook />, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Reading Time', value: `${Math.round(totalTime / 60)}m`, icon: <AccessTime />, color: '#0d9488', bg: '#ccfbf1' },
          { label: 'Highlights', value: highlights.length, icon: <Bookmark />, color: '#d97706', bg: '#fef3c7' },
        ].map((s) => (
          <Card key={s.label} sx={{ ...cardSx, gridColumn: s.label === 'Highlights' ? { xs: '1 / -1', sm: 'auto' } : 'auto' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ color: '#64748b', fontSize: { xs: 10, sm: 12 }, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>{s.label}</Typography>
                  {loading ? <Skeleton variant="text" width={60} height={36} /> : (
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', fontSize: { xs: 18, sm: 22 } }}>{s.value ?? 0}</Typography>
                  )}
                </Box>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: s.bg, color: s.color, flexShrink: 0 }}>{s.icon}</Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '5fr 7fr' }, gap: 2.5, mb: 2.5 }}>
        {/* Time Per Category Pie */}
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2.5, fontSize: 15 }}>Time Spent per Category</Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} />
            ) : stats?.timePerCategory?.length ? (
              <PieChart
                labels={stats.timePerCategory.map((t) => t.category)}
                data={stats.timePerCategory.map((t) => Math.round(t.duration / 60))}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                <Typography sx={{ color: '#64748b', fontSize: 14 }}>No reading data recorded yet.</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Read Articles Table */}
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2.5, fontSize: 15 }}>Recently Read Articles</Typography>
            {loading ? <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} /> : (
              stats?.readArticles?.length ? (
                <TableContainer sx={{ maxHeight: 260, overflowX: 'auto' }}>
                  <Table stickyHeader size="small" sx={{ minWidth: 280 }}>
                    <TableHead>
                      <TableRow>
                        {['Article', 'Category', 'Time'].map((h) => (
                          <TableCell key={h} sx={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff', whiteSpace: 'nowrap' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.readArticles.map((r, i) => (
                        <TableRow key={i} sx={{ '& td': { borderBottom: '1px solid #f1f5f9' } }}>
                          <TableCell sx={{ color: '#0f172a', fontSize: 13, maxWidth: { xs: 120, sm: 180 } }}>
                            <Typography noWrap sx={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>
                              {typeof r.article === 'object' ? r.article.title : 'Article'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Chip label={typeof r.article === 'object' ? r.article.category : '—'} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontSize: 11, height: 22, fontWeight: 500 }} />
                          </TableCell>
                          <TableCell sx={{ color: '#64748b', fontSize: 13, whiteSpace: 'nowrap' }}>{Math.round(r.duration / 60)}m</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                  <Typography sx={{ color: '#64748b', fontSize: 14 }}>No articles read yet.</Typography>
                </Box>
              )
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Highlights */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 2, fontSize: 15 }}>Saved Highlights</Typography>
          {loading ? <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} /> : highlights.length === 0 ? (
            <Typography sx={{ color: '#64748b', py: 3, textAlign: 'center', fontSize: 14 }}>No highlights saved yet. Select text while reading to save highlights.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {highlights.slice(0, 5).map((h) => (
                <Box key={h._id} sx={{ p: 2, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ color: '#334155', fontSize: 13, fontStyle: 'italic', mb: h.note ? 0.5 : 0 }}>"{h.text}"</Typography>
                  {h.note && <Typography sx={{ color: '#64748b', fontSize: 12, mt: 0.5 }}>Note: {h.note}</Typography>}
                  <Typography sx={{ color: '#94a3b8', fontSize: 11, mt: 0.5 }}>{new Date(h.timestamp).toLocaleDateString()}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
