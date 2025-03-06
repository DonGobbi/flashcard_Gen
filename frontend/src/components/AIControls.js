import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TranslateIcon from '@mui/icons-material/Translate';

const LANGUAGES = [
  'French',
  'Spanish',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
  'Russian',
  'Arabic'
];

const AIControls = ({ onAIOperation }) => {
  const [numCards, setNumCards] = useState(5);
  const [subject, setSubject] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');

  const handleNumCardsChange = (event) => {
    const value = Math.max(1, Math.min(20, Number(event.target.value)));
    setNumCards(value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
        AI Enhancement Controls
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
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
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Subject (Optional)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            helperText="Specify the subject matter"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Target Language</InputLabel>
            <Select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              label="Target Language"
            >
              {LANGUAGES.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary" gutterBottom>
        AI-powered tools to enhance your flashcards
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AutoFixHighIcon />}
          onClick={() => onAIOperation('improve')}
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            color: 'white',
          }}
        >
          Improve All Cards
        </Button>

        <Button
          variant="contained"
          startIcon={<TranslateIcon />}
          onClick={() => targetLanguage && onAIOperation('translate', { target_language: targetLanguage })}
          disabled={!targetLanguage}
          sx={{
            background: 'linear-gradient(45deg, #FF4081 30%, #FF79B0 90%)',
            color: 'white',
          }}
        >
          Translate All Cards
        </Button>
      </Box>
    </Box>
  );
};

export default AIControls;
