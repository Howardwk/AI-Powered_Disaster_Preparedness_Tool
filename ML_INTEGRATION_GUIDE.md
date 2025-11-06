# Machine Learning Integration Guide

This guide explains how to use the ML models integrated into the disaster preparedness tool.

## Overview

The system now includes machine learning models for more accurate disaster predictions:
- **Hurricane Model** - Neural network for hurricane risk prediction
- **Flood Model** - Neural network for flood risk prediction  
- **Earthquake Model** - Neural network for earthquake risk prediction

The system uses a **hybrid approach**:
1. **ML Prediction** (if enabled and models are trained)
2. **Rule-based Fallback** (if ML is unavailable or fails)

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install TensorFlow.js and other ML dependencies.

### 2. Train Models (Optional)

Train models with sample data:

```bash
node backend/ml/training/trainModels.js
```

This will:
- Generate sample training data
- Train all available models
- Save models to `backend/ml/models/saved/`

**Note**: Models trained with sample data are for demonstration only. For production, train with real historical disaster data.

### 3. Enable ML Predictions

Add to `backend/.env`:

```env
USE_ML_MODELS=true
```

If this is not set or set to `false`, the system will use rule-based predictions.

### 4. Restart Backend

Restart your backend server:

```bash
npm run dev
```

You should see:
```
ML models initialized successfully
```

Or if ML is disabled:
```
ML models disabled. Set USE_ML_MODELS=true in .env to enable.
```

## How It Works

### Prediction Flow

1. User requests prediction → API call
2. System checks if ML is enabled
3. If enabled:
   - Try ML prediction first
   - If ML fails → Fallback to rule-based
4. If disabled:
   - Use rule-based prediction directly

### ML Model Architecture

Each model uses a **Sequential Neural Network**:
- **Input Layer**: Features (10-12 depending on disaster type)
- **Hidden Layers**: 
  - Dense(64) + Dropout(0.2)
  - Dense(32) + Dropout(0.2)
  - Dense(16)
- **Output Layer**: Dense(4) with Softmax
  - 4 risk levels: low, moderate, high, critical

### Features Used

#### Hurricane Model (12 features)
- Latitude, Longitude
- Temperature, Humidity, Pressure
- Wind Speed, Wind Direction
- Cloud Cover, Visibility
- Month, Hurricane Season Flag
- Sea Surface Temperature

#### Flood Model (10 features)
- Latitude, Longitude
- Temperature, Humidity, Pressure
- Cloud Cover, Visibility
- Estimated Rainfall, Elevation
- Near Water Body Flag

#### Earthquake Model (8 features)
- Latitude, Longitude
- Recent Magnitude (24h)
- Recent Count (24h)
- Average Magnitude (7 days)
- Seismic Zone Flag
- Depth, Near Fault Line Flag

## Training with Real Data

### Prepare Training Data

```javascript
const trainingData = [
  {
    lat: 25.7617,
    lon: -80.1918,
    weatherData: {
      temperature: 28,
      humidity: 75,
      pressure: 1005,
      windSpeed: 30,
      // ... other weather fields
    },
    riskLevel: 'high' // Actual historical risk level
  },
  // ... more records
];
```

### Train Model

```javascript
const mlModelManager = require('./ml/models/MLModelManager');

// Initialize
await mlModelManager.initialize();

// Train
await mlModelManager.trainModel('hurricane', trainingData, 100);

// Save
await mlModelManager.saveModel('hurricane', './backend/ml/models/saved/hurricane_model');
```

### Training via API

```bash
POST /api/ml/train/hurricane
Content-Type: application/json

{
  "trainingData": [...],
  "epochs": 100
}
```

## Monitoring

### Check ML Status

```bash
GET /api/ml/status
```

Response:
```json
{
  "success": true,
  "mlEnabled": true,
  "modelsLoaded": true,
  "models": {
    "hurricane": {
      "name": "Hurricane",
      "loaded": true,
      "totalParams": 12345,
      "trainableParams": 12345
    },
    // ... other models
  }
}
```

## Improving Accuracy

### 1. More Training Data
- Collect historical disaster records
- Include actual weather conditions at time of disasters
- Include actual outcomes (risk levels)

### 2. Better Features
- Add more weather variables
- Include historical patterns
- Add geographic features (elevation, proximity to water, etc.)

### 3. Model Tuning
- Adjust epochs (more = better but slower)
- Adjust batch size
- Modify learning rate
- Try different architectures

### 4. Ensemble Methods
- Combine multiple models
- Weight predictions by confidence
- Use voting mechanisms

## Performance

### Prediction Speed
- **ML Prediction**: ~50-200ms (depending on model size)
- **Rule-based**: ~1-5ms
- **Fallback**: Automatic if ML fails

### Accuracy
- Current (sample data): ~60-70% accuracy
- With real data: Target >75% accuracy
- Production goal: >85% accuracy

## Troubleshooting

### ML Models Not Loading

**Issue**: Models not initializing
- Check `USE_ML_MODELS=true` in `.env`
- Check model files exist in `backend/ml/models/saved/`
- Check console for error messages

**Solution**: Train models first:
```bash
node backend/ml/training/trainModels.js
```

### Models Taking Too Long

**Issue**: Predictions are slow
- ML predictions are slower than rule-based
- Consider caching predictions
- Optimize model size if needed

### Low Accuracy

**Issue**: Predictions not accurate
- Train with real historical data
- Increase training epochs
- Add more features
- Collect more training data

### Fallback to Rule-based

**Issue**: Always using rule-based
- Check ML status: `GET /api/ml/status`
- Verify `USE_ML_MODELS=true`
- Check if models are loaded
- Review console logs for errors

## Future Enhancements

- [ ] Tornado and Wildfire ML models
- [ ] LSTM for time-series predictions
- [ ] Transfer learning from pre-trained models
- [ ] Real-time model retraining
- [ ] A/B testing between models
- [ ] Model versioning
- [ ] Performance monitoring dashboard

## API Endpoints

### Get ML Status
```
GET /api/ml/status
```

### Train Model
```
POST /api/ml/train/:disasterType
Body: {
  "trainingData": [...],
  "epochs": 100
}
```

## Example Usage

### Checking if ML is Active

```bash
curl http://localhost:5000/api/ml/status
```

### Making Predictions

ML predictions are automatic when enabled. Just use the normal prediction endpoints:

```bash
GET /api/disasters/predict?lat=-1.2921&lon=36.8219
```

The response will include:
- `mlConfidence`: ML model confidence
- `mlProbabilities`: Probability distribution from ML model
- `riskLevel`: Final risk level (from ML or rule-based)

## Best Practices

1. **Always have fallback**: Rule-based predictions ensure system works
2. **Monitor accuracy**: Track prediction accuracy over time
3. **Retrain regularly**: Update models with new data
4. **Test thoroughly**: Validate models before production
5. **Document changes**: Keep track of model versions and changes

---

**Ready to use ML predictions!** Set `USE_ML_MODELS=true` and train your models to get started.

