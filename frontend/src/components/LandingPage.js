import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  AutoStories,
  Brush,
  CloudUpload,
  Translate,
  Share,
  Psychology,
} from '@mui/icons-material';

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  
  return (
    <Card
      component={motion.div}
      whileHover={{ 
        y: -5,
        boxShadow: theme.shadows[8],
      }}
      transition={{ duration: 0.2 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 2,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const features = [
  {
    icon: <AutoStories fontSize="large" />,
    title: 'Smart Flashcards',
    description: 'Create AI-powered flashcards from your notes, textbooks, or any learning material.',
  },
  {
    icon: <Brush fontSize="large" />,
    title: 'Customizable Design',
    description: 'Choose from multiple card styles, fonts, and color themes to match your preferences.',
  },
  {
    icon: <CloudUpload fontSize="large" />,
    title: 'Easy Import',
    description: 'Upload files in various formats and automatically generate organized flashcard sets.',
  },
  {
    icon: <Translate fontSize="large" />,
    title: 'Translation Support',
    description: 'Study in multiple languages with built-in translation capabilities.',
  },
  {
    icon: <Share fontSize="large" />,
    title: 'Export & Share',
    description: 'Export your flashcards to PDF or share them with friends and study groups.',
  },
  {
    icon: <Psychology fontSize="large" />,
    title: 'Smart Learning',
    description: 'Track your progress and get personalized suggestions for improvement.',
  },
];

const LandingPage = ({ onLogin, onSignup }) => {
  return (
    <Box component="main">
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  component="h1"
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Smart Flashcards for Better Learning
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Transform your study materials into effective flashcards using AI. Learn smarter, not harder.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onSignup}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={onLogin}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="/hero-image.png"
                  alt="Flashcard Generator"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: 600,
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Features
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Everything you need to create and study with effective flashcards
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
