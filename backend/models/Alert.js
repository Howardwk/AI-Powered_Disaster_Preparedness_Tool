const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['hurricane', 'flood', 'tornado', 'earthquake', 'wildfire'],
  },
  severity: {
    type: String,
    required: true,
    enum: ['high', 'critical'],
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: Number,
    lon: Number,
  },
  message: {
    type: String,
    required: true,
  },
  prediction: {
    type: mongoose.Schema.Types.Mixed,
  },
  actionRequired: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;



