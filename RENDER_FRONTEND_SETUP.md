# Deploy Frontend to Render - Step-by-Step Guide

## Quick Start Guide

### Step 1: Get Your Backend URL

First, make sure your backend is deployed on Railway and get its URL:
- Example: `https://disaster-prep-backend.up.railway.app`
- Test it: `https://disaster-prep-backend.up.railway.app/api/health`

### Step 2: Deploy Frontend on Render

#### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - https://render.com/dashboard
   - Sign in with GitHub

2. **Create New Static Site**
   - Click "New +" button
   - Select "Static Site"

3. **Connect Repository**
   - Click "Connect GitHub"
   - Select your repository
   - Click "Connect"

4. **Configure Settings**

   **Basic Settings:**
   - **Name:** `disaster-prep-frontend` (or your choice)
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `frontend` ⚠️ **IMPORTANT!**
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

   **Environment Variables:**
   - Click "Add Environment Variable"
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-name.up.railway.app/api`
     - Replace with your actual Railway backend URL
     - **Must include `/api` at the end!**

5. **Deploy**
   - Click "Create Static Site"
   - Wait 2-3 minutes for build

#### Option B: Using render.yaml (Blueprint)

1. **Push render.yaml to GitHub**
   - Already configured in your repo

2. **Go to Render Dashboard**
   - Click "New +" → "Blueprint"
   - Select your repository
   - Render will detect `render.yaml`

3. **Add Environment Variable**
   - Go to your frontend service → Environment
   - Add `REACT_APP_API_URL` with your backend URL + `/api`

4. **Deploy**
   - Render will deploy automatically

### Step 3: Get Your Frontend URL

After deployment:
- Render provides URL: `https://disaster-prep-frontend.onrender.com`
- Copy this URL

### Step 4: Update Backend with Frontend URL

1. **Go to Railway Dashboard**
   - Your backend service → Variables

2. **Update FRONTEND_URL**
   ```
   FRONTEND_URL=https://disaster-prep-frontend.onrender.com
   ```
   - Replace with your actual Render frontend URL
   - Railway will auto-redeploy

### Step 5: Test Everything

1. **Test Frontend:**
   - Open: `https://disaster-prep-frontend.onrender.com`
   - Should load your app

2. **Test Backend Connection:**
   - Open browser console (F12)
   - Try getting predictions
   - Should connect to Railway backend

3. **Test All Features:**
   - Dashboard predictions
   - Map view
   - Predictions page
   - Plan generator
   - Alerts

## Configuration Details

### Frontend Environment Variable (Render)

```
REACT_APP_API_URL=https://your-backend-name.up.railway.app/api
```

**Important:**
- Must include `/api` at the end
- No trailing slash after `/api`
- Use `https://` (not `http://`)

### Backend Environment Variable (Railway)

```
FRONTEND_URL=https://disaster-prep-frontend.onrender.com
```

**Important:**
- Use your actual Render frontend URL
- No trailing slash
- Use `https://` (not `http://`)

## Troubleshooting

### Issue: Frontend can't connect to backend

**Symptoms:**
- "Cannot connect to server" error
- CORS errors in console
- Network errors

**Solutions:**
1. Check `REACT_APP_API_URL` includes `/api`
2. Verify backend URL is correct
3. Test backend health: `https://your-backend.railway.app/api/health`
4. Check `FRONTEND_URL` is set in Railway backend
5. Redeploy frontend after fixing environment variable

### Issue: CORS errors

**Symptoms:**
- "Access-Control-Allow-Origin" errors
- Requests blocked by browser

**Solutions:**
1. Update `FRONTEND_URL` in Railway with your Render URL
2. Backend will auto-redeploy
3. CORS should work after redeploy

### Issue: Build fails on Render

**Symptoms:**
- Build logs show errors
- Deployment fails

**Solutions:**
1. Check Node version (use 18 or 20)
2. Verify `package.json` has correct scripts
3. Check Root Directory is set to `frontend`
4. Verify Build Command: `npm install && npm run build`
5. Check Publish Directory is `build`

### Issue: Blank page after deployment

**Symptoms:**
- Frontend loads but shows blank page
- No errors visible

**Solutions:**
1. Check browser console (F12) for errors
2. Verify `REACT_APP_API_URL` is set correctly
3. Check build logs for warnings
4. Try rebuilding frontend

## Quick Checklist

- [ ] Backend deployed on Railway
- [ ] Backend URL copied
- [ ] Render account created
- [ ] Static site created
- [ ] Repository connected
- [ ] Root directory: `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `build`
- [ ] `REACT_APP_API_URL` added (with `/api`)
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied
- [ ] `FRONTEND_URL` updated in Railway
- [ ] Frontend loads correctly
- [ ] Can connect to backend
- [ ] Predictions work

## Example Configuration

### Render Frontend Settings

```
Name: disaster-prep-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
Environment Variable:
  REACT_APP_API_URL=https://disaster-prep-backend.up.railway.app/api
```

### Railway Backend Settings

```
Root Directory: backend
Start Command: npm start
Environment Variables:
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=mongodb+srv://wanyehowa0:gosg2407@cluster0.kmzxbqp.mongodb.net/weather?retryWrites=true&w=majority
  OPENWEATHER_API_KEY=3cc2e41da12e73190e2934e14407907b
  FRONTEND_URL=https://disaster-prep-frontend.onrender.com
  USE_ML_MODELS=false
```

## Your Final URLs

- **Backend:** `https://your-backend-name.up.railway.app`
- **Frontend:** `https://disaster-prep-frontend.onrender.com`
- **API Health:** `https://your-backend-name.up.railway.app/api/health`

## Success!

Once deployed, your app will be live at:
- **Frontend:** `https://disaster-prep-frontend.onrender.com`
- **Backend:** `https://your-backend-name.up.railway.app`

Both services will be connected and working together! 🎉

