# 📦 GitHub Setup Guide

## Quick Start: Push Your Code to GitHub

### Step 1: Initialize Git (if not done)

```bash
cd c:\interviewAI

# Check if git is initialized
git status

# If not initialized, run:
git init
```

### Step 2: Create .gitignore (Already Created ✅)

The root `.gitignore` file is already created and includes:
- `node_modules/`
- `.env` files
- Build outputs
- Uploads directory
- IDE files

### Step 3: Stage and Commit Files

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: InterviewAI - AI-Powered Interview Preparation App

Features:
- User authentication (JWT)
- AI interview question generation (Google Gemini)
- Resume builder with PDF export
- Learning Assistant with PDF upload
- AI chat, summaries, flashcards, and quizzes
- Progress tracking
- Modern responsive UI"
```

### Step 4: Create GitHub Repository

1. **Go to GitHub**: [github.com](https://github.com)
2. **Click**: "+" icon (top right) → "New repository"
3. **Repository Settings**:
   - **Name**: `interviewAI` (or your preferred name)
   - **Description**: `AI-Powered Interview Preparation Web App built with MERN stack and Google Gemini AI`
   - **Visibility**: 
     - ✅ **Public** (recommended for portfolio/showcase)
     - Or **Private** (if you want to keep it private)
   - **DO NOT** check:
     - ❌ Add a README file (we already have one)
     - ❌ Add .gitignore (we already have one)
     - ❌ Choose a license (optional, add later if needed)
4. **Click**: "Create repository"

### Step 5: Connect and Push

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/interviewAI.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you get authentication error**, use:
```bash
# Use GitHub CLI or Personal Access Token
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/interviewAI.git
```

Or use SSH:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/interviewAI.git
```

---

## 📁 Repository Structure (Monorepo)

Your repository structure will be:
```
interviewAI/
├── .gitignore          # Root gitignore
├── README.md           # Main documentation
├── DEPLOYMENT.md       # Deployment guide
├── GITHUB_SETUP.md     # This file
├── SETUP.md            # Setup instructions
│
├── frontend/           # React frontend
│   ├── .gitignore
│   ├── package.json
│   ├── src/
│   └── ...
│
└── backend/            # Node.js backend
    ├── .gitignore
    ├── package.json
    ├── src/
    └── ...
```

---

## 🔒 Security: What NOT to Commit

**Already in .gitignore:**
- ✅ `.env` files (contain secrets)
- ✅ `node_modules/` (dependencies)
- ✅ `uploads/` (user-uploaded files)
- ✅ `dist/` and `build/` (build outputs)

**Double-check before committing:**
- ❌ Never commit `.env` files
- ❌ Never commit API keys
- ❌ Never commit JWT secrets
- ❌ Never commit MongoDB connection strings with passwords

---

## 📝 Recommended: Add Environment Variable Templates

Create example files (these ARE safe to commit):

### `backend/.env.example`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interviewai
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### `frontend/.env.example`
```env
VITE_API_URL=http://localhost:5000/api
```

These help other developers know what environment variables are needed.

---

## 🌿 Branch Strategy (Optional)

For production apps, consider:

```bash
# Main branch (production-ready code)
git checkout -b main

# Development branch
git checkout -b develop

# Feature branches
git checkout -b feature/new-feature
```

---

## 📋 Pre-Push Checklist

Before pushing to GitHub:

- [ ] All `.env` files are in `.gitignore`
- [ ] No API keys or secrets in code
- [ ] `node_modules/` is ignored
- [ ] Uploads directory is ignored
- [ ] README.md is updated
- [ ] Code is tested locally
- [ ] No sensitive data in commit history

---

## 🚀 Next Steps After GitHub Setup

1. **Set up free hosting** (see `DEPLOYMENT.md`)
2. **Add repository description** on GitHub
3. **Add topics/tags** on GitHub: `mern-stack`, `react`, `nodejs`, `mongodb`, `ai`, `interview-prep`
4. **Enable GitHub Pages** (optional, for documentation)
5. **Set up CI/CD** (optional, for automated testing)

---

## 💡 Pro Tips

1. **Use meaningful commit messages**:
   ```bash
   git commit -m "feat: Add AI chat feature to learning assistant"
   git commit -m "fix: Resolve PDF extraction error"
   git commit -m "docs: Update deployment guide"
   ```

2. **Use .gitattributes** (optional) for consistent line endings:
   ```
   * text=auto
   ```

3. **Add LICENSE file** if you want to open source it:
   - MIT License (most permissive)
   - Apache 2.0
   - ISC (current in package.json)

---

## ✅ You're Done!

Your code is now on GitHub and ready for:
- ✅ Free hosting deployment
- ✅ Collaboration
- ✅ Portfolio showcase
- ✅ Version control
- ✅ Backup

**Next**: Follow `DEPLOYMENT.md` to deploy for free! 🚀
