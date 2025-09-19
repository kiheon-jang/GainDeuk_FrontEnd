import { useState, useEffect, useRef } from 'react';

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

  // Use refs to store callbacks to avoid dependency issues
  const onOnlineRef = useRef(onOnline);
  const onOfflineRef = useRef(onOffline);
  const onSlowConnectionRef = useRef(onSlowConnection);

  // Update refs when callbacks change
  onOnlineRef.current = onOnline;
  onOfflineRef.current = onOffline;
  onSlowConnectionRef.current = onSlowConnection;

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: null,
    effectiveType: null,
    downlink: null,
    rtt: null
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
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

      setNetworkStatus(prevStatus => {
        // Trigger callbacks only when status actually changes
        if (isOnline && !prevStatus.isOnline) {
          onOnlineRef.current?.();
        } else if (!isOnline && prevStatus.isOnline) {
          onOfflineRef.current?.();
        }

        if (isSlowConnection && !prevStatus.isSlowConnection) {
          onSlowConnectionRef.current?.();
        }

        return newStatus;
      });
    };

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to prevent infinite re-renders

  return networkStatus;
};

export default useNetworkStatus;
