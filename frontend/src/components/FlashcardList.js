import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Button
} from '@mui/material';
import FlipIcon from '@mui/icons-material/Flip';

const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Card 
      sx={{ 
        height: '200px', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
        },
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" component="div" align="center">
          {isFlipped ? answer : question}
        </Typography>
        <IconButton 
          size="small" 
          sx={{ position: 'absolute', bottom: 8, right: 8 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(!isFlipped);
          }}
        >
          <FlipIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

const FlashcardList = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!flashcards.length) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Flashcard {currentIndex + 1} of {flashcards.length}
      </Typography>
      
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={8}>
          <Flashcard {...flashcards[currentIndex]} />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handlePrev}
          disabled={flashcards.length <= 1}
        >
          Previous
        </Button>
        <Button 
          variant="contained" 
          onClick={handleNext}
          disabled={flashcards.length <= 1}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default FlashcardList;
