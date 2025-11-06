const mlModelManager = require('../models/MLModelManager');
const fs = require('fs');
const path = require('path');

/**
 * Training script for ML models
 * Run with: node backend/ml/training/trainModels.js
 */
async function trainModels() {
  console.log('Starting ML model training...\n');

  try {
    // Force enable ML models for training
    process.env.USE_ML_MODELS = 'true';
    
    // Initialize models
    await mlModelManager.initialize();

    if (!mlModelManager.isMLAvailable()) {
      console.log('❌ ML models not available. Please check TensorFlow.js installation.');
      process.exit(1);
    }

    console.log('✅ ML models initialized. Generating sample training data...\n');
    
    // Generate sample training data for demonstration
    const sampleData = generateSampleTrainingData();
    
    console.log('Training Hurricane Model...');
    await mlModelManager.trainModel('hurricane', sampleData.hurricane, 50);
    
    console.log('\nTraining Flood Model...');
    await mlModelManager.trainModel('flood', sampleData.flood, 50);
    
    console.log('\nTraining Earthquake Model...');
    await mlModelManager.trainModel('earthquake', sampleData.earthquake, 50);
    
    console.log('\nSaving models...');
    const path = require('path');
    const savedPath = path.join(__dirname, '..', 'models', 'saved');
    
    await mlModelManager.saveModel('hurricane', path.join(savedPath, 'hurricane_model', 'model.json'));
    await mlModelManager.saveModel('flood', path.join(savedPath, 'flood_model', 'model.json'));
    await mlModelManager.saveModel('earthquake', path.join(savedPath, 'earthquake_model', 'model.json'));
    
    console.log('\n✅ Model training completed!');
    console.log('Set USE_ML_MODELS=true in backend/.env to use ML predictions');
  } catch (error) {
    console.error('Error training models:', error);
    process.exit(1);
  }
}

/**
 * Generate sample training data
 * In production, replace this with real historical disaster data
 */
function generateSampleTrainingData() {
  const hurricaneData = [];
  const floodData = [];
  const earthquakeData = [];

  // Generate sample data for different scenarios
  for (let i = 0; i < 100; i++) {
    // Hurricane samples
    hurricaneData.push({
      lat: 10 + Math.random() * 20, // Hurricane-prone latitudes
      lon: -100 + Math.random() * 40,
      weatherData: {
        temperature: 20 + Math.random() * 15,
        humidity: 60 + Math.random() * 40,
        pressure: 980 + Math.random() * 40,
        windSpeed: Math.random() * 50,
        windDirection: Math.random() * 360,
        clouds: Math.random() * 100,
        visibility: 5000 + Math.random() * 5000
      },
      riskLevel: i < 20 ? 'low' : i < 50 ? 'moderate' : i < 80 ? 'high' : 'critical'
    });

    // Flood samples
    floodData.push({
      lat: -90 + Math.random() * 180,
      lon: -180 + Math.random() * 360,
      weatherData: {
        temperature: 10 + Math.random() * 30,
        humidity: 40 + Math.random() * 60,
        pressure: 980 + Math.random() * 40,
        clouds: Math.random() * 100,
        visibility: Math.random() * 10000
      },
      riskLevel: i < 25 ? 'low' : i < 55 ? 'moderate' : i < 85 ? 'high' : 'critical'
    });

    // Earthquake samples
    earthquakeData.push({
      lat: -90 + Math.random() * 180,
      lon: -180 + Math.random() * 360,
      earthquakeData: {
        features: Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
          properties: {
            time: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
            mag: Math.random() * 6
          }
        }))
      },
      riskLevel: i < 30 ? 'low' : i < 60 ? 'moderate' : i < 85 ? 'high' : 'critical'
    });
  }

  return { hurricane: hurricaneData, flood: floodData, earthquake: earthquakeData };
}

// Run training if script is executed directly
if (require.main === module) {
  trainModels()
    .then(() => {
      console.log('Training script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Training failed:', error);
      process.exit(1);
    });
}

module.exports = { trainModels, generateSampleTrainingData };

