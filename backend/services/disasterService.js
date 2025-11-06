const axios = require('axios');
const predictionService = require('./predictionService');
const weatherService = require('./weatherService');

class DisasterService {
  async getPredictions(lat, lon, location) {
    try {
      // Get current weather data
      const weatherData = await weatherService.getCurrentWeather(lat, lon);
      console.log('Weather data received:', weatherData);
      
      // Get earthquake data
      const earthquakeData = await this.getEarthquakeData(lat, lon);
      
      // Predict different disaster types
      const predictions = {
        hurricane: await predictionService.predictHurricane(weatherData, lat, lon),
        flood: await predictionService.predictFlood(weatherData, lat, lon),
        tornado: await predictionService.predictTornado(weatherData, lat, lon),
        earthquake: await predictionService.predictEarthquake(earthquakeData, lat, lon),
        wildfire: await predictionService.predictWildfire(weatherData, lat, lon)
      };
      
      // Log predictions for debugging
      console.log('All predictions:', JSON.stringify(predictions, null, 2));

      // Calculate overall risk level
      const riskLevel = this.calculateOverallRisk(predictions);

      return {
        location: location || `${lat}, ${lon}`,
        coordinates: { lat, lon },
        riskLevel,
        predictions,
        weatherData: {
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          windSpeed: weatherData.windSpeed,
          windDirection: weatherData.windDirection,
          visibility: weatherData.visibility,
          clouds: weatherData.clouds,
          conditions: weatherData.conditions
        },
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getPredictions:', error);
      throw error;
    }
  }

  async getHistoricalData(options) {
    try {
      // Placeholder for historical data retrieval
      // This would typically query a database of past disasters
      const history = [];
      
      // Get earthquake history from USGS
      if (options.lat && options.lon) {
        try {
          const response = await axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query', {
            params: {
              format: 'geojson',
              latitude: options.lat,
              longitude: options.lon,
              maxradiuskm: 1000,
              limit: options.limit || 50,
              orderby: 'time'
            }
          });
          
          if (response.data && response.data.features) {
            history.push(...response.data.features.map(feature => ({
              type: 'earthquake',
              date: new Date(feature.properties.time),
              magnitude: feature.properties.mag,
              location: feature.properties.place,
              coordinates: feature.geometry.coordinates
            })));
          }
        } catch (err) {
          console.error('Error fetching earthquake history:', err.message);
        }
      }

      return history;
    } catch (error) {
      console.error('Error in getHistoricalData:', error);
      throw error;
    }
  }

  async getEarthquakeData(lat, lon) {
    try {
      const response = await axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query', {
        params: {
          format: 'geojson',
          latitude: lat,
          longitude: lon,
          maxradiuskm: 100,
          limit: 10,
          orderby: 'time'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
      return { features: [] };
    }
  }

  calculateOverallRisk(predictions) {
    const riskLevels = {
      'low': 1,
      'moderate': 2,
      'high': 3,
      'critical': 4
    };

    let maxRisk = 1;
    for (const [type, prediction] of Object.entries(predictions)) {
      const risk = riskLevels[prediction?.riskLevel || 'low'] || 1;
      maxRisk = Math.max(maxRisk, risk);
    }

    const riskMap = {
      1: 'low',
      2: 'moderate',
      3: 'high',
      4: 'critical'
    };

    return riskMap[maxRisk] || 'low';
  }
}

module.exports = new DisasterService();



