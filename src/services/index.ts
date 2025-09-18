// API Services
export { default as apiClient, api, retryRequest, healthCheck } from './api';
export { signalsApi } from './signalsApi';
export { coinsApi } from './coinsApi';
export { userProfilesApi } from './userProfilesApi';
export { alertsApi } from './alertsApi';
export { strategyApi } from './strategyApi';
export { analyticsApi } from './analyticsApi';

// WebSocket Service
export { 
  websocketService,
  connectWebSocket,
  disconnectWebSocket,
  sendWebSocketMessage,
  subscribeToWebSocket,
  isWebSocketConnected,
  getWebSocketConnectionState
} from './websocketService';

// Re-export types
export type { WebSocketEventType, WebSocketEvent, WebSocketEventHandler } from './websocketService';
