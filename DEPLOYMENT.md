# Deployment Guide

This guide covers deploying the AI-Powered Disaster Preparedness Tool to various hosting platforms.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier) or local MongoDB
- OpenWeatherMap API key (free tier available)

## Option 1: Render (Recommended)

### Backend Deployment

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: disaster-prep-backend
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Plan**: Free
   
4. **Environment Variables**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   OPENWEATHER_API_KEY=your_openweather_api_key
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

5. **Deploy Frontend**
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: disaster-prep-frontend
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/build`
   
6. **Frontend Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

### Render Deployment URLs
- Backend: `https://disaster-prep-backend.onrender.com`
- Frontend: `https://disaster-prep-frontend.onrender.com`

---

## Option 2: Vercel (Frontend) + Railway (Backend)

### Railway Backend Deployment

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js
   - Update start command: `cd backend && npm start`

3. **Environment Variables**
   Add in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   OPENWEATHER_API_KEY=your_openweather_api_key
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Get Railway URL**
   - Railway will provide a URL like: `https://your-app.railway.app`

### Vercel Frontend Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

---

## Option 3: Heroku (Full Stack)

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create disaster-prep-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment

1. **Create Frontend App**
   ```bash
   heroku create disaster-prep-frontend --buildpack https://github.com/mars/create-react-app-buildpack.git
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set REACT_APP_API_URL=https://disaster-prep-backend.herokuapp.com
   ```

3. **Deploy**
   ```bash
   git subtree push --prefix frontend heroku main
   ```

---

## MongoDB Atlas Setup

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to you

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

4. **Allow Network Access**
   - In Network Access, add IP `0.0.0.0/0` (allow all) for development
   - Or add your hosting provider's IP ranges

---

## OpenWeatherMap API Setup

1. **Create Account**
   - Go to https://openweathermap.org/api
   - Sign up for free

2. **Get API Key**
   - Go to API keys section
   - Generate new key
   - Free tier: 60 calls/minute

3. **Add to Environment Variables**
   - Add `OPENWEATHER_API_KEY` to your backend environment variables

---

## Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Disaster Preparedness API is running",
  "timestamp": "2024-..."
}
```

### Test Predictions Endpoint
```bash
curl "https://your-backend-url.onrender.com/api/disasters/predict?lat=40.7128&lon=-74.0060"
```

---

## Troubleshooting

### Backend Issues

1. **Connection Refused**
   - Check MongoDB Atlas IP whitelist
   - Verify MONGODB_URI is correct

2. **Port Error**
   - Render uses PORT environment variable
   - Update server.js to use `process.env.PORT`

3. **API Key Errors**
   - Verify OPENWEATHER_API_KEY is set
   - Check API key is active in OpenWeatherMap dashboard

### Frontend Issues

1. **CORS Errors**
   - Ensure FRONTEND_URL is set in backend
   - Check CORS middleware is configured

2. **API Calls Failing**
   - Verify REACT_APP_API_URL is correct
   - Check backend URL is accessible

3. **Build Errors**
   - Check Node version compatibility
   - Review build logs in hosting platform

---

## Custom Domain Setup

### Render
1. Go to your service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

### Vercel
1. Go to project → Settings → Domains
2. Add your domain
3. Configure DNS as shown

---

## Monitoring

- **Render**: Built-in metrics dashboard
- **Vercel**: Analytics in dashboard
- **Railway**: Metrics in project dashboard

---

## Cost Estimate

### Free Tiers
- **Render**: Free tier available (limited)
- **Vercel**: Free tier for frontend
- **Railway**: $5/month free credit
- **MongoDB Atlas**: Free tier (512MB)
- **OpenWeatherMap**: Free tier (60 calls/min)

### Total Monthly Cost: **$0-5** (mostly free tier options)

---

## Next Steps

1. Set up monitoring and alerts
2. Configure CI/CD pipeline
3. Add error tracking (Sentry)
4. Set up automated backups
5. Configure rate limiting
6. Add SSL certificates (usually automatic)



