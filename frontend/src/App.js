import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  CssBaseline, 
  useMediaQuery,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  Grid,
  ThemeProvider,
  createTheme,
  Tooltip,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FileUpload from './components/FileUpload';
import FlashcardList from './components/FlashcardList';
import FlashcardCustomization from './components/FlashcardCustomization';
import HelpDialog from './components/HelpDialog';
import config from './config';

const getDesignTokens = (mode, customization) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: customization?.primaryColor || '#2196f3',
          },
          secondary: {
            main: customization?.secondaryColor || '#f50057',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
        }
      : {
          primary: {
            main: customization?.primaryColor || '#90caf9',
          },
          secondary: {
            main: customization?.secondaryColor || '#f48fb1',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
        }),
  },
  typography: {
    fontFamily: customization?.font || '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: customization?.fontSize || 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },
});

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [mode, setMode] = useState('light');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [customization, setCustomization] = useState({
    style: 'Classic',
    font: 'Roboto',
    fontSize: 14,
    primaryColor: '#2196f3',
    secondaryColor: '#f50057',
    animations: true,
  });
  const [showHelp, setShowHelp] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode, customization)), [mode, customization]);

  const handleFileUploadSuccess = (newFlashcards) => {
    setFlashcards(newFlashcards);
    setSnackbar({
      open: true,
      message: `Successfully generated ${newFlashcards.length} flashcards!`,
      severity: 'success',
    });
  };

  const handleError = (errorMessage) => {
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

      if (format === 'print') {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          throw new Error('Pop-up blocked. Please allow pop-ups and try again.');
        }

        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Flashcards</title>
              <style>
                body { 
                  font-family: ${customization.font}, Arial, sans-serif;
                  margin: 20px;
                  color: ${mode === 'dark' ? '#fff' : '#000'};
                  background-color: ${mode === 'dark' ? '#121212' : '#fff'};
                }
                .flashcard { 
                  border: 1px solid ${mode === 'dark' ? '#444' : '#ccc'}; 
                  padding: 20px; 
                  margin-bottom: 20px;
                  page-break-inside: avoid;
                  background-color: ${mode === 'dark' ? '#1e1e1e' : '#fff'};
                }
                .question { 
                  font-weight: bold; 
                  margin-bottom: 10px;
                  color: ${customization.primaryColor};
                }
                .answer { 
                  margin-top: 10px;
                  color: ${mode === 'dark' ? '#ddd' : '#333'};
                }
                @media print {
                  .flashcard { break-inside: avoid; }
                  body { 
                    color: #000;
                    background-color: #fff;
                  }
                  .flashcard {
                    border-color: #ccc;
                    background-color: #fff;
                  }
                  .question { color: #000; }
                  .answer { color: #333; }
                }
              </style>
            </head>
            <body>
              <h1 style="color: ${customization.primaryColor}">My Flashcards</h1>
              ${flashcards.map((card, index) => `
                <div class="flashcard">
                  <div class="question">Question ${index + 1}: ${card.question}</div>
                  <div class="answer">Answer: ${card.answer}</div>
                </div>
              `).join('')}
            </body>
          </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();

        setSnackbar({
          open: true,
          message: 'Print window opened successfully!',
          severity: 'success',
        });
        return;
      }

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
          customization
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

  const handleImproveAllCards = async () => {
    try {
      setIsImproving(true);
      setSnackbar({
        open: true,
        message: 'Improving all flashcards...',
        severity: 'info',
      });

      const improvedCards = [];
      for (const card of flashcards) {
        const response = await fetch(`${config.API_BASE_URL}/api/improve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            flashcard: {
              question: card.question,
              answer: card.answer
            }
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to improve flashcard');
        }

        const data = await response.json();
        improvedCards.push(data.flashcard);
      }

      setFlashcards(improvedCards);
      setSnackbar({
        open: true,
        message: 'Successfully improved all flashcards!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error improving cards:', error);
      setSnackbar({
        open: true,
        message: 'Failed to improve flashcards. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsImproving(false);
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
          bgcolor: 'background.default',
          transition: 'background-color 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" color="primary" gutterBottom>
                Flashcard Generator
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {flashcards.length > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={handleImproveAllCards}
                    disabled={isImproving}
                  >
                    {isImproving ? 'Improving...' : 'Improve All Cards'}
                  </Button>
                )}
                <Tooltip title="Help">
                  <IconButton onClick={() => setShowHelp(true)} color="inherit">
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                  <IconButton onClick={toggleColorMode} color="inherit">
                    {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <FileUpload onSuccess={handleFileUploadSuccess} onError={handleError} />
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <FlashcardCustomization
                    onCustomizationChange={handleCustomizationChange}
                    onExport={handleExport}
                    customization={customization}
                  />
                </motion.div>
              </Grid>

              {flashcards.length > 0 && (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Paper elevation={3} sx={{ p: 3 }}>
                      <FlashcardList
                        flashcards={flashcards}
                        onFlashcardsUpdate={handleFlashcardsUpdate}
                        onError={handleError}
                        customization={customization}
                      />
                    </Paper>
                  </motion.div>
                </Grid>
              )}
            </Grid>
          </Box>
        </Container>

        <HelpDialog open={showHelp} onClose={() => setShowHelp(false)} />

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
      </Box>
    </ThemeProvider>
  );
}

export default App;
