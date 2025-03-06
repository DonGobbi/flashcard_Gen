import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const FileUpload = ({ setFlashcards }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFlashcards(response.data.flashcards);
      setSelectedFile(null);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred while uploading the file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <input
        accept=".docx,.pptx,.csv,.xlsx"
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="file-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Select File
        </Button>
      </label>
      
      {selectedFile && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Selected file: {selectedFile.name}
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Flashcards'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Supported formats: DOCX, PPTX, CSV, XLSX
      </Typography>
    </Box>
  );
};

export default FileUpload;
