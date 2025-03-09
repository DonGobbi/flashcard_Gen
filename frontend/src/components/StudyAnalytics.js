import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  PieChart as PieChartIcon,
  Share,
  Download,
  Info,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';

const StudyAnalytics = ({ studyData, onExport }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('performance');

  // Mock data for demonstration
  const performanceData = [
    { date: 'Mon', correct: 85, incorrect: 15, total: 100 },
    { date: 'Tue', correct: 92, incorrect: 8, total: 100 },
    { date: 'Wed', correct: 78, incorrect: 22, total: 100 },
    { date: 'Thu', correct: 95, incorrect: 5, total: 100 },
    { date: 'Fri', correct: 88, incorrect: 12, total: 100 },
    { date: 'Sat', correct: 90, incorrect: 10, total: 100 },
    { date: 'Sun', correct: 93, incorrect: 7, total: 100 },
  ];

  const studyTimeData = [
    { date: 'Mon', minutes: 45 },
    { date: 'Tue', minutes: 30 },
    { date: 'Wed', minutes: 60 },
    { date: 'Thu', minutes: 25 },
    { date: 'Fri', minutes: 40 },
    { date: 'Sat', minutes: 50 },
    { date: 'Sun', minutes: 35 },
  ];

  const topicDistributionData = [
    { name: 'Mathematics', value: 30 },
    { name: 'Science', value: 25 },
    { name: 'History', value: 20 },
    { name: 'Languages', value: 15 },
    { name: 'Others', value: 10 },
  ];

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  const statsVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05 },
  };

  const renderPerformanceChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={performanceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Bar
          dataKey="correct"
          name="Correct"
          fill={theme.palette.success.main}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="incorrect"
          name="Incorrect"
          fill={theme.palette.error.main}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderStudyTimeChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={studyTimeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="minutes"
          name="Study Time (minutes)"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderTopicDistributionChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={topicDistributionData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {topicDistributionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <RechartsTooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Typography variant="h5" fontWeight="bold">
            Study Analytics
          </Typography>

          <Stack direction="row" spacing={2}>
            <FormControl size="small">
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={onExport}
            >
              Export
            </Button>

            <Button variant="outlined" startIcon={<Info />}>
              Print
            </Button>

            <Button variant="outlined" startIcon={<Share />}>
              Share
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              variants={statsVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Card
                sx={{
                  bgcolor: 'primary.lighter',
                  color: 'primary.darker',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Timeline />
                    <Box>
                      <Typography variant="body2">Total Study Time</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        285 minutes
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              variants={statsVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Card
                sx={{
                  bgcolor: 'success.lighter',
                  color: 'success.darker',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TrendingUp />
                    <Box>
                      <Typography variant="body2">Average Accuracy</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        88.7%
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              variants={statsVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Card
                sx={{
                  bgcolor: 'warning.lighter',
                  color: 'warning.darker',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PieChartIcon />
                    <Box>
                      <Typography variant="body2">Cards Mastered</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        156
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              variants={statsVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Card
                sx={{
                  bgcolor: 'secondary.lighter',
                  color: 'secondary.darker',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Info />
                    <Box>
                      <Typography variant="body2">Best Streak</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        15 days
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6">Performance Trends</Typography>
              <FormControl size="small">
                <Select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="performance">Accuracy</MenuItem>
                  <MenuItem value="time">Study Time</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {chartType === 'performance'
              ? renderPerformanceChart()
              : renderStudyTimeChart()}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Topic Distribution
            </Typography>
            {renderTopicDistributionChart()}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Study Recommendations
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    bgcolor: 'background.neutral',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Best Study Time
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Based on your performance data, you show highest
                      retention during morning sessions (9 AM - 11 AM).
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Consider scheduling your study sessions during these
                      peak hours.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    bgcolor: 'background.neutral',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Focus Areas
                    </Typography>
                    <Typography variant="body2" paragraph>
                      History and Language cards show lower accuracy rates.
                      These topics might need more attention.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try breaking down complex topics into smaller sets.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    bgcolor: 'background.neutral',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Study Streak
                    </Typography>
                    <Typography variant="body2" paragraph>
                      You're on a 7-day study streak! Keep going to beat
                      your record of 15 days.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Consistent daily practice leads to better retention.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudyAnalytics;
