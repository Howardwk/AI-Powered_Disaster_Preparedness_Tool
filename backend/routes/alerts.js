const express = require('express');
const router = express.Router();
const alertService = require('../services/alertService');

// Get alerts for a location
router.get('/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { lat, lon } = req.query;

    const alerts = await alertService.getAlertsForLocation(
      location,
      lat ? parseFloat(lat) : null,
      lon ? parseFloat(lon) : null
    );

    res.json({
      success: true,
      location,
      alerts,
      count: alerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Alert error:', error);
    res.status(500).json({ 
      error: 'Failed to get alerts',
      message: error.message 
    });
  }
});

// Get all active alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await alertService.getAllActiveAlerts();

    res.json({
      success: true,
      alerts,
      count: alerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({ 
      error: 'Failed to get alerts',
      message: error.message 
    });
  }
});

module.exports = router;



