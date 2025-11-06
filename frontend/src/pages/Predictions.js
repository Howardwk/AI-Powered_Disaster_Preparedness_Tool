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
} from '@mui/material';
import { disasterService } from '../services/disasterService';

const Predictions = () => {
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (lat && lon) {
        const data = await disasterService.getPredictions(lat, lon, location);
        setPredictions(data);
      } else {
        setError('Please enter coordinates');
      }
    } catch (err) {
      setError(err.message || 'Failed to get predictions');
    } finally {
      setLoading(false);
    }
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Disaster Predictions
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Get detailed AI-powered predictions for different types of natural
        disasters.
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
                {loading ? <CircularProgress size={24} /> : 'Predict'}
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

      {predictions && (
        <Grid container spacing={3}>
          {Object.entries(predictions.predictions).map(([type, prediction]) => (
            <Grid item xs={12} md={6} key={type}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                    <Chip
                      label={prediction.riskLevel}
                      color={getRiskColor(prediction.riskLevel)}
                    />
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Confidence: {prediction.confidence}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Probability: {prediction.probability}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Timeframe: {prediction.timeframe}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Factors:
                    </Typography>
                    {prediction.factors && prediction.factors.length > 0 ? (
                      <ul style={{ paddingLeft: '20px' }}>
                        {prediction.factors.map((factor, index) => (
                          <li key={index}>
                            <Typography variant="body2">{factor}</Typography>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No significant factors detected
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                    {prediction.recommendation}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Predictions;



