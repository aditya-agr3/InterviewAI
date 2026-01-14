import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a separate axios instance for health checks (without auth token)
const healthCheckApi = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BackendStatus {
  isAvailable: boolean;
  lastChecked: Date | null;
  error: string | null;
}

class BackendStatusManager {
  private status: BackendStatus = {
    isAvailable: false,
    lastChecked: null,
    error: null,
  };
  private listeners: Set<(status: BackendStatus) => void> = new Set();
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  async checkBackend(): Promise<boolean> {
    try {
      // Try multiple endpoints to determine if backend is available
      let isAvailable = false;
      let error: string | null = null;

      // Strategy 1: Try health endpoint (if available)
      try {
        const healthResponse = await healthCheckApi.get('/health');
        isAvailable = healthResponse.status === 200;
      } catch (healthError: any) {
        // Strategy 2: Try /sessions endpoint (requires auth, but 401 means backend exists)
        try {
          const sessionsResponse = await healthCheckApi.get('/sessions');
          isAvailable = sessionsResponse.status === 200 || sessionsResponse.status === 401;
        } catch (sessionsError: any) {
          // Strategy 3: Try /auth/register with GET (will return 405, but that means backend exists)
          try {
            const authResponse = await healthCheckApi.get('/auth/register');
            isAvailable = authResponse.status === 200;
          } catch (authError: any) {
            // 405 Method Not Allowed means endpoint exists, backend is available
            if (authError.response?.status === 405) {
              isAvailable = true;
            } else if (authError.response?.status === 400 || authError.response?.status === 422) {
              // 400/422 means endpoint exists and is processing request
              isAvailable = true;
            } else if (authError.code === 'ERR_NETWORK' || authError.code === 'ECONNREFUSED') {
              // Network error - backend not reachable
              isAvailable = false;
              error = 'Cannot connect to backend server';
            } else {
              // Other errors - assume backend not available
              isAvailable = false;
              error = authError.message || 'Backend not responding';
            }
          }
        }
      }
      
      this.status = {
        isAvailable,
        lastChecked: new Date(),
        error: isAvailable ? null : (error || 'Backend not responding'),
      };

      this.notifyListeners();
      return isAvailable;
    } catch (error: any) {
      // Final fallback - any unhandled error means backend not available
      const isAvailable = false;
      this.status = {
        isAvailable,
        lastChecked: new Date(),
        error: error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED'
          ? 'Cannot connect to backend server'
          : error.message || 'Backend connection failed',
      };

      this.notifyListeners();
      return isAvailable;
    }
  }

  getStatus(): BackendStatus {
    return { ...this.status };
  }

  subscribe(listener: (status: BackendStatus) => void): () => void {
    this.listeners.add(listener);
    // Immediately notify with current status
    listener(this.status);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.status);
    });
  }

  startPeriodicCheck(intervalMs: number = 30000) {
    // Check immediately
    this.checkBackend();
    
    // Then check periodically
    this.checkInterval = setInterval(() => {
      this.checkBackend();
    }, intervalMs);
  }

  stopPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export const backendStatusManager = new BackendStatusManager();
