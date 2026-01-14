# Quick Setup Guide

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interviewai
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get Gemini API Key:**
1. Visit https://aistudio.google.com/app/apikey (or https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the API key (it should start with "AIza...")
5. Paste it into your `.env` file as `GEMINI_API_KEY=your_key_here`

**Important Notes:**
- The API key should start with "AIza"
- Make sure there are no extra spaces or quotes around the key
- If you get a 403 error, verify the key is correct and has proper permissions

### Frontend (Optional)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

## Step 4: Run the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

## Step 5: Test the Application

1. Open http://localhost:3000
2. Click "Get Started" or "Register"
3. Create an account
4. Create your first interview session
5. Start preparing!

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, ensure IP whitelist includes your IP

### Gemini API Error
- Verify API key is correct
- Check API quota/limits
- Ensure internet connection

### Port Already in Use
- Change `PORT` in `backend/.env`
- Update `VITE_API_URL` in `frontend/.env` if changed

### CORS Errors
- Ensure backend is running before frontend
- Check proxy configuration in `vite.config.ts`

---

For detailed documentation, see [README.md](./README.md)
