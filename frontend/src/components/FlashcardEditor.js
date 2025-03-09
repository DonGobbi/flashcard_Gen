import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  useTheme,
  Tab,
  Tabs,
  CircularProgress,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import FileUpload from './FileUpload';
import FlashcardExport from './FlashcardExport';
import FlashcardService from '../services/flashcardService';

const cardStyles = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'colorful', label: 'Colorful' },
];

const FlashcardEditor = ({
  initialSet = {
    title: '',
    description: '',
    style: 'modern',
    cards: [],
  },
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [set, setSet] = useState(initialSet);
  const [activeTab, setActiveTab] = useState(0);
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleSetChange = (field, value) => {
    setSet((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFlashcardsGenerated = (generatedCards) => {
    setFlashcards(generatedCards);
    setSet(prev => ({
      ...prev,
      cards: generatedCards
    }));
    setActiveTab(1); // Switch to preview tab after generation
    setNotification({
      open: true,
      message: 'Flashcards generated successfully!',
      severity: 'success'
    });
  };

  const validateSet = () => {
    if (!set.title.trim()) {
      setError('Please enter a title for the set');
      return false;
    }

    if (set.cards.length === 0) {
      setError('Please generate some flashcards first');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateSet()) return;

    try {
      setLoading(true);
      const result = await FlashcardService.saveFlashcards(set.cards, {
        title: set.title,
        description: set.description,
        style: set.style
      });

      setNotification({
        open: true,
        message: 'Flashcard set saved successfully!',
        severity: 'success'
      });

      // Navigate to the flashcard sets page after successful save
      setTimeout(() => {
        navigate('/dashboard/sets');
      }, 1500);
    } catch (error) {
      console.error('Error saving flashcards:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to save flashcards. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard/sets')}
          >
            Back to Sets
          </Button>
          <Typography variant="h4" flex={1}>
            Create New Flashcard Set
          </Typography>
        </Stack>
        
        <Stack spacing={3}>
          <TextField
            label="Title"
            fullWidth
            value={set.title}
            onChange={(e) => handleSetChange('title', e.target.value)}
            variant="outlined"
            error={error && !set.title.trim()}
            helperText={error && !set.title.trim() ? 'Title is required' : ''}
          />
          
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={set.description}
            onChange={(e) => handleSetChange('description', e.target.value)}
            variant="outlined"
          />

          <FormControl fullWidth>
            <InputLabel>Card Style</InputLabel>
            <Select
              value={set.style}
              onChange={(e) => handleSetChange('style', e.target.value)}
              label="Card Style"
            >
              {cardStyles.map((style) => (
                <MenuItem key={style.value} value={style.value}>
                  {style.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="flashcard creation tabs"
        >
          <Tab label="Generate" />
          <Tab label="Preview" disabled={flashcards.length === 0} />
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FileUpload onFlashcardsGenerated={handleFlashcardsGenerated} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Generated Flashcards
              </Typography>
              {flashcards.map((card, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: theme.palette.background.default,
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Question {index + 1}:</strong> {card.question}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Answer:</strong> {card.answer}
                  </Typography>
                </Paper>
              ))}
            </Box>
            <FlashcardExport flashcards={flashcards} />
          </motion.div>
        )}
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={loading || flashcards.length === 0}
        >
          {loading ? 'Saving...' : 'Save Set'}
        </Button>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlashcardEditor;
