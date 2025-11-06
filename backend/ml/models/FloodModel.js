const BaseMLModel = require('./BaseMLModel');

/**
 * ML Model for Flood Prediction
 */
class FloodModel extends BaseMLModel {
  constructor() {
    super('Flood');
    const path = require('path');
    this.modelPath = path.join(__dirname, 'saved', 'flood_model', 'model.json');
  }

  getInputSize() {
    return 10; // 10 features for flood prediction
  }

  getFeatureRange(featureIndex) {
    const ranges = [
      [-90, 90],      // latitude
      [-180, 180],    // longitude
      [-50, 50],      // temperature
      [0, 100],       // humidity
      [800, 1100],    // pressure
      [0, 100],       // cloudCover
      [0, 10000],     // visibility
      [0, 500],       // rainfall (mm) - estimated from weather
      [0, 100],       // elevation (m) - estimated
      [0, 1]          // nearWaterBody (0 or 1) - estimated
    ];
    return ranges[featureIndex] || [0, 100];
  }

  extractFeatures(weatherData, lat, lon) {
    // Estimate rainfall from weather conditions
    const estimatedRainfall = weatherData.visibility < 5000 ? 
      (100 - weatherData.visibility / 50) : 0;
    
    // Estimate elevation (simplified - coastal areas lower)
    const estimatedElevation = Math.abs(lat) < 30 ? 50 : 200;
    
    // Estimate proximity to water (simplified - near coast or major rivers)
    const nearWaterBody = (Math.abs(lat) < 30 || Math.abs(lon) < 30) ? 1 : 0;

    return [
      lat,
      lon,
      weatherData.temperature || 20,
      weatherData.humidity || 60,
      weatherData.pressure || 1013,
      weatherData.clouds || 0,
      weatherData.visibility || 10000,
      estimatedRainfall,
      estimatedElevation,
      nearWaterBody
    ];
  }

  async predictRisk(weatherData, lat, lon) {
    const features = this.extractFeatures(weatherData, lat, lon);
    const prediction = await this.predict(features);
    
    const probability = this.calculateProbability(prediction, weatherData);
    const factors = this.getFactors(weatherData, lat, lon, prediction);
    
    return {
      type: 'flood',
      riskLevel: prediction.riskLevel,
      confidence: prediction.confidence,
      probability: probability,
      factors: factors,
      recommendation: this.getRecommendation(prediction.riskLevel),
      timeframe: '12-24 hours',
      mlConfidence: prediction.confidence,
      mlProbabilities: prediction.probabilities
    };
  }

  calculateProbability(prediction, weatherData) {
    let baseProbability = prediction.probabilities[prediction.riskLevel];
    
    if (weatherData.humidity > 80) {
      baseProbability += 15;
    }
    if (weatherData.visibility < 5000) {
      baseProbability += 20;
    }
    if (weatherData.pressure < 1000) {
      baseProbability += 15;
    }
    
    return Math.min(Math.round(baseProbability), 100);
  }

  getFactors(weatherData, lat, lon, prediction) {
    const factors = [];
    
    if (weatherData.humidity > 80) {
      factors.push('Very high humidity');
    }
    if (weatherData.visibility < 5000) {
      factors.push('Poor visibility, possible heavy rain');
    }
    if (weatherData.clouds > 80) {
      factors.push('Heavy cloud cover');
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
      low: 'Normal conditions. Stay informed about local weather.',
      moderate: 'Monitor rainfall and water levels. Avoid low-lying areas.',
      high: 'Move to higher ground. Do not drive through flooded areas.',
      critical: 'Evacuate immediately. Seek shelter on high ground.'
    };
    return recommendations[riskLevel] || 'Stay informed and be prepared.';
  }

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
      
      const riskLevels = ['low', 'moderate', 'high', 'critical'];
      const label = new Array(4).fill(0);
      label[riskLevels.indexOf(record.riskLevel)] = 1;
      labels.push(label);
    });
    
    return { features, labels };
  }
}

module.exports = FloodModel;

