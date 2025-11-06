const HurricaneModel = require('./HurricaneModel');
const FloodModel = require('./FloodModel');
const EarthquakeModel = require('./EarthquakeModel');
const fs = require('fs');
const path = require('path');

/**
 * Manager for ML models
 * Handles loading, initialization, and prediction coordination
 */
class MLModelManager {
  constructor() {
    this.models = {
      hurricane: null,
      flood: null,
      tornado: null,
      earthquake: null,
      wildfire: null
    };
    this.modelsLoaded = false;
    this.useML = false; // Will be set in initialize()
  }

  /**
   * Initialize and load all ML models
   */
  async initialize() {
    // Check env var in initialize() so it can be set before calling
    this.useML = process.env.USE_ML_MODELS === 'true' || process.env.USE_ML_MODELS === true || false;
    
    if (!this.useML) {
      console.log('ML models disabled. Set USE_ML_MODELS=true in .env to enable.');
      return;
    }

    try {
      // Create saved models directory if it doesn't exist
      const savedDir = path.join(__dirname, 'saved');
      if (!fs.existsSync(savedDir)) {
        fs.mkdirSync(savedDir, { recursive: true });
      }

      // Initialize models
      this.models.hurricane = new HurricaneModel();
      this.models.flood = new FloodModel();
      this.models.earthquake = new EarthquakeModel();
      
      // TODO: Add tornado and wildfire models when implemented
      // this.models.tornado = new TornadoModel();
      // this.models.wildfire = new WildfireModel();

      // Load models (will create new ones if not found)
      await Promise.all([
        this.models.hurricane.load(),
        this.models.flood.load(),
        this.models.earthquake.load()
      ]);

      this.modelsLoaded = true;
      console.log('ML models initialized successfully');
    } catch (error) {
      console.error('Error initializing ML models:', error);
      this.useML = false; // Fallback to rule-based
    }
  }

  /**
   * Check if ML models are available and loaded
   */
  isMLAvailable() {
    return this.useML && this.modelsLoaded;
  }

  /**
   * Predict using ML model if available, otherwise return null for fallback
   */
  async predictWithML(disasterType, weatherData, earthquakeData, lat, lon) {
    if (!this.isMLAvailable()) {
      return null; // Signal to use rule-based prediction
    }

    try {
      switch (disasterType.toLowerCase()) {
        case 'hurricane':
          if (this.models.hurricane) {
            return await this.models.hurricane.predictRisk(weatherData, lat, lon);
          }
          break;
        
        case 'flood':
          if (this.models.flood) {
            return await this.models.flood.predictRisk(weatherData, lat, lon);
          }
          break;
        
        case 'earthquake':
          if (this.models.earthquake) {
            return await this.models.earthquake.predictRisk(earthquakeData, lat, lon);
          }
          break;
        
        // TODO: Add tornado and wildfire when models are implemented
        case 'tornado':
        case 'wildfire':
          // Fallback to rule-based for now
          return null;
        
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error in ML prediction for ${disasterType}:`, error);
      return null; // Fallback to rule-based
    }

    return null;
  }

  /**
   * Train a specific model
   */
  async trainModel(disasterType, trainingData, epochs = 100) {
    if (!this.isMLAvailable()) {
      throw new Error('ML models not initialized');
    }

    const model = this.models[disasterType.toLowerCase()];
    if (!model) {
      throw new Error(`Model for ${disasterType} not found`);
    }

    await model.train(trainingData, epochs);
    return model;
  }

  /**
   * Save a specific model
   */
  async saveModel(disasterType, path) {
    const model = this.models[disasterType.toLowerCase()];
    if (!model) {
      throw new Error(`Model for ${disasterType} not found`);
    }

    await model.save(path);
  }

  /**
   * Get model statistics
   */
  getModelStats() {
    const stats = {};
    
    Object.keys(this.models).forEach(type => {
      const model = this.models[type];
      if (model) {
        stats[type] = model.getSummary();
      }
    });

    return {
      mlEnabled: this.useML,
      modelsLoaded: this.modelsLoaded,
      models: stats
    };
  }
}

// Create singleton instance
const mlModelManager = new MLModelManager();

module.exports = mlModelManager;

