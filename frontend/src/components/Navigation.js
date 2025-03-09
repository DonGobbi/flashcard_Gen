import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Home,
  ChevronRight,
  LibraryBooks,
  School,
  Analytics,
  Settings,
} from '@mui/icons-material';

const routeConfig = {
  dashboard: {
    label: 'Dashboard',
    icon: Home,
  },
  sets: {
    label: 'My Sets',
    icon: LibraryBooks,
  },
  study: {
    label: 'Study Mode',
    icon: School,
  },
  analytics: {
    label: 'Analytics',
    icon: Analytics,
  },
  settings: {
    label: 'Settings',
    icon: Settings,
  },
};

const Navigation = () => {
  const location = useLocation();
  const theme = useTheme();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbData = (segment, index) => {
    if (segment === 'study') {
      return {
        label: 'Study Mode',
        icon: School,
        path: '/dashboard/study',
      };
    }

    if (segment === 'sets') {
      if (pathSegments[index + 1] === 'new') {
        return { label: 'New Set', path: '/dashboard/sets/new' };
      }
      
      if (pathSegments[index + 1]) {
        const setId = pathSegments[index + 1];
        const isStudyMode = pathSegments[index + 2] === 'study';
        return {
          label: isStudyMode ? 'Study Mode' : 'Edit Set',
          path: `/dashboard/sets/${setId}${isStudyMode ? '/study' : ''}`,
          icon: isStudyMode ? School : null,
        };
      }
    }

    const config = routeConfig[segment];
    if (config) {
      return {
        label: config.label,
        icon: config.icon,
        path: '/dashboard/' + pathSegments.slice(1, index + 1).join('/'),
      };
    }

    return { label: segment.charAt(0).toUpperCase() + segment.slice(1) };
  };

  if (location.pathname === '/') return null;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Breadcrumbs
        separator={<ChevronRight fontSize="small" />}
        aria-label="breadcrumb"
      >
        <MuiLink
          component={Link}
          to="/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </MuiLink>

        {pathSegments.slice(1).map((segment, index) => {
          const { label, icon: Icon, path } = getBreadcrumbData(segment, index + 1);
          const isLast = index === pathSegments.length - 2;

          if (isLast) {
            return (
              <Typography
                key={segment}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.primary',
                }}
              >
                {Icon && <Icon sx={{ mr: 0.5 }} fontSize="small" />}
                {label}
                {segment === 'study' && (
                  <Chip
                    size="small"
                    label="In Progress"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
            );
          }

          return path ? (
            <MuiLink
              key={segment}
              component={Link}
              to={path}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {Icon && <Icon sx={{ mr: 0.5 }} fontSize="small" />}
              {label}
            </MuiLink>
          ) : null;
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Navigation;
