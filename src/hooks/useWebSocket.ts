import { useEffect, useRef, useState } from 'react';
import { 
  websocketService, 
  connectWebSocket,
  disconnectWebSocket,
  subscribeToWebSocket,
  isWebSocketConnected,
  getWebSocketConnectionState
} from '../services/websocketService';
import type { WebSocketEventType, WebSocketEvent } from '../services/websocketService';
import { useSignalsStore } from '../stores/signalsStore';
import { useUIStore } from '../stores/uiStore';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnMount?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { autoConnect = true, reconnectOnMount = true } = options;
  
  const [connectionState, setConnectionState] = useState(getWebSocketConnectionState());
  const [isConnected, setIsConnected] = useState(isWebSocketConnected());
  const [lastMessage, setLastMessage] = useState<WebSocketEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const unsubscribeRef = useRef<(() => void)[]>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get store actions
  const { addSignal, updateSignal, removeSignal, setLastUpdated } = useSignalsStore();
  const { addNotification, addToast } = useUIStore();

  // Connect to WebSocket
  const connect = async () => {
    try {
      setError(null);
      
      // Check server availability first
      const isServerAvailable = await websocketService.checkServerAvailability();
      if (!isServerAvailable) {
        console.warn('WebSocket server is not available');
        setError('WebSocket 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        setIsConnected(false);
        setConnectionState(getWebSocketConnectionState());
        return;
      }
      
      await connectWebSocket();
      setIsConnected(true);
      setConnectionState(getWebSocketConnectionState());
    } catch (err: any) {
      console.warn('WebSocket connection failed:', err);
      setError('실시간 업데이트를 사용할 수 없습니다. 기본 기능은 정상 작동합니다.');
      setIsConnected(false);
      setConnectionState(getWebSocketConnectionState());
    }
  };

  // Disconnect from WebSocket
  const disconnect = () => {
    disconnectWebSocket();
    setIsConnected(false);
    setConnectionState(getWebSocketConnectionState());
    
    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  // Send message through WebSocket
  const sendMessage = (message: any) => {
    if (isConnected) {
      websocketService.send(message);
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', message);
    }
  };

  // Handle WebSocket events
  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionState(getWebSocketConnectionState());
      setError(null);
      
      addToast({
        type: 'success',
        title: '연결됨',
        message: '실시간 데이터 연결이 성공했습니다.',
        duration: 3000,
      });
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setConnectionState(getWebSocketConnectionState());
      
      addToast({
        type: 'warning',
        title: '연결 끊김',
        message: '실시간 데이터 연결이 끊어졌습니다.',
        duration: 5000,
      });
    };

    const handleError = (event: WebSocketEvent) => {
      setError(event.data?.error || 'WebSocket 오류가 발생했습니다.');
      
      addToast({
        type: 'error',
        title: '연결 오류',
        message: event.data?.error || '실시간 데이터 연결에 문제가 발생했습니다.',
        duration: 5000,
      });
    };

    const handleSignalUpdate = (event: WebSocketEvent) => {
      setLastMessage(event);
      
      const { type, data } = event.data;
      
      switch (type) {
        case 'new_signal':
          addSignal(data);
          addNotification({
            type: 'info',
            title: '새로운 신호',
            message: `${data.symbol}에 대한 새로운 투자 신호가 도착했습니다.`,
          });
          break;
          
        case 'updated_signal':
          updateSignal(data._id, data);
          break;
          
        case 'deleted_signal':
          removeSignal(data._id);
          break;
          
        case 'strong_signal':
          addSignal(data);
          addNotification({
            type: 'success',
            title: '강한 신호',
            message: `${data.symbol}에 대한 강한 투자 신호가 도착했습니다!`,
            persistent: true,
          });
          break;
      }
      
      setLastUpdated(new Date().toISOString());
    };

    const handlePriceUpdate = (event: WebSocketEvent) => {
      setLastMessage(event);
      // Handle price updates if needed
    };

    const handleMarketUpdate = (event: WebSocketEvent) => {
      setLastMessage(event);
      // Handle market updates if needed
    };

    // Subscribe to WebSocket events
    const unsubscribeConnected = subscribeToWebSocket('connected', handleConnected);
    const unsubscribeDisconnected = subscribeToWebSocket('disconnected', handleDisconnected);
    const unsubscribeError = subscribeToWebSocket('error', handleError);
    const unsubscribeSignalUpdate = subscribeToWebSocket('signal_update', handleSignalUpdate);
    const unsubscribePriceUpdate = subscribeToWebSocket('price_update', handlePriceUpdate);
    const unsubscribeMarketUpdate = subscribeToWebSocket('market_update', handleMarketUpdate);

    // Store unsubscribe functions
    unsubscribeRef.current = [
      unsubscribeConnected,
      unsubscribeDisconnected,
      unsubscribeError,
      unsubscribeSignalUpdate,
      unsubscribePriceUpdate,
      unsubscribeMarketUpdate,
    ];

    // Auto-connect if enabled
    if (autoConnect && !isConnected) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      unsubscribeRef.current.forEach(unsubscribe => unsubscribe());
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [autoConnect, isConnected, addSignal, updateSignal, removeSignal, setLastUpdated, addNotification, addToast]);

  // Reconnect on mount if enabled
  useEffect(() => {
    if (reconnectOnMount && !isConnected) {
      const timeout = setTimeout(() => {
        connect();
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [reconnectOnMount, isConnected]);

  return {
    // Connection state
    isConnected,
    connectionState,
    error,
    lastMessage,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    
    // Utility
    reconnect: connect,
  };
};

// Hook for specific WebSocket event types
export const useWebSocketEvent = (
  eventType: WebSocketEventType,
  handler: (event: WebSocketEvent) => void,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const unsubscribe = subscribeToWebSocket(eventType, handler);
    return unsubscribe;
  }, dependencies);
};

// Hook for WebSocket connection status
export const useWebSocketStatus = () => {
  const [isConnected, setIsConnected] = useState(isWebSocketConnected());
  const [connectionState, setConnectionState] = useState(getWebSocketConnectionState());

  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionState(getWebSocketConnectionState());
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setConnectionState(getWebSocketConnectionState());
    };

    const unsubscribeConnected = subscribeToWebSocket('connected', handleConnected);
    const unsubscribeDisconnected = subscribeToWebSocket('disconnected', handleDisconnected);

    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
    };
  }, []);

  return { isConnected, connectionState };
};
