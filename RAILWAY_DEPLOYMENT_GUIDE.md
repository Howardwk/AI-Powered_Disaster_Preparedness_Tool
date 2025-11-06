# Railway Deployment Guide - Complete Setup

## Step-by-Step Deployment Instructions

### Step 1: Prepare Your Code

✅ **Already Done:**
- Root route (`/`) added - no more "Route not found" on root
- MongoDB database name updated to "weather"
- Health check endpoint enhanced

### Step 2: Set Up Railway

1. **Go to Railway Dashboard**
   - https://railway.app/dashboard
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Railway will auto-detect Node.js
   - **Set Root Directory:** `backend`
   - **Start Command:** `npm start` (or leave blank, auto-detected)

### Step 3: Add Environment Variables

Go to your service → **Variables** tab → Add these:

#### Required Variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
OPENWEATHER_API_KEY=3cc2e41da12e73190e2934e14407907b
FRONTEND_URL=https://your-frontend-url.vercel.app
USE_ML_MODELS=false
```

**Important Notes:**
- MongoDB URI ends with `/weather` (your database name)
- `FRONTEND_URL` - Update after deploying frontend
- `USE_ML_MODELS=false` - Saves memory, use rule-based predictions

### Step 4: Deploy Frontend to Vercel

1. **Go to Vercel**
   - https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your repository

3. **Configure Frontend**
   - Framework: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `build` (auto-detected)

4. **Add Environment Variable**
   - Go to Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api
     ```
   - **Important:** Include `/api` at the end!

5. **Deploy**
   - Click "Deploy"
   - Copy your frontend URL

### Step 5: Update Backend with Frontend URL

1. **Go back to Railway**
   - Your backend service → Variables
   - Update `FRONTEND_URL`:
     ```
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - Railway will auto-redeploy

### Step 6: Test Your Deployment

#### Test Backend:

1. **Root Endpoint:**
   ```
   https://your-backend-url.railway.app/
   ```
   Should return: API information

2. **Health Check:**
   ```
   https://your-backend-url.railway.app/api/health
   ```
   Should return: `{"status":"OK","mongodb":"connected",...}`

3. **Predictions:**
   ```
   https://your-backend-url.railway.app/api/disasters/predict?lat=-1.2921&lon=36.8219
   ```
   Should return: Predictions data

#### Test Frontend:

1. Open your Vercel URL
2. Try getting predictions
3. Should work if backend is running

## Troubleshooting

### Issue: "Route not found" on root URL

**Fixed!** I've added a root route. Now `/` returns API information.

### Issue: MongoDB connection fails

**Check:**
1. Connection string ends with `/weather`
2. MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)
3. Username and password are correct

**Fix:**
```
MONGODB_URI=mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
```

### Issue: Frontend can't connect to backend

**Check:**
1. `REACT_APP_API_URL` includes `/api` at the end
2. Backend URL is correct (no trailing slash)
3. CORS is enabled (already done)

**Example:**
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

### Issue: Server won't start

**Check Railway Logs:**
1. Go to Deployments tab
2. Click latest deployment
3. Check for errors

**Common Issues:**
- Missing environment variables
- `npm install` failed
- Port not set correctly

## Quick Checklist

- [ ] Railway project created
- [ ] Root Directory set to `backend`
- [ ] Environment variables added:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI` (with `/weather` database)
  - [ ] `OPENWEATHER_API_KEY`
  - [ ] `FRONTEND_URL` (placeholder, update later)
  - [ ] `USE_ML_MODELS=false`
- [ ] Backend deployed successfully
- [ ] Root endpoint works: `/`
- [ ] Health check works: `/api/health`
- [ ] Predictions work: `/api/disasters/predict`
- [ ] Frontend deployed to Vercel
- [ ] `REACT_APP_API_URL` set correctly (with `/api`)
- [ ] Frontend can connect to backend
- [ ] `FRONTEND_URL` updated in Railway

## Your URLs (After Deployment)

- **Backend:** `https://your-app-name.up.railway.app`
- **Frontend:** `https://your-app-name.vercel.app`
- **API Health:** `https://your-app-name.up.railway.app/api/health`

## MongoDB Connection String

Your connection string should be:
```
mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
```

**Key Points:**
- Database name: `weather` (not `disaster-prep`)
- Includes connection options: `?retryWrites=true&w=majority`
- No spaces in the connection string

## Success Indicators

✅ Backend root URL (`/`) returns API info
✅ Health check shows MongoDB connected
✅ Predictions endpoint returns data
✅ Frontend can fetch predictions
✅ No "Route not found" errors

