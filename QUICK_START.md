# Quick Start Guide

Get your AI-Powered Disaster Preparedness Tool up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] MongoDB Atlas account (free) OR local MongoDB
- [ ] OpenWeatherMap API key (free tier available)

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

## Step 3: Get API Keys

### MongoDB Atlas (Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 free tier)
4. Get connection string
5. Add to `MONGODB_URI` in backend `.env`

### OpenWeatherMap API (Free)
1. Go to https://openweathermap.org/api
2. Sign up for free account
3. Get API key from dashboard
4. Add to `OPENWEATHER_API_KEY` in backend `.env`
5. **Note:** Free tier allows 60 calls/minute

## Step 4: Run the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## Step 5: Test the Application

1. **Open Dashboard**
   - Visit `http://localhost:3000`
   - You should see the Disaster Preparedness Dashboard

2. **Test Predictions**
   - Enter coordinates: `40.7128, -74.0060` (New York)
   - Click "Get Predictions"
   - You should see disaster risk predictions

3. **Generate a Plan**
   - Go to "Plan Generator"
   - Fill in location, disaster type, household size
   - Click "Generate Plan"
   - Review your personalized response plan

4. **Check Alerts**
   - Go to "Alerts" page
   - Enter coordinates
   - See active alerts for that location

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify MongoDB connection string is correct
- Check environment variables are set

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend

### No predictions showing
- Verify OpenWeatherMap API key is correct
- Check API key is active in OpenWeatherMap dashboard
- Check browser console for errors

### MongoDB connection error
- Verify MongoDB Atlas IP whitelist includes your IP
- Check connection string format
- Verify database user credentials

## Next Steps

1. **Customize Predictions**: Edit `backend/services/predictionService.js`
2. **Add Features**: See `PROJECT_PLAN.md` for roadmap
3. **Deploy**: Follow `DEPLOYMENT.md` for hosting
4. **Enhance AI**: Integrate more advanced ML models

## Need Help?

- Check `DEPLOYMENT.md` for deployment issues
- See `docs/API_DOCUMENTATION.md` for API details
- Review `PROJECT_PLAN.md` for project structure

## Common Issues

**Issue**: `Cannot find module` errors
**Solution**: Run `npm install` in both frontend and backend

**Issue**: CORS errors
**Solution**: Ensure `FRONTEND_URL` is set in backend `.env`

**Issue**: API rate limit exceeded
**Solution**: OpenWeatherMap free tier is 60 calls/min. Wait or upgrade API plan

**Issue**: Build errors
**Solution**: Ensure Node.js 18+ is installed. Try deleting `node_modules` and reinstalling



