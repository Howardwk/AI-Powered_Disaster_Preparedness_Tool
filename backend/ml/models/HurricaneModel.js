const BaseMLModel = require('./BaseMLModel');

/**
 * ML Model for Hurricane Prediction
 */
class HurricaneModel extends BaseMLModel {
  constructor() {
    super('Hurricane');
    const path = require('path');
    this.modelPath = path.join(__dirname, 'saved', 'hurricane_model', 'model.json');
  }

  getInputSize() {
    return 12; // 12 features for hurricane prediction
  }

  /**
   * Get feature ranges for normalization
   */
  getFeatureRange(featureIndex) {
    const ranges = [
      [-90, 90],      // latitude
      [-180, 180],    // longitude
      [-50, 50],      // temperature (Celsius)
      [0, 100],       // humidity (%)
      [800, 1100],    // pressure (hPa)
      [0, 100],       // windSpeed (m/s)
      [0, 360],       // windDirection (degrees)
      [0, 100],       // cloudCover (%)
      [0, 10000],     // visibility (meters)
      [1, 12],        // month
      [0, 1],         // isHurricaneSeason (0 or 1)
      [-50, 50]       // seaSurfaceTemperature (Celsius) - estimated
    ];
    return ranges[featureIndex] || [0, 100];
  }

  /**
   * Extract features from weather data and location
   */
  extractFeatures(weatherData, lat, lon) {
    const month = new Date().getMonth() + 1;
    const isHurricaneSeason = (lat > 0 && month >= 6 && month <= 11) || 
                              (lat < 0 && month >= 12 || month <= 3) ? 1 : 0;
    
    // Estimate sea surface temperature (simplified)
    const seaSurfaceTemp = lat >= -30 && lat <= 30 ? 
      weatherData.temperature + 2 : weatherData.temperature;

    return [
      lat,
      lon,
      weatherData.temperature || 20,
      weatherData.humidity || 60,
      weatherData.pressure || 1013,
      weatherData.windSpeed || 0,
      weatherData.windDirection || 0,
      weatherData.clouds || 0,
      weatherData.visibility || 10000,
      month,
      isHurricaneSeason,
      seaSurfaceTemp
    ];
  }

  /**
   * Predict hurricane risk
   */
  async predictRisk(weatherData, lat, lon) {
    const features = this.extractFeatures(weatherData, lat, lon);
    const prediction = await this.predict(features);
    
    // Calculate probability based on prediction
    const probability = this.calculateProbability(prediction, weatherData, lat, lon);
    
    // Get factors
    const factors = this.getFactors(weatherData, lat, lon, prediction);
    
    return {
      type: 'hurricane',
      riskLevel: prediction.riskLevel,
      confidence: prediction.confidence,
      probability: probability,
      factors: factors,
      recommendation: this.getRecommendation(prediction.riskLevel),
      timeframe: '24-48 hours',
      mlConfidence: prediction.confidence,
      mlProbabilities: prediction.probabilities
    };
  }

  /**
   * Calculate probability based on ML prediction and additional factors
   */
  calculateProbability(prediction, weatherData, lat, lon) {
    let baseProbability = prediction.probabilities[prediction.riskLevel];
    
    // Adjust based on weather conditions
    if (weatherData.windSpeed > 25) {
      baseProbability += 10;
    }
    if (weatherData.pressure < 1000) {
      baseProbability += 15;
    }
    if (lat >= 10 && lat <= 30 && (lon >= -100 || lon <= -60)) {
      baseProbability += 20; // Hurricane-prone region
    }
    
    return Math.min(Math.round(baseProbability), 100);
  }

  /**
   * Get contributing factors
   */
  getFactors(weatherData, lat, lon, prediction) {
    const factors = [];
    
    if (weatherData.windSpeed > 25) {
      factors.push(`High wind speeds (${weatherData.windSpeed.toFixed(1)} m/s)`);
    }
    if (weatherData.humidity > 70 && weatherData.temperature > 26) {
      factors.push('High humidity and warm temperatures');
    }
    if (lat >= 10 && lat <= 30) {
      factors.push('Located in hurricane-prone region');
    }
    if (weatherData.pressure < 1000) {
      factors.push('Low atmospheric pressure');
    }
    
    if (factors.length === 0) {
      factors.push('Normal weather conditions');
    }
    
    return factors;
  }

  getRecommendation(riskLevel) {
    const recommendations = {
      low: 'Monitor weather updates and have a basic emergency kit ready.',
      moderate: 'Stay informed about weather conditions. Prepare evacuation plan and supplies.',
      high: 'Take immediate action. Prepare to evacuate if ordered. Secure outdoor items.',
      critical: 'Evacuate immediately if ordered. Follow local emergency services instructions.'
    };
    return recommendations[riskLevel] || 'Stay informed and be prepared.';
  }

  /**
   * Prepare training data from historical records
   */
  prepareTrainingData(data) {
    const features = [];
    const labels = [];
    
    data.forEach(record => {
      const featureVector = this.extractFeatures(
        record.weatherData,
        record.lat,
        record.lon
      );
      features.push(featureVector);
      
      // Convert risk level to one-hot encoding
      const riskLevels = ['low', 'moderate', 'high', 'critical'];
      const label = new Array(4).fill(0);
      label[riskLevels.indexOf(record.riskLevel)] = 1;
      labels.push(label);
    });
    
    return { features, labels };
  }
}

module.exports = HurricaneModel;

