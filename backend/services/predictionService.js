const weatherService = require('./weatherService');
const mlModelManager = require('../ml/models/MLModelManager');

class PredictionService {
  constructor() {
    // Initialize ML models on startup
    this.initializeML();
  }

  /**
   * Initialize ML models
   */
  async initializeML() {
    try {
      await mlModelManager.initialize();
    } catch (error) {
      console.warn('ML models initialization failed, using rule-based predictions:', error.message);
    }
  }

  // Predict hurricane risk
  async predictHurricane(weatherData, lat, lon) {
    try {
      // Try ML prediction first
      const mlPrediction = await mlModelManager.predictWithML(
        'hurricane',
        weatherData,
        null,
        lat,
        lon
      );

      if (mlPrediction) {
        // Use ML prediction
        return mlPrediction;
      }

      // Fallback to rule-based prediction
      // Hurricane prediction logic based on weather conditions
      let riskLevel = 'low';
      let confidence = 0.3;
      let factors = [];

      // Factors for hurricane prediction
      if (weatherData.windSpeed > 25) {
        riskLevel = 'moderate';
        confidence += 0.2;
        factors.push('High wind speeds detected');
      }

      if (weatherData.humidity > 70 && weatherData.temperature > 26) {
        riskLevel = 'moderate';
        confidence += 0.2;
        factors.push('High humidity and warm temperatures');
      }

      // Check if location is in hurricane-prone area (latitudes 10-30)
      if (lat >= 10 && lat <= 30 && (lon >= -100 || lon <= -60)) {
        riskLevel = 'high';
        confidence += 0.3;
        factors.push('Located in hurricane-prone region');
      }

      // Seasonality check (hurricane season: June-November in Northern Hemisphere)
      const month = new Date().getMonth() + 1;
      if (month >= 6 && month <= 11 && lat > 0) {
        confidence += 0.1;
        factors.push('Currently in hurricane season');
      }

      confidence = Math.min(confidence, 1.0);

      return {
        type: 'hurricane',
        riskLevel,
        confidence: Math.round(confidence * 100),
        probability: Math.round(confidence * 60), // Percentage
        factors,
        recommendation: this.getRecommendation('hurricane', riskLevel),
        timeframe: '24-48 hours'
      };
    } catch (error) {
      console.error('Error in predictHurricane:', error);
      throw error;
    }
  }

  // Predict flood risk
  async predictFlood(weatherData, lat, lon) {
    try {
      // Try ML prediction first
      const mlPrediction = await mlModelManager.predictWithML(
        'flood',
        weatherData,
        null,
        lat,
        lon
      );

      if (mlPrediction) {
        return mlPrediction;
      }

      // Fallback to rule-based prediction
      let riskLevel = 'low';
      let confidence = 0.2;
      let factors = [];

      if (weatherData.humidity > 80) {
        riskLevel = 'moderate';
        confidence += 0.2;
        factors.push('Very high humidity');
      }

      if (weatherData.visibility < 5000) {
        riskLevel = 'high';
        confidence += 0.3;
        factors.push('Poor visibility, possible heavy rain');
      }

      if (weatherData.clouds > 80) {
        confidence += 0.2;
        factors.push('Heavy cloud cover');
      }

      if (weatherData.pressure < 1000) {
        riskLevel = 'high';
        confidence += 0.3;
        factors.push('Low atmospheric pressure');
      }

      confidence = Math.min(confidence, 1.0);

      return {
        type: 'flood',
        riskLevel,
        confidence: Math.round(confidence * 100),
        probability: Math.round(confidence * 50),
        factors,
        recommendation: this.getRecommendation('flood', riskLevel),
        timeframe: '12-24 hours'
      };
    } catch (error) {
      console.error('Error in predictFlood:', error);
      throw error;
    }
  }

  // Predict tornado risk
  async predictTornado(weatherData, lat, lon) {
    try {
      let riskLevel = 'low';
      let confidence = 0.1;
      let factors = [];

      if (weatherData.windSpeed > 15) {
        riskLevel = 'moderate';
        confidence += 0.2;
        factors.push('Strong wind speeds');
      }

      if (weatherData.humidity > 60 && weatherData.temperature > 24) {
        confidence += 0.2;
        factors.push('Warm, humid conditions');
      }

      if (weatherData.pressure < 1005) {
        riskLevel = 'high';
        confidence += 0.3;
        factors.push('Low pressure system');
      }

      // Tornado Alley region (central US)
      if (lat >= 30 && lat <= 50 && lon >= -110 && lon <= -85) {
        riskLevel = 'moderate';
        confidence += 0.2;
        factors.push('Located in tornado-prone region');
      }

      confidence = Math.min(confidence, 1.0);

      return {
        type: 'tornado',
        riskLevel,
        confidence: Math.round(confidence * 100),
        probability: Math.round(confidence * 40),
        factors,
        recommendation: this.getRecommendation('tornado', riskLevel),
        timeframe: '6-12 hours'
      };
    } catch (error) {
      console.error('Error in predictTornado:', error);
      throw error;
    }
  }

  // Predict earthquake risk
  async predictEarthquake(earthquakeData, lat, lon) {
    try {
      // Try ML prediction first
      const mlPrediction = await mlModelManager.predictWithML(
        'earthquake',
        null,
        earthquakeData,
        lat,
        lon
      );

      if (mlPrediction) {
        return mlPrediction;
      }

      // Fallback to rule-based prediction
      let riskLevel = 'low';
      let confidence = 0.2;
      let factors = [];

      // Check recent earthquake activity
      if (earthquakeData.features && earthquakeData.features.length > 0) {
        const recentQuakes = earthquakeData.features.filter(feature => {
          const quakeTime = new Date(feature.properties.time);
          const hoursAgo = (Date.now() - quakeTime.getTime()) / (1000 * 60 * 60);
          return hoursAgo < 48; // Last 48 hours
        });

        if (recentQuakes.length > 0) {
          const maxMagnitude = Math.max(...recentQuakes.map(q => q.properties.mag || 0));
          
          if (maxMagnitude > 4) {
            riskLevel = 'high';
            confidence += 0.4;
            factors.push(`Recent earthquake activity (M${maxMagnitude.toFixed(1)})`);
          } else if (maxMagnitude > 3) {
            riskLevel = 'moderate';
            confidence += 0.2;
            factors.push(`Recent moderate earthquake activity`);
          }
        }
      }

      // Seismically active regions
      if (this.isInSeismicZone(lat, lon)) {
        confidence += 0.2;
        factors.push('Located in seismically active region');
      }

      confidence = Math.min(confidence, 1.0);

      return {
        type: 'earthquake',
        riskLevel,
        confidence: Math.round(confidence * 100),
        probability: Math.round(confidence * 30), // Earthquakes are harder to predict
        factors,
        recommendation: this.getRecommendation('earthquake', riskLevel),
        timeframe: 'Unpredictable'
      };
    } catch (error) {
      console.error('Error in predictEarthquake:', error);
      throw error;
    }
  }

  // Predict wildfire risk
  async predictWildfire(weatherData, lat, lon) {
    try {
      let riskLevel = 'low';
      let confidence = 0.2;
      let factors = [];

      if (weatherData.temperature > 30) {
        riskLevel = 'moderate';
        confidence += 0.2;
        factors.push('High temperatures');
      }

      if (weatherData.humidity < 30) {
        riskLevel = 'high';
        confidence += 0.3;
        factors.push('Very low humidity');
      }

      if (weatherData.windSpeed > 20) {
        riskLevel = 'high';
        confidence += 0.3;
        factors.push('Strong winds');
      }

      if (weatherData.temperature > 25 && weatherData.humidity < 40) {
        riskLevel = 'critical';
        confidence += 0.3;
        factors.push('Dry and hot conditions');
      }

      confidence = Math.min(confidence, 1.0);

      return {
        type: 'wildfire',
        riskLevel,
        confidence: Math.round(confidence * 100),
        probability: Math.round(confidence * 55),
        factors,
        recommendation: this.getRecommendation('wildfire', riskLevel),
        timeframe: '12-72 hours'
      };
    } catch (error) {
      console.error('Error in predictWildfire:', error);
      throw error;
    }
  }

  // Predict specific disaster type
  async predictDisasterType(type, lat, lon) {
    const weatherData = await weatherService.getCurrentWeather(lat, lon);
    
    switch (type.toLowerCase()) {
      case 'hurricane':
        return await this.predictHurricane(weatherData, lat, lon);
      case 'flood':
        return await this.predictFlood(weatherData, lat, lon);
      case 'tornado':
        return await this.predictTornado(weatherData, lat, lon);
      case 'earthquake':
        const earthquakeData = await this.getEarthquakeData(lat, lon);
        return await this.predictEarthquake(earthquakeData, lat, lon);
      case 'wildfire':
        return await this.predictWildfire(weatherData, lat, lon);
      default:
        throw new Error(`Unknown disaster type: ${type}`);
    }
  }

  async getEarthquakeData(lat, lon) {
    const axios = require('axios');
    try {
      const response = await axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query', {
        params: {
          format: 'geojson',
          latitude: lat,
          longitude: lon,
          maxradiuskm: 100,
          limit: 10
        }
      });
      return response.data;
    } catch (error) {
      return { features: [] };
    }
  }

  isInSeismicZone(lat, lon) {
    // Check if location is in known seismic zones
    // Pacific Ring of Fire, etc.
    return false; // Simplified
  }

  getRecommendation(type, riskLevel) {
    const recommendations = {
      hurricane: {
        low: 'Monitor weather updates and have a basic emergency kit ready.',
        moderate: 'Stay informed about weather conditions. Prepare evacuation plan and supplies.',
        high: 'Take immediate action. Prepare to evacuate if ordered. Secure outdoor items.',
        critical: 'Evacuate immediately if ordered. Follow local emergency services instructions.'
      },
      flood: {
        low: 'Normal conditions. Stay informed about local weather.',
        moderate: 'Monitor rainfall and water levels. Avoid low-lying areas.',
        high: 'Move to higher ground. Do not drive through flooded areas.',
        critical: 'Evacuate immediately. Seek shelter on high ground.'
      },
      tornado: {
        low: 'Normal conditions. Be aware of weather changes.',
        moderate: 'Stay alert for weather warnings. Identify safe shelter location.',
        high: 'Take shelter immediately. Move to basement or interior room.',
        critical: 'Take immediate shelter. Move to lowest floor, away from windows.'
      },
      earthquake: {
        low: 'Normal seismic activity. Have emergency supplies ready.',
        moderate: 'Be prepared for potential aftershocks. Review earthquake safety procedures.',
        high: 'Prepare for potential earthquake. Secure heavy items, identify safe zones.',
        critical: 'Drop, cover, and hold on. Stay away from windows and heavy objects.'
      },
      wildfire: {
        low: 'Normal fire risk. Practice fire safety.',
        moderate: 'High fire danger. Avoid open flames. Prepare evacuation plan.',
        high: 'Very high fire risk. Evacuate if ordered. Pack important documents.',
        critical: 'Extreme fire danger. Evacuate immediately. Follow evacuation routes.'
      }
    };

    return recommendations[type]?.[riskLevel] || 'Stay informed and be prepared.';
  }
}

// Export singleton instance
const predictionService = new PredictionService();
module.exports = predictionService;



