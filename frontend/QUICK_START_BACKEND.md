# Quick Start: Connecting Your Backend

## How Automatic Backend Detection Works

Your frontend **automatically detects** when the backend API becomes available and switches from dummy data to real data seamlessly.

## What Happens Automatically

### 1. **Backend Detection**
- Frontend checks backend health every 30 seconds
- Tries multiple endpoints: `/api/health`, `/api/sessions`, `/api/auth/register`
- Updates status automatically

### 2. **Visual Indicators**
- **Demo Mode Banner** (Blue): Shows when backend is not connected
- **Success Banner** (Green): Appears when backend connects
- Banner automatically disappears when backend is available

### 3. **Data Switching**
- When backend is **offline**: Shows dummy/sample data
- When backend comes **online**: 
  - ✅ Automatically fetches real data
  - ✅ Replaces dummy data with real data
  - ✅ Shows success notification
  - ✅ All features work with real backend

## To Connect Your Backend

### Step 1: Start Your Backend Server
```bash
# In your backend directory
npm start
# or
node server.js
```

### Step 2: Verify Backend is Running
- Backend should be on: `http://localhost:5000` (or your configured port)
- Check: `http://localhost:5000/api/health` (optional but recommended)

### Step 3: Frontend Auto-Detects
- Frontend automatically detects backend within 30 seconds
- Demo banner disappears
- Success notification appears
- Data automatically refreshes

## Backend Endpoint Requirements

Your backend should implement these endpoints:

### Required Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/sessions
POST   /api/sessions
GET    /api/sessions/:id
... (other existing endpoints)
```

### Learning Assistant Endpoints (New)
```
POST   /api/learning/documents          # Upload PDF
GET    /api/learning/documents           # List documents
GET    /api/learning/documents/:id       # Get document
DELETE /api/learning/documents/:id      # Delete document
GET    /api/learning/documents/:id/file  # Get PDF file

POST   /api/learning/documents/:id/chat  # AI chat
GET    /api/learning/documents/:id/chat  # Chat history
POST   /api/learning/documents/:id/summary  # Generate summary
POST   /api/learning/documents/:id/explain   # Explain concept

POST   /api/learning/documents/:id/flashcards/generate  # Generate flashcards
GET    /api/learning/flashcards         # Get flashcards
PATCH  /api/learning/flashcards/:id/favorite  # Toggle favorite
DELETE /api/learning/flashcards/:id     # Delete flashcard

POST   /api/learning/documents/:id/quizzes/generate  # Generate quiz
GET    /api/learning/quizzes            # Get quizzes
GET    /api/learning/quizzes/:id        # Get quiz
POST   /api/learning/quizzes/:id/submit  # Submit quiz
DELETE /api/learning/quizzes/:id        # Delete quiz

GET    /api/learning/progress           # Get progress stats
```

### Optional: Health Check Endpoint
```javascript
// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});
```

## Testing

1. **Start Backend**: Run your backend server
2. **Open Frontend**: Open `http://localhost:3000` (or your frontend URL)
3. **Watch for Changes**:
   - Demo banner should disappear
   - Green "Backend Connected!" banner appears
   - Data automatically refreshes
   - Console shows successful API calls

## Manual Testing

You can manually trigger a backend check:

```typescript
import { useBackendStatus } from '../hooks/useBackendStatus';

const { refreshStatus, isAvailable } = useBackendStatus();

// Force check
await refreshStatus();

// Check status
console.log('Backend available:', isAvailable);
```

## Troubleshooting

### Backend Not Detected?

1. **Check Backend URL**
   - Verify `VITE_API_URL` in `.env` matches your backend
   - Default: `http://localhost:5000/api`

2. **Check CORS**
   ```javascript
   // Backend should allow frontend origin
   app.use(cors({
     origin: 'http://localhost:3000', // Your frontend URL
     credentials: true
   }));
   ```

3. **Check Network**
   - Open browser DevTools → Network tab
   - Look for failed requests to `/api/health` or `/api/sessions`
   - Check for CORS errors

4. **Check Backend Logs**
   - Verify backend is receiving requests
   - Check for errors in backend console

### Still Showing Dummy Data?

1. **Wait 30 seconds** - Auto-check happens every 30s
2. **Refresh page** - Forces immediate check
3. **Check browser console** - Look for API errors
4. **Verify endpoints** - Make sure backend endpoints exist

## Configuration

### Environment Variables
Create `.env` file in frontend root:
```env
VITE_API_URL=http://localhost:5000/api
```

### Change Check Interval
In `src/utils/backendStatus.ts`:
```typescript
backendStatusManager.startPeriodicCheck(30000); // 30 seconds
// Change to your preferred interval (in milliseconds)
```

## Features

✅ **Automatic Detection** - No manual configuration needed
✅ **Periodic Checking** - Checks every 30 seconds
✅ **Auto-Refresh** - Data refreshes when backend connects
✅ **Visual Feedback** - Clear indicators of connection status
✅ **Seamless Transition** - Smooth switch from dummy to real data
✅ **Error Handling** - Graceful fallback to dummy data

## Summary

**Just start your backend server** - the frontend will automatically:
1. Detect when backend is available
2. Switch from dummy to real data
3. Show success notification
4. Keep checking periodically

No code changes needed! 🎉
