import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const alertService = {
  async getAlerts(location, lat, lon) {
    try {
      const response = await axios.get(`${API_URL}/alerts/${location}`, {
        params: { lat, lon },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to get alerts'
      );
    }
  },
};



