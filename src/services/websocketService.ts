import type { WebSocketMessage } from '../types';

export type WebSocketEventType = 'signal_update' | 'price_update' | 'market_update' | 'error' | 'connected' | 'disconnected';

export interface WebSocketEvent {
  type: WebSocketEventType;
  data: any;
  timestamp: string;
  error?: string;
  code?: number;
  reason?: string;
  url?: string;
  message?: string;
}

export type WebSocketEventHandler = (event: WebSocketEvent) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 1000;
  private eventHandlers: Map<WebSocketEventType, WebSocketEventHandler[]> = new Map();
  private isConnecting: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Use proxy in development, direct URL in production
    this.url = import.meta.env.VITE_WS_URL || 
      (import.meta.env.DEV ? 'ws://localhost:5173/ws/signals' : 'ws://localhost:3000/ws/signals');
    this.setupEventHandlers();
    
    // Log WebSocket URL for debugging
    console.log('WebSocket URL:', this.url);
  }

  private setupEventHandlers(): void {
    this.eventHandlers.set('signal_update', []);
    this.eventHandlers.set('price_update', []);
    this.eventHandlers.set('market_update', []);
    this.eventHandlers.set('error', []);
    this.eventHandlers.set('connected', []);
    this.eventHandlers.set('disconnected', []);
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;

      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          this.isConnecting = false;
          reject(new Error('WebSocket is not available in this environment'));
          return;
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.emit('connected', {
            type: 'connected',
            data: {},
            timestamp: new Date().toISOString()
          });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
            this.emit('error', { 
              type: 'error',
              data: { error: 'Failed to parse message' },
              timestamp: new Date().toISOString()
            });
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.stopHeartbeat();
          this.emit('disconnected', { 
            type: 'disconnected',
            data: { code: event.code, reason: event.reason },
            timestamp: new Date().toISOString()
          });
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.warn('WebSocket connection failed - continuing without real-time updates:', error);
          console.warn('WebSocket URL attempted:', this.url);
          console.warn('Make sure the WebSocket server is running on the correct port');
          this.isConnecting = false;
          this.emit('error', { 
            type: 'error',
            data: { 
              error: 'WebSocket connection error',
              url: this.url,
              message: 'WebSocket 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
            },
            timestamp: new Date().toISOString()
          });
          // Don't reject the promise to prevent app crashes
          resolve();
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.stopHeartbeat();
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
  }

  public send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  public subscribe(eventType: WebSocketEventType, handler: WebSocketEventHandler): () => void {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventType, handlers);

    // Return unsubscribe function
    return () => {
      const currentHandlers = this.eventHandlers.get(eventType) || [];
      const index = currentHandlers.indexOf(handler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
        this.eventHandlers.set(eventType, currentHandlers);
      }
    };
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public getConnectionState(): string {
    if (!this.ws) return 'CLOSED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }

  public async checkServerAvailability(): Promise<boolean> {
    try {
      // Try to fetch the server health endpoint first
      const httpUrl = this.url.replace('ws://', 'http://').replace('wss://', 'https://');
      const healthUrl = httpUrl.replace('/ws/signals', '/health');
      
      await fetch(healthUrl, { 
        method: 'GET',
        mode: 'no-cors', // Allow cross-origin requests
        cache: 'no-cache'
      });
      
      return true;
    } catch (error) {
      console.warn('Server health check failed:', error);
      return false;
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const event: WebSocketEvent = {
      type: message.type,
      data: message.data,
      timestamp: message.timestamp || new Date().toISOString(),
    };

    this.emit(message.type, event);
  }

  private emit(eventType: WebSocketEventType, event: WebSocketEvent): void {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in WebSocket event handler for ${eventType}:`, error);
      }
    });
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect().catch(error => {
          console.error('Reconnect failed:', error);
        });
      }
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
        
        // Set timeout for pong response
        this.heartbeatTimeout = setTimeout(() => {
          console.warn('Heartbeat timeout, reconnecting...');
          this.ws?.close();
        }, 5000);
      }
    }, 30000); // Send ping every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// Export convenience functions
export const connectWebSocket = () => websocketService.connect();
export const disconnectWebSocket = () => websocketService.disconnect();
export const sendWebSocketMessage = (message: any) => websocketService.send(message);
export const subscribeToWebSocket = (eventType: WebSocketEventType, handler: WebSocketEventHandler) => 
  websocketService.subscribe(eventType, handler);
export const isWebSocketConnected = () => websocketService.isConnected();
export const getWebSocketConnectionState = () => websocketService.getConnectionState();

export default websocketService;
