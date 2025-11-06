import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { disasterService } from '../services/disasterService';

const Dashboard = () => {
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Priority 1: Use lat/lon if provided directly
      if (lat !== null && lon !== null) {
        await fetchPredictions(lat, lon);
      } 
      // Priority 2: Try to parse coordinates from location field
      else if (location) {
        const coords = await getCoordinates(location);
        if (coords) {
          setLat(coords.lat);
          setLon(coords.lon);
          await fetchPredictions(coords.lat, coords.lon);
        } else {
          setError('Could not find location. Please enter coordinates (latitude, longitude) directly in the coordinate fields, or enter coordinates in format: "lat, lon" in the location field.');
        }
      } else {
        setError('Please enter either coordinates or a location name.');
      }
    } catch (err) {
      setError(err.message || 'Failed to get predictions');
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async (latitude, longitude) => {
    try {
      const response = await disasterService.getPredictions(
        latitude,
        longitude,
        location
      );
      // Backend returns: { success, location, predictions, timestamp }
      // Extract the predictions object
      if (response.predictions) {
        setPredictions(response.predictions);
      } else {
        // Fallback if structure is different
        setPredictions(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to get predictions');
      console.error('Prediction error:', err);
    }
  };

  const getCoordinates = async (locationName) => {
    // Try to parse coordinates from input (format: "lat, lon" or "lat,lon")
    const coordMatch = locationName.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      // Validate coordinates are in reasonable ranges
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        return { lat, lon };
      }
    }
    // Could integrate with a geocoding API here for location names
    return null;
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      low: '#4caf50',
      moderate: '#ff9800',
      high: '#f44336',
      critical: '#d32f2f',
    };
    return colors[riskLevel] || '#757575';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Disaster Preparedness Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Get AI-powered disaster predictions for your location and generate
        personalized response plans.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleLocationSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                placeholder="City name or coordinates (lat, lon)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={lat || ''}
                onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="e.g., 40.7128"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={lon || ''}
                onChange={(e) => setLon(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="e.g., -74.0060"
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
                {loading ? <CircularProgress size={24} /> : 'Get Predictions'}
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

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {predictions && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Risk Level
                </Typography>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: getRiskColor(predictions.riskLevel),
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {predictions.riskLevel.toUpperCase()}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Location: {predictions.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {Object.entries(predictions.predictions).map(([type, prediction]) => (
            <Grid item xs={12} sm={6} md={4} key={type}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: getRiskColor(prediction.riskLevel),
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    {prediction.riskLevel}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {prediction.confidence}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Probability: {prediction.probability}%
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {prediction.recommendation}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!predictions && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Enter a location above to get disaster predictions
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard;



