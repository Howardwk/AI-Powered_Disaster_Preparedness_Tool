# Deploy Frontend to Render - Complete Guide

## Prerequisites

- Backend deployed on Railway (or another platform)
- Backend URL: `https://your-backend-name.up.railway.app`
- GitHub repository with your code

## Step-by-Step Instructions

### Step 1: Prepare Your Code

✅ **Already Done:**
- `render.yaml` configured for frontend
- Frontend uses `REACT_APP_API_URL` environment variable
- Build configuration ready

### Step 2: Create Render Account

1. **Go to Render**
   - https://render.com
   - Sign up with GitHub (recommended)

2. **Authorize Render**
   - Allow Render to access your GitHub repositories

### Step 3: Deploy Frontend as Static Site

1. **Go to Render Dashboard**
   - Click "New +"
   - Select "Static Site"

2. **Connect Repository**
   - Select "Connect GitHub"
   - Choose your repository
   - Click "Connect"

3. **Configure Build Settings**

   **Basic Settings:**
   - **Name:** `disaster-prep-frontend` (or your preferred name)
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

   **Advanced Settings (if needed):**
   - **Node Version:** 18 or 20 (LTS)
   - **Auto-Deploy:** Yes (deploys on every push)

4. **Add Environment Variable**

   Click "Add Environment Variable" and add:
   
   ```
   Key: REACT_APP_API_URL
   Value: https://your-backend-name.up.railway.app/api
   ```
   
   **Important:**
   - Replace `your-backend-name.up.railway.app` with your actual Railway backend URL
   - **Must include `/api` at the end!**
   - Example: `https://disaster-prep-backend.up.railway.app/api`

5. **Deploy**
   - Click "Create Static Site"
   - Render will start building
   - Wait 2-3 minutes for build to complete

### Step 4: Get Your Frontend URL

After deployment:
- Render provides a URL like: `https://disaster-prep-frontend.onrender.com`
- Copy this URL

### Step 5: Update Backend with Frontend URL

1. **Go to Railway Dashboard**
   - Your backend service → Variables
   - Update `FRONTEND_URL`:
     ```
     FRONTEND_URL=https://disaster-prep-frontend.onrender.com
     ```
   - Railway will auto-redeploy

### Step 6: Test Your Deployment

1. **Open Frontend URL**
   - Go to: `https://disaster-prep-frontend.onrender.com`
   - Should load your React app

2. **Test Predictions**
   - Enter coordinates (e.g., `-1.2921, 36.8219`)
   - Click "Get Predictions"
   - Should connect to backend and show predictions

3. **Check Browser Console**
   - Press F12 → Console tab
   - Look for any API errors
   - Should see successful API calls

## Configuration Summary

### Frontend Environment Variable (Render)

```
REACT_APP_API_URL=https://your-backend-name.up.railway.app/api
```

### Backend Environment Variable (Railway)

```
FRONTEND_URL=https://disaster-prep-frontend.onrender.com
```

## Troubleshooting

### Issue: Frontend can't connect to backend

**Check:**
1. `REACT_APP_API_URL` includes `/api` at the end
2. Backend URL is correct (no trailing slash before `/api`)
3. Backend is running and accessible

**Test Backend:**
```
https://your-backend-name.up.railway.app/api/health
```
Should return: `{"status":"OK",...}`

**Fix:**
- Update `REACT_APP_API_URL` in Render
- Redeploy frontend

### Issue: CORS errors

**Check:**
- Backend has `FRONTEND_URL` set correctly
- CORS is enabled in backend (already done)

**Fix:**
- Update `FRONTEND_URL` in Railway with your Render frontend URL
- Redeploy backend

### Issue: Build fails on Render

**Check:**
- Node version is compatible (use 18 or 20)
- Build command is correct: `npm install && npm run build`
- Root directory is set to `frontend`

**Fix:**
- Check Render build logs
- Verify `package.json` has correct scripts

### Issue: Blank page after deployment

**Check:**
- Build completed successfully
- No JavaScript errors in console
- `REACT_APP_API_URL` is set correctly

**Fix:**
- Check browser console for errors
- Verify environment variable is set
- Rebuild frontend

## Quick Checklist

- [ ] Render account created
- [ ] Static site created
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `build`
- [ ] `REACT_APP_API_URL` environment variable added (with `/api`)
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied
- [ ] `FRONTEND_URL` updated in Railway backend
- [ ] Frontend loads correctly
- [ ] Predictions work (can connect to backend)

## Your URLs (After Deployment)

- **Backend (Railway):** `https://your-backend-name.up.railway.app`
- **Frontend (Render):** `https://disaster-prep-frontend.onrender.com`
- **API Health:** `https://your-backend-name.up.railway.app/api/health`

## Environment Variables Reference

### Render (Frontend)

```
REACT_APP_API_URL=https://your-backend-name.up.railway.app/api
```

### Railway (Backend)

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
OPENWEATHER_API_KEY=3cc2e41da12e73190e2934e14407907b
FRONTEND_URL=https://disaster-prep-frontend.onrender.com
USE_ML_MODELS=false
```

## Success Indicators

✅ Frontend loads without errors
✅ No CORS errors in console
✅ Predictions endpoint works
✅ Can fetch predictions from backend
✅ All pages load correctly
✅ Map visualization works

## Next Steps

1. Test all features:
   - Dashboard predictions
   - Map view
   - Predictions page
   - Plan generator
   - Alerts

2. Monitor:
   - Render build logs
   - Railway backend logs
   - Browser console for errors

3. Optimize:
   - Enable caching if needed
   - Set up custom domain (optional)
   - Monitor performance

