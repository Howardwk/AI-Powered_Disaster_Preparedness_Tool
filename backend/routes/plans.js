const express = require('express');
const router = express.Router();
const planService = require('../services/planService');

// Generate a response plan
router.post('/generate', async (req, res) => {
  try {
    const { 
      location, 
      disasterType, 
      householdSize, 
      specialNeeds,
      lat,
      lon
    } = req.body;

    if (!location || !disasterType) {
      return res.status(400).json({ 
        error: 'Location and disaster type are required' 
      });
    }

    const plan = await planService.generatePlan({
      location,
      disasterType,
      householdSize: householdSize || 1,
      specialNeeds: specialNeeds || [],
      coordinates: { lat, lon }
    });

    res.json({
      success: true,
      plan,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Plan generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate plan',
      message: error.message 
    });
  }
});

// Get saved plans (placeholder for future implementation)
router.get('/saved', async (req, res) => {
  try {
    // TODO: Implement user authentication and plan storage
    res.json({
      success: true,
      message: 'Feature coming soon',
      plans: []
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get saved plans',
      message: error.message 
    });
  }
});

module.exports = router;



