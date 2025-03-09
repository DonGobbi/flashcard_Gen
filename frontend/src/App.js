import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { SnackbarProvider, useSnackbar } from 'notistack';
import LandingPage from './components/LandingPage';
import AuthDialog from './components/AuthDialog';
import Dashboard from './components/Dashboard';
import FlashcardSets from './components/FlashcardSets';
import FlashcardEditor from './components/FlashcardEditor';
import StudyInterface from './components/StudyInterface';
import StudyAnalytics from './components/StudyAnalytics';
import Settings from './components/Settings';
import RouteGuard from './components/RouteGuard';
import AuthService from './services/authService';

const themeSettings = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' 
            ? '0 2px 4px rgba(0,0,0,0.1)' 
            : '0 2px 4px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });
  
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleThemeToggle = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const handleLogin = async (email, password) => {
    try {
      await AuthService.login(email, password);
      enqueueSnackbar('Successfully logged in!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      throw error;
    }
  };

  const handleSignup = async (email, password) => {
    try {
      await AuthService.register(email, password);
      enqueueSnackbar('Account created successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      throw error;
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      enqueueSnackbar('Successfully logged in with Google!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      enqueueSnackbar('Successfully logged out!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              !user ? (
                <LandingPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              !user ? (
                <AuthDialog
                  mode="login"
                  onSubmit={handleLogin}
                  onGoogleAuth={handleGoogleAuth}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !user ? (
                <AuthDialog
                  mode="signup"
                  onSubmit={handleSignup}
                  onGoogleAuth={handleGoogleAuth}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <RouteGuard isAuthenticated={!!user} isLoading={loading}>
                <Dashboard
                  onLogout={handleLogout}
                  onThemeToggle={handleThemeToggle}
                  isDarkMode={mode === 'dark'}
                />
              </RouteGuard>
            }
          >
            <Route index element={<FlashcardSets />} />
            <Route path="sets" element={<FlashcardSets />} />
            <Route path="sets/new" element={<FlashcardEditor />} />
            <Route path="sets/:id" element={<FlashcardEditor />} />
            <Route path="sets/:id/study" element={<StudyInterface />} />
            <Route path="study" element={<FlashcardSets study />} />
            <Route path="analytics" element={<StudyAnalytics />} />
            <Route path="settings" element={<Settings onThemeToggle={handleThemeToggle} isDarkMode={mode === 'dark'} />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <SnackbarProvider 
      maxSnack={3} 
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
    >
      <AppContent />
    </SnackbarProvider>
  );
};

export default App;
