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
  Chip,
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
      <Box sx={{ mb: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white', p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🌍 Disaster Preparedness Dashboard
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          AI-Powered Disaster Predictions & Response Planning
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
          Search Location
        </Typography>
        <form onSubmit={handleLocationSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                placeholder="City name or coordinates (lat, lon)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                variant="outlined"
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
                placeholder="e.g., -1.2921"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={lon || ''}
                onChange={(e) => setLon(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="e.g., 36.8219"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ height: '56px', fontSize: '1rem', fontWeight: 600 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Predictions'}
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
            <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Overall Risk Assessment
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                    }}
                  >
                    {predictions.riskLevel.toUpperCase()}
                  </Box>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    📍 {predictions.location}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {Object.entries(predictions.predictions).map(([type, prediction]) => (
            <Grid item xs={12} sm={6} md={4} key={type}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                    <Chip
                      label={prediction.riskLevel}
                      color={getRiskColor(prediction.riskLevel) === '#4caf50' ? 'success' : 
                             getRiskColor(prediction.riskLevel) === '#ff9800' ? 'warning' : 'error'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Confidence:</strong> {prediction.confidence}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Probability:</strong> {prediction.probability}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Timeframe:</strong> {prediction.timeframe}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    bgcolor: 'grey.50', 
                    p: 1.5, 
                    borderRadius: 1,
                    borderLeft: `4px solid ${getRiskColor(prediction.riskLevel)}`
                  }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      {prediction.recommendation}
                    </Typography>
                  </Box>
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



