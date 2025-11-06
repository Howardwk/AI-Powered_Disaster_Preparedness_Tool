import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const disasterService = {
  async getPredictions(lat, lon, location) {
    try {
      const response = await axios.get(`${API_URL}/disasters/predict`, {
        params: { lat, lon, location },
      });
      return response.data;
    } catch (error) {
      // More detailed error messages
      if (error.response) {
        // Server responded with error
        throw new Error(
          error.response.data?.error || 
          error.response.data?.message || 
          `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // Request made but no response
        throw new Error(
          'Cannot connect to server. Please make sure the backend is running on http://localhost:5000'
        );
      } else {
        // Something else happened
        throw new Error(error.message || 'Failed to get predictions');
      }
    }
  },

  async getHistoricalData(lat, lon, type, limit = 50) {
    try {
      const response = await axios.get(`${API_URL}/disasters/history`, {
        params: { lat, lon, type, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to get historical data'
      );
    }
  },
};



