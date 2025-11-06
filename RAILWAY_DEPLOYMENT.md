# Railway Deployment Fix

## The Problem
Railway is trying to use a Dockerfile but can't find npm. This means Railway isn't detecting Node.js properly.

## Solution: Configure Railway Settings

### In Railway Dashboard:

1. **Go to your service → Settings → Deploy**

2. **Set Root Directory:**
   - Root Directory: `backend`
   - This tells Railway where your Node.js app is

3. **Set Build Command:**
   - Build Command: `npm install`
   - (Leave blank if auto-detected)

4. **Set Start Command:**
   - Start Command: `npm start`
   - (This will run from the backend folder)

5. **Save and Redeploy**

## Alternative: Use railway.json (Already Updated)

The railway.json file has been updated with:
```json
{
  "deploy": {
    "startCommand": "cd backend && npm start"
  }
}
```

But Railway might still need the Root Directory set to `backend` in the dashboard.

## Quick Fix Steps:

1. Go to Railway Dashboard
2. Click your service
3. Go to Settings → Deploy
4. Set **Root Directory** to: `backend`
5. Set **Start Command** to: `npm start`
6. Click "Save"
7. Railway will automatically redeploy

This should fix the "npm: command not found" error.

