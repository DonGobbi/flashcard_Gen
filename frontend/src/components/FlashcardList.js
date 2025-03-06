import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Collapse,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Flip as FlipIcon,
  AutoFixHigh as AutoFixHighIcon,
  Translate as TranslateIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

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

const Flashcard = ({ card, onAIOperation }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLanguageMenuOpen = (event) => setLanguageMenuAnchor(event.currentTarget);
  const handleLanguageMenuClose = () => setLanguageMenuAnchor(null);

  const handleImprove = () => {
    onAIOperation('improve', {
      question: card.question,
      answer: card.answer
    });
    handleMenuClose();
  };

  const handleTranslate = (language) => {
    onAIOperation('translate', {
      question: card.question,
      answer: card.answer,
      target_language: language
    });
    handleLanguageMenuClose();
    handleMenuClose();
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        background: 'linear-gradient(to right bottom, #ffffff 0%, #f5f5f5 100%)',
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            {isFlipped ? 'Answer' : 'Question'}
          </Typography>
          <Box>
            <IconButton size="small" onClick={handleFlip}>
              <FlipIcon />
            </IconButton>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Collapse in={!isFlipped} timeout="auto" unmountOnExit>
          <Typography variant="body1">{card.question}</Typography>
        </Collapse>
        
        <Collapse in={isFlipped} timeout="auto" unmountOnExit>
          <Typography variant="body1">{card.answer}</Typography>
        </Collapse>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleImprove}>
          <AutoFixHighIcon sx={{ mr: 1 }} />
          Improve with AI
        </MenuItem>
        <MenuItem onClick={handleLanguageMenuOpen}>
          <TranslateIcon sx={{ mr: 1 }} />
          Translate
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageMenuClose}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem key={lang} onClick={() => handleTranslate(lang)}>
            {lang}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
};

const FlashcardList = ({ flashcards, onAIOperation }) => {
  const handleExport = () => {
    const content = flashcards
      .map(card => `Q: ${card.question}\nA: ${card.answer}\n`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContent = flashcards
      .map(card => `
        <div style="page-break-inside: avoid; margin-bottom: 20px;">
          <h3>Question:</h3>
          <p>${card.question}</p>
          <h3>Answer:</h3>
          <p>${card.answer}</p>
          <hr>
        </div>
      `)
      .join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Flashcards</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @media print {
              hr { display: none; }
              div { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Flashcards</h1>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h6" color="primary">
          Your Flashcards ({flashcards.length})
        </Typography>
        
        <Box>
          <Tooltip title="Export as Text">
            <IconButton onClick={handleExport} sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print Flashcards">
            <IconButton onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {flashcards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Flashcard card={card} onAIOperation={onAIOperation} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FlashcardList;
