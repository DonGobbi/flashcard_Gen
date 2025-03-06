import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  IconButton,
  useTheme,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  FormatSize as FontIcon,
  Palette as ColorIcon,
  Style as StyleIcon,
  Download as ExportIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const FONTS = [
  'Poppins',
  'Roboto',
  'Arial',
  'Times New Roman',
  'Georgia',
  'Verdana',
];

const CARD_STYLES = [
  { name: 'Classic', value: 'classic' },
  { name: 'Modern', value: 'modern' },
  { name: 'Minimalist', value: 'minimalist' },
  { name: 'Colorful', value: 'colorful' },
];

const COLOR_THEMES = [
  { name: 'Blue Ocean', primary: '#2196F3', secondary: '#90CAF9' },
  { name: 'Forest Green', primary: '#4CAF50', secondary: '#A5D6A7' },
  { name: 'Sunset Orange', primary: '#FF5722', secondary: '#FFAB91' },
  { name: 'Royal Purple', primary: '#9C27B0', secondary: '#CE93D8' },
];

const FlashcardCustomization = ({ onCustomizationChange, onExport }) => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [customization, setCustomization] = useState({
    font: 'Poppins',
    fontSize: 16,
    cardStyle: 'modern',
    colorTheme: COLOR_THEMES[0],
    showImages: true,
    animations: true,
    printFormat: 'standard',
  });

  const handleCustomizationChange = (key, value) => {
    const newCustomization = { ...customization, [key]: value };
    setCustomization(newCustomization);
    onCustomizationChange?.(newCustomization);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleExport = (format) => {
    onExport?.(format, customization);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
        Customize Your Flashcards
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab icon={<StyleIcon />} label="Style" />
        <Tab icon={<FontIcon />} label="Typography" />
        <Tab icon={<ExportIcon />} label="Export" />
      </Tabs>

      {currentTab === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Card Style</InputLabel>
                <Select
                  value={customization.cardStyle}
                  onChange={(e) => handleCustomizationChange('cardStyle', e.target.value)}
                  label="Card Style"
                >
                  {CARD_STYLES.map((style) => (
                    <MenuItem key={style.value} value={style.value}>
                      {style.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Color Theme</InputLabel>
                <Select
                  value={customization.colorTheme.name}
                  onChange={(e) => {
                    const theme = COLOR_THEMES.find(t => t.name === e.target.value);
                    handleCustomizationChange('colorTheme', theme);
                  }}
                  label="Color Theme"
                >
                  {COLOR_THEMES.map((theme) => (
                    <MenuItem key={theme.name} value={theme.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`,
                            mr: 1,
                          }}
                        />
                        {theme.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={customization.animations}
                    onChange={(e) => handleCustomizationChange('animations', e.target.checked)}
                  />
                }
                label="Enable Animations"
              />
            </Grid>
          </Grid>
        </motion.div>
      )}

      {currentTab === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Font Family</InputLabel>
                <Select
                  value={customization.font}
                  onChange={(e) => handleCustomizationChange('font', e.target.value)}
                  label="Font Family"
                >
                  {FONTS.map((font) => (
                    <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                      {font}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Font Size</Typography>
              <Slider
                value={customization.fontSize}
                onChange={(e, value) => handleCustomizationChange('fontSize', value)}
                min={12}
                max={24}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </motion.div>
      )}

      {currentTab === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Export Options
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() => handleExport('print')}
              >
                Print Ready
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={() => handleExport('pdf')}
              >
                Export PDF
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={() => handleExport('anki')}
              >
                Export to Anki
              </Button>
            </Grid>
          </Grid>
        </motion.div>
      )}
    </Paper>
  );
};

export default FlashcardCustomization;
