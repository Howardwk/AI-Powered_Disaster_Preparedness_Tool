const express = require('express');
const router = express.Router();
const mlModelManager = require('../ml/models/MLModelManager');

// Get ML model status and statistics
router.get('/status', async (req, res) => {
  try {
    const stats = mlModelManager.getModelStats();
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get ML model status',
      message: error.message
    });
  }
});

// Train a specific model (admin endpoint - should be protected in production)
router.post('/train/:disasterType', async (req, res) => {
  try {
    const { disasterType } = req.params;
    const { trainingData, epochs = 100 } = req.body;

    if (!trainingData || !Array.isArray(trainingData)) {
      return res.status(400).json({
        error: 'Training data is required and must be an array'
      });
    }

    await mlModelManager.trainModel(disasterType, trainingData, epochs);
    
    res.json({
      success: true,
      message: `${disasterType} model trained successfully`,
      epochs: epochs
    });
  } catch (error) {
    res.status(500).json({
      error: `Failed to train ${req.params.disasterType} model`,
      message: error.message
    });
  }
});

module.exports = router;

