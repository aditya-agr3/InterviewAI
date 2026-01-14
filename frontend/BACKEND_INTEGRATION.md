# Backend Integration Guide

## How Automatic Backend Detection Works

The frontend now automatically detects when the backend API becomes available and switches from dummy data to real data seamlessly.

### Architecture

1. **BackendStatusManager** (`src/utils/backendStatus.ts`)
   - Singleton that manages backend connection status
   - Periodically checks backend health (every 30 seconds)
   - Notifies subscribers when status changes

2. **useBackendStatus Hook** (`src/hooks/useBackendStatus.ts`)
   - React hook that provides backend status to components
   - Automatically subscribes/unsubscribes on mount/unmount
   - Returns: `{ isAvailable, lastChecked, error, refreshStatus }`

3. **Auto-Refresh Logic**
   - Components watch for `backendAvailable` changes
   - When backend becomes available, components automatically refetch data
   - Smooth transition from dummy to real data

### How It Works

#### Step 1: Backend Detection
```typescript
// The system checks backend health by trying to access:
// 1. /api/health (if available)
// 2. /api/sessions (fallback)
```

#### Step 2: Status Updates
- When backend is **unavailable**: Shows dummy data, displays demo banner
- When backend becomes **available**: 
  - Shows success notification
  - Automatically refetches all data
  - Switches to real data

#### Step 3: Periodic Checking
- Checks every 30 seconds automatically
- Can be manually refreshed with `refreshStatus()`

### Usage in Components

```typescript
import { useBackendStatus } from '../hooks/useBackendStatus';

const MyComponent = () => {
  const { isAvailable, refreshStatus } = useBackendStatus();
  
  useEffect(() => {
    if (isAvailable) {
      // Backend is available - fetch real data
      fetchRealData();
    } else {
      // Backend not available - use dummy data
      setData(dummyData);
    }
  }, [isAvailable]);
  
  // Auto-refresh when backend comes online
  useEffect(() => {
    if (isAvailable && isShowingDummyData) {
      fetchRealData();
    }
  }, [isAvailable]);
};
```

### Backend Requirements

For automatic detection to work, your backend should:

1. **Health Check Endpoint** (Optional but recommended)
   ```javascript
   // GET /api/health
   app.get('/api/health', (req, res) => {
     res.json({ status: 'ok', timestamp: new Date() });
   });
   ```

2. **Standard API Endpoints**
   - All endpoints should return proper HTTP status codes
   - 200 for success
   - 404 for not found
   - 500 for server errors

3. **CORS Configuration**
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```

### Testing Backend Connection

1. **Start Backend**: Run your backend server
2. **Check Status**: The demo banner will automatically disappear
3. **Success Notification**: Green banner appears saying "Backend Connected!"
4. **Data Refresh**: All pages automatically fetch real data

### Manual Refresh

If you want to manually check backend status:

```typescript
const { refreshStatus } = useBackendStatus();

// Force a status check
await refreshStatus();
```

### Configuration

The backend URL is configured in:
- Environment variable: `VITE_API_URL`
- Default: `http://localhost:5000/api`
- File: `.env` or `vite.config.ts`

### Troubleshooting

**Backend not detected?**
1. Check if backend is running on correct port
2. Verify CORS is configured correctly
3. Check browser console for network errors
4. Ensure `/api/health` or `/api/sessions` endpoint exists

**Still showing dummy data?**
1. Check backend status: Look at demo banner
2. Manually refresh: Use `refreshStatus()` in component
3. Check network tab: Verify API calls are succeeding
4. Clear browser cache if needed

### Features

✅ Automatic backend detection
✅ Periodic health checks (every 30s)
✅ Auto-refresh when backend comes online
✅ Success notification when connected
✅ Seamless transition from dummy to real data
✅ Manual refresh capability
✅ Status subscription system
