import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';

const FileUpload = ({ setFlashcards, onNotification }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numCards, setNumCards] = useState(5);
  const [subject, setSubject] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleNumCardsChange = (event) => {
    const value = Math.max(1, Math.min(20, Number(event.target.value)));
    setNumCards(value);
  };

  const handleUpload = async () => {
    if (!file) {
      onNotification('Please select a file first', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('num_cards', numCards);
    if (subject) formData.append('subject', subject);

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFlashcards(data.flashcards);
      onNotification('Flashcards generated successfully!', 'success');
      setFile(null);
    } catch (error) {
      onNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Upload Your Content
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Support for DOCX, PPTX, CSV, and more formats
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of Cards to Generate"
            type="number"
            value={numCards}
            onChange={handleNumCardsChange}
            inputProps={{ min: 1, max: 20 }}
            helperText="Generate 1-20 cards per upload"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Subject (Optional)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            helperText="Specify the subject matter for better results"
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          border: '2px dashed',
          borderColor: 'primary.main',
          borderRadius: 2,
          bgcolor: 'background.paper',
          mb: 3,
        }}
      >
        <input
          accept=".docx,.pptx,.csv,.xlsx,.txt,.pdf"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button
            component="span"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            }}
          >
            Choose File
          </Button>
        </label>
        
        {file && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <DescriptionIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{file.name}</Typography>
          </Box>
        )}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={handleUpload}
        disabled={!file || loading}
        sx={{
          height: 56,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Generate AI Flashcards'
        )}
      </Button>
    </Box>
  );
};

export default FileUpload;
