const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat, lon) {
    try {
      if (!this.apiKey) {
        // Return mock data if API key not provided
        console.warn('OpenWeather API key not found. Using mock data.');
        return this.getMockWeatherData();
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind?.speed || 0,
        windDirection: response.data.wind?.deg || 0,
        conditions: response.data.weather[0]?.main || 'Clear',
        description: response.data.weather[0]?.description || '',
        visibility: response.data.visibility || 10000,
        clouds: response.data.clouds?.all || 0
      };
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      // Return mock data on error
      return this.getMockWeatherData();
    }
  }

  getMockWeatherData() {
    // Mock weather data for development/testing
    return {
      temperature: 22,
      humidity: 65,
      pressure: 1013,
      windSpeed: 5,
      windDirection: 180,
      conditions: 'Clear',
      description: 'clear sky',
      visibility: 10000,
      clouds: 20
    };
  }

  async getForecast(lat, lon) {
    try {
      if (!this.apiKey) {
        return { list: [] };
      }

      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error.message);
      return { list: [] };
    }
  }
}

module.exports = new WeatherService();



