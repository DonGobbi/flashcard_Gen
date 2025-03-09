import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const theme = useTheme();
  
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="h6" color="text.secondary">
        Loading your study space...
      </Typography>
    </Box>
  );
};

const RouteGuard = ({ children, isAuthenticated, isLoading }) => {
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RouteGuard;
