import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string | null;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
}

interface UseNetworkStatusOptions {
  onOnline?: () => void;
  onOffline?: () => void;
  onSlowConnection?: () => void;
  slowConnectionThreshold?: number; // in Mbps
}

export const useNetworkStatus = (options: UseNetworkStatusOptions = {}) => {
  const {
    onOnline,
    onOffline,
    onSlowConnection,
    slowConnectionThreshold = 1.5 // 1.5 Mbps threshold
  } = options;

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: null,
    effectiveType: null,
    downlink: null,
    rtt: null
  });

  const updateNetworkStatus = useCallback(() => {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    const isOnline = navigator.onLine;
    const downlink = connection?.downlink || null;
    const rtt = connection?.rtt || null;
    const effectiveType = connection?.effectiveType || null;
    const connectionType = connection?.type || null;

    const isSlowConnection = downlink !== null && downlink < slowConnectionThreshold;

    const newStatus: NetworkStatus = {
      isOnline,
      isSlowConnection,
      connectionType,
      effectiveType,
      downlink,
      rtt
    };

    setNetworkStatus(newStatus);

    // Trigger callbacks
    if (isOnline && !networkStatus.isOnline) {
      onOnline?.();
    } else if (!isOnline && networkStatus.isOnline) {
      onOffline?.();
    }

    if (isSlowConnection && !networkStatus.isSlowConnection) {
      onSlowConnection?.();
    }
  }, [networkStatus.isOnline, networkStatus.isSlowConnection, onOnline, onOffline, onSlowConnection, slowConnectionThreshold]);

  useEffect(() => {
    // Initial check
    updateNetworkStatus();

    // Listen for online/offline events
    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes (if supported)
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, [updateNetworkStatus]);

  return networkStatus;
};

export default useNetworkStatus;
