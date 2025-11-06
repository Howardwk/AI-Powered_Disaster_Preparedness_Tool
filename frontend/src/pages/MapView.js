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
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import LayersIcon from '@mui/icons-material/Layers';
import RouteIcon from '@mui/icons-material/Route';
import DisasterMap from '../components/DisasterMap';
import { disasterService } from '../services/disasterService';

const MapView = () => {
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [showEvacuationRoutes, setShowEvacuationRoutes] = useState(false);

  // Load saved locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }
  }, []);

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (lat !== null && lon !== null) {
        await fetchPredictions(lat, lon);
      } else if (location) {
        const coords = await getCoordinates(location);
        if (coords) {
          setLat(coords.lat);
          setLon(coords.lon);
          await fetchPredictions(coords.lat, coords.lon);
        } else {
          setError('Could not find location. Please enter coordinates.');
        }
      } else {
        setError('Please enter coordinates or location name.');
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
      if (response.predictions) {
        setPredictions(response.predictions);
      } else {
        setPredictions(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to get predictions');
    }
  };

  const getCoordinates = async (locationName) => {
    const coordMatch = locationName.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        return { lat, lon };
      }
    }
    return null;
  };

  const saveLocation = () => {
    if (predictions) {
      const newLocation = {
        id: Date.now(),
        name: location || `${lat}, ${lon}`,
        lat: predictions.coordinates.lat,
        lon: predictions.coordinates.lon,
        riskLevel: predictions.riskLevel,
        timestamp: new Date().toISOString(),
      };
      const updated = [...savedLocations, newLocation];
      setSavedLocations(updated);
      localStorage.setItem('savedLocations', JSON.stringify(updated));
    }
  };

  const removeLocation = (id) => {
    const updated = savedLocations.filter(loc => loc.id !== id);
    setSavedLocations(updated);
    localStorage.setItem('savedLocations', JSON.stringify(updated));
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      low: 'success',
      moderate: 'warning',
      high: 'error',
      critical: 'error',
    };
    return colors[riskLevel] || 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          <MapIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Disaster Risk Map
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize disaster risks on an interactive map with risk zones, heat maps, and evacuation routes.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Sidebar - Controls */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Search Location
            </Typography>
            <form onSubmit={handleLocationSubmit}>
              <TextField
                fullWidth
                label="Location"
                placeholder="City name or coordinates"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    type="number"
                    value={lat || ''}
                    onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    type="number"
                    value={lon || ''}
                    onChange={(e) => setLon(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Get Predictions'}
              </Button>
            </form>

            {predictions && (
              <Button
                fullWidth
                variant="outlined"
                onClick={saveLocation}
                sx={{ mb: 2 }}
              >
                Save Location
              </Button>
            )}
          </Paper>

          {/* Map Controls */}
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <LayersIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Map Layers
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showRiskZones}
                    onChange={(e) => setShowRiskZones(e.target.checked)}
                  />
                }
                label="Risk Zones"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showHeatMap}
                    onChange={(e) => setShowHeatMap(e.target.checked)}
                  />
                }
                label="Heat Map"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showEvacuationRoutes}
                    onChange={(e) => setShowEvacuationRoutes(e.target.checked)}
                  />
                }
                label="Evacuation Routes"
              />
            </Box>
          </Paper>

          {/* Saved Locations */}
          {savedLocations.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Saved Locations ({savedLocations.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {savedLocations.map((loc) => (
                  <Card key={loc.id} variant="outlined">
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">{loc.name}</Typography>
                          <Chip
                            label={loc.riskLevel}
                            color={getRiskColor(loc.riskLevel)}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeLocation(loc.id)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          )}

          {/* Current Prediction Info */}
          {predictions && (
            <Paper sx={{ p: 3, mt: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Current Location
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {predictions.location}
              </Typography>
              <Chip
                label={`Risk: ${predictions.riskLevel.toUpperCase()}`}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              />
            </Paper>
          )}
        </Grid>

        {/* Right Side - Map */}
        <Grid item xs={12} md={8}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          )}

          <DisasterMap
            predictions={predictions}
            locations={savedLocations}
            showRiskZones={showRiskZones}
            showHeatMap={showHeatMap}
            showEvacuationRoutes={showEvacuationRoutes}
          />

          {!predictions && !loading && (
            <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
              <MapIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Enter a location above to view disaster risks on the map
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MapView;

