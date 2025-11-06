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
    { label: 'Predictions', path: '/predictions' },
    { label: 'Plan Generator', path: '/plan-generator' },
    { label: 'Alerts', path: '/alerts' },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <WarningIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            Disaster Preparedness
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{
                  backgroundColor:
                    location.pathname === item.path
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'transparent',
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



