import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Style as StyleIcon,
  Translate as TranslateIcon,
  AutoAwesome as AutoAwesomeIcon,
  ImportExport as ImportExportIcon,
  School as SchoolIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';

const HelpDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Welcome to Flashcard Generator!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Key Features
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <StyleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Customizable Design"
                secondary="Choose from multiple card styles (Classic, Modern, Minimalist, Colorful), customize fonts, colors, and animations"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AutoAwesomeIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="AI Enhancement"
                secondary="Improve your flashcards with AI suggestions. You can enhance individual cards or all cards at once using the 'Improve All Cards' button"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TranslateIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Translation Support"
                secondary="Translate your flashcards into multiple languages. The default translation is in French, but you can choose other languages from the dropdown"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ImportExportIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Export Options"
                secondary="Export your flashcards as PDF, print them directly, or save them as Anki decks (.apkg files) for spaced repetition learning"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SchoolIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Interactive Study Mode"
                secondary="Practice with flip animations, track your progress, and monitor success rates"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PaletteIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Theme Customization"
                secondary="Switch between light and dark modes, customize card colors and styles"
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom color="primary">
          About Anki Integration
        </Typography>
        <Typography variant="body1" paragraph>
          Anki is a powerful spaced repetition software that helps you remember things efficiently. When you export your flashcards to Anki format (.apkg), you can:
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem>
            <ListItemText
              primary="• Study with scientifically-proven spaced repetition"
              secondary="Anki shows you cards at optimal intervals based on your performance"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="• Sync across devices"
              secondary="Study on your computer, phone, or tablet"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="• Track your learning progress"
              secondary="Get detailed statistics about your study sessions"
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom color="primary">
          Quick Tips
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem>
            <ListItemText
              primary="• Enhance All Cards"
              secondary="Click the 'Improve All Cards' button in the toolbar to enhance all flashcards at once using AI"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="• Default Translation"
              secondary="The default translation is in French for better learning outcomes, but you can change this in the translation settings"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="• Card Limit"
              secondary="While you can select a specific number of cards to generate, the AI might generate more if it finds more relevant content to ensure comprehensive learning"
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDialog;
