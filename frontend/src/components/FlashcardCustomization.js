import React, { useState } from 'react';
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  FormatSize as FontSizeIcon,
  Style as StyleIcon,
  DarkMode as DarkModeIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

const FONTS = [
  'Arial',
  'Times New Roman',
  'Roboto',
  'Open Sans',
];

const CARD_STYLES = [
  { name: 'Classic', value: 'classic' },
  { name: 'Modern', value: 'modern' },
  { name: 'Minimalist', value: 'minimalist' },
  { name: 'Colorful', value: 'colorful' },
];

const FlashcardCustomization = ({ customization, onCustomizationChange, onExport }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleStyleChange = (event) => {
    onCustomizationChange({
      ...customization,
      cardStyle: event.target.value,
    });
  };

  const handleFontFamilyChange = (event) => {
    onCustomizationChange({
      ...customization,
      fontFamily: event.target.value,
    });
  };

  const handleFontSizeChange = (event, newValue) => {
    onCustomizationChange({
      ...customization,
      fontSize: newValue,
    });
  };

  const handleAnimationsToggle = (event) => {
    onCustomizationChange({
      ...customization,
      animations: event.target.checked,
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Customize Your Flashcards
      </Typography>

      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab icon={<StyleIcon />} label="Style" />
        <Tab icon={<FontSizeIcon />} label="Typography" />
        <Tab icon={<DarkModeIcon />} label="Export" />
      </Tabs>

      {currentTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Card Style</InputLabel>
              <Select
                value={customization.cardStyle}
                onChange={handleStyleChange}
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
            <FormControlLabel
              control={
                <Switch
                  checked={customization.animations}
                  onChange={handleAnimationsToggle}
                  color="primary"
                />
              }
              label="Enable Animations"
            />
          </Grid>
        </Grid>
      )}

      {currentTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Font Family</InputLabel>
              <Select
                value={customization.fontFamily}
                onChange={handleFontFamilyChange}
                label="Font Family"
              >
                {FONTS.map((font) => (
                  <MenuItem key={font} value={font}>
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Font Size</Typography>
            <Slider
              value={customization.fontSize}
              onChange={handleFontSizeChange}
              min={12}
              max={24}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      )}

      {currentTab === 2 && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => onExport('print')}
            >
              Print Ready
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => onExport('pdf')}
            >
              Export PDF
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={() => onExport('anki')}
            >
              Export to Anki
            </Button>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default FlashcardCustomization;
