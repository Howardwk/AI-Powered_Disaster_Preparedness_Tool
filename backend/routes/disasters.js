const express = require('express');
const router = express.Router();
const disasterService = require('../services/disasterService');
const predictionService = require('../services/predictionService');

// Get disaster predictions for a location
router.get('/predict', async (req, res) => {
  try {
    const { lat, lon, location } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required' 
      });
    }

    const predictions = await disasterService.getPredictions(
      parseFloat(lat), 
      parseFloat(lon),
      location
    );

    res.json({
      success: true,
      location: location || `${lat}, ${lon}`,
      predictions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      error: 'Failed to get predictions',
      message: error.message 
    });
  }
});

// Get historical disaster data
router.get('/history', async (req, res) => {
  try {
    const { lat, lon, type, limit = 50 } = req.query;
    
    const history = await disasterService.getHistoricalData({
      lat: lat ? parseFloat(lat) : null,
      lon: lon ? parseFloat(lon) : null,
      type,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ 
      error: 'Failed to get historical data',
      message: error.message 
    });
  }
});

// Get specific disaster type prediction
router.get('/predict/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required' 
      });
    }

    const prediction = await predictionService.predictDisasterType(
      type,
      parseFloat(lat),
      parseFloat(lon)
    );

    res.json({
      success: true,
      type,
      prediction,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Type prediction error:', error);
    res.status(500).json({ 
      error: `Failed to predict ${req.params.type}`,
      message: error.message 
    });
  }
});

module.exports = router;



