import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherArticles from './pages/teacher/Articles';
import CreateArticle from './pages/teacher/CreateArticle';
import TeacherAnalytics from './pages/teacher/Analytics';
import StudentDashboard from './pages/student/Dashboard';
import ArticleList from './pages/student/ArticleList';
import ArticleReader from './pages/student/ArticleReader';

const cleanTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    secondary: { main: '#0d9488' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, borderRadius: 6, boxShadow: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={cleanTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute role="teacher" />}>
              <Route element={<AppLayout />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/articles" element={<TeacherArticles />} />
                <Route path="/teacher/articles/create" element={<CreateArticle />} />
                <Route path="/teacher/articles/:id/edit" element={<CreateArticle />} />
                <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
              </Route>
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute role="student" />}>
              <Route element={<AppLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/articles" element={<ArticleList />} />
                <Route path="/student/articles/:id" element={<ArticleReader />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161b27',
            color: '#fff',
            border: '1px solid rgba(108,99,255,0.25)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#00c896', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ff6b6b', secondary: '#fff' } },
        }}
      />
    </ThemeProvider>
  );
}
