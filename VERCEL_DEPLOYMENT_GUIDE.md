# 🚀 Vercel Deployment Guide

This guide will help you deploy your Arbab Portfolio MERN application to Vercel with proper routing and no 404 errors on refresh.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Option 1: Full Stack Deployment](#option-1-full-stack-deployment)
4. [Option 2: Separate Frontend/Backend](#option-2-separate-frontendbackend)
5. [Environment Variables Setup](#environment-variables-setup)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before deploying to Vercel, ensure you have:

- [x] A Vercel account (sign up at [vercel.com](https://vercel.com))
- [x] GitHub repository connected to Vercel
- [x] Production-ready environment variables
- [x] All security fixes implemented (completed in previous steps)

---

## 🎯 Deployment Options

### Option 1: Full Stack Deployment (Recommended)
Deploy both frontend and backend as a single Vercel project.

### Option 2: Separate Frontend/Backend
Deploy frontend to Vercel and backend to a different service (Railway, Heroku, etc.).

---

## 🚀 Option 1: Full Stack Deployment

### Step 1: Update Root `vercel.json`

The main `vercel.json` file has been configured with:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/socket.io/(.*)",
      "dest": "/backend/server.js",
      "ws": true
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ],
  "rewrites": [
    {
      "source": "/((?!api|socket\\.io).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Configure Frontend API URL

Update the frontend API configuration to work with production:

```javascript
// frontend/src/utils/api.js
const API_URL = process.env.NODE_ENV === 'production'
  ? '/api'  // This will be handled by Vercel routing
  : 'http://localhost:5000/api';
```

### Step 3: Deploy to Vercel

1. **Connect GitHub Repository:**
   ```bash
   # Make sure your code is pushed to GitHub
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Import Project in Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the `vercel.json` configuration

3. **Configure Environment Variables:**
   In Vercel dashboard → Settings → Environment Variables, add:
   ```
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   JWT_REFRESH_SECRET=your_production_refresh_secret
   FRONTEND_URL=https://your-domain.vercel.app
   CORS_ORIGIN=https://your-domain.vercel.app
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ADMIN_EMAIL=admin@your-domain.com
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

---

## 🚀 Option 2: Separate Frontend/Backend

### Step 1: Deploy Frontend to Vercel

1. **Use frontend `vercel.json`:**
   - The `frontend/vercel.json` is configured for frontend-only deployment
   - Contains proper SPA routing with rewrites

2. **Update API Configuration:**
   ```javascript
   // frontend/src/utils/api.js
   const API_URL = 'https://your-backend-domain.com/api';
   ```

3. **Deploy Frontend:**
   ```bash
   # From root directory
   vercel --prod frontend
   ```

### Step 2: Deploy Backend Separately

Deploy your backend to a service like:
- Railway
- Heroku
- DigitalOcean
- AWS
- Or any Node.js hosting service

---

## 🔧 Environment Variables Setup

### Required Environment Variables

```env
# Server Configuration
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

# JWT Security
JWT_SECRET=<64_character_secret>
JWT_REFRESH_SECRET=<64_character_secret>
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Frontend URL
FRONTEND_URL=https://your-domain.vercel.app
CORS_ORIGIN=https://your-domain.vercel.app

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Configuration
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=<strong_password>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### How to Generate Secrets

```bash
# Generate secure secrets
node backend/scripts/setup-secrets.js
```

---

## ✅ Post-Deployment Verification

### Step 1: Check Routing

Test these URLs to ensure routing works:

1. **Home Page:** `https://your-domain.vercel.app`
2. **Blog Page:** `https://your-domain.vercel.app/blog`
3. **Admin Dashboard:** `https://your-domain.vercel.app/admin`
4. **Individual Blog Post:** `https://your-domain.vercel.app/blog/sample-post`

### Step 2: Test API Endpoints

```bash
# Test API is working
curl https://your-domain.vercel.app/api/projects
curl https://your-domain.vercel.app/api/blogs
```

### Step 3: Test Refresh Behavior

- Navigate to different pages
- Refresh the browser (F5 or Cmd+R)
- Ensure no 404 errors occur

### Step 4: Test Functionality

- Test user registration/login
- Test blog CRUD operations
- Test contact form
- Test file uploads
- Test Socket.io functionality

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. 404 Errors on Refresh

**Problem:** Getting 404 errors when refreshing pages
**Solution:** Ensure rewrites are properly configured in `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/((?!api|socket\\.io).*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 2. API Connection Errors

**Problem:** Frontend can't connect to backend API
**Solution:** Check CORS configuration and API URL

```javascript
// In frontend/src/utils/api.js
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
```

#### 3. Build Failures

**Problem:** Vercel build fails
**Solution:** Check `package.json` build scripts

```json
{
  "scripts": {
    "build": "vite build",
    "start": "vite preview"
  }
}
```

#### 4. Socket.io Connection Issues

**Problem:** Real-time features not working
**Solution:** Ensure WebSocket routing is configured

```json
{
  "routes": [
    {
      "src": "/socket.io/(.*)",
      "dest": "/backend/server.js",
      "ws": true
    }
  ]
}
```

#### 5. Environment Variables Not Working

**Problem:** Environment variables not accessible
**Solution:** Check they're properly set in Vercel dashboard

1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Add all required variables
3. Redeploy the application

### Debugging Tips

1. **Check Vercel Logs:**
   - Go to Vercel dashboard → Functions → Logs
   - Look for build errors and runtime errors

2. **Local Testing:**
   ```bash
   # Test build locally
   npm run build

   # Test production build locally
   npm run preview
   ```

3. **Network Tab:**
   - Use browser DevTools Network tab
   - Check for failed API requests
   - Verify CORS headers

4. **Console Errors:**
   - Check browser console for JavaScript errors
   - Look for routing issues

---

## 🎉 Deployment Checklist

### Before Deployment

- [ ] All environment variables configured
- [ ] Production database set up
- [ ] Secrets generated and secure
- [ ] CORS configured for production domain
- [ ] `vercel.json` configuration tested
- [ ] Frontend API URL updated
- [ ] Build process tested locally

### After Deployment

- [ ] All pages load without 404 errors
- [ ] Refresh functionality works correctly
- [ ] API endpoints respond correctly
- [ ] User authentication works
- [ ] File uploads work
- [ ] Socket.io functionality works
- [ ] Mobile responsive design works
- [ ] HTTPS properly configured
- [ ] Security headers are present

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [React Router on Vercel](https://vercel.com/guides/deploying-a-react-app)
- [MERN Stack Deployment](https://vercel.com/guides/deploying-a-mern-app)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

**🎯 Your Arbab Portfolio is now ready for production deployment on Vercel!**

The configuration ensures:
- ✅ No 404 errors on page refresh
- ✅ Proper API routing
- ✅ WebSocket support for real-time features
- ✅ Production security headers
- ✅ Optimized caching strategy
- ✅ Mobile responsive design