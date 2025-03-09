import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Grid,
  Button,
  Stack,
  Card,
  CardContent,
  useTheme,
  IconButton,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Palette,
  FormatSize,
  Animation,
  Style,
  Translate,
  VolumeUp,
  DarkMode,
  LightMode,
  Save,
  Preview,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import FlashcardService from '../services/flashcardService';

const Settings = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    cardStyle: 'modern',
    fontFamily: 'Roboto',
    fontSize: 16,
    colorTheme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    animations: true,
    autoPlayAudio: false,
    spellCheck: true,
    language: 'en',
    showHints: true,
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Load saved settings on component mount
    const loadSettings = async () => {
      try {
        const savedSettings = await FlashcardService.getCustomization();
        if (savedSettings) {
          setSettings(prev => ({ ...prev, ...savedSettings }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setNotification({
          open: true,
          message: 'Failed to load settings',
          severity: 'error'
        });
      }
    };
    loadSettings();
  }, []);

  const [previewText, setPreviewText] = useState({
    question: 'What is React?',
    answer: 'React is a JavaScript library for building user interfaces.',
  });

  const fontFamilies = [
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Source Sans Pro',
  ];

  const cardStyles = [
    {
      name: 'modern',
      label: 'Modern',
      style: {
        background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
        color: 'white',
      },
    },
    {
      name: 'minimalist',
      label: 'Minimalist',
      style: {
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      },
    },
    {
      name: 'colorful',
      label: 'Colorful',
      style: {
        background: 'linear-gradient(45deg, #FF512F 0%, #DD2476 100%)',
        color: 'white',
      },
    },
    {
      name: 'classic',
      label: 'Classic',
      style: {
        bgcolor: 'primary.main',
        color: 'white',
      },
    },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
  ];

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await FlashcardService.saveCustomization(settings);
      setNotification({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        open: true,
        message: 'Failed to save settings',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const getCardStyle = (style) => {
    const selectedStyle = cardStyles.find((s) => s.name === style);
    return selectedStyle ? selectedStyle.style : cardStyles[0].style;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Settings</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Style sx={{ mr: 1 }} /> Card Appearance
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Card Style
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {cardStyles.map((style) => (
                      <Card
                        key={style.name}
                        sx={{
                          width: 120,
                          height: 80,
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          transform: settings.cardStyle === style.name ? 'scale(1.05)' : 'none',
                          outline: settings.cardStyle === style.name ? `2px solid ${theme.palette.primary.main}` : 'none',
                          ...style.style,
                        }}
                        onClick={() => handleSettingChange('cardStyle', style.name)}
                      >
                        <CardContent>
                          <Typography variant="caption">{style.label}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Font Family</InputLabel>
                    <Select
                      value={settings.fontFamily}
                      onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                      label="Font Family"
                    >
                      {fontFamilies.map((font) => (
                        <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                          {font}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Font Size</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormatSize />
                    <Slider
                      value={settings.fontSize}
                      onChange={(e, value) => handleSettingChange('fontSize', value)}
                      min={12}
                      max={24}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.animations}
                        onChange={(e) => handleSettingChange('animations', e.target.checked)}
                      />
                    }
                    label="Enable Animations"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Translate sx={{ mr: 1 }} /> Language & Accessibility
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      label="Language"
                    >
                      {languages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoPlayAudio}
                        onChange={(e) => handleSettingChange('autoPlayAudio', e.target.checked)}
                      />
                    }
                    label="Auto-play Audio"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.spellCheck}
                        onChange={(e) => handleSettingChange('spellCheck', e.target.checked)}
                      />
                    }
                    label="Enable Spell Check"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showHints}
                        onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                      />
                    }
                    label="Show Study Hints"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Card
                sx={{
                  minHeight: 200,
                  ...getCardStyle(settings.cardStyle),
                  fontFamily: settings.fontFamily,
                  fontSize: settings.fontSize,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {previewText.question}
                  </Typography>
                  <Typography>
                    {previewText.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
