# Setup Instructions

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ npm (comes with Node.js)
- ✅ Git installed
- ✅ Code editor (VS Code recommended)
- ✅ MongoDB Atlas account (free) or local MongoDB
- ✅ OpenWeatherMap API key (free tier)

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd "AI SOFTWARE"
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment template
# On Windows (PowerShell):
Copy-Item .env.example .env

# On Mac/Linux:
cp .env.example .env

# Edit .env file with your credentials
# Windows: notepad .env
# Mac/Linux: nano .env
```

**Required .env variables:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
FRONTEND_URL=http://localhost:3000
```

### 3. Get API Keys

#### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 - Free tier)
4. Create database user
5. Whitelist IP (0.0.0.0/0 for development)
6. Get connection string
7. Replace `<password>` in connection string

#### OpenWeatherMap
1. Go to https://openweathermap.org/api
2. Sign up for free account
3. Verify email
4. Go to API keys section
5. Copy your API key

### 4. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Copy environment template
# Windows:
Copy-Item .env.example .env

# Mac/Linux:
cp .env.example .env

# Edit .env file
# Windows: notepad .env
# Mac/Linux: nano .env
```

**Required .env variable:**
```env
REACT_APP_API_URL=http://localhost:5000
```

### 5. Start Development Servers

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

Expected output:
```
MongoDB connected successfully
Server is running on port 5000
Environment: development
```

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view disaster-prep-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### 6. Verify Installation

1. **Check Backend Health**
   - Open browser: http://localhost:5000/api/health
   - Should see: `{"status":"OK",...}`

2. **Check Frontend**
   - Open browser: http://localhost:3000
   - Should see Disaster Preparedness Dashboard

3. **Test Predictions**
   - Enter coordinates: `40.7128, -74.0060` (New York)
   - Click "Get Predictions"
   - Should see disaster risk predictions

## Troubleshooting

### Backend Issues

**Problem**: Port 5000 already in use
```bash
# Change PORT in backend/.env to another port (e.g., 5001)
# Update REACT_APP_API_URL in frontend/.env accordingly
```

**Problem**: MongoDB connection failed
- Verify connection string format
- Check IP whitelist includes your IP
- Verify database user credentials
- Test connection in MongoDB Atlas dashboard

**Problem**: OpenWeatherMap API errors
- Verify API key is correct
- Check API key is activated (may take 2 hours after signup)
- Verify you haven't exceeded rate limits (60/min for free tier)

### Frontend Issues

**Problem**: Cannot connect to backend
- Verify backend is running on correct port
- Check `REACT_APP_API_URL` matches backend port
- Verify CORS is configured in backend

**Problem**: Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version: `node --version` (should be 18+)

**Problem**: Blank page
- Check browser console for errors
- Verify all dependencies installed
- Check network tab for failed API calls

### Common Errors

**Error**: `Cannot find module`
- Solution: Run `npm install` in the respective directory

**Error**: `EADDRINUSE` (Address already in use)
- Solution: Change port in `.env` or kill process using that port

**Error**: `MongoNetworkError`
- Solution: Check internet connection and MongoDB Atlas IP whitelist

**Error**: `401 Unauthorized` (OpenWeatherMap)
- Solution: Verify API key and ensure it's activated

## Windows-Specific Notes

### PowerShell Issues
If you encounter PowerShell execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Path Issues
Use forward slashes or escaped backslashes:
```bash
# Good:
cd backend
cd frontend

# Avoid:
cd backend\..
```

## Next Steps

1. ✅ **Test the Application**
   - Try all features
   - Generate a response plan
   - Check alerts

2. ✅ **Customize**
   - Edit prediction logic in `backend/services/predictionService.js`
   - Customize UI components
   - Add your branding

3. ✅ **Deploy**
   - Follow `DEPLOYMENT.md` for hosting instructions
   - Deploy to Render, Vercel, or Railway
   - Get your live URL!

## Need Help?

- **Quick Start**: See `QUICK_START.md`
- **Deployment**: See `DEPLOYMENT.md`
- **API Docs**: See `docs/API_DOCUMENTATION.md`
- **Project Plan**: See `PROJECT_PLAN.md`

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **Logs**: Check terminal output for errors
3. **Browser DevTools**: Use Network tab to debug API calls
4. **Postman**: Test API endpoints directly
5. **MongoDB Compass**: Visual tool for database management

## Environment Variables Checklist

### Backend (.env)
- [ ] `PORT` set (default: 5000)
- [ ] `MONGODB_URI` configured
- [ ] `OPENWEATHER_API_KEY` set
- [ ] `FRONTEND_URL` set to http://localhost:3000

### Frontend (.env)
- [ ] `REACT_APP_API_URL` set to http://localhost:5000

---

**Ready to go!** Start developing and deploying your AI-powered disaster preparedness tool! 🚀



