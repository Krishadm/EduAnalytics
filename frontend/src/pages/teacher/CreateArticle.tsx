import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  MenuItem, Select, FormControl, InputLabel, IconButton,
  CircularProgress, Chip, Divider, Tooltip, Alert,
} from '@mui/material';
import {
  Add, Delete, DragIndicator, TextFields, Image, VideoLibrary, ArrowBack, Save, Preview,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, updateArticle, getArticle } from '../../api/articles';
import api from '../../api/axios';
import type { Article, ContentBlock, ContentBlockType, ArticleCategory } from '../../types';
import toast from 'react-hot-toast';

const CATEGORIES: ArticleCategory[] = ['Science', 'Math', 'English', 'History', 'Technology', 'Other'];
const BLOCK_TYPES: { type: ContentBlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text Block', icon: <TextFields fontSize="small" /> },
  { type: 'image', label: 'Image Block', icon: <Image fontSize="small" /> },
  { type: 'video', label: 'Video Block', icon: <VideoLibrary fontSize="small" /> },
];

export default function CreateArticle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('Science');
  const [blocks, setBlocks] = useState<ContentBlock[]>([{ type: 'text', value: '' }]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getArticle(id).then((a) => {
        setTitle(a.title);
        setCategory(a.category);
        setBlocks(a.contentBlocks);
      }).catch(() => toast.error('Failed to load article')).finally(() => setFetchLoading(false));
    }
  }, [id]);

  const addBlock = (type: ContentBlockType) => setBlocks([...blocks, { type, value: '' }]);
  const removeBlock = (i: number) => setBlocks(blocks.filter((_, idx) => idx !== i));
  const updateBlock = (i: number, field: keyof ContentBlock, value: string) =>
    setBlocks(blocks.map((b, idx) => idx === i ? { ...b, [field]: value } : b));

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (blocks.every((b) => !b.value.trim())) { toast.error('Add at least one content block'); return; }
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateArticle(id, { title, category, contentBlocks: blocks });
        toast.success('Article updated!');
      } else {
        await createArticle({ title, category, contentBlocks: blocks });
        toast.success('Article created!');
      }
      navigate('/teacher/articles');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save article');
    } finally { setLoading(false); }
  };

  if (fetchLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress size={30} sx={{ color: '#2563eb' }} /></Box>;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        {/* Top row: back + title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 1.5, sm: 0 } }}>
          <IconButton onClick={() => navigate('/teacher/articles')} size="small" sx={{ color: '#64748b', flexShrink: 0 }}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', fontSize: { xs: 18, sm: 22 } }}>
              {isEdit ? 'Edit Article' : 'Create Article'}
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: 13 }}>Build and organize learning content</Typography>
          </Box>
          {/* Buttons: inline on sm+, below on xs */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, flexShrink: 0 }}>
            <Button
              startIcon={<Preview />} onClick={() => setPreview(!preview)}
              sx={{ color: '#475569', borderColor: '#cbd5e1', borderRadius: 1, textTransform: 'none' }}
              variant="outlined" size="small"
            >
              {preview ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="contained" startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Save />}
              onClick={handleSubmit} disabled={loading}
              sx={{ borderRadius: 1, fontWeight: 600, textTransform: 'none', bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
            >
              {isEdit ? 'Update' : 'Publish'}
            </Button>
          </Box>
        </Box>

        {/* Mobile buttons row */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1, pl: 5 }}>
          <Button
            startIcon={<Preview />} onClick={() => setPreview(!preview)}
            sx={{ color: '#475569', borderColor: '#cbd5e1', borderRadius: 1, textTransform: 'none', flex: 1 }}
            variant="outlined" size="small"
          >
            {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="contained" startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Save />}
            onClick={handleSubmit} disabled={loading}
            sx={{ borderRadius: 1, fontWeight: 600, textTransform: 'none', bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, flex: 1 }}
          >
            {isEdit ? 'Update' : 'Publish'}
          </Button>
        </Box>
      </Box>

      {preview ? (
        /* Preview Mode */
        <Card sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Chip label={category} size="small" sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 600, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 3, fontSize: { xs: 22, md: 30 } }}>{title || 'Untitled Article'}</Typography>
            {blocks.map((b, i) => (
              <Box key={i} sx={{ mb: 2.5 }}>
                {b.type === 'text' && <Typography sx={{ color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: 15 }}>{b.value}</Typography>}
                {b.type === 'image' && b.value && <Box component="img" src={b.value} alt={b.caption} sx={{ maxWidth: '100%', borderRadius: 1.5, border: '1px solid #e2e8f0' }} />}
                {b.type === 'video' && b.value && (
                  <Box component="video" controls src={b.value} sx={{ maxWidth: '100%', borderRadius: 1.5 }} />
                )}
                {b.caption && <Typography sx={{ color: '#64748b', fontSize: 13, mt: 0.5, fontStyle: 'italic' }}>{b.caption}</Typography>}
              </Box>
            ))}
          </CardContent>
        </Card>
      ) : (
        /* Edit Mode */
        <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Article Meta */}
            <Card sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', mb: 2.5 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1.5 }}>Article Meta</Typography>
                <TextField
                  fullWidth label="Article Title" value={title} size="small"
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 2, bgcolor: '#ffffff' }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category} label="Category"
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    sx={{ bgcolor: '#ffffff' }}
                  >
                    {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>

            {/* Content Blocks */}
            {blocks.map((block, i) => (
              <Card key={i} sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', mb: 2 }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>{block.type} Block</Typography>
                    <IconButton size="small" onClick={() => removeBlock(i)} sx={{ color: '#ef4444' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>

                  {block.type === 'text' ? (
                    <TextField
                      fullWidth multiline rows={4} placeholder="Write block content..."
                      value={block.value} onChange={(e) => updateBlock(i, 'value', e.target.value)}
                      sx={{ bgcolor: '#ffffff' }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                      <TextField
                        fullWidth size="small" placeholder={block.type === 'image' ? 'Image URL' : 'Video URL'}
                        value={block.value} onChange={(e) => updateBlock(i, 'value', e.target.value)}
                        sx={{ bgcolor: '#ffffff' }}
                      />
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{ height: 40, flexShrink: 0, color: '#475569', borderColor: '#cbd5e1', textTransform: 'none', whiteSpace: 'nowrap' }}
                      >
                        Upload File
                        <input
                          type="file"
                          hidden
                          accept={block.type === 'image' ? 'image/*' : 'video/*'}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append('file', file);
                              const toastId = toast.loading('Uploading file...');
                              try {
                                const response = await api.post('/api/articles/upload', formData, {
                                  headers: { 'Content-Type': 'multipart/form-data' }
                                });
                                updateBlock(i, 'value', response.data.url);
                                toast.success('File uploaded!', { id: toastId });
                              } catch (err: any) {
                                toast.error(err?.response?.data?.message || 'Upload failed', { id: toastId });
                              }
                            }
                          }}
                        />
                      </Button>
                    </Box>
                  )}
                  {block.type !== 'text' && (
                    <TextField
                      fullWidth size="small" placeholder="Caption (optional)"
                      value={block.caption || ''} onChange={(e) => updateBlock(i, 'caption', e.target.value)}
                      sx={{ bgcolor: '#ffffff' }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Add Block Sidebar */}
          <Box sx={{ width: { xs: '100%', lg: 200 }, flexShrink: 0 }}>
            <Card sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', position: { lg: 'sticky' }, top: 24 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1.5 }}>Add Content Block</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', lg: 'nowrap' }, flexDirection: { xs: 'row', lg: 'column' } }}>
                  {BLOCK_TYPES.map((bt) => (
                    <Button
                      key={bt.type} startIcon={bt.icon}
                      onClick={() => addBlock(bt.type)}
                      sx={{
                        flex: { xs: 1, lg: 'unset' },
                        justifyContent: 'flex-start', borderRadius: 1, color: '#334155',
                        bgcolor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        '&:hover': { bgcolor: '#f1f5f9' },
                        fontSize: 13, fontWeight: 500, textTransform: 'none',
                        mb: { xs: 0, lg: 1 },
                      }}
                    >
                      {bt.label}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
}
