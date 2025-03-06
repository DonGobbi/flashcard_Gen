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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Close as CloseIcon } from '@mui/icons-material';
import AuthService from '../services/authService';

const AuthDialog = ({ open, onClose, mode = 'login', onSuccess }) => {
  const theme = useTheme();
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

      const result = isLogin
        ? await AuthService.login(formData.email, formData.password)
        : await AuthService.register(formData.email, formData.password);

      onSuccess(result);
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
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #1a237e 30%, #311b92 90%)'
            : 'linear-gradient(45deg, #42a5f5 30%, #3f51b5 90%)',
          p: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ color: 'white', p: 0 }}>
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </DialogTitle>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          {isLogin
            ? 'Sign in to access your flashcards'
            : 'Join us to start creating smart flashcards'}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
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
                  />
                )}
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
              </Box>
            </motion.div>
          </AnimatePresence>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={loading}
            sx={{ position: 'relative' }}
          >
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-12px',
                }}
              />
            )}
            <span style={{ opacity: loading ? 0 : 1 }}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </span>
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={toggleMode}
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AuthDialog;
