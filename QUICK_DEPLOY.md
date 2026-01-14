# ⚡ Quick Deploy Guide - 5 Minutes

## 🎯 Fastest Free Deployment

### Step 1: Push to GitHub (2 min)

```bash
cd c:\interviewAI

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/interviewAI.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend on Render (2 min)

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repo
4. **Settings**:
   - **Name**: `interviewai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables** (click "Add Environment Variable"):
   ```
   PORT=10000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/interviewai
   JWT_SECRET=your_32_char_secret_here
   GEMINI_API_KEY=your_gemini_key
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. Click **"Create Web Service"**
7. **Wait 5-10 minutes** for first deployment
8. **Copy your backend URL**: `https://your-backend.onrender.com`

### Step 3: Deploy Frontend on Vercel (1 min)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo
4. **Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
6. Click **"Deploy"**
7. **Copy your frontend URL**: `https://your-app.vercel.app`

### Step 4: Update Backend CORS (30 sec)

1. Go back to Render dashboard
2. Click on your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` = `https://your-app.vercel.app`
5. **Manual Deploy** → **"Deploy latest commit"**

### Step 5: Get MongoDB Atlas (Free) (2 min)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. **Create Free Cluster** (M0)
4. **Database Access** → Create user → Save password
5. **Network Access** → Allow from anywhere (`0.0.0.0/0`)
6. **Connect** → Copy connection string
7. Replace `<password>` with your password
8. Update `MONGODB_URI` in Render environment variables

### Step 6: Get Gemini API Key (1 min)

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy the key
5. Update `GEMINI_API_KEY` in Render environment variables

---

## ✅ Done! Your app is live!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

**Test it**: Visit your Vercel URL and create an account!

---

## 🎉 That's it! Your app is deployed for FREE!

**Total time**: ~10 minutes
**Cost**: $0/month

---

## 📝 Notes

- **Render backend sleeps** after 15 min inactivity (wakes on first request)
- **First request** after sleep takes ~30 seconds
- **MongoDB Atlas** free tier: 512MB storage (plenty for development)
- **Vercel** has unlimited deployments and 100GB bandwidth/month

---

## 🔄 Auto-Deployments

Both platforms auto-deploy when you push to GitHub:
- Push to `main` → Auto-deploy both frontend and backend
- No manual deployment needed!

---

## 🐛 Troubleshooting

**Backend not working?**
- Check Render logs
- Verify all environment variables are set
- Check MongoDB connection string

**Frontend can't connect?**
- Verify `VITE_API_URL` is correct
- Check backend CORS settings
- Check browser console for errors

**Need help?** Check `DEPLOYMENT.md` for detailed troubleshooting.
