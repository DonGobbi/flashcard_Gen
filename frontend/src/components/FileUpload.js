import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Slider,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  YouTube as YouTubeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import FlashcardService from '../services/flashcardService';
import ApiService from '../services/apiService';

const FileUpload = ({ onFlashcardsGenerated }) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [numCards, setNumCards] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setYoutubeUrl('');
      setError('');
    }
  };

  const handleUrlChange = (event) => {
    setYoutubeUrl(event.target.value);
    setFile(null);
    setError('');
  };

  const handleNumCardsChange = (event, newValue) => {
    setNumCards(newValue);
  };

  const clearFile = () => {
    setFile(null);
    setError('');
  };

  const clearUrl = () => {
    setYoutubeUrl('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      let flashcardsResponse;

      if (file) {
        flashcardsResponse = await ApiService.generateFromFile(file, numCards);
      } else if (youtubeUrl) {
        flashcardsResponse = await ApiService.generateFromYoutube(youtubeUrl, numCards);
      } else {
        throw new Error('Please provide either a file or YouTube URL');
      }

      const { flashcards } = flashcardsResponse;
      
      // Save the generated flashcards
      await FlashcardService.saveFlashcards(flashcards, {
        title: file ? file.name.split('.')[0] : 'YouTube Flashcards',
        description: `Generated from ${file ? 'file upload' : 'YouTube video'}`,
        style: 'modern'
      });

      setSuccess(true);
      onFlashcardsGenerated();
      
      // Clear form
      setFile(null);
      setYoutubeUrl('');
      
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      elevation={2}
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Generate Flashcards
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
            Flashcards generated successfully!
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Number of flashcards to generate: {numCards}
          </Typography>
          <Slider
            value={numCards}
            onChange={handleNumCardsChange}
            min={1}
            max={20}
            step={1}
            marks
            valueLabelDisplay="auto"
            disabled={loading}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <input
            type="file"
            accept=".txt,.pdf,.docx,.pptx,.csv,.md"
            style={{ display: 'none' }}
            id="file-upload"
            onChange={handleFileChange}
            disabled={loading}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              component="label"
              htmlFor="file-upload"
              variant={file ? "outlined" : "contained"}
              startIcon={<CloudUploadIcon />}
              disabled={loading || !!youtubeUrl}
              sx={{ flexGrow: 1 }}
            >
              {file ? 'Change File' : 'Upload File'}
            </Button>
            {file && (
              <IconButton onClick={clearFile} disabled={loading}>
                <CloseIcon />
              </IconButton>
            )}
          </Box>
          {file && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Selected file: {file.name}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              label="YouTube URL"
              value={youtubeUrl}
              onChange={handleUrlChange}
              disabled={loading || !!file}
              InputProps={{
                startAdornment: <YouTubeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            {youtubeUrl && (
              <IconButton onClick={clearUrl} disabled={loading}>
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading || (!file && !youtubeUrl)}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            'Generate Flashcards'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default FileUpload;
