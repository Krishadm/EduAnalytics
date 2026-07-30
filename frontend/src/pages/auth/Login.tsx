import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, CircularProgress, Link,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, MenuBook } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      // AuthContext will set user; redirect based on role after a tiny tick
      setTimeout(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
          const user = JSON.parse(stored);
          navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
        }
      }, 100);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setForm(prev => ({ ...prev, password: '' }));
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
      }}
    >
      <Card sx={{
        width: '100%', maxWidth: 400, mx: 2,
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <MenuBook sx={{ color: '#2563eb', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                EduAnalytics
              </Typography>
            </Box>
            <Typography sx={{ color: '#64748b', fontSize: 14 }}>Sign in to your dashboard</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth label="Email" type="email" required size="small"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Email sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment>
                }
              }}
            />
            <TextField
              fullWidth label="Password" type={showPass ? 'text' : 'password'} required size="small"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                        {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <Button
              type="submit" fullWidth variant="contained" disabled={loading}
              sx={{
                mt: 1, py: 1, borderRadius: 1, fontWeight: 600, fontSize: 14,
                bgcolor: '#2563eb',
                '&:hover': { bgcolor: '#1d4ed8' },
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Sign In'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 2.5, color: '#64748b', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" sx={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
