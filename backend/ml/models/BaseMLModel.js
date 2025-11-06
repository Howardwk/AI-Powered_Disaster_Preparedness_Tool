// Load TensorFlow.js - try native bindings first, fallback to CPU-only
let tf;
try {
  // Try native bindings (faster, but may not work on all systems)
  tf = require('@tensorflow/tfjs-node');
  // Verify native backend is available
  if (tf.getBackend() === 'tensorflow') {
    console.log('✅ Using TensorFlow.js with native Node.js backend (optimized)');
  } else {
    console.log('✅ Using TensorFlow.js Node.js backend');
  }
} catch (error) {
  // Fallback to CPU-only version (works everywhere but slower)
  console.warn('⚠️ TensorFlow.js native bindings not available, using CPU-only version');
  console.warn('   This is slower. To fix: npm rebuild @tensorflow/tfjs-node');
  try {
    tf = require('@tensorflow/tfjs');
    // Set backend to CPU
    tf.setBackend('cpu');
    console.log('Using TensorFlow.js CPU backend');
  } catch (err) {
    console.error('TensorFlow.js not available:', err.message);
    throw new Error('TensorFlow.js is required for ML models. Please run: npm install @tensorflow/tfjs');
  }
}

/**
 * Base class for ML models
 */
class BaseMLModel {
  constructor(modelName) {
    this.modelName = modelName;
    this.model = null;
    this.isLoaded = false;
    this.modelPath = null;
  }

  /**
   * Load model from file or create new model
   */
  async load() {
    try {
      if (this.modelPath) {
        const fs = require('fs');
        const pathModule = require('path');
        
        // Check if model file exists
        const modelPath = pathModule.resolve(this.modelPath);
        if (fs.existsSync(modelPath)) {
          try {
            // Try loading with file:// URL (works with native bindings)
            const fileUrl = `file://${modelPath.replace(/\\/g, '/')}`;
            this.model = await tf.loadLayersModel(fileUrl);
            this.isLoaded = true;
            console.log(`${this.modelName} model loaded successfully from ${modelPath}`);
            return;
          } catch (fileError) {
            // If file:// doesn't work, try manual loading (for CPU-only mode)
            console.log(`Loading ${this.modelName} model manually...`);
            try {
              // Load model.json (may be stringified JSON)
              let modelJsonRaw = fs.readFileSync(modelPath, 'utf8');
              let modelJson;
              try {
                modelJson = JSON.parse(modelJsonRaw);
                // If it's a string, parse again
                if (typeof modelJson === 'string') {
                  modelJson = JSON.parse(modelJson);
                }
              } catch (e) {
                throw new Error('Invalid model JSON format');
              }
              
              // Load weights
              const weightsPath = pathModule.join(pathModule.dirname(modelPath), 'weights.json');
              if (fs.existsSync(weightsPath)) {
                const weightsInfo = JSON.parse(fs.readFileSync(weightsPath, 'utf8'));
                
                // Recreate model from JSON structure
                // The model JSON should have the structure from model.toJSON()
                if (modelJson.class_name === 'Sequential' && modelJson.config) {
                  // Create model from sequential config
                  this.model = tf.sequential();
                  
                  // Build layers from config
                  const layers = modelJson.config.layers || [];
                  for (const layerConfig of layers) {
                    const layer = this.createLayerFromConfig(layerConfig);
                    this.model.add(layer);
                  }
                  
                  // Compile the model
                  this.model.compile({
                    optimizer: 'adam',
                    loss: 'categoricalCrossentropy',
                    metrics: ['accuracy']
                  });
                } else {
                  // Fallback: create new model
                  this.model = this.createModel();
                }
                
                // Load weights - handle both array format (old) and object format (new)
                const weightTensors = weightsInfo.map((weightInfo, index) => {
                  if (Array.isArray(weightInfo)) {
                    // Old format - just array, infer shape from model
                    // We need to get the shape from the model's weight specs
                    const modelWeights = this.model.getWeights();
                    if (index < modelWeights.length) {
                      const shape = modelWeights[index].shape;
                      return tf.tensor(weightInfo, shape);
                    }
                    // Fallback: try to infer shape
                    const inferredShape = [weightInfo.length];
                    return tf.tensor(weightInfo, inferredShape);
                  } else {
                    // New format - object with shape, data, and dtype
                    return tf.tensor(weightInfo.data, weightInfo.shape, weightInfo.dtype);
                  }
                });
                
                // Set weights on the model
                if (weightTensors.length > 0) {
                  this.model.setWeights(weightTensors);
                  // Clean up temporary tensors
                  weightTensors.forEach(t => t.dispose());
                }
                
                this.isLoaded = true;
                console.log(`${this.modelName} model loaded successfully from ${modelPath}`);
                return;
              } else {
                throw new Error('Weights file not found');
              }
            } catch (manualError) {
              console.warn(`Manual load failed for ${this.modelName}:`, manualError.message);
              throw fileError; // Fall through to create new model
            }
          }
        } else {
          // Model file doesn't exist, create new one
          console.log(`${this.modelName} model file not found at ${modelPath}, creating new model`);
        }
      }
      
      // Create a new model if loading failed or no path specified
      this.model = this.createModel();
      this.isLoaded = true;
      console.log(`${this.modelName} model created (untrained)`);
    } catch (error) {
      console.warn(`Could not load ${this.modelName} model, creating new one:`, error.message);
      this.model = this.createModel();
      this.isLoaded = true;
    }
  }

  /**
   * Create a new neural network model
   * Override in subclasses for custom architectures
   */
  createModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [this.getInputSize()],
          units: 64,
          activation: 'relu',
          name: 'hidden1'
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 32,
          activation: 'relu',
          name: 'hidden2'
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 16,
          activation: 'relu',
          name: 'hidden3'
        }),
        tf.layers.dense({
          units: this.getOutputSize(),
          activation: 'softmax',
          name: 'output'
        })
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * Get input size (number of features)
   * Override in subclasses
   */
  getInputSize() {
    return 10; // Default: 10 features
  }

  /**
   * Get output size (number of risk levels)
   */
  getOutputSize() {
    return 4; // low, moderate, high, critical
  }

  /**
   * Normalize input features
   */
  normalizeFeatures(features) {
    // Min-max normalization
    const normalized = features.map((feature, index) => {
      const [min, max] = this.getFeatureRange(index);
      if (max === min) return 0;
      return (feature - min) / (max - min);
    });
    return normalized;
  }

  /**
   * Get feature ranges for normalization
   * Override in subclasses
   */
  getFeatureRange(featureIndex) {
    // Default ranges - override in subclasses
    return [0, 100];
  }

  /**
   * Predict risk level from features
   */
  async predict(features) {
    if (!this.isLoaded) {
      await this.load();
    }

    try {
      // Normalize features
      const normalizedFeatures = this.normalizeFeatures(features);
      
      // Convert to tensor
      const inputTensor = tf.tensor2d([normalizedFeatures]);
      
      // Make prediction
      const prediction = this.model.predict(inputTensor);
      const predictionData = await prediction.data();
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();
      
      // Map prediction to risk levels
      const riskLevels = ['low', 'moderate', 'high', 'critical'];
      const riskIndex = predictionData.indexOf(Math.max(...predictionData));
      const confidence = predictionData[riskIndex];
      
      return {
        riskLevel: riskLevels[riskIndex],
        confidence: Math.round(confidence * 100),
        probabilities: riskLevels.reduce((acc, level, index) => {
          acc[level] = Math.round(predictionData[index] * 100);
          return acc;
        }, {})
      };
    } catch (error) {
      console.error(`Error in ${this.modelName} prediction:`, error);
      // Fallback to default
      return {
        riskLevel: 'low',
        confidence: 50,
        probabilities: { low: 50, moderate: 30, high: 15, critical: 5 }
      };
    }
  }

  /**
   * Train model with data
   */
  async train(trainingData, epochs = 100) {
    if (!this.isLoaded) {
      await this.load();
    }

    try {
      const { features, labels } = this.prepareTrainingData(trainingData);
      
      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(labels);
      
      await this.model.fit(xs, ys, {
        epochs: epochs,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`${this.modelName} - Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
            }
          }
        }
      });
      
      xs.dispose();
      ys.dispose();
      
      console.log(`${this.modelName} model training completed`);
    } catch (error) {
      console.error(`Error training ${this.modelName} model:`, error);
      throw error;
    }
  }

  /**
   * Prepare training data
   * Override in subclasses
   */
  prepareTrainingData(data) {
    // Default implementation - override in subclasses
    return {
      features: [],
      labels: []
    };
  }

  /**
   * Save model to file
   */
  async save(path) {
    if (this.model) {
      const pathModule = require('path');
      const fs = require('fs');
      
      // Ensure directory exists
      const dir = pathModule.dirname(path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Try file:// URL first (works with native bindings)
      try {
        const absolutePath = pathModule.resolve(path);
        const fileUrl = `file://${absolutePath.replace(/\\/g, '/')}`;
        await this.model.save(fileUrl);
        this.modelPath = fileUrl;
        console.log(`${this.modelName} model saved to ${absolutePath}`);
      } catch (error) {
        // Fallback: Save model structure manually (for CPU-only mode)
        console.warn(`${this.modelName} model save using file:// failed, using manual save:`, error.message);
        try {
          const modelJson = this.model.toJSON();
          const weightsData = await this.model.getWeights();
          
          // Save model.json
          const modelJsonPath = path;
          fs.writeFileSync(modelJsonPath, JSON.stringify(modelJson, null, 2));
          
          // Save weights with shape information (for proper loading)
          const weightsPath = pathModule.join(dir, 'weights.json');
          const weightsInfo = await Promise.all(
            weightsData.map(async (tensor, index) => {
              const data = await tensor.data();
              return {
                shape: tensor.shape,
                data: Array.from(data),
                dtype: tensor.dtype
              };
            })
          );
          fs.writeFileSync(weightsPath, JSON.stringify(weightsInfo));
          
          this.modelPath = path;
          console.log(`${this.modelName} model saved manually to ${path}`);
        } catch (manualError) {
          console.error(`Failed to save ${this.modelName} model:`, manualError.message);
          throw manualError;
        }
      }
    }
  }

  /**
   * Create layer from config (for loading models)
   */
  createLayerFromConfig(layerConfig) {
    const className = layerConfig.class_name;
    const config = layerConfig.config || {};
    
    switch (className) {
      case 'Dense':
        return tf.layers.dense({
          units: config.units,
          activation: config.activation,
          name: config.name,
          inputShape: config.batch_input_shape ? config.batch_input_shape.slice(1) : undefined
        });
      case 'Dropout':
        return tf.layers.dropout({
          rate: config.rate,
          name: config.name
        });
      default:
        // For other layer types, create a basic dense layer as fallback
        console.warn(`Unknown layer type: ${className}, using default dense layer`);
        return tf.layers.dense({ units: 32, activation: 'relu' });
    }
  }

  /**
   * Get model summary
   */
  getSummary() {
    if (this.model) {
      return {
        name: this.modelName,
        loaded: this.isLoaded,
        totalParams: this.model.countParams(),
        trainableParams: this.model.countParams(true)
      };
    }
    return null;
  }
}

module.exports = BaseMLModel;

