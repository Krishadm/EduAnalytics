import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Avatar, Chip, Divider, IconButton, Tooltip,
  AppBar, Toolbar, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Dashboard, Article, Analytics, LibraryBooks,
  MenuBook, ChevronLeft, ChevronRight, Logout, Menu,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DRAWER_W = 240;
const MINI_W = 64;

const teacherLinks = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/teacher/dashboard' },
  { label: 'My Articles', icon: <Article />, path: '/teacher/articles' },
  { label: 'Analytics', icon: <Analytics />, path: '/teacher/analytics' },
];
const studentLinks = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/student/dashboard' },
  { label: 'Browse Articles', icon: <LibraryBooks />, path: '/student/articles' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  const drawerContent = (mobile = false) => (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: (mobile || open) ? 'space-between' : 'center', minHeight: 60 }}>
        {(mobile || open) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MenuBook sx={{ color: '#2563eb', fontSize: 24 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>EduAnalytics</Typography>
          </Box>
        )}
        {!mobile && (
          <IconButton onClick={() => setOpen(!open)} size="small" sx={{ color: '#64748b' }}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        )}
      </Box>

      <Box sx={{ px: (mobile || open) ? 2 : 1, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, flexDirection: (mobile || open) ? 'row' : 'column' }}>
        <Avatar sx={{ bgcolor: '#2563eb', width: 34, height: 34, fontSize: 14, fontWeight: 600 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        {(mobile || open) && (
          <Box>
            <Typography sx={{ color: '#0f172a', fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>{user?.name}</Typography>
            <Chip label={user?.role} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', mt: 0.3, height: 18, fontSize: 10, fontWeight: 600, textTransform: 'capitalize' }} />
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      <List sx={{ px: 1, pt: 1, flexGrow: 1 }}>
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Tooltip title={!mobile && !open ? link.label : ''} placement="right" key={link.path}>
              <ListItemButton
                onClick={() => { navigate(link.path); if (mobile) setMobileOpen(false); }}
                sx={{
                  borderRadius: 1.5, mb: 0.5, minHeight: 40,
                  bgcolor: active ? '#eff6ff' : 'transparent',
                  '&:hover': { bgcolor: active ? '#eff6ff' : '#f8fafc' },
                  justifyContent: (mobile || open) ? 'initial' : 'center',
                }}
              >
                <ListItemIcon sx={{ color: active ? '#2563eb' : '#64748b', minWidth: (mobile || open) ? 36 : 0 }}>
                  {link.icon}
                </ListItemIcon>
                {(mobile || open) && (
                  <ListItemText primary={<Typography sx={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? '#2563eb' : '#475569' }}>{link.label}</Typography>} />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      <Box sx={{ p: 1 }}>
        <Tooltip title={!mobile && !open ? 'Logout' : ''} placement="right">
          <ListItemButton
            onClick={logout}
            sx={{ borderRadius: 1.5, minHeight: 40, justifyContent: (mobile || open) ? 'initial' : 'center', '&:hover': { bgcolor: '#fef2f2' } }}
          >
            <ListItemIcon sx={{ color: '#ef4444', minWidth: (mobile || open) ? 36 : 0 }}><Logout fontSize="small" /></ListItemIcon>
            {(mobile || open) && <ListItemText primary={<Typography sx={{ fontSize: 14, color: '#ef4444', fontWeight: 500 }}>Logout</Typography>} />}
          </ListItemButton>
        </Tooltip>
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <>
        <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0', zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ minHeight: 56 }}>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#0f172a', mr: 1 }}>
              <Menu />
            </IconButton>
            <MenuBook sx={{ color: '#2563eb', fontSize: 22, mr: 0.5 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>EduAnalytics</Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_W,
              bgcolor: '#ffffff',
              borderRight: '1px solid #e2e8f0',
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent(true)}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_W : MINI_W,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_W : MINI_W,
          transition: 'width 0.2s ease',
          overflowX: 'hidden',
          bgcolor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent(false)}
    </Drawer>
  );
}
