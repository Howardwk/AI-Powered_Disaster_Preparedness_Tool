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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { planService } from '../services/planService';

const PlanGenerator = () => {
  const [formData, setFormData] = useState({
    location: '',
    disasterType: '',
    householdSize: 1,
    specialNeeds: [],
    lat: null,
    lon: null,
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const disasterTypes = [
    'hurricane',
    'flood',
    'tornado',
    'earthquake',
    'wildfire',
  ];

  const specialNeedsOptions = [
    'infants',
    'elderly',
    'disabilities',
    'pets',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecialNeedsChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      specialNeeds: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.location || !formData.disasterType) {
        setError('Location and disaster type are required');
        setLoading(false);
        return;
      }

      const data = await planService.generatePlan(formData);
      setPlan(data.plan);
    } catch (err) {
      setError(err.message || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Response Plan Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate a personalized disaster response plan based on your location,
        household, and specific needs.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Disaster Type</InputLabel>
                <Select
                  name="disasterType"
                  value={formData.disasterType}
                  onChange={handleChange}
                  label="Disaster Type"
                >
                  {disasterTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Household Size"
                name="householdSize"
                type="number"
                value={formData.householdSize}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Latitude (optional)"
                name="lat"
                type="number"
                value={formData.lat || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lat: e.target.value ? parseFloat(e.target.value) : null,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Longitude (optional)"
                name="lon"
                type="number"
                value={formData.lon || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lon: e.target.value ? parseFloat(e.target.value) : null,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Special Needs (optional)</InputLabel>
                <Select
                  multiple
                  value={formData.specialNeeds}
                  onChange={handleSpecialNeedsChange}
                  label="Special Needs (optional)"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {specialNeedsOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                size="large"
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Plan'}
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

      {plan && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Your {plan.disasterType.charAt(0).toUpperCase() + plan.disasterType.slice(1)} Response Plan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {plan.location} | Household Size: {plan.householdSize}
              </Typography>
              {plan.specialNeeds.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {plan.specialNeeds.map((need) => (
                    <Chip
                      key={need}
                      label={need}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {plan.sections.map((section, index) => (
            <Accordion key={index} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.actions && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Actions:
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                      {section.actions.map((action, i) => (
                        <li key={i}>
                          <Typography variant="body2">{action}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}

                {section.checklist && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Checklist:
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                      {section.checklist.map((item, i) => (
                        <li key={i}>
                          <Typography variant="body2">
                            {item.task}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}

                {section.supplies && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Supplies:
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                      {section.supplies.map((supply, i) => (
                        <li key={i}>
                          <Typography variant="body2">
                            {supply.item} ({supply.quantity})
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}

                {section.tips && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tips:
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                      {section.tips.map((tip, i) => (
                        <li key={i}>
                          <Typography variant="body2">{tip}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}

                {section.emergencyContacts && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Emergency Contacts:
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                      {section.emergencyContacts.map((contact, i) => (
                        <li key={i}>
                          <Typography variant="body2">{contact}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default PlanGenerator;



