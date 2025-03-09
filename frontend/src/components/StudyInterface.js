import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  LinearProgress,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Tooltip,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  VolumeUp,
  Lightbulb,
  Check,
  Close,
  Timer,
  Refresh,
  Help,
  NavigateNext,
  NavigateBefore,
  Translate,
  Flag,
  Bookmark,
  Share,
  Star,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const StudyInterface = () => {
  const { setId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    timeSpent: 0,
    streak: 0,
  });
  const [timer, setTimer] = useState(0);
  const [isStudyComplete, setIsStudyComplete] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockSet = {
          id: setId,
          title: 'JavaScript Basics',
          description: 'Core concepts of JavaScript programming',
          cards: [
            {
              id: '1',
              question: 'What is a closure in JavaScript?',
              answer: 'A closure is the combination of a function and the lexical environment within which that function was declared. This environment consists of any local variables that were in-scope at the time the closure was created.',
              hint: 'Think about function scope and variable access',
              difficulty: 'medium',
            },
            {
              id: '2',
              question: 'Explain the difference between let and var',
              answer: 'let is block-scoped while var is function-scoped. let does not allow redeclaration and is not hoisted like var.',
              hint: 'Consider variable scope and hoisting',
              difficulty: 'easy',
            },
            {
              id: '3',
              question: 'What is the purpose of the Promise object?',
              answer: 'The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.',
              hint: 'Think about handling asynchronous operations',
              difficulty: 'hard',
            },
          ],
          settings: {
            showHints: true,
            autoPlayAudio: false,
            spellCheck: true,
            language: 'en',
          },
        };

        setFlashcardSet(mockSet);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching flashcard set:', err);
        setError('Failed to load flashcard set. Please try again later.');
        setLoading(false);
      }
    };

    fetchFlashcardSet();
  }, [setId]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="h6" color="text.secondary">
          Loading flashcard set...
        </Typography>
      </Box>
    );
  }

  if (error || !flashcardSet) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Failed to load flashcard set'}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard/sets')}
          startIcon={<NavigateBefore />}
        >
          Back to Sets
        </Button>
      </Box>
    );
  }

  const currentCard = flashcardSet.cards[currentIndex];
  const progress = ((currentIndex + 1) / flashcardSet.cards.length) * 100;

  const handleAnswer = (isCorrect) => {
    setStudyStats((prev) => ({
      ...prev,
      [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1,
      streak: isCorrect ? prev.streak + 1 : 0,
    }));

    if (currentIndex === flashcardSet.cards.length - 1) {
      setIsStudyComplete(true);
    } else {
      nextCard();
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcardSet.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setShowHint(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setShowHint(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    flip: {
      rotateY: 180,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
    unflip: {
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const contentVariants = {
    question: {
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
    answer: {
      rotateY: 180,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  if (isStudyComplete) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Study Session Complete! 🎉
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Performance Summary
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'success.lighter',
                        color: 'success.dark',
                      }}
                    >
                      <Typography variant="h4">
                        {studyStats.correct}
                      </Typography>
                      <Typography variant="body2">Correct</Typography>
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'error.lighter',
                        color: 'error.dark',
                      }}
                    >
                      <Typography variant="h4">
                        {studyStats.incorrect}
                      </Typography>
                      <Typography variant="body2">Incorrect</Typography>
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                      }}
                    >
                      <Typography variant="h4">
                        {formatTime(timer)}
                      </Typography>
                      <Typography variant="body2">Time Spent</Typography>
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                      }}
                    >
                      <Typography variant="h4">
                        {studyStats.streak}
                      </Typography>
                      <Typography variant="body2">Best Streak</Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.location.reload()}
                  startIcon={<Refresh />}
                >
                  Study Again
                </Button>
                <Button
                  variant="outlined"
                  href="/dashboard/sets"
                  startIcon={<NavigateBefore />}
                >
                  Back to Sets
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Study Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Based on your performance, here are some suggestions:
              </Typography>
              <Stack spacing={2}>
                {studyStats.incorrect > studyStats.correct && (
                  <Alert severity="info">
                    Consider reviewing the material again before proceeding to more advanced topics.
                  </Alert>
                )}
                {studyStats.correct > studyStats.incorrect && (
                  <Alert severity="success">
                    Great job! You're ready to move on to more challenging material.
                  </Alert>
                )}
                {timer < 300 && (
                  <Alert severity="warning">
                    Try spending more time on each card to improve retention.
                  </Alert>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {flashcardSet.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {flashcardSet.description}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mt: 2,
            height: 8,
            borderRadius: 4,
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          }}
        />
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Card {currentIndex + 1} of {flashcardSet.cards.length}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={<Timer fontSize="small" />}
              label={`Time: ${formatTime(timer)}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Star fontSize="small" />}
              label={`Streak: ${studyStats.streak}`}
              size="small"
              color="warning"
              variant="outlined"
            />
          </Stack>
        </Box>
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ perspective: 1000 }}
        >
          <Card
            component={motion.div}
            animate={showAnswer ? "flip" : "unflip"}
            variants={cardVariants}
            sx={{
              minHeight: 300,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'visible',
              cursor: 'pointer',
              transformStyle: 'preserve-3d',
              '& > *': {
                backfaceVisibility: 'hidden',
              },
            }}
            onClick={() => !showAnswer && setShowAnswer(true)}
          >
            <CardContent 
              component={motion.div}
              variants={contentVariants}
              animate={showAnswer ? "answer" : "question"}
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <Box sx={{ position: 'absolute', top: -20, right: -20, zIndex: 1 }}>
                <Chip
                  label={currentCard.difficulty}
                  color={
                    currentCard.difficulty === 'easy'
                      ? 'success'
                      : currentCard.difficulty === 'medium'
                      ? 'warning'
                      : 'error'
                  }
                  size="small"
                  sx={{ transform: showAnswer ? 'rotateY(180deg)' : 'none' }}
                />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  transform: showAnswer ? 'rotateY(180deg)' : 'none',
                  backfaceVisibility: 'hidden',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    color: 'text.primary',
                    mb: 2,
                  }}
                >
                  {showAnswer ? currentCard.answer : currentCard.question}
                </Typography>

                {showHint && !showAnswer && (
                  <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
                    Hint: {currentCard.hint}
                  </Alert>
                )}
              </Box>
            </CardContent>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                p: 2,
                pt: 0,
                justifyContent: 'space-between',
                transform: showAnswer ? 'rotateY(180deg)' : 'none',
              }}
            >
              <Box>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(!showHint);
                  }}
                  color={showHint ? 'primary' : 'default'}
                >
                  <Lightbulb />
                </IconButton>
                <IconButton onClick={(e) => e.stopPropagation()}>
                  <VolumeUp />
                </IconButton>
                <IconButton onClick={(e) => e.stopPropagation()}>
                  <Translate />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {showAnswer ? (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnswer(true);
                      }}
                      startIcon={<Check />}
                    >
                      Correct
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnswer(false);
                      }}
                      startIcon={<Close />}
                    >
                      Incorrect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAnswer(true);
                    }}
                    endIcon={<Help />}
                  >
                    Show Answer
                  </Button>
                )}
              </Box>
            </Stack>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={prevCard}
          disabled={currentIndex === 0}
          startIcon={<NavigateBefore />}
        >
          Previous
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton>
            <Flag />
          </IconButton>
          <IconButton>
            <Bookmark />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
        </Box>
        <Button
          variant="outlined"
          onClick={nextCard}
          disabled={currentIndex === flashcardSet.cards.length - 1}
          endIcon={<NavigateNext />}
        >
          Next
        </Button>
      </Box>

      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>End Study Session?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to end this study session? Your progress will be saved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setShowConfirmDialog(false);
              setIsStudyComplete(true);
            }}
            color="primary"
            variant="contained"
          >
            End Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyInterface;
