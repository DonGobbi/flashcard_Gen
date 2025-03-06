import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  LinearProgress,
  useTheme,
  Zoom,
  Chip,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Refresh as ResetIcon,
  AutoFixHigh as ImproveIcon,
  Translate as TranslateIcon,
  Check as CorrectIcon,
  Close as WrongIcon,
  MoreVert as MoreIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../config';

const LANGUAGES = [
  'French', 'Spanish', 'German', 'Italian', 'Portuguese',
  'Chinese', 'Japanese', 'Korean', 'Russian', 'Arabic'
];

const FlashcardList = ({ flashcards, onStatsUpdate, onFlashcardsUpdate, customization, onError }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [reviewTimes, setReviewTimes] = useState([]);
  const [improving, setImproving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [translateDialogOpen, setTranslateDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const theme = useTheme();

  useEffect(() => {
    setStudyStartTime(Date.now());
    return () => updateStats();
  }, []);

  useEffect(() => {
    if (totalAttempts > 0) {
      updateStats();
    }
  }, [correctAnswers, totalAttempts, reviewTimes]);

  const updateStats = () => {
    const successRate = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
    const avgTime = reviewTimes.length > 0 
      ? Math.round(reviewTimes.reduce((a, b) => a + b, 0) / reviewTimes.length)
      : 0;
    
    onStatsUpdate?.({
      successRate,
      averageTime: avgTime
    });
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      recordReviewTime();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
      recordReviewTime();
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudyStartTime(Date.now());
    setCorrectAnswers(0);
    setTotalAttempts(0);
    setReviewTimes([]);
  };

  const recordReviewTime = () => {
    const currentTime = Date.now();
    if (studyStartTime) {
      const reviewTime = Math.round((currentTime - studyStartTime) / 1000);
      setReviewTimes(prev => [...prev, reviewTime]);
      setStudyStartTime(currentTime);
    }
  };

  const handleAnswer = (correct) => {
    setTotalAttempts(prev => prev + 1);
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }
    handleNext();
  };

  const handleImprove = async () => {
    try {
      setImproving(true);
      const response = await fetch(`${config.API_BASE_URL}/api/improve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcard: flashcards[currentIndex],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to improve flashcard');
      }

      const data = await response.json();
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[currentIndex] = data.flashcard;
      onFlashcardsUpdate?.(updatedFlashcards);
    } catch (error) {
      console.error('Error improving flashcard:', error);
      onError?.(error.message);
    } finally {
      setImproving(false);
    }
  };

  const handleTranslate = async () => {
    if (!selectedLanguage) return;
    
    try {
      setTranslating(true);
      setTranslateDialogOpen(false);
      
      const response = await fetch(`${config.API_BASE_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcard: flashcards[currentIndex],
          target_language: selectedLanguage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to translate flashcard');
      }

      const data = await response.json();
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[currentIndex] = data.flashcard;
      onFlashcardsUpdate?.(updatedFlashcards);
    } catch (error) {
      console.error('Error translating flashcard:', error);
      onError?.(error.message);
    } finally {
      setTranslating(false);
      setSelectedLanguage('');
    }
  };

  const handleExport = async (format) => {
    try {
      setMenuAnchor(null);
      let endpoint = '';
      let downloadName = '';
      
      switch (format) {
        case 'pdf':
          endpoint = '/api/export/pdf';
          downloadName = 'flashcards.pdf';
          break;
        case 'anki':
          endpoint = '/api/export/anki';
          downloadName = 'flashcards.apkg';
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
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Create a blob from the response and download it
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      // Notify parent component about the error
      onError?.(error.message);
    }
  };

  const handlePrint = () => {
    setMenuAnchor(null);
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Flashcards</title>
          <style>
            body { font-family: ${customization?.font || 'Arial'}; }
            .card {
              page-break-inside: avoid;
              border: 1px solid #ccc;
              padding: 20px;
              margin: 20px;
              border-radius: 8px;
            }
            .question { font-weight: bold; margin-bottom: 10px; }
            .answer { margin-top: 10px; }
          </style>
        </head>
        <body>
          ${flashcards.map((card, index) => `
            <div class="card">
              <div class="question">Question ${index + 1}: ${card.question}</div>
              <div class="answer">Answer: ${card.answer}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const getCardStyle = () => {
    const style = {
      minHeight: 300,
      cursor: 'pointer',
      transform: isFlipped ? 'rotateY(180deg)' : 'none',
      transformStyle: 'preserve-3d',
      transition: customization?.animations ? 'transform 0.6s' : 'none',
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        boxShadow: theme.shadows[6],
      },
    };

    if (customization?.cardStyle === 'classic') {
      return {
        ...style,
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: 8,
      };
    } else if (customization?.cardStyle === 'modern') {
      return {
        ...style,
        borderRadius: 16,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
      };
    } else if (customization?.cardStyle === 'minimalist') {
      return {
        ...style,
        borderRadius: 4,
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
      };
    } else if (customization?.cardStyle === 'colorful') {
      return {
        ...style,
        borderRadius: 12,
        background: `linear-gradient(135deg, ${customization?.colorTheme?.primary}20 0%, ${customization?.colorTheme?.secondary}20 100%)`,
      };
    }

    return style;
  };

  const getTypographyStyle = () => ({
    fontFamily: customization?.font || theme.typography.fontFamily,
    fontSize: customization?.fontSize || theme.typography.fontSize,
    color: theme.palette.text.primary,
    fontWeight: 500,
    mb: 2
  });

  if (!flashcards.length) return null;

  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Study Your Flashcards
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background: `linear-gradient(45deg, ${customization?.colorTheme?.primary || '#2196F3'} 30%, ${customization?.colorTheme?.secondary || '#21CBF3'} 90%)`,
            }
          }} 
        />
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{ mt: 1 }}
        >
          Card {currentIndex + 1} of {flashcards.length}
        </Typography>
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex + (isFlipped ? '-flipped' : '')}
          initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
          animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: customization?.animations ? 0.5 : 0 }}
          style={{ perspective: 1000 }}
        >
          <Card
            elevation={3}
            onClick={handleFlip}
            sx={getCardStyle()}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 4,
                backfaceVisibility: 'hidden',
              }}
            >
              <Typography 
                variant="h6" 
                component="div" 
                align="center"
                sx={getTypographyStyle()}
              >
                {isFlipped ? flashcards[currentIndex].answer : flashcards[currentIndex].question}
              </Typography>
              <Chip
                label={isFlipped ? "Answer" : "Question"}
                color="primary"
                size="small"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <CardActions sx={{ justifyContent: 'space-between', mt: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Tooltip title="Previous Card">
            <IconButton 
              onClick={handlePrev} 
              disabled={currentIndex === 0}
              color="primary"
            >
              <PrevIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next Card">
            <IconButton 
              onClick={handleNext} 
              disabled={currentIndex === flashcards.length - 1}
              color="primary"
            >
              <NextIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset">
            <IconButton onClick={handleReset} color="secondary">
              <ResetIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Mark as Correct">
            <IconButton 
              onClick={() => handleAnswer(true)}
              color="success"
              sx={{ backgroundColor: theme.palette.success.main + '20' }}
            >
              <CorrectIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark as Incorrect">
            <IconButton 
              onClick={() => handleAnswer(false)}
              color="error"
              sx={{ backgroundColor: theme.palette.error.main + '20' }}
            >
              <WrongIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <Tooltip title="Improve Card">
            <IconButton 
              onClick={handleImprove}
              disabled={improving}
              color="primary"
              sx={{ backgroundColor: theme.palette.primary.main + '20' }}
            >
              <ImproveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Translate Card">
            <IconButton 
              onClick={() => setTranslateDialogOpen(true)}
              disabled={translating}
              color="primary"
              sx={{ backgroundColor: theme.palette.primary.main + '20' }}
            >
              <TranslateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options">
            <IconButton 
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              color="primary"
            >
              <MoreIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={handlePrint}>
          <PrintIcon sx={{ mr: 1 }} /> Print Cards
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          <DownloadIcon sx={{ mr: 1 }} /> Export PDF
        </MenuItem>
        <MenuItem onClick={() => handleExport('anki')}>
          <ShareIcon sx={{ mr: 1 }} /> Export to Anki
        </MenuItem>
      </Menu>

      <Dialog open={translateDialogOpen} onClose={() => setTranslateDialogOpen(false)}>
        <DialogTitle>Translate Flashcard</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Target Language</InputLabel>
            <Select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              label="Target Language"
            >
              {LANGUAGES.map((lang) => (
                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTranslateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleTranslate}
            variant="contained"
            disabled={!selectedLanguage}
          >
            Translate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlashcardList;
