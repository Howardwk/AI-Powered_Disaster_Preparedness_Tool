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
  const [predictionData, setPredictionData] = useState(null); // Store full response with location, weather data, etc.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (lat && lon) {
        const response = await disasterService.getPredictions(lat, lon, location);
        // Backend returns: { success, location, predictions, timestamp }
        // Where predictions is: { location, coordinates, riskLevel, predictions: {...}, lastUpdated }
        console.log('Full response:', response);
        
        // Extract the nested predictions object
        if (response.predictions && response.predictions.predictions) {
          // Response structure: { success, location, predictions: { predictions: {...}, weatherData, coordinates, etc. } }
          console.log('Nested predictions object:', response.predictions.predictions);
          setPredictions(response.predictions.predictions);
          setPredictionData(response.predictions); // Store full data with location, weather, coordinates
        } else if (response.predictions) {
          // Fallback: if predictions is directly the disaster predictions object
          console.log('Direct predictions object:', response.predictions);
          setPredictions(response.predictions);
          setPredictionData(response); // Store full response
        } else {
          // Last fallback
          console.log('Using response directly:', response);
          setPredictions(response);
          setPredictionData(response);
        }
      } else {
        setError('Please enter coordinates');
      }
    } catch (err) {
      setError(err.message || 'Failed to get predictions');
      console.error('Prediction error:', err);
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
      <Box sx={{ mb: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white', p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🔮 Disaster Predictions
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Detailed AI-powered predictions for different disaster types
        </Typography>
      </Box>

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
          {Object.entries(predictions)
            .filter(([type, prediction]) => 
              prediction && 
              typeof prediction === 'object' && 
              prediction.riskLevel && 
              !['location', 'coordinates', 'riskLevel', 'lastUpdated', 'coordinates'].includes(type)
            )
            .map(([type, prediction]) => {
              // Get current month for display
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                  'July', 'August', 'September', 'October', 'November', 'December'];
              const currentMonth = monthNames[new Date().getMonth()];
              
              return (
              <Grid item xs={12} md={6} key={type}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h5">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Typography>
                      <Chip
                        label={`${prediction.riskLevel} risk`}
                        color={getRiskColor(prediction.riskLevel)}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    {/* Detailed Information Section for Hurricane */}
                    {type === 'hurricane' && predictionData && (
                      <Box mb={2} sx={{ 
                        bgcolor: 'info.light', 
                        p: 2, 
                        borderRadius: 1,
                        borderLeft: '4px solid',
                        borderColor: 'info.main'
                      }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                          Location Details:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Location:</strong> {predictionData.location || `${predictionData.coordinates?.lat?.toFixed(2)}°, ${predictionData.coordinates?.lon?.toFixed(2)}°`}
                        </Typography>
                        {predictionData.weatherData && (
                          <>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Wind Speed:</strong> {predictionData.weatherData.windSpeed?.toFixed(1) || 'N/A'} m/s
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Humidity:</strong> {predictionData.weatherData.humidity?.toFixed(0) || 'N/A'}%, <strong>Temperature:</strong> {predictionData.weatherData.temperature?.toFixed(1) || 'N/A'}°C
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Month:</strong> {currentMonth} {prediction.consideredFactors?.season?.value === 'Yes' ? '(hurricane season)' : '(off season)'}
                            </Typography>
                          </>
                        )}
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                          <strong>Result:</strong> {prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)} risk 
                          {prediction.factors && prediction.factors.length > 0 && 
                            ` (${prediction.factors.map(f => f.toLowerCase()).join(' + ')})`
                          }
                        </Typography>
                      </Box>
                    )}

                    {/* Detailed Information Section for Earthquake */}
                    {type === 'earthquake' && (
                      <Box mb={2} sx={{ 
                        bgcolor: 'warning.light', 
                        p: 2, 
                        borderRadius: 1,
                        borderLeft: '4px solid',
                        borderColor: 'warning.main'
                      }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                          Activity Details:
                        </Typography>
                        {prediction.consideredFactors?.recentActivity?.value !== 'No recent activity' ? (
                          <>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Recent Earthquake:</strong> {prediction.consideredFactors?.maxMagnitude?.value || 'N/A'} 
                              {prediction.consideredFactors?.recentActivity?.value && ` (${prediction.consideredFactors.recentActivity.value})`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Location:</strong> {prediction.consideredFactors?.location?.status === 'in_zone' ? 'Seismically active region' : 'Outside active region'}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Recent Activity:</strong> No recent earthquakes detected
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                          <strong>Result:</strong> {prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)} risk 
                          {prediction.factors && prediction.factors.length > 0 && 
                            ` (${prediction.factors.map(f => f.toLowerCase()).join(' + ')})`
                          }
                        </Typography>
                      </Box>
                    )}

                    {/* Detailed Information Section for Flood */}
                    {type === 'flood' && (
                      <Box mb={2} sx={{ 
                        bgcolor: 'primary.light', 
                        p: 2, 
                        borderRadius: 1,
                        borderLeft: '4px solid',
                        borderColor: 'primary.main'
                      }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                          Risk Assessment:
                        </Typography>
                        {predictionData?.weatherData && (
                          <>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Humidity:</strong> {predictionData.weatherData.humidity?.toFixed(0) || 'N/A'}% 
                              {prediction.consideredFactors?.humidity?.status === 'exceeded' && ' (Very high - flood risk)'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Visibility:</strong> {predictionData.weatherData.visibility ? (predictionData.weatherData.visibility / 1000).toFixed(1) : 'N/A'} km
                              {prediction.consideredFactors?.visibility?.status === 'exceeded' && ' (Poor - heavy rain possible)'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Cloud Cover:</strong> {predictionData.weatherData.clouds?.toFixed(0) || 'N/A'}%
                              {prediction.consideredFactors?.cloudCover?.status === 'exceeded' && ' (Heavy cloud cover)'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Atmospheric Pressure:</strong> {predictionData.weatherData.pressure?.toFixed(0) || 'N/A'} hPa
                              {prediction.consideredFactors?.pressure?.status === 'exceeded' && ' (Low pressure - storm conditions)'}
                            </Typography>
                          </>
                        )}
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                          <strong>Risk Level:</strong> {prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)} - 
                          {prediction.riskLevel === 'high' || prediction.riskLevel === 'critical' 
                            ? ' Multiple flood risk factors present. Monitor water levels closely.'
                            : prediction.riskLevel === 'moderate'
                            ? ' Some flood risk factors detected. Stay alert to weather changes.'
                            : ' Normal conditions. Low flood risk.'
                          }
                        </Typography>
                      </Box>
                    )}

                    <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Confidence:</strong> {prediction.confidence !== undefined ? `${prediction.confidence}%` : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Probability:</strong> {prediction.probability !== undefined ? `${prediction.probability}%` : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Timeframe:</strong> {prediction.timeframe || 'N/A'}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Contributing Factors:
                    </Typography>
                    {prediction.factors && prediction.factors.length > 0 ? (
                      <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                        {prediction.factors.map((factor, index) => (
                          <li key={index}>
                            <Typography variant="body2">{factor}</Typography>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No significant factors detected
                      </Typography>
                    )}
                  </Box>

                  {prediction.consideredFactors && (
                    <Box mb={2} sx={{ 
                      bgcolor: 'grey.50', 
                      p: 2, 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.300'
                    }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
                        Factors Considered:
                      </Typography>
                      {Object.entries(prediction.consideredFactors).map(([factorName, factorData]) => (
                        <Box key={factorName} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'grey.200', '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                              {factorName.replace(/([A-Z])/g, ' $1').trim()}:
                            </Typography>
                            <Chip
                              label={factorData.status === 'exceeded' || factorData.status === 'in_zone' || factorData.status === 'in_season' || factorData.status === 'active' || factorData.status === 'high' || factorData.status === 'critical' ? '⚠️ Risk' : '✓ Normal'}
                              size="small"
                              color={factorData.status === 'exceeded' || factorData.status === 'in_zone' || factorData.status === 'in_season' || factorData.status === 'active' || factorData.status === 'high' || factorData.status === 'critical' ? 'warning' : 'success'}
                              sx={{ height: '20px', fontSize: '0.7rem' }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                            <strong>Current:</strong> {factorData.value} {factorData.unit || ''}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                            <strong>Threshold:</strong> {factorData.threshold}
                          </Typography>
                          {factorData.note && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                              Note: {factorData.note}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                    {prediction.recommendation}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      )}


      {!predictions && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Enter coordinates above to get disaster predictions
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Predictions;



