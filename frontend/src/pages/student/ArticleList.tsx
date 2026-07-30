import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, CardActionArea, Chip,
  TextField, InputAdornment, CircularProgress, Button,
} from '@mui/material';
import { Search, AccessTime, Visibility, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getArticles } from '../../api/articles';
import type { Article, ArticleCategory } from '../../types';

const CATEGORIES: ArticleCategory[] = ['Science', 'Math', 'English', 'History', 'Technology', 'Other'];
const CATEGORY_COLORS: Record<string, string> = {
  Science: '#00c896', Math: '#6c63ff', English: '#ffa500',
  History: '#ff6b6b', Technology: '#00bcd4', Other: '#8892a4',
};

export default function ArticleList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filtered, setFiltered] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then((data) => { setArticles(data); setFiltered(data); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = articles;
    if (activeCategory !== 'All') result = result.filter((a) => a.category === activeCategory);
    if (search.trim()) result = result.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, activeCategory, articles]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>Browse Articles</Typography>
        <Typography sx={{ color: '#64748b', fontSize: 14 }}>{articles.length} articles available</Typography>
      </Box>

      {/* Search & Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search articles by title or category..."
          value={search} size="small"
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment>
            }
          }}
          sx={{ mb: 2, width: '100%', maxWidth: 400, bgcolor: '#ffffff' }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['All', ...CATEGORIES].map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveCategory(cat)}
              sx={{
                cursor: 'pointer',
                bgcolor: activeCategory === cat ? '#2563eb' : '#ffffff',
                color: activeCategory === cat ? '#ffffff' : '#475569',
                border: '1px solid',
                borderColor: activeCategory === cat ? '#2563eb' : '#cbd5e1',
                fontWeight: activeCategory === cat ? 600 : 400,
                fontSize: 12,
                height: 28,
                '&:hover': { bgcolor: activeCategory === cat ? '#1d4ed8' : '#f1f5f9' },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Articles Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
          <CircularProgress size={30} sx={{ color: '#2563eb' }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Typography sx={{ color: '#64748b', fontSize: 14 }}>No articles found matching your search.</Typography>
          <Button onClick={() => { setSearch(''); setActiveCategory('All'); }} sx={{ mt: 1, color: '#2563eb', textTransform: 'none' }}>Clear Filters</Button>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2.5 }}>
          {filtered.map((article) => {
            return (
              <Box key={article._id}>
                <Card
                  sx={{
                    bgcolor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2, height: '100%',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    transition: 'border-color 0.2s',
                    '&:hover': {
                      borderColor: '#94a3b8',
                    },
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/student/articles/${article._id}`)} sx={{ height: '100%', p: 0 }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Chip label={article.category} size="small" sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 600, fontSize: 11, height: 22 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                          <Visibility sx={{ fontSize: 14 }} />
                          <Typography sx={{ fontSize: 12 }}>{article.viewCount ?? 0}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', fontSize: 15, mb: 1, lineHeight: 1.3 }}>
                        {article.title}
                      </Typography>
                      <Typography sx={{ color: '#64748b', fontSize: 13, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.contentBlocks?.find((b) => b.type === 'text')?.value || 'Read article...'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
                          <AccessTime sx={{ fontSize: 13 }} />
                          <Typography sx={{ fontSize: 12 }}>{new Date(article.createdAt).toLocaleDateString()}</Typography>
                        </Box>
                        <ArrowForward sx={{ fontSize: 14, color: '#2563eb' }} />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
