import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Badge,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LibraryBooks,
  Analytics,
  Settings,
  Logout,
  Add,
  School,
  DarkMode,
  LightMode,
  Notifications,
  Timer,
  EmojiEvents,
} from '@mui/icons-material';
import Navigation from './Navigation';
import { motion } from 'framer-motion';

const Dashboard = ({ user, onLogout, onThemeToggle, isDarkMode, children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const menuItems = [
    { text: 'My Sets', icon: <LibraryBooks />, path: '/dashboard/sets', badge: 12 },
    { text: 'Study Mode', icon: <School />, path: '/dashboard/study', badge: 3 },
    { text: 'Analytics', icon: <Analytics />, path: '/dashboard/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Avatar
          src={user?.photoURL}
          alt={user?.displayName || user?.email}
          sx={{ width: 64, height: 64 }}
        />
        <Typography variant="subtitle1" noWrap>
          {user?.displayName || user?.email}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip
            icon={<Timer fontSize="small" />}
            label="2h Today"
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<EmojiEvents fontSize="small" />}
            label="5 Day Streak"
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 1,
                mx: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                },
              }}
            >
              <ListItemIcon>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="primary">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 'bold',
            }}
          >
            Flashcard Generator
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Toggle theme">
              <IconButton onClick={onThemeToggle}>
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotificationOpen}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              component={Link}
              to="/sets/new"
              sx={{
                mx: 1,
                px: 2,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Create Set
            </Button>

            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Avatar
                src={user?.photoURL}
                alt={user?.displayName || user?.email}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          component={Link}
          to="/settings"
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        onClick={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <ListItemIcon>
            <School fontSize="small" color="primary" />
          </ListItemIcon>
          <Box>
            <Typography variant="body2">Time to review JavaScript Basics</Typography>
            <Typography variant="caption" color="text.secondary">2 hours ago</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <EmojiEvents fontSize="small" color="secondary" />
          </ListItemIcon>
          <Box>
            <Typography variant="body2">New Achievement: 5-day streak!</Typography>
            <Typography variant="caption" color="text.secondary">Today</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Analytics fontSize="small" color="info" />
          </ListItemIcon>
          <Box>
            <Typography variant="body2">Weekly progress report available</Typography>
            <Typography variant="caption" color="text.secondary">Yesterday</Typography>
          </Box>
        </MenuItem>
      </Menu>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Navigation />
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ p: 3, flexGrow: 1 }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
