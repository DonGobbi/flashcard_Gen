import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Fade,
  useMediaQuery,
  IconButton,
  Tooltip,
  Snackbar,
  Divider,
  Grid,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FileUpload from './components/FileUpload';
import FlashcardList from './components/FlashcardList';
import StatsCard from './components/StatsCard';
import FlashcardCustomization from './components/FlashcardCustomization';

const getDesignTokens = (mode, customization) => ({
  palette: {
    mode,
    primary: {
      main: customization?.colorTheme?.primary || (mode === 'light' ? '#2196F3' : '#90CAF9'),
    },
    secondary: {
      main: customization?.colorTheme?.secondary || (mode === 'light' ? '#F50057' : '#FF4081'),
    },
    background: {
      default: mode === 'light' ? '#F5F5F5' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
  },
  typography: {
    fontFamily: customization?.font || '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: customization?.fontSize || 16,
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: mode === 'light' ? 'translateY(-4px)' : 'none',
            boxShadow: mode === 'light' ? '0 8px 24px rgba(0,0,0,0.1)' : 'none',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCards: 0,
    successRate: 0,
    averageTime: 0,
  });
  const [mode, setMode] = useState('light');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [customization, setCustomization] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode, customization)), [mode, customization]);

  const handleFileUploadSuccess = (newFlashcards) => {
    setFlashcards(newFlashcards);
    setError(null);
    setStats(prev => ({
      ...prev,
      totalCards: prev.totalCards + newFlashcards.length,
    }));
    setSnackbar({
      open: true,
      message: `Successfully generated ${newFlashcards.length} flashcards!`,
      severity: 'success',
    });
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: 'error',
    });
  };

  const handleFlashcardsUpdate = (updatedFlashcards) => {
    setFlashcards(updatedFlashcards);
    setSnackbar({
      open: true,
      message: 'Flashcard updated successfully!',
      severity: 'success',
    });
  };

  const handleCustomizationChange = (newCustomization) => {
    setCustomization(newCustomization);
    setSnackbar({
      open: true,
      message: 'Design updated successfully!',
      severity: 'success',
    });
  };

  const handleExport = async (format, customizationOptions) => {
    try {
      setSnackbar({
        open: true,
        message: `Exporting flashcards in ${format} format...`,
        severity: 'info',
      });

      let endpoint = '';
      switch (format) {
        case 'pdf':
          endpoint = '/api/export/pdf';
          break;
        case 'anki':
          endpoint = '/api/export/anki';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcards,
          customization: customizationOptions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to export flashcards in ${format} format`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flashcards.${format === 'anki' ? 'apkg' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: `Successfully exported flashcards in ${format} format!`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Export error:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    }
  };

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.background.default,
          transition: 'background 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                  }}
                >
                  AI Flashcard Generator
                </Typography>
              </motion.div>
              <Box>
                <Tooltip title="Help">
                  <IconButton onClick={() => setShowHelp(!showHelp)} color="inherit" sx={{ mr: 1 }}>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                  <IconButton onClick={toggleColorMode} color="inherit">
                    {mode === 'light' ? <NightlightIcon /> : <LightModeIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {showHelp && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Paper sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h5" gutterBottom color="primary">
                    How to Use
                  </Typography>
                  <Typography variant="body1" paragraph>
                    1. Upload your content file (supported formats: TXT, DOCX, PPTX, CSV)
                  </Typography>
                  <Typography variant="body1" paragraph>
                    2. Customize the appearance of your flashcards using the customization panel
                  </Typography>
                  <Typography variant="body1" paragraph>
                    3. Study your flashcards with our interactive viewer
                  </Typography>
                  <Typography variant="body1">
                    4. Export your flashcards in various formats or print them for offline use
                  </Typography>
                </Paper>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StatsCard stats={stats} />
            </motion.div>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 4,
                      height: '100%',
                      background: theme.palette.background.paper,
                    }}
                  >
                    <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
                      Generate Flashcards
                    </Typography>
                    <FileUpload 
                      onSuccess={handleFileUploadSuccess}
                      onError={handleError}
                    />
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FlashcardCustomization
                    onCustomizationChange={handleCustomizationChange}
                    onExport={handleExport}
                  />
                </motion.div>
              </Grid>
            </Grid>

            {error && (
              <Fade in={true}>
                <Alert 
                  severity="error" 
                  sx={{ mb: 4 }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {flashcards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4,
                    background: theme.palette.background.paper,
                  }}
                >
                  <FlashcardList 
                    flashcards={flashcards} 
                    onStatsUpdate={(newStats) => setStats(prev => ({ ...prev, ...newStats }))}
                    onFlashcardsUpdate={handleFlashcardsUpdate}
                    onError={handleError}
                    customization={customization}
                  />
                </Paper>
              </motion.div>
            )}
          </Box>
        </Container>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
