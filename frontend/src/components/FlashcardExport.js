import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Stack,
  Alert,
  Snackbar,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  FileCopy,
  Print,
  Download,
  Share,
  ContentCopy,
  SaveAlt,
  PictureAsPdf,
} from '@mui/icons-material';

const FlashcardExport = ({ flashcards }) => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = () => {
    const flashcardText = flashcards
      .map((card, index) => `${index + 1}. Q: ${card.question}\nA: ${card.answer}\n`)
      .join('\n');

    navigator.clipboard.writeText(flashcardText);
    setSnackbarMessage('Flashcards copied to clipboard');
    setSnackbarOpen(true);
    handleMenuClose();
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Flashcards</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .flashcard {
              border: 1px solid #ccc;
              padding: 20px;
              margin: 20px 0;
              page-break-inside: avoid;
            }
            .question { font-weight: bold; margin-bottom: 10px; }
            .answer { color: #666; }
          </style>
        </head>
        <body>
          ${flashcards
            .map(
              (card) => `
              <div class="flashcard">
                <div class="question">Q: ${card.question}</div>
                <div class="answer">A: ${card.answer}</div>
              </div>
            `
            )
            .join('')}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    handleMenuClose();
  };

  const handleExport = () => {
    setExportDialogOpen(true);
    handleMenuClose();
  };

  const generatePDF = () => {
    // Mock PDF generation - replace with actual PDF generation logic
    const blob = new Blob(['PDF content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flashcards.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateAnkiDeck = () => {
    // Mock Anki deck generation - replace with actual Anki deck generation logic
    const ankiDeck = {
      cards: flashcards.map((card) => ({
        front: card.question,
        back: card.answer,
      })),
    };

    const blob = new Blob([JSON.stringify(ankiDeck)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flashcards.apkg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportConfirm = () => {
    switch (exportFormat) {
      case 'pdf':
        generatePDF();
        break;
      case 'anki':
        generateAnkiDeck();
        break;
      default:
        break;
    }
    setExportDialogOpen(false);
    setSnackbarMessage(`Flashcards exported as ${exportFormat.toUpperCase()}`);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Box>
        <Tooltip title="Export Options">
          <IconButton onClick={handleExportClick} color="primary">
            <Download />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleCopy}>
            <ContentCopy sx={{ mr: 1 }} /> Copy to Clipboard
          </MenuItem>
          <MenuItem onClick={handlePrint}>
            <Print sx={{ mr: 1 }} /> Print
          </MenuItem>
          <MenuItem onClick={handleExport}>
            <SaveAlt sx={{ mr: 1 }} /> Export as...
          </MenuItem>
        </Menu>
      </Box>

      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>Export Flashcards</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <FormControlLabel
                value="pdf"
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PictureAsPdf />
                    <Typography>PDF Format</Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                value="anki"
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FileCopy />
                    <Typography>Anki Deck</Typography>
                  </Stack>
                }
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExportConfirm} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default FlashcardExport;
