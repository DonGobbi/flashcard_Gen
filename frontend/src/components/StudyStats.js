import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 2,
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 1,
        color: `${color}.main`,
      }}
    >
      {icon}
    </Box>
    <Typography variant="h4" color={`${color}.main`} gutterBottom>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      {title}
    </Typography>
  </Paper>
);

const StudyStats = ({ stats }) => {
  const {
    totalReviewed,
    correctCount,
    totalCards,
    successRate,
    averageTime,
    studyStreak,
  } = stats;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
        Study Progress
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Cards Reviewed"
            value={totalReviewed}
            icon={<TimelineIcon fontSize="large" />}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            icon={<TrendingUpIcon fontSize="large" />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Study Streak"
            value={`${studyStreak} days`}
            icon={<CheckCircleIcon fontSize="large" />}
            color="secondary"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Overall Progress
        </Typography>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <Tooltip title={`${(totalReviewed / totalCards * 100).toFixed(1)}% Complete`}>
            <CircularProgress
              variant="determinate"
              value={(totalReviewed / totalCards) * 100}
              size={120}
              thickness={4}
              sx={{ mr: 2 }}
            />
          </Tooltip>
          <Box
            sx={{
              position: 'absolute',
              left: 60,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="h6" color="primary">
              {`${(totalReviewed / totalCards * 100).toFixed(0)}%`}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Average Review Time: {averageTime} seconds
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Total Cards Mastered: {correctCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default StudyStats;
