import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Map View', path: '/map' },
    { label: 'Predictions', path: '/predictions' },
    { label: 'Plan Generator', path: '/plan-generator' },
    { label: 'Alerts', path: '/alerts' },
  ];

  return (
    <AppBar position="static" elevation={3} sx={{ bgcolor: 'primary.main' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          <WarningIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 0.5 }}
          >
            Disaster Preparedness
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{
                  backgroundColor:
                    location.pathname === item.path
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'transparent',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;



