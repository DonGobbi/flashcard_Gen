import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  useTheme,
  Paper,
  Chip,
  Stack,
  LinearProgress,
  Button,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NavigateBefore,
  NavigateNext,
  Refresh,
  Check,
  Close,
  Lightbulb,
} from '@mui/icons-material';

const cardStyles = {
  classic: {
    background: 'linear-gradient(to right bottom, #ffffff, #f5f5f5)',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: 2,
  },
  modern: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    borderRadius: 3,
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  minimalist: {
    background: '#ffffff',
    borderRadius: 1,
    border: '1px solid rgba(0, 0, 0, 0.08)',
  },
  colorful: {
    background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
    borderRadius: 3,
    color: 'white',
  },
};

const FlashcardView = ({
  cards = [],
  style = 'modern',
  onNext,
  onPrevious,
  onAnswer,
  showProgress = true,
}) => {
  const theme = useTheme();
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    setFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      onNext?.();
    }
  };

  const handlePrevious = () => {
    setFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      onPrevious?.();
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleAnswer = (correct) => {
    onAnswer?.(currentCard, correct);
    handleNext();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
      {showProgress && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Card {currentIndex + 1} of {cards.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                flexGrow: 1,
                height: 8,
                borderRadius: 4,
                bgcolor: 'action.hover',
              }}
            />
          </Stack>
        </Box>
      )}

      <Box
        sx={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          height: 400,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (flipped ? '-back' : '-front')}
            initial={{ opacity: 0, rotateY: flipped ? -180 : 0 }}
            animate={{ opacity: 1, rotateY: flipped ? 0 : 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            <Card
              onClick={handleFlip}
              sx={{
                ...cardStyles[style],
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                cursor: 'pointer',
                position: 'relative',
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  textAlign: 'center',
                  fontWeight: 500,
                  mb: 2,
                  color: style === 'colorful' ? 'white' : 'text.primary',
                }}
              >
                {flipped ? currentCard?.answer : currentCard?.question}
              </Typography>

              {currentCard?.hint && !flipped && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <Chip
                    icon={<Lightbulb />}
                    label="Hint available"
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle hint display
                    }}
                  />
                </Box>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 3 }}
      >
        <IconButton
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
        >
          <NavigateBefore />
        </IconButton>

        <Button
          startIcon={<Refresh />}
          onClick={handleFlip}
          variant="outlined"
          sx={{ mx: 2 }}
        >
          Flip Card
        </Button>

        {flipped && (
          <>
            <Button
              startIcon={<Close />}
              onClick={() => handleAnswer(false)}
              variant="contained"
              color="error"
              sx={{ minWidth: 120 }}
            >
              Incorrect
            </Button>
            <Button
              startIcon={<Check />}
              onClick={() => handleAnswer(true)}
              variant="contained"
              color="success"
              sx={{ minWidth: 120 }}
            >
              Correct
            </Button>
          </>
        )}

        <IconButton
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
        >
          <NavigateNext />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default FlashcardView;
