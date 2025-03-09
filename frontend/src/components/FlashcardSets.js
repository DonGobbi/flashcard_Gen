import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  MoreVert,
  School,
  Edit,
  Delete,
  Share,
  Download,
  Timer,
  TrendingUp,
  Star,
  ContentCopy,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import FlashcardService from '../services/flashcardService';

const FlashcardSets = ({ study }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState([]);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    loadFlashcardSets();
  }, []);

  const loadFlashcardSets = async () => {
    try {
      setLoading(true);
      const fetchedSets = await FlashcardService.getUserFlashcardSets();
      setSets(fetchedSets);
    } catch (error) {
      console.error('Error loading flashcard sets:', error);
      setError('Failed to load flashcard sets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, set) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedSet(set);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSet(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await FlashcardService.deleteFlashcardSet(selectedSet.id);
      setNotification({
        open: true,
        message: 'Flashcard set deleted successfully',
        severity: 'success'
      });
      loadFlashcardSets();
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
      setNotification({
        open: true,
        message: 'Failed to delete flashcard set',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSet(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {study ? 'Study Sets' : 'My Flashcard Sets'}
        </Typography>
        {!study && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/dashboard/sets/new"
            startIcon={<ContentCopy />}
          >
            Create New Set
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid
        container
        spacing={3}
        component={motion.div}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {loading ? (
          [...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="80%" />
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Skeleton variant="rounded" width={60} height={24} />
                    <Skeleton variant="rounded" width={80} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          sets.map((set) => (
            <Grid item xs={12} sm={6} md={4} key={set.id} component={motion.div} variants={item}>
              <Card
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                  },
                }}
                onClick={() => navigate(study ? `/dashboard/sets/${set.id}/study` : `/dashboard/sets/${set.id}`)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {set.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>
                    {set.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                      size="small"
                      icon={<School fontSize="small" />}
                      label={`${set.cardCount} Cards`}
                    />
                    {set.stats?.lastStudied && (
                      <Chip
                        size="small"
                        icon={<Timer fontSize="small" />}
                        label={new Date(set.stats.lastStudied).toLocaleDateString()}
                      />
                    )}
                  </Box>
                  {set.stats && (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrendingUp fontSize="small" color="primary" />
                        {set.stats.averageScore || 0}%
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star fontSize="small" color="primary" />
                        {set.stats.timesStudied || 0} studies
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ mt: 'auto', p: 2 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, set)}
                    sx={{ ml: 'auto' }}
                  >
                    <MoreVert />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate(`/dashboard/sets/${selectedSet?.id}/edit`);
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Share fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Flashcard Set</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{selectedSet?.title}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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

export default FlashcardSets;
