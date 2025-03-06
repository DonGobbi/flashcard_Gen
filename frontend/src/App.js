import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar,
  Alert
} from '@mui/material';
import FileUpload from './components/FileUpload';
import FlashcardList from './components/FlashcardList';
import AIControls from './components/AIControls';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleAIOperation = async (operation, data) => {
    try {
      const response = await fetch(`http://localhost:5000/api/${operation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('AI operation failed');
      }

      const result = await response.json();
      
      if (operation === 'improve' || operation === 'translate') {
        const updatedFlashcards = flashcards.map(card => 
          card.question === data.question ? result : card
        );
        setFlashcards(updatedFlashcards);
        handleNotification('Flashcard updated successfully!', 'success');
      }
    } catch (error) {
      handleNotification('Failed to process AI operation', 'error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              mb: 4,
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI-Powered Flashcard Generator
          </Typography>
          
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 4,
              background: 'linear-gradient(to right bottom, #ffffff 0%, #f5f5f5 100%)',
            }}
          >
            <FileUpload 
              setFlashcards={setFlashcards}
              onNotification={handleNotification}
            />
          </Paper>

          {flashcards.length > 0 && (
            <>
              <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <AIControls onAIOperation={handleAIOperation} />
              </Paper>
              <FlashcardList 
                flashcards={flashcards}
                onAIOperation={handleAIOperation}
              />
            </>
          )}
        </Box>

        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
