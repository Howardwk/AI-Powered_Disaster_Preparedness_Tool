const BaseMLModel = require('./BaseMLModel');

/**
 * ML Model for Earthquake Prediction
 * Note: Earthquakes are very difficult to predict accurately
 * This model uses recent seismic activity and regional data
 */
class EarthquakeModel extends BaseMLModel {
  constructor() {
    super('Earthquake');
    const path = require('path');
    this.modelPath = path.join(__dirname, 'saved', 'earthquake_model', 'model.json');
  }

  getInputSize() {
    return 8; // 8 features for earthquake prediction
  }

  getFeatureRange(featureIndex) {
    const ranges = [
      [-90, 90],      // latitude
      [-180, 180],    // longitude
      [0, 10],        // recentMagnitude (last 24h)
      [0, 100],       // recentCount (earthquakes in last 24h)
      [0, 10],        // avgMagnitude (last 7 days)
      [0, 1],         // isSeismicZone (0 or 1)
      [0, 100],       // depth (km) - estimated
      [0, 1]          // nearFaultLine (0 or 1) - estimated
    ];
    return ranges[featureIndex] || [0, 100];
  }

  extractFeatures(earthquakeData, lat, lon) {
    // Analyze recent earthquake activity
    const recentQuakes = earthquakeData.features || [];
    const last24h = recentQuakes.filter(q => {
      const quakeTime = new Date(q.properties.time);
      const hoursAgo = (Date.now() - quakeTime.getTime()) / (1000 * 60 * 60);
      return hoursAgo < 24;
    });
    
    const recentMagnitude = last24h.length > 0 ? 
      Math.max(...last24h.map(q => q.properties.mag || 0)) : 0;
    const recentCount = last24h.length;
    
    const last7Days = recentQuakes.filter(q => {
      const quakeTime = new Date(q.properties.time);
      const daysAgo = (Date.now() - quakeTime.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo < 7;
    });
    const avgMagnitude = last7Days.length > 0 ?
      last7Days.reduce((sum, q) => sum + (q.properties.mag || 0), 0) / last7Days.length : 0;
    
    // Estimate if in seismic zone (simplified - Ring of Fire, etc.)
    const isSeismicZone = this.isInSeismicZone(lat, lon) ? 1 : 0;
    
    // Estimate depth (simplified)
    const depth = isSeismicZone ? 10 : 50;
    
    // Estimate near fault line (simplified)
    const nearFaultLine = isSeismicZone ? 1 : 0;

    return [
      lat,
      lon,
      recentMagnitude,
      recentCount,
      avgMagnitude,
      isSeismicZone,
      depth,
      nearFaultLine
    ];
  }

  isInSeismicZone(lat, lon) {
    // Pacific Ring of Fire approximation
    // This is simplified - in production, use actual fault line data
    const ringOfFire = (
      (lat >= -60 && lat <= 60 && lon >= 120 && lon <= -70) || // Pacific
      (lat >= 35 && lat <= 45 && lon >= -10 && lon <= 40) ||  // Mediterranean
      (lat >= 20 && lat <= 40 && lon >= 70 && lon <= 120)      // Himalayas
    );
    
    return ringOfFire;
  }

  async predictRisk(earthquakeData, lat, lon) {
    const features = this.extractFeatures(earthquakeData, lat, lon);
    const prediction = await this.predict(features);
    
    // Earthquakes are harder to predict - lower base probability
    const probability = this.calculateProbability(prediction, earthquakeData, features);
    const factors = this.getFactors(earthquakeData, lat, lon, features);
    
    return {
      type: 'earthquake',
      riskLevel: prediction.riskLevel,
      confidence: prediction.confidence,
      probability: probability,
      factors: factors,
      recommendation: this.getRecommendation(prediction.riskLevel),
      timeframe: 'Unpredictable',
      mlConfidence: prediction.confidence,
      mlProbabilities: prediction.probabilities
    };
  }

  calculateProbability(prediction, earthquakeData, features) {
    // Base probability is lower for earthquakes (they're harder to predict)
    let baseProbability = Math.round(prediction.probabilities[prediction.riskLevel] * 0.6);
    
    // Recent activity increases probability
    if (features[2] > 4) { // recentMagnitude > 4
      baseProbability += 20;
    }
    if (features[3] > 5) { // recentCount > 5
      baseProbability += 15;
    }
    if (features[4] > 3) { // avgMagnitude > 3
      baseProbability += 10;
    }
    
    return Math.min(baseProbability, 100);
  }

  getFactors(earthquakeData, lat, lon, features) {
    const factors = [];
    
    if (features[2] > 4) {
      factors.push(`Recent earthquake activity (M${features[2].toFixed(1)})`);
    }
    if (features[3] > 0) {
      factors.push(`${features[3]} earthquakes in last 24 hours`);
    }
    if (features[5] === 1) {
      factors.push('Located in seismically active region');
    }
    if (features[4] > 3) {
      factors.push('Elevated seismic activity in recent days');
    }
    
    if (factors.length === 0) {
      factors.push('Normal seismic activity');
    }
    
    return factors;
  }

  getRecommendation(riskLevel) {
    const recommendations = {
      low: 'Normal seismic activity. Have emergency supplies ready.',
      moderate: 'Be prepared for potential aftershocks. Review earthquake safety procedures.',
      high: 'Prepare for potential earthquake. Secure heavy items, identify safe zones.',
      critical: 'Drop, cover, and hold on. Stay away from windows and heavy objects.'
    };
    return recommendations[riskLevel] || 'Stay informed and be prepared.';
  }

  prepareTrainingData(data) {
    const features = [];
    const labels = [];
    
    data.forEach(record => {
      const featureVector = this.extractFeatures(
        record.earthquakeData,
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

module.exports = EarthquakeModel;

