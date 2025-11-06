const disasterService = require('./disasterService');

class AlertService {
  async getAlertsForLocation(location, lat, lon) {
    try {
      const alerts = [];

      // If coordinates provided, get predictions
      if (lat && lon) {
        const predictions = await disasterService.getPredictions(lat, lon, location);
        
        // Generate alerts based on predictions
        Object.entries(predictions.predictions).forEach(([type, prediction]) => {
          if (prediction.riskLevel === 'high' || prediction.riskLevel === 'critical') {
            alerts.push({
              id: this.generateAlertId(),
              type: prediction.type,
              severity: prediction.riskLevel,
              location,
              message: this.generateAlertMessage(type, prediction.riskLevel),
              prediction,
              timestamp: new Date().toISOString(),
              actionRequired: true
            });
          }
        });
      }

      return alerts;
    } catch (error) {
      console.error('Error in getAlertsForLocation:', error);
      throw error;
    }
  }

  async getAllActiveAlerts() {
    try {
      // Placeholder for getting all active alerts
      // In production, this would query a database of active alerts
      return [];
    } catch (error) {
      console.error('Error in getAllActiveAlerts:', error);
      throw error;
    }
  }

  generateAlertMessage(type, severity) {
    const messages = {
      hurricane: {
        high: 'High risk of hurricane conditions. Prepare evacuation plan and supplies.',
        critical: 'CRITICAL: Hurricane threat detected. Evacuate if ordered by authorities.'
      },
      flood: {
        high: 'High flood risk. Move to higher ground and avoid flooded areas.',
        critical: 'CRITICAL: Immediate flood threat. Evacuate immediately to higher ground.'
      },
      tornado: {
        high: 'High tornado risk. Take shelter in interior room or basement immediately.',
        critical: 'CRITICAL: Tornado threat. Take shelter immediately in lowest floor.'
      },
      earthquake: {
        high: 'Elevated earthquake risk. Review safety procedures and secure heavy items.',
        critical: 'CRITICAL: High earthquake risk. Be prepared to drop, cover, and hold on.'
      },
      wildfire: {
        high: 'High wildfire risk. Prepare for potential evacuation.',
        critical: 'CRITICAL: Extreme wildfire danger. Evacuate immediately if ordered.'
      }
    };

    return messages[type]?.[severity] || `High risk of ${type}. Take appropriate precautions.`;
  }

  generateAlertId() {
    return `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = new AlertService();



