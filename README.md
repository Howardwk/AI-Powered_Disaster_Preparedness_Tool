# AI-Powered Disaster Preparedness Tool

An intelligent web application that predicts natural disasters early and generates personalized response plans for individuals and communities.

## Live Demo

- Frontend (Render): https://disaster-prep-frontend.onrender.com
- Backend API (Render): https://disaster-prep-backend.onrender.com
- Health Check: https://disaster-prep-backend.onrender.com/api/health

## Features

- 🌪️ **Disaster Prediction**: AI-powered predictions for hurricanes, floods, earthquakes, wildfires, and tornadoes
- 📋 **Response Plans**: Personalized, step-by-step disaster response plans
- 🗺️ **Interactive Maps**: Visualize disaster risk zones and impact areas
- 🔔 **Real-time Alerts**: Get notified about potential disasters in your area
- 📊 **Historical Analysis**: Learn from past disaster patterns

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI for components
- Leaflet.js for maps
- Chart.js for visualizations

### Backend
- Node.js with Express
- MongoDB/Mongoose for database
- TensorFlow.js for AI predictions
- Weather APIs for real-time data

### Deployment
- Frontend: Render static site (live link above)
- Backend: Render web service (Node.js)
- Database: MongoDB Atlas (free tier)

## System Architecture

- **Frontend (React + Material-UI)**: Routes for Dashboard, Predictions, Plan Generator, Map View, Alerts. Integrates Leaflet for map layers (risk zones, pins, heat maps, evacuation routes) and consumes backend APIs via Axios.
- **Backend (Node.js + Express)**: REST API with modules for disasters, plans, alerts, ML status. Connects to MongoDB via Mongoose, fetches weather/seismic data, orchestrates rule-based + ML predictions, and emits sockets for live updates.
- **ML Layer (TensorFlow.js)**: `MLModelManager` coordinates Hurricane, Flood, and Earthquake models with CPU fallback, manual weights loading, and rule-based fallbacks when ML is unavailable.
- **External Data Sources**: OpenWeatherMap for current weather, USGS for seismic activity, plus placeholders for NOAA/NASA data as future enhancements.
- **Deployment Topology**: Render hosts both frontend and backend; environment variables are stored in Render dashboard and `.env` files for local dev.

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free) or local MongoDB

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd "AI SOFTWARE"
```

2. Install dependencies

Frontend:
```bash
cd frontend
npm install
```

Backend:
```bash
cd backend
npm install
```

3. Set up environment variables

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
```

Backend (.env):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
USGS_API_URL=https://earthquake.usgs.gov/fdsnws/event/1
FRONTEND_URL=http://localhost:3000
USE_ML_MODELS=false
```

4. Run the application

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

Visit `http://localhost:3000` in your browser.

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd "AI SOFTWARE"
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and API keys
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL (include /api)
npm start
```

Visit `http://localhost:3000` in your browser.

## Deployment

### Option 1: Render Blueprint (Recommended)

1. Push code to GitHub.
2. From Render dashboard choose **Blueprint** and point to this repo (Render auto-detects `render.yaml`).
3. Render provisions two services:
   - `disaster-prep-backend` (Node web service)  
     - Root dir: `backend`  
     - Build: `npm install`  
     - Start: `npm start`  
     - Required env vars:  
       ```
       NODE_ENV=production
       PORT=10000
       MONGODB_URI=mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
       OPENWEATHER_API_KEY=<your-openweather-key>
       FRONTEND_URL=https://disaster-prep-frontend.onrender.com
       USE_ML_MODELS=false
       ```
   - `disaster-prep-frontend` (static site)  
     - Root dir: `frontend`  
     - Build: `npm install && npm run build`  
     - Publish dir: `build`  
     - Env vars:  
       ```
       REACT_APP_API_URL=https://disaster-prep-backend.onrender.com/api
       ```
4. Deploy both services, then update `FRONTEND_URL` and `REACT_APP_API_URL` with the live URLs Render assigns if they differ.

**Live URLs (current deployment):**
- Frontend: `https://disaster-prep-frontend.onrender.com`
- Backend: `https://disaster-prep-backend.onrender.com`
- API Health: `https://disaster-prep-backend.onrender.com/api/health`

### Option 2: Vercel (Frontend) + Railway (Backend)

- Deploy backend from `backend/` directory on Railway (Node service, `npm start`, same env vars as above).
- Deploy frontend to Vercel/Netlify with `npm install && npm run build`.
- Update `REACT_APP_API_URL` to your Railway backend URL + `/api`.

### Option 3: Heroku or Other Hosts

See detailed instructions in `DEPLOYMENT.md`.

## API Endpoints

- `GET /api/disasters/predict` - Get disaster predictions for a location
- `POST /api/plans/generate` - Generate a response plan
- `GET /api/alerts/:location` - Get alerts for a location
- `GET /api/history` - Get historical disaster data

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

