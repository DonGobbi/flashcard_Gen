import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Close as CloseIcon,
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  LoginOutlined,
  PersonAddOutlined,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthDialog = ({ mode = 'login', onSubmit, onGoogleAuth }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await onSubmit(formData.email, formData.password);
      
      // After successful auth, redirect to the intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await onGoogleAuth();
      
      // After successful auth, redirect to the intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    });
    navigate(isLogin ? '/signup' : '/login', { 
      replace: true,
      state: location.state 
    });
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 480,
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isLogin
                ? 'Sign in to access your flashcards'
                : 'Join us to start creating smart flashcards'}
            </Typography>
          </motion.div>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  disabled={loading}
                  error={!!error}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  disabled={loading}
                  error={!!error}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    disabled={loading}
                    error={!!error}
                    InputProps={{
                      startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                )}
              </Box>
            </motion.div>
          </AnimatePresence>

          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : (isLogin ? <LoginOutlined /> : <PersonAddOutlined />)}
              sx={{ mb: 2 }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <Button
              fullWidth
              onClick={handleGoogleSignIn}
              variant="outlined"
              disabled={loading}
              startIcon={<GoogleIcon />}
              sx={{ mb: 2 }}
            >
              Continue with Google
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            onClick={toggleMode}
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthDialog;
