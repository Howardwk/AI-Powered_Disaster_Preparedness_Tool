import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { alertService } from '../services/alertService';

const Alerts = () => {
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (lat && lon) {
        const data = await alertService.getAlerts(location || 'Your Location', lat, lon);
        setAlerts(data.alerts || []);
      } else {
        setError('Please enter coordinates');
      }
    } catch (err) {
      setError(err.message || 'Failed to get alerts');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'warning',
      critical: 'error',
    };
    return colors[severity] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Disaster Alerts
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Get real-time alerts for potential disasters in your area.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City name (optional)"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={lat || ''}
                onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : null)}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={lon || ''}
                onChange={(e) => setLon(e.target.value ? parseFloat(e.target.value) : null)}
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Get Alerts'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {alerts.length > 0 ? (
        <Grid container spacing={2}>
          {alerts.map((alert) => (
            <Grid item xs={12} key={alert.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <WarningIcon
                      sx={{
                        color: alert.severity === 'critical' ? 'error.main' : 'warning.main',
                        mr: 2,
                        fontSize: 40,
                      }}
                    />
                    <Box flexGrow={1}>
                      <Typography variant="h6">
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                      </Typography>
                      <Chip
                        label={alert.severity.toUpperCase()}
                        color={getSeverityColor(alert.severity)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {alert.message}
                  </Typography>
                  {alert.prediction && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Risk Level: {alert.prediction.riskLevel} | Confidence:{' '}
                        {alert.prediction.confidence}%
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    {new Date(alert.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              {lat && lon
                ? 'No active alerts for this location'
                : 'Enter coordinates to check for alerts'}
            </Typography>
          </Paper>
        )
      )}
    </Container>
  );
};

export default Alerts;



