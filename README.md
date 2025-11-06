# AI-Powered Disaster Preparedness Tool

An intelligent web application that predicts natural disasters early and generates personalized response plans for individuals and communities.

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
- Frontend: Vercel/Netlify
- Backend: Render/Railway
- Database: MongoDB Atlas (free tier)

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
REACT_APP_API_URL=http://localhost:5000
```

Backend (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
USGS_API_URL=https://earthquake.usgs.gov/fdsnws/event/1
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
# Edit .env with your backend URL
npm start
```

Visit `http://localhost:3000` in your browser.

## Deployment

### Option 1: Render (Recommended - Free Tier Available)

**Backend:**
1. Push code to GitHub
2. Create new Web Service on Render (render.com)
3. Connect GitHub repository
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Set environment variables (see DEPLOYMENT.md)

**Frontend:**
1. Create Static Site on Render
2. Build Command: `cd frontend && npm install && npm run build`
3. Publish Directory: `frontend/build`
4. Set `REACT_APP_API_URL` to your backend URL

**Live URLs:**
- Backend: `https://disaster-prep-backend.onrender.com`
- Frontend: `https://disaster-prep-frontend.onrender.com`

### Option 2: Vercel (Frontend) + Railway (Backend)

See detailed instructions in `DEPLOYMENT.md`

### Option 3: Heroku

See detailed instructions in `DEPLOYMENT.md`

## API Endpoints

- `GET /api/disasters/predict` - Get disaster predictions for a location
- `POST /api/plans/generate` - Generate a response plan
- `GET /api/alerts/:location` - Get alerts for a location
- `GET /api/history` - Get historical disaster data

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

