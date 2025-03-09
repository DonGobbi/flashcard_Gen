import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import FlashcardService from '../services/flashcardService';

const FlashcardList = ({ customization }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviewed: 0,
    correctCount: 0,
    averageTime: 0,
  });

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const cards = await FlashcardService.getUserFlashcards();
      setFlashcards(cards);
      
      // Calculate stats
      const totalReviewed = cards.reduce((sum, card) => sum + card.stats.timesReviewed, 0);
      const totalCorrect = cards.reduce((sum, card) => sum + card.stats.correctCount, 0);
      
      setStats({
        totalReviewed,
        correctCount: totalCorrect,
        successRate: totalReviewed > 0 ? (totalCorrect / totalReviewed) * 100 : 0,
      });
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleResponse = async (id, isCorrect) => {
    try {
      await FlashcardService.updateFlashcardStats(id, isCorrect);
      // Update local stats
      setStats(prev => ({
        ...prev,
        totalReviewed: prev.totalReviewed + 1,
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      }));
      // Reset card flip
      setFlippedCards(prev => ({
        ...prev,
        [id]: false
      }));
    } catch (error) {
      console.error('Error updating flashcard stats:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (flashcards.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No flashcards yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a document or create flashcards manually to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Stats Section */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Cards Reviewed
            </Typography>
            <Typography variant="h4" color="primary">
              {stats.totalReviewed}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Success Rate
            </Typography>
            <Typography variant="h4" color="primary">
              {stats.successRate.toFixed(1)}%
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Total Cards
            </Typography>
            <Typography variant="h4" color="primary">
              {flashcards.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Flashcards Grid */}
      <Grid container spacing={3}>
        {flashcards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  transform: flippedCards[card.id] ? 'rotateY(180deg)' : 'none',
                  '&:hover': {
                    transform: flippedCards[card.id] 
                      ? 'rotateY(180deg) scale(1.02)' 
                      : 'scale(1.02)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleFlip(card.id)}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontFamily: customization.fontFamily,
                      fontSize: customization.fontSize,
                      transform: flippedCards[card.id] ? 'rotateY(180deg)' : 'none',
                    }}
                  >
                    {flippedCards[card.id] ? card.answer : card.question}
                  </Typography>
                </CardContent>

                {flippedCards[card.id] && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      p: 1,
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <Tooltip title="Incorrect">
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResponse(card.id, false);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Correct">
                      <IconButton
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResponse(card.id, true);
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                {/* Progress indicator */}
                <Box sx={{ px: 2, pb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(card.stats.correctCount / (card.stats.timesReviewed || 1)) * 100}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FlashcardList;
