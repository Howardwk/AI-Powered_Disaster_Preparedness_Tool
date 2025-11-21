# Complete Render Deployment Guide - Backend + Frontend

## Deploy Both Backend and Frontend on Render

### Step 1: Prepare Your Code

✅ **Already Done:**
- `render.yaml` configured for both services
- Backend routes configured
- Frontend API configuration ready

### Step 2: Create Render Account

1. **Go to Render**
   - https://render.com
   - Sign up with GitHub (recommended)

2. **Authorize Render**
   - Allow Render to access your GitHub repositories

### Step 3: Deploy Using Blueprint (Recommended)

1. **Go to Render Dashboard**
   - Click "New +"
   - Select "Blueprint"

2. **Connect Repository**
   - Select "Connect GitHub"
   - Choose your repository
   - Click "Connect"

3. **Render will detect `render.yaml`**
   - It will show both backend and frontend services
   - Click "Apply"

4. **Configure Environment Variables**

   **Backend Service:**
   - Click on `disaster-prep-backend` service
   - Go to "Environment" tab
   - Add these variables:
   
     ```
     MONGODB_URI=mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
     OPENWEATHER_API_KEY=3cc2e41da12e73190e2934e14407907b
     FRONTEND_URL=https://disaster-prep-frontend.onrender.com
     ```
     - **Note:** `FRONTEND_URL` will be set after frontend deploys

   **Frontend Service:**
   - Click on `disaster-prep-frontend` service
   - Go to "Environment" tab
   - Add this variable:
   
     ```
     REACT_APP_API_URL=https://disaster-prep-backend.onrender.com/api
     ```
     - **Note:** Replace `disaster-prep-backend` with your actual backend service name
     - **Must include `/api` at the end!**

5. **Deploy**
   - Render will deploy both services
   - Backend deploys first (takes 3-5 minutes)
   - Frontend deploys after (takes 2-3 minutes)

### Step 4: Get Your URLs

After deployment:

**Backend URL:**
- Format: `https://disaster-prep-backend.onrender.com`
- Copy this URL

**Frontend URL:**
- Format: `https://disaster-prep-frontend.onrender.com`
- Copy this URL

### Step 5: Update Environment Variables

1. **Update Frontend with Backend URL**
   - Go to Frontend service → Environment
   - Update `REACT_APP_API_URL`:
     ```
     REACT_APP_API_URL=https://disaster-prep-backend.onrender.com/api
     ```
   - Use your actual backend service name
   - Redeploy frontend

2. **Update Backend with Frontend URL**
   - Go to Backend service → Environment
   - Update `FRONTEND_URL`:
     ```
     FRONTEND_URL=https://disaster-prep-frontend.onrender.com
     ```
   - Use your actual frontend service name
   - Redeploy backend

### Step 6: Test Your Deployment

1. **Test Backend:**
   ```
   https://disaster-prep-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK",...}`

2. **Test Frontend:**
   ```
   https://disaster-prep-frontend.onrender.com
   ```
   Should load your React app

3. **Test Connection:**
   - Open frontend
   - Try getting predictions
   - Should connect to backend

## Manual Deployment (Alternative)

If you prefer to deploy services separately:

### Deploy Backend Manually

1. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure Backend:**
   - **Name:** `disaster-prep-backend`
   - **Environment:** Node
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
   OPENWEATHER_API_KEY=3cc2e41da12e73190e2934e14407907b
   FRONTEND_URL=https://disaster-prep-frontend.onrender.com
   USE_ML_MODELS=false
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment

### Deploy Frontend Manually

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect your repository

2. **Configure Frontend:**
   - **Name:** `disaster-prep-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

3. **Add Environment Variable:**
   ```
   REACT_APP_API_URL=https://disaster-prep-backend.onrender.com/api
   ```
   - Use your actual backend service name

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment

## Important Notes

### Render Free Tier Limitations

1. **Spins Down After Inactivity**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds
   - This is normal for free tier

2. **Cold Starts**
   - Backend may take 30 seconds to start
   - Frontend loads immediately (static)

3. **Always-On (Optional)**
   - Can upgrade to paid plan for always-on
   - Free tier is fine for demos/testing

### Environment Variables

**Backend (Render):**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
OPENWEATHER_API_KEY=3cc2e41da12e73190e2934e14407907b
FRONTEND_URL=https://disaster-prep-frontend.onrender.com
USE_ML_MODELS=false
```

**Frontend (Render):**
```
REACT_APP_API_URL=https://disaster-prep-backend.onrender.com/api
```

## Troubleshooting

### Issue: Backend spins down

**Solution:**
- This is normal for free tier
- First request after spin-down takes ~30 seconds
- Consider upgrading to paid plan for always-on

### Issue: Frontend can't connect to backend

**Check:**
1. `REACT_APP_API_URL` includes `/api`
2. Backend service name is correct
3. Backend is deployed and running

**Fix:**
- Update `REACT_APP_API_URL` with correct backend URL
- Redeploy frontend

### Issue: CORS errors

**Check:**
- `FRONTEND_URL` is set correctly in backend
- Frontend URL matches Render frontend URL

**Fix:**
- Update `FRONTEND_URL` in backend environment variables
- Redeploy backend

### Issue: MongoDB connection fails

**Check:**
1. Connection string ends with `/weather`
2. MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. Username and password are correct

**Fix:**
- Verify connection string format
- Check MongoDB Atlas network access

## Quick Checklist

- [ ] Render account created
- [ ] Blueprint deployed (or services deployed manually)
- [ ] Backend environment variables added
- [ ] Frontend environment variables added
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Backend URL copied
- [ ] Frontend URL copied
- [ ] `REACT_APP_API_URL` updated with backend URL
- [ ] `FRONTEND_URL` updated with frontend URL
- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] Frontend can connect to backend

## Your URLs (After Deployment)

- **Backend:** `https://disaster-prep-backend.onrender.com`
- **Frontend:** `https://disaster-prep-frontend.onrender.com`
- **API Health:** `https://disaster-prep-backend.onrender.com/api/health`

## Success!

Once deployed, your app will be live at:
- **Frontend:** `https://disaster-prep-frontend.onrender.com`
- **Backend:** `https://disaster-prep-backend.onrender.com`

Both services will be connected and working together! 🎉


