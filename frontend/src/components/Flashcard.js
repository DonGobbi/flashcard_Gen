import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  AutoFixHigh as ImprovementIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';

const Flashcard = ({ question, answer, loading, onImprove, onTranslate }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'none',
        position: 'relative',
        '&:hover': {
          boxShadow: 6,
        }
      }}
      onClick={handleFlip}
    >
      {/* Front side */}
      <Paper 
        elevation={3}
        sx={{
          height: '100%',
          position: 'relative',
          backfaceVisibility: 'hidden',
        }}
      >
        <CardContent>
          <Box sx={{ minHeight: 100, position: 'relative' }}>
            <Typography variant="h6" component="div" gutterBottom>
              Question
            </Typography>
            <Typography variant="body1">
              {question}
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 2 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip title="Improve with AI">
              <IconButton 
                size="small" 
                onClick={onImprove}
                disabled={loading}
                sx={{ mr: 1 }}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <ImprovementIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Translate">
              <IconButton 
                size="small" 
                onClick={onTranslate}
                disabled={loading}
              >
                <TranslateIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Paper>

      {/* Back side */}
      <Paper 
        elevation={3}
        sx={{
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <CardContent>
          <Box sx={{ minHeight: 100 }}>
            <Typography variant="h6" component="div" gutterBottom>
              Answer
            </Typography>
            <Typography variant="body1">
              {answer}
            </Typography>
          </Box>
        </CardContent>
      </Paper>
    </Card>
  );
};

export default Flashcard;
