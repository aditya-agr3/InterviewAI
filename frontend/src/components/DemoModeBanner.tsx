import { useState, useEffect } from 'react';
import { useBackendStatus } from '../hooks/useBackendStatus';

const DemoModeBanner = () => {
  const { isAvailable: backendAvailable } = useBackendStatus();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [justConnected, setJustConnected] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem('demo-banner-dismissed');
    
    if (!backendAvailable && !wasDismissed) {
      setShowBanner(true);
    } else if (backendAvailable) {
      // Backend just became available
      if (wasDismissed) {
        setJustConnected(true);
        setTimeout(() => setJustConnected(false), 5000);
      }
      setShowBanner(false);
    }
  }, [backendAvailable]);

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('demo-banner-dismissed', 'true');
  };

  // Show success message when backend connects
  if (justConnected) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 animate-slide-down">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Backend Connected!</strong> Switched to real data automatically.
            </span>
          </div>
          <button
            onClick={() => setJustConnected(false)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (!showBanner || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Demo Mode:</strong> Backend API not connected. Showing sample data for demonstration purposes.
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DemoModeBanner;
