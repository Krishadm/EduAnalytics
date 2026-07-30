import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          pt: { xs: '72px', md: 4 },
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          minHeight: '100vh',
          bgcolor: '#f8fafc',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
