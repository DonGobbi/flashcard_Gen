import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid,
  useTheme 
} from '@mui/material';
import { 
  AutoStories as CardsIcon,
  Timeline as SuccessIcon,
  Timer as TimeIcon 
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StatItem = ({ icon, label, value, delay }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
            : 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(30,30,30,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            color: theme.palette.primary.main,
          }}
        >
          {icon}
        </Box>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mt: 1, textAlign: 'center' }}
        >
          {label}
        </Typography>
      </Paper>
    </motion.div>
  );
};

const StatsCard = ({ stats }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatItem
            icon={<CardsIcon fontSize="large" />}
            label="Total Cards Created"
            value={stats.totalCards}
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatItem
            icon={<SuccessIcon fontSize="large" />}
            label="Success Rate"
            value={`${stats.successRate}%`}
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatItem
            icon={<TimeIcon fontSize="large" />}
            label="Average Review Time"
            value={`${stats.averageTime}s`}
            delay={0.3}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsCard;
