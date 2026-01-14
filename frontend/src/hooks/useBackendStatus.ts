import { useState, useEffect } from 'react';
import { backendStatusManager, BackendStatus } from '../utils/backendStatus';

export const useBackendStatus = () => {
  const [status, setStatus] = useState<BackendStatus>(backendStatusManager.getStatus());

  useEffect(() => {
    // Subscribe to status changes
    const unsubscribe = backendStatusManager.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    // Check backend status on mount
    backendStatusManager.checkBackend();

    // Start periodic checking (every 30 seconds)
    backendStatusManager.startPeriodicCheck(30000);

    return () => {
      unsubscribe();
      backendStatusManager.stopPeriodicCheck();
    };
  }, []);

  const refreshStatus = async () => {
    await backendStatusManager.checkBackend();
  };

  return {
    ...status,
    refreshStatus,
  };
};
