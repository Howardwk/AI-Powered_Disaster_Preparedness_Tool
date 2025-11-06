const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['hurricane', 'flood', 'tornado', 'earthquake', 'wildfire'],
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['low', 'moderate', 'high', 'critical'],
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  probability: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  factors: [String],
  prediction: {
    type: mongoose.Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Disaster = mongoose.model('Disaster', disasterSchema);

module.exports = Disaster;



