# 🚀 Deployment Guide - Free Hosting Options

This guide covers how to deploy your InterviewAI application for **FREE** using various hosting platforms.

## 📦 Repository Setup (Recommended: Monorepo)

**✅ Use 1 Repository (Monorepo)** - Recommended because:
- Easier to manage and sync frontend/backend
- Single deployment workflow
- Shared code/types can be in root
- Simpler CI/CD setup

### Step 1: Initialize Git Repository

```bash
cd c:\interviewAI

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: InterviewAI MERN stack application"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click **"New repository"** (or the **+** icon)
3. Repository name: `interviewAI` (or your preferred name)
4. Description: "AI-Powered Interview Preparation Web App - MERN Stack"
5. Choose **Public** (for free hosting) or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

### Step 3: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/interviewAI.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Free Hosting Options

### Option 1: Vercel (Frontend) + Render (Backend) - **RECOMMENDED** ⭐

**Why this combo:**
- ✅ Vercel: Best for React/Vite apps, automatic deployments, free SSL
- ✅ Render: Free tier for Node.js backends, easy MongoDB integration
- ✅ Both have generous free tiers
- ✅ Easy setup and automatic deployments

#### Frontend on Vercel

1. **Sign up**: Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. **Import Project**: 
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - **Root Directory**: Set to `frontend`
3. **Configure**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Environment Variables**:
   - Add `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. **Deploy**: Click "Deploy"
6. **Result**: Your frontend will be live at `https://your-app.vercel.app`

#### Backend on Render

1. **Sign up**: Go to [render.com](https://render.com) and sign up with GitHub
2. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - **Name**: `interviewai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. **Environment Variables**:
   ```
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_min_32_chars
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=production
   ```
4. **Deploy**: Click "Create Web Service"
5. **Result**: Your backend will be live at `https://your-backend.onrender.com`

**⚠️ Important**: Update frontend `VITE_API_URL` to point to your Render backend URL.

---

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend on Netlify

1. **Sign up**: [netlify.com](https://netlify.com) with GitHub
2. **Deploy**:
   - "Add new site" → "Import an existing project"
   - Connect GitHub repo
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. **Environment Variables**:
   - `VITE_API_URL` = `https://your-backend.railway.app/api`
4. **Deploy**: Your site will be live at `https://your-app.netlify.app`

#### Backend on Railway

1. **Sign up**: [railway.app](https://railway.app) with GitHub
2. **New Project** → "Deploy from GitHub repo"
3. **Configure**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Environment Variables**: Same as Render
5. **Deploy**: Your backend will be live at `https://your-backend.railway.app`

---

### Option 3: All on Render (Frontend + Backend)

1. **Frontend**: Create a "Static Site" on Render
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `frontend/dist`
2. **Backend**: Create a "Web Service" (same as Option 1)

---

## 🗄️ Free MongoDB Database

### MongoDB Atlas (Free Tier)

1. **Sign up**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**:
   - Choose "Free" tier (M0)
   - Select a region close to your backend
   - Click "Create Cluster"
3. **Database Access**:
   - Go to "Database Access"
   - Add new database user
   - Username: `interviewai-user`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
4. **Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for free hosting)
   - Or add specific IPs: `0.0.0.0/0`
5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://interviewai-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/interviewai?retryWrites=true&w=majority`

---

## 📝 Pre-Deployment Checklist

### Backend

- [ ] All environment variables set in hosting platform
- [ ] MongoDB Atlas cluster created and accessible
- [ ] CORS configured to allow frontend domain
- [ ] `NODE_ENV=production` set
- [ ] Build command: `npm run build`
- [ ] Start command: `npm start`
- [ ] Port configured (Render uses `PORT` env var)

### Frontend

- [ ] `VITE_API_URL` points to deployed backend
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] All API calls use environment variable (not hardcoded)

### Security

- [ ] Strong `JWT_SECRET` (32+ characters)
- [ ] MongoDB password is secure
- [ ] `.env` files are in `.gitignore`
- [ ] No API keys committed to GitHub
- [ ] CORS configured correctly

---

## 🔧 Backend Configuration Updates

### Update CORS in `backend/src/app.ts`

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
    'https://your-frontend.netlify.app',
    // Add all your frontend URLs
  ],
  credentials: true
}));
```

### Update Frontend API URL

In `frontend/.env.production` (create this file):
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

Or set it in your hosting platform's environment variables.

---

## 🚀 Deployment Steps Summary

### Quick Deploy (Vercel + Render)

1. **Push to GitHub** ✅
2. **Deploy Backend on Render**:
   - Connect GitHub repo
   - Set root directory: `backend`
   - Add environment variables
   - Deploy
3. **Deploy Frontend on Vercel**:
   - Connect GitHub repo
   - Set root directory: `frontend`
   - Add `VITE_API_URL` = your Render backend URL
   - Deploy
4. **Update Backend CORS** with Vercel URL
5. **Test**: Visit your Vercel URL and test the app!

---

## 📊 Free Tier Limits

### Vercel
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Free SSL
- ✅ Custom domains

### Render
- ✅ 750 hours/month (enough for 24/7)
- ✅ Free SSL
- ✅ Sleeps after 15 min inactivity (wakes on request)
- ⚠️ First request after sleep takes ~30 seconds

### Netlify
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Free SSL

### Railway
- ✅ $5 free credit/month
- ✅ Pay-as-you-go after credit
- ✅ No sleep (always on)

### MongoDB Atlas
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Perfect for development/small apps

---

## 🎯 Recommended Setup for Production

**Best Free Combo:**
1. **Frontend**: Vercel (best performance, instant deploys)
2. **Backend**: Render (generous free tier, easy setup)
3. **Database**: MongoDB Atlas (free tier)

**Alternative:**
1. **Frontend**: Netlify
2. **Backend**: Railway (if you want always-on, uses $5 credit)
3. **Database**: MongoDB Atlas

---

## 🔄 Continuous Deployment

Both Vercel and Render automatically deploy when you push to GitHub:
- Push to `main` branch → Auto-deploy
- Push to other branches → Preview deployments (Vercel)

---

## 📱 Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS instructions

### Render
1. Go to Service Settings → Custom Domains
2. Add your domain
3. Update DNS records

---

## 🐛 Troubleshooting

### Backend not connecting
- Check CORS settings include frontend URL
- Verify `VITE_API_URL` in frontend
- Check backend logs on hosting platform

### MongoDB connection issues
- Verify connection string in environment variables
- Check Network Access allows your IP
- Ensure password is URL-encoded if it has special characters

### Build failures
- Check Node.js version (should be 18+)
- Verify all dependencies in `package.json`
- Check build logs on hosting platform

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Railway Documentation](https://docs.railway.app/)

---

**🎉 You're all set! Your app will be live and accessible worldwide for FREE!**
