import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  useTheme,
  Fade,
  Paper,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import config from '../config';

const FileUpload = ({ onSuccess, onError }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [numCards, setNumCards] = useState(5);
  const [subject, setSubject] = useState('');
  const fileInputRef = useRef(null);
  const theme = useTheme();

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        onError('Invalid file type. Please upload a .txt, .docx, .pptx, or .csv file');
        event.target.value = null;
      }
    }
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/csv',
    ];
    return allowedTypes.includes(file.type);
  };

  const handleUpload = async () => {
    if (!file) {
      onError('Please select a file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('num_cards', numCards);
    formData.append('subject', subject);

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate flashcards');
      }

      onSuccess(data.flashcards);
      setFile(null);
      fileInputRef.current.value = null;
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `2px dashed ${theme.palette.primary.main}`,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(33, 150, 243, 0.04)'
              : 'rgba(144, 202, 249, 0.04)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light'
                ? 'rgba(33, 150, 243, 0.08)'
                : 'rgba(144, 202, 249, 0.08)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <input
              type="file"
              accept=".txt,.docx,.pptx,.csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  onClick={() => fileInputRef.current.click()}
                  startIcon={<UploadIcon />}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  }}
                >
                  Choose File
                </Button>
              </motion.div>
              
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Supported formats: TXT, DOCX, PPTX, CSV
              </Typography>
            </Box>

            {file && (
              <Fade in={true}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" color="primary">
                    {file.name}
                  </Typography>
                  <Tooltip title="Remove file">
                    <IconButton
                      size="small"
                      onClick={handleClearFile}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Fade>
            )}

            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <TextField
                fullWidth
                label="Number of Flashcards"
                type="number"
                value={numCards}
                onChange={(e) => setNumCards(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                InputProps={{ inputProps: { min: 1, max: 20 } }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Subject (Optional)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., History, Science, Math"
              />
            </Box>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!file || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                }}
              >
                {loading ? 'Generating...' : 'Generate Flashcards'}
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default FileUpload;
