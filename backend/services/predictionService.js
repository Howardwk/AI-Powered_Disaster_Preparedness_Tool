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

      if (mlPrediction && mlPrediction.riskLevel) {
        // Use ML prediction
        return mlPrediction;
      }

      // Fallback to rule-based prediction
      console.log('Using rule-based prediction for hurricane');
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
      const isHurricaneSeason = (month >= 6 && month <= 11 && lat > 0) || 
                                ((month >= 12 || month <= 3) && lat < 0);
      
      if (isHurricaneSeason) {
        confidence += 0.1;
        factors.push('Currently in hurricane season');
      }

      confidence = Math.min(confidence, 1.0);
      
      const result = {
        type: 'hurricane',
        riskLevel: riskLevel || 'low',
        confidence: Math.round(confidence * 100) || 30,
        probability: Math.round(confidence * 60) || 18, // Percentage
        factors: factors || [],
        recommendation: this.getRecommendation('hurricane', riskLevel) || 'Monitor weather updates.',
        timeframe: '24-48 hours',
        consideredFactors: {
          windSpeed: {
            value: weatherData.windSpeed || 0,
            threshold: 25,
            unit: 'm/s',
            status: weatherData.windSpeed > 25 ? 'exceeded' : 'normal'
          },
          humidity: {
            value: weatherData.humidity || 0,
            threshold: 70,
            unit: '%',
            status: weatherData.humidity > 70 ? 'exceeded' : 'normal'
          },
          temperature: {
            value: weatherData.temperature || 0,
            threshold: 26,
            unit: '°C',
            status: weatherData.temperature > 26 ? 'exceeded' : 'normal'
          },
          location: {
            value: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
            threshold: 'Hurricane-prone region (10-30°N, -100° to -60°W)',
            status: (lat >= 10 && lat <= 30 && (lon >= -100 || lon <= -60)) ? 'in_zone' : 'outside_zone'
          },
          season: {
            value: isHurricaneSeason ? 'Yes' : 'No',
            threshold: 'Hurricane season (Jun-Nov in Northern Hemisphere)',
            status: isHurricaneSeason ? 'in_season' : 'off_season'
          }
        }
      };
      
      console.log('Hurricane prediction result:', result);
      return result;
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
        timeframe: '12-24 hours',
        consideredFactors: {
          humidity: {
            value: weatherData.humidity || 0,
            threshold: 80,
            unit: '%',
            status: weatherData.humidity > 80 ? 'exceeded' : 'normal'
          },
          visibility: {
            value: weatherData.visibility || 10000,
            threshold: 5000,
            unit: 'm',
            status: weatherData.visibility < 5000 ? 'exceeded' : 'normal'
          },
          cloudCover: {
            value: weatherData.clouds || 0,
            threshold: 80,
            unit: '%',
            status: weatherData.clouds > 80 ? 'exceeded' : 'normal'
          },
          pressure: {
            value: weatherData.pressure || 1013,
            threshold: 1000,
            unit: 'hPa',
            status: weatherData.pressure < 1000 ? 'exceeded' : 'normal'
          }
        }
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
        timeframe: '6-12 hours',
        consideredFactors: {
          windSpeed: {
            value: weatherData.windSpeed || 0,
            threshold: 15,
            unit: 'm/s',
            status: weatherData.windSpeed > 15 ? 'exceeded' : 'normal'
          },
          humidity: {
            value: weatherData.humidity || 0,
            threshold: 60,
            unit: '%',
            status: weatherData.humidity > 60 ? 'exceeded' : 'normal'
          },
          temperature: {
            value: weatherData.temperature || 0,
            threshold: 24,
            unit: '°C',
            status: weatherData.temperature > 24 ? 'exceeded' : 'normal'
          },
          pressure: {
            value: weatherData.pressure || 1013,
            threshold: 1005,
            unit: 'hPa',
            status: weatherData.pressure < 1005 ? 'exceeded' : 'normal'
          },
          location: {
            value: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
            threshold: 'Tornado Alley (30-50°N, -110° to -85°W)',
            status: (lat >= 30 && lat <= 50 && lon >= -110 && lon <= -85) ? 'in_zone' : 'outside_zone'
          }
        }
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
      const recentQuakes = earthquakeData.features && earthquakeData.features.length > 0
        ? earthquakeData.features.filter(feature => {
            const quakeTime = new Date(feature.properties.time);
            const hoursAgo = (Date.now() - quakeTime.getTime()) / (1000 * 60 * 60);
            return hoursAgo < 48; // Last 48 hours
          })
        : [];
      
      const maxMagnitude = recentQuakes.length > 0
        ? Math.max(...recentQuakes.map(q => q.properties.mag || 0))
        : 0;

      if (recentQuakes.length > 0) {
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
        timeframe: 'Unpredictable',
        consideredFactors: {
          recentActivity: {
            value: recentQuakes.length > 0 ? `${recentQuakes.length} quakes in last 48h` : 'No recent activity',
            threshold: 'Recent earthquakes within 48 hours',
            status: recentQuakes.length > 0 ? 'active' : 'inactive'
          },
          maxMagnitude: {
            value: maxMagnitude > 0 ? `M${maxMagnitude.toFixed(1)}` : 'N/A',
            threshold: 'Magnitude > 3.0',
            unit: 'Richter scale',
            status: maxMagnitude > 4 ? 'high' : maxMagnitude > 3 ? 'moderate' : 'low'
          },
          location: {
            value: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
            threshold: 'Seismically active region',
            status: this.isInSeismicZone(lat, lon) ? 'in_zone' : 'outside_zone'
          }
        }
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
        timeframe: '12-72 hours',
        consideredFactors: {
          temperature: {
            value: weatherData.temperature || 0,
            threshold: 30,
            unit: '°C',
            status: weatherData.temperature > 30 ? 'exceeded' : 'normal'
          },
          humidity: {
            value: weatherData.humidity || 0,
            threshold: 30,
            unit: '%',
            status: weatherData.humidity < 30 ? 'exceeded' : 'normal',
            note: 'Lower is worse for wildfires'
          },
          windSpeed: {
            value: weatherData.windSpeed || 0,
            threshold: 20,
            unit: 'm/s',
            status: weatherData.windSpeed > 20 ? 'exceeded' : 'normal'
          },
          combinedRisk: {
            value: weatherData.temperature > 25 && weatherData.humidity < 40 ? 'High' : 'Normal',
            threshold: 'Temp > 25°C AND Humidity < 40%',
            status: (weatherData.temperature > 25 && weatherData.humidity < 40) ? 'critical' : 'normal'
          }
        }
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



