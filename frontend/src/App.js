import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import FileUpload from './components/FileUpload';
import FlashcardList from './components/FlashcardList';

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
});

function App() {
  const [flashcards, setFlashcards] = useState([]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Flashcard Generator
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <FileUpload setFlashcards={setFlashcards} />
          </Paper>
          <FlashcardList flashcards={flashcards} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
