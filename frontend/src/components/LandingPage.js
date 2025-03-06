import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  AutoAwesome as AutoAwesomeIcon,
  Translate as TranslateIcon,
  ImportExport as ImportExportIcon,
} from '@mui/icons-material';

const FeatureCard = ({ icon, title, description, delay }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: theme.palette.background.paper,
          '&:hover': {
            transform: 'translateY(-8px)',
            transition: 'transform 0.3s ease-in-out',
          },
        }}
      >
        <Box sx={{ color: 'primary.main', mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Paper>
    </motion.div>
  );
};

const LandingPage = ({ onLogin, onSignup }) => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(45deg, #1a237e 30%, #311b92 90%)'
            : 'linear-gradient(45deg, #42a5f5 30%, #3f51b5 90%)',
          color: 'white',
          pt: 15,
          pb: 20,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h2" gutterBottom fontWeight="bold">
                  Master Any Subject with Smart Flashcards
                </Typography>
                <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                  Create, customize, and study flashcards enhanced by AI technology
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onSignup}
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={onLogin}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.9)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: 400,
                    backgroundColor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: 3,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    animate={{
                      y: [-400, 0, 0, -400],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      repeatType: 'loop',
                      times: [0, 0.3, 0.7, 1],
                    }}
                  >
                    {/* Demo Card 1 */}
                    <Paper
                      sx={{
                        m: 2,
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      <Typography variant="h6" gutterBottom color="primary">
                        What is photosynthesis?
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Photosynthesis is the process by which plants convert light energy into chemical energy to produce glucose from carbon dioxide and water.
                      </Typography>
                    </Paper>

                    {/* Demo Card 2 */}
                    <Paper
                      sx={{
                        m: 2,
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: '#e3f2fd',
                        border: '1px solid #90caf9',
                      }}
                    >
                      <Typography variant="h6" gutterBottom color="primary">
                        What is the capital of France?
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Paris is the capital city of France, known for its iconic Eiffel Tower, world-class museums, and rich cultural heritage.
                      </Typography>
                    </Paper>

                    {/* Demo Card 3 */}
                    <Paper
                      sx={{
                        m: 2,
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: '#f3e5f5',
                        border: '1px solid #ce93d8',
                      }}
                    >
                      <Typography variant="h6" gutterBottom color="primary">
                        What is Newton's First Law?
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Newton's First Law states that an object will remain at rest or in uniform motion unless acted upon by an external force.
                      </Typography>
                    </Paper>
                  </motion.div>

                  {/* Overlay gradients for smooth transition */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 50,
                      background: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))',
                      pointerEvents: 'none',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 50,
                      background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Request Demo Button */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onSignup}
                      sx={{
                        borderRadius: 5,
                        px: 4,
                        py: 1,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: 3,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          transition: 'transform 0.2s',
                        },
                      }}
                    >
                      Request Demo
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: -10, mb: 8, position: 'relative' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<SchoolIcon sx={{ fontSize: 40 }} />}
              title="Smart Learning"
              description="AI-powered flashcard generation and improvement suggestions"
              delay={0.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<AutoAwesomeIcon sx={{ fontSize: 40 }} />}
              title="Beautiful Design"
              description="Multiple card styles and customization options"
              delay={0.4}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<TranslateIcon sx={{ fontSize: 40 }} />}
              title="Translation Support"
              description="Translate your flashcards into multiple languages"
              delay={0.5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<ImportExportIcon sx={{ fontSize: 40 }} />}
              title="Export Options"
              description="Export to PDF or Anki for flexible studying"
              delay={0.6}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Feature Highlights Section */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
              Features that make learning effortless
            </Typography>
          </Grid>
          {[
            {
              title: 'Smart Flashcard Generation',
              description: 'Upload your study material and let AI create perfect flashcards instantly',
              icon: '🤖',
            },
            {
              title: 'Multiple Card Styles',
              description: 'Choose from Classic, Modern, Minimalist, or Colorful designs',
              icon: '🎨',
            },
            {
              title: 'AI-Powered Improvements',
              description: 'Enhance your flashcards with AI suggestions and refinements',
              icon: '✨',
            },
            {
              title: 'Progress Tracking',
              description: 'Monitor your success rate and average review time',
              icon: '📊',
            },
            {
              title: 'Export Options',
              description: 'Export to PDF, Anki, or share with friends',
              icon: '📤',
            },
            {
              title: 'Translation Support',
              description: 'Translate cards to multiple languages for language learning',
              icon: '🌍',
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 4,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" gutterBottom color="primary">
              Ready to transform your learning experience?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of students who are already using our smart flashcard generator.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onSignup}
              sx={{
                borderRadius: 5,
                px: 6,
                py: 1.5,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: 3,
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              Get Started for Free
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
