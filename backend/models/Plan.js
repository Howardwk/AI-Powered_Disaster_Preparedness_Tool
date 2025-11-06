const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  disasterType: {
    type: String,
    required: true,
    enum: ['hurricane', 'flood', 'tornado', 'earthquake', 'wildfire'],
  },
  householdSize: {
    type: Number,
    default: 1,
  },
  specialNeeds: [String],
  coordinates: {
    lat: Number,
    lon: Number,
  },
  plan: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

planSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;



