import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box, Typography, Chip, IconButton, CircularProgress, Drawer,
  TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Divider, Card,
} from '@mui/material';
import {
  ArrowBack, Bookmark, BookmarkBorder, AccessTime, Visibility,
  ThreeDRotation, Close, FormatQuote,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticle } from '../../api/articles';
import { logView, logDuration } from '../../api/tracking';
import { saveHighlight, getHighlights } from '../../api/highlights';
import type { Article, Highlight } from '../../types';
import toast from 'react-hot-toast';

const CATEGORY_COLORS: Record<string, string> = {
  Science: '#00c896', Math: '#6c63ff', English: '#ffa500',
  History: '#ff6b6b', Technology: '#00bcd4', Other: '#8892a4',
};

export default function ArticleReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Highlight dialog
  const [selectedText, setSelectedText] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);
  const [savingHighlight, setSavingHighlight] = useState(false);

  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load article + highlights
  useEffect(() => {
    if (!id) return;
    Promise.all([
      getArticle(id).then(setArticle),
      getHighlights(id).then(setHighlights),
    ]).catch(console.error).finally(() => setLoading(false));

    // Log view on open
    logView({ articleId: id }).catch(console.error);

    // Start timer
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      // Log duration on unmount
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      logDuration({ articleId: id!, duration }).catch(console.error);
    };
  }, [id]);

  // Detect text selection
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 3) {
      setSelectedText(text);
      setNoteInput('');
      setHighlightDialogOpen(true);
    }
  }, []);

  const handleSaveHighlight = async () => {
    if (!id || !selectedText) return;
    setSavingHighlight(true);
    try {
      const h = await saveHighlight({ articleId: id, text: selectedText, note: noteInput });
      setHighlights((prev) => [h, ...prev]);
      toast.success('Highlight saved!');
      setHighlightDialogOpen(false);
      setSelectedText('');
      setNoteInput('');
    } catch { toast.error('Failed to save highlight'); }
    finally { setSavingHighlight(false); }
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress sx={{ color: '#6c63ff' }} /></Box>;
  if (!article) return <Box sx={{ pt: 6, textAlign: 'center' }}><Typography sx={{ color: '#8892a4' }}>Article not found.</Typography></Box>;

  const color = CATEGORY_COLORS[article.category] || '#6c63ff';

  return (
    <Box sx={{ maxWidth: 840, mx: 'auto', px: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/student/articles')} size="small" sx={{ color: '#64748b' }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        {/* Timer */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid #cbd5e1' }}>
          <AccessTime sx={{ color: '#0d9488', fontSize: 14 }} />
          <Typography sx={{ color: '#0d9488', fontSize: 13, fontWeight: 600 }}>{fmtTime(elapsed)}</Typography>
        </Box>
        <Tooltip title="View Highlights">
          <IconButton onClick={() => setDrawerOpen(true)} size="small" sx={{ color: '#d97706', bgcolor: '#fef3c7', '&:hover': { bgcolor: '#fde68a' } }}>
            <Bookmark fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Article */}
      <Card
        sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', overflow: 'hidden' }}
        onMouseUp={handleMouseUp}
      >
        <Box sx={{ p: { xs: 2.5, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Chip label={article.category} size="small" sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 600, fontSize: 11, height: 22 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
              <Visibility sx={{ fontSize: 14 }} />
              <Typography sx={{ fontSize: 12 }}>{article.viewCount ?? 0} views</Typography>
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: -0.5, lineHeight: 1.3, mb: 2, fontSize: { xs: 22, md: 30 } }}>
            {article.title}
          </Typography>

          <Typography sx={{ color: '#64748b', fontSize: 13, mb: 3 }}>
            Published on {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>

          <Divider sx={{ borderColor: '#f1f5f9', mb: 3 }} />

          {/* Content Blocks */}
          {article.contentBlocks?.map((block, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              {block.type === 'text' && (
                <Typography sx={{ color: '#334155', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap', userSelect: 'text' }}>
                  {block.value}
                </Typography>
              )}
              {block.type === 'image' && block.value && (
                <Box>
                  <Box
                    component="img"
                    src={block.value}
                    alt={block.caption || 'Article image'}
                    sx={{ width: '100%', maxHeight: 440, objectFit: 'cover', borderRadius: 1.5, border: '1px solid #e2e8f0' }}
                    onError={(e: any) => { e.target.style.display = 'none'; }}
                  />
                  {block.caption && <Typography sx={{ color: '#64748b', fontSize: 12, mt: 0.5, textAlign: 'center', fontStyle: 'italic' }}>{block.caption}</Typography>}
                </Box>
              )}
              {block.type === 'video' && block.value && (
                <Box>
                  <Box
                    component="video"
                    controls
                    src={block.value}
                    sx={{ width: '100%', borderRadius: 1.5, border: '1px solid #e2e8f0' }}
                  />
                  {block.caption && <Typography sx={{ color: '#64748b', fontSize: 12, mt: 0.5, textAlign: 'center', fontStyle: 'italic' }}>{block.caption}</Typography>}
                </Box>
              )}
            </Box>
          ))}

          {/* Highlight tip */}
          <Divider sx={{ borderColor: '#f1f5f9', my: 3 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <FormatQuote sx={{ color: '#2563eb', fontSize: 18 }} />
            <Typography sx={{ color: '#64748b', fontSize: 13 }}>
              <strong style={{ color: '#0f172a' }}>Tip:</strong> Select any text above to save a highlight or add a note.
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Highlight Dialog */}
      <Dialog
        open={highlightDialogOpen}
        onClose={() => setHighlightDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 } }
        }}
      >
        <DialogTitle sx={{ color: '#0f172a', fontWeight: 600, fontSize: 16, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bookmark sx={{ color: '#d97706', fontSize: 20 }} />
            Save Highlight
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: '#fef3c7', border: '1px solid #fde68a', mb: 2, mt: 0.5 }}>
            <Typography sx={{ color: '#92400e', fontSize: 13, fontStyle: 'italic' }}>"{selectedText}"</Typography>
          </Box>
          <TextField
            fullWidth multiline rows={3} size="small"
            label="Add a note (optional)"
            value={noteInput} onChange={(e) => setNoteInput(e.target.value)}
            sx={{ bgcolor: '#ffffff' }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setHighlightDialogOpen(false)} sx={{ color: '#64748b', textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleSaveHighlight} disabled={savingHighlight} variant="contained"
            sx={{ borderRadius: 1, bgcolor: '#2563eb', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#1d4ed8' } }}
          >
            {savingHighlight ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Highlights Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: { sx: { width: { xs: '85%', sm: 340 }, bgcolor: '#ffffff', borderLeft: '1px solid #e2e8f0', p: 0 } }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Bookmark sx={{ color: '#d97706', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>My Highlights</Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: '#64748b' }}><Close /></IconButton>
          </Box>
          {highlights.length === 0 ? (
            <Box sx={{ textAlign: 'center', pt: 6 }}>
              <BookmarkBorder sx={{ color: '#94a3b8', fontSize: 40, mb: 1 }} />
              <Typography sx={{ color: '#64748b', fontSize: 13 }}>No highlights saved yet.<br />Select text in article to save.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {highlights.map((h) => (
                <Box key={h._id} sx={{ p: 2, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ color: '#334155', fontSize: 13, fontStyle: 'italic', mb: h.note ? 0.5 : 0 }}>"{h.text}"</Typography>
                  {h.note && <Typography sx={{ color: '#64748b', fontSize: 12, mt: 0.5 }}>Note: {h.note}</Typography>}
                  <Typography sx={{ color: '#94a3b8', fontSize: 11, mt: 0.5 }}>{new Date(h.timestamp).toLocaleTimeString()}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
