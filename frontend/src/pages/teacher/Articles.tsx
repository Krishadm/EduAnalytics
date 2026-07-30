import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Tooltip,
} from '@mui/material';
import { Add, Search, Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getArticles, deleteArticle } from '../../api/articles';
import type { Article } from '../../types';
import toast from 'react-hot-toast';

export default function TeacherArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filtered, setFiltered] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getArticles().then((data) => {
      setArticles(data); setFiltered(data);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(articles.filter((a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)));
  }, [search, articles]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteArticle(deleteId);
      toast.success('Article deleted');
      setDeleteId(null);
      load();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', fontSize: { xs: 18, sm: 22 } }}>My Articles</Typography>
          <Typography sx={{ color: '#64748b', fontSize: 14 }}>{articles.length} total articles</Typography>
        </Box>
        <Button
          variant="contained" startIcon={<Add />}
          onClick={() => navigate('/teacher/articles/create')}
          sx={{ borderRadius: 1, fontWeight: 600, bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, textTransform: 'none', flexShrink: 0 }}
        >
          New Article
        </Button>
      </Box>

      <Card sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <TextField
            placeholder="Search articles..." size="small"
            value={search} onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment>
              }
            }}
            sx={{ mb: 2.5, width: { xs: '100%', sm: 300 }, bgcolor: '#ffffff' }}
          />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={30} sx={{ color: '#2563eb' }} />
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography sx={{ color: '#64748b', fontSize: 14 }}>No articles found. Create your first article!</Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    {['Title', 'Category', 'Views', 'Created', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a._id} sx={{ '&:hover': { bgcolor: '#f8fafc' }, '& td': { borderBottom: '1px solid #f1f5f9' } }}>
                      <TableCell sx={{ color: '#0f172a', fontWeight: 500, maxWidth: { xs: 140, sm: 260 } }}>
                        <Typography noWrap sx={{ fontSize: 14, color: '#0f172a', fontWeight: 500 }}>{a.title}</Typography>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Chip label={a.category} size="small" sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 500, fontSize: 11, height: 22 }} />
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: 13, whiteSpace: 'nowrap' }}>{a.viewCount ?? 0}</TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: 13, whiteSpace: 'nowrap' }}>{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/teacher/articles/${a._id}/edit`)} sx={{ color: '#2563eb' }}><Edit fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(a._id)} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton></Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: { sx: { bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, p: 1, mx: 2 } }
        }}
      >
        <DialogTitle sx={{ color: '#0f172a', fontWeight: 600, fontSize: 18 }}>Delete Article?</DialogTitle>
        <DialogContent><Typography sx={{ color: '#64748b', fontSize: 14 }}>Are you sure you want to delete this article? This action cannot be undone and will permanently remove all associated engagement analytics.</Typography></DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#64748b', textTransform: 'none', px: 2 }}>Cancel</Button>
          <Button onClick={handleDelete} disabled={deleting} variant="contained" sx={{ bgcolor: '#ef4444', textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#dc2626' } }}>
            {deleting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Delete Article'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
