# ML Model Training

This directory contains scripts and utilities for training machine learning models for disaster prediction.

## Quick Start

### 1. Install Dependencies

Make sure you've installed all backend dependencies:

```bash
cd backend
npm install
```

### 2. Train Models

Train all models with sample data:

```bash
node backend/ml/training/trainModels.js
```

This will:
- Generate sample training data
- Train Hurricane, Flood, and Earthquake models
- Save trained models to `backend/ml/models/saved/`

### 3. Enable ML Predictions

Add to `backend/.env`:

```env
USE_ML_MODELS=true
```

Restart the backend server to use ML predictions.

## Model Architecture

### Base Model
- **Architecture**: Sequential Neural Network
- **Layers**: 
  - Dense (64 units, ReLU) + Dropout (0.2)
  - Dense (32 units, ReLU) + Dropout (0.2)
  - Dense (16 units, ReLU)
  - Dense (4 units, Softmax) - Output layer
- **Optimizer**: Adam
- **Loss**: Categorical Crossentropy
- **Output**: 4 risk levels (low, moderate, high, critical)

### Hurricane Model
- **Input Features**: 12
  - Latitude, Longitude
  - Temperature, Humidity, Pressure
  - Wind Speed, Wind Direction
  - Cloud Cover, Visibility
  - Month, Hurricane Season Flag
  - Sea Surface Temperature

### Flood Model
- **Input Features**: 10
  - Latitude, Longitude
  - Temperature, Humidity, Pressure
  - Cloud Cover, Visibility
  - Estimated Rainfall, Elevation
  - Near Water Body Flag

### Earthquake Model
- **Input Features**: 8
  - Latitude, Longitude
  - Recent Magnitude (24h)
  - Recent Count (24h)
  - Average Magnitude (7 days)
  - Seismic Zone Flag
  - Depth, Near Fault Line Flag

## Training with Real Data

To train with real historical data:

1. **Prepare Data**:
   ```javascript
   const trainingData = [
     {
       lat: 25.7617,
       lon: -80.1918,
       weatherData: { /* actual weather data */ },
       riskLevel: 'high' // actual historical risk level
     },
     // ... more records
   ];
   ```

2. **Train Specific Model**:
   ```javascript
   const mlModelManager = require('../models/MLModelManager');
   await mlModelManager.initialize();
   await mlModelManager.trainModel('hurricane', trainingData, 100);
   await mlModelManager.saveModel('hurricane', './backend/ml/models/saved/hurricane_model');
   ```

## Model Performance

### Evaluation Metrics
- **Accuracy**: Classification accuracy
- **Confidence**: Prediction confidence score
- **Probability Distribution**: Probabilities for each risk level

### Improving Accuracy

1. **More Training Data**: Collect more historical disaster records
2. **Feature Engineering**: Add more relevant features
3. **Model Tuning**: Adjust hyperparameters (epochs, batch size, learning rate)
4. **Architecture**: Experiment with different architectures (LSTM, CNN, etc.)
5. **Ensemble Methods**: Combine multiple models

## Model Files

Trained models are saved in `backend/ml/models/saved/`:
- `hurricane_model/model.json` - Model architecture
- `hurricane_model/weights.bin` - Model weights
- Similar structure for other models

## Using Trained Models

Models are automatically loaded when:
1. `USE_ML_MODELS=true` in `.env`
2. Model files exist in `saved/` directory
3. Backend server starts

The system will:
- Try ML prediction first
- Fallback to rule-based if ML fails
- Log ML predictions for monitoring

## Future Enhancements

- [ ] Add Tornado and Wildfire models
- [ ] Time-series models (LSTM/GRU) for temporal patterns
- [ ] Ensemble methods combining multiple models
- [ ] Model versioning and A/B testing
- [ ] Real-time model retraining
- [ ] Model performance monitoring
- [ ] Transfer learning from pre-trained models

