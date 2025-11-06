# Deployment Fix Guide

## Issue: "Route not found" Error

### Problem
When deploying the backend, accessing the root URL `/` returns "Route not found" error.

### Solution
I've added a root route (`/`) that now returns API information instead of an error.

## MongoDB Database Name

Your MongoDB database is named **"weather"**. I've updated the default connection string to use this.

### Connection String Format
```
mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
```

**Important:** Make sure your connection string ends with `/weather` (not `/disaster-prep`)

## Deployment Checklist

### 1. Environment Variables (Railway/Render)

Set these in your deployment platform:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
OPENWEATHER_API_KEY=3cc2e41da12e73190e2934e14407907b
FRONTEND_URL=https://your-frontend-url.vercel.app
USE_ML_MODELS=false
```

### 2. Test Endpoints

After deployment, test these URLs:

**Root URL:**
```
https://your-backend-url.railway.app/
```
Should return: API information and available endpoints

**Health Check:**
```
https://your-backend-url.railway.app/api/health
```
Should return: `{"status":"OK",...}`

**Predictions:**
```
https://your-backend-url.railway.app/api/disasters/predict?lat=-1.2921&lon=36.8219
```
Should return: Predictions data

### 3. Common Issues

#### Issue: Still getting "Route not found"
- **Solution:** Make sure you're using `/api/health` not just `/`
- **Solution:** Check that routes are registered before the 404 handler

#### Issue: MongoDB connection fails
- **Solution:** Verify `MONGODB_URI` includes `/weather` at the end
- **Solution:** Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for all IPs)

#### Issue: Server not starting
- **Solution:** Check deployment logs
- **Solution:** Verify `PORT` environment variable is set
- **Solution:** Check that `npm install` completed successfully

## Railway Deployment Steps

1. **Set Root Directory:**
   - Go to Settings → Deploy
   - Root Directory: `backend`

2. **Set Start Command:**
   - Start Command: `npm start`

3. **Add Environment Variables:**
   - Go to Variables tab
   - Add all variables listed above

4. **Deploy:**
   - Railway will auto-deploy
   - Check logs for errors

## Testing After Deployment

1. Test root endpoint: `https://your-url.railway.app/`
2. Test health: `https://your-url.railway.app/api/health`
3. Test predictions: `https://your-url.railway.app/api/disasters/predict?lat=-1.2921&lon=36.8219`

## Frontend Configuration

Update your frontend `.env`:
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

Make sure it includes `/api` at the end!

