import { api, retryRequest } from './api';
import { Alert, ApiResponse } from '../types';

export interface AlertCreateData {
  type: 'signal' | 'price' | 'volume' | 'news' | 'whale' | 'social';
  title: string;
  message: string;
  coinSymbol: string;
  signalScore?: number;
  price?: number;
  priority: 'high' | 'medium' | 'low';
  deliveryMethod: 'push' | 'email' | 'discord';
  metadata?: {
    signalId?: string;
    coinId?: string;
    originalData?: object;
  };
}

export interface AlertUpdateData {
  isRead?: boolean;
  isDelivered?: boolean;
  deliveryMethod?: 'push' | 'email' | 'discord';
}

export interface AlertsQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  priority?: string;
  isRead?: boolean;
  isDelivered?: boolean;
  coinSymbol?: string;
  startDate?: string;
  endDate?: string;
}

export interface AlertsResponse {
  alerts: Alert[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const alertsApi = {
  // Get alerts with filtering and pagination
  getAlerts: async (
    userId: string,
    params: AlertsQueryParams = {}
  ): Promise<ApiResponse<AlertsResponse>> => {
    const queryParams = new URLSearchParams();
    queryParams.append('userId', userId);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `/alerts?${queryParams.toString()}`;
    
    return retryRequest(() => api.get<AlertsResponse>(url));
  },

  // Get unread alerts count
  getUnreadAlertsCount: async (userId: string): Promise<ApiResponse<{ count: number }>> => {
    return retryRequest(() => 
      api.get<{ count: number }>(`/alerts/unread-count?userId=${userId}`)
    );
  },

  // Get alert by ID
  getAlertById: async (alertId: string): Promise<ApiResponse<Alert>> => {
    return retryRequest(() => 
      api.get<Alert>(`/alerts/${alertId}`)
    );
  },

  // Create new alert
  createAlert: async (data: AlertCreateData): Promise<ApiResponse<Alert>> => {
    return retryRequest(() => 
      api.post<Alert>('/alerts', data)
    );
  },

  // Update alert
  updateAlert: async (
    alertId: string,
    data: AlertUpdateData
  ): Promise<ApiResponse<Alert>> => {
    return retryRequest(() => 
      api.put<Alert>(`/alerts/${alertId}`, data)
    );
  },

  // Mark alert as read
  markAsRead: async (alertId: string): Promise<ApiResponse<Alert>> => {
    return retryRequest(() => 
      api.patch<Alert>(`/alerts/${alertId}/read`)
    );
  },

  // Mark multiple alerts as read
  markMultipleAsRead: async (alertIds: string[]): Promise<ApiResponse<{ updated: number }>> => {
    return retryRequest(() => 
      api.patch<{ updated: number }>('/alerts/mark-read', { alertIds })
    );
  },

  // Mark all alerts as read for user
  markAllAsRead: async (userId: string): Promise<ApiResponse<{ updated: number }>> => {
    return retryRequest(() => 
      api.patch<{ updated: number }>(`/alerts/mark-all-read?userId=${userId}`)
    );
  },

  // Delete alert
  deleteAlert: async (alertId: string): Promise<ApiResponse<{ message: string }>> => {
    return retryRequest(() => 
      api.delete(`/alerts/${alertId}`)
    );
  },

  // Delete multiple alerts
  deleteMultipleAlerts: async (alertIds: string[]): Promise<ApiResponse<{ deleted: number }>> => {
    return retryRequest(() => 
      api.delete('/alerts/batch', { data: { alertIds } })
    );
  },

  // Get alert statistics
  getAlertStats: async (userId: string): Promise<ApiResponse<{
    totalAlerts: number;
    unreadAlerts: number;
    alertsByType: {
      signal: number;
      price: number;
      volume: number;
      news: number;
      whale: number;
      social: number;
    };
    alertsByPriority: {
      high: number;
      medium: number;
      low: number;
    };
    deliveryStats: {
      push: { sent: number; delivered: number; failed: number };
      email: { sent: number; delivered: number; failed: number };
      discord: { sent: number; delivered: number; failed: number };
    };
    responseRate: number;
    averageResponseTime: number;
  }>> => {
    return retryRequest(() => 
      api.get(`/alerts/stats?userId=${userId}`)
    );
  },

  // Test alert delivery
  testAlertDelivery: async (
    userId: string,
    deliveryMethod: 'push' | 'email' | 'discord'
  ): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    return retryRequest(() => 
      api.post(`/alerts/test-delivery`, { userId, deliveryMethod })
    );
  },

  // Get alert preferences
  getAlertPreferences: async (userId: string): Promise<ApiResponse<{
    signalAlerts: {
      enabled: boolean;
      minScore: number;
      timeframes: string[];
      coins: string[];
    };
    priceAlerts: {
      enabled: boolean;
      thresholds: {
        coinSymbol: string;
        price: number;
        direction: 'above' | 'below';
      }[];
    };
    volumeAlerts: {
      enabled: boolean;
      threshold: number;
      coins: string[];
    };
    newsAlerts: {
      enabled: boolean;
      keywords: string[];
      sources: string[];
    };
    whaleAlerts: {
      enabled: boolean;
      minAmount: number;
      coins: string[];
    };
    socialAlerts: {
      enabled: boolean;
      platforms: string[];
      sentimentThreshold: number;
    };
  }>> => {
    return retryRequest(() => 
      api.get(`/alerts/preferences?userId=${userId}`)
    );
  },

  // Update alert preferences
  updateAlertPreferences: async (
    userId: string,
    preferences: any
  ): Promise<ApiResponse<{ message: string }>> => {
    return retryRequest(() => 
      api.put(`/alerts/preferences`, { userId, preferences })
    );
  },
};
