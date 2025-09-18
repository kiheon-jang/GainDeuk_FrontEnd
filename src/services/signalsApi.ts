import { api, retryRequest } from './api';
import type { Signal, SignalFilters, ApiResponse } from '../types';

export interface SignalsQueryParams {
  page?: number;
  limit?: number;
  sort?: 'finalScore' | 'createdAt' | 'rank';
  order?: 'asc' | 'desc';
  minScore?: number;
  maxScore?: number;
  action?: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'WEAK_SELL' | 'SELL' | 'STRONG_SELL';
  timeframe?: 'SCALPING' | 'DAY_TRADING' | 'SWING_TRADING' | 'LONG_TERM';
  priority?: 'high_priority' | 'medium_priority' | 'low_priority';
  coinSymbol?: string;
}

export interface SignalsResponse {
  signals: Signal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const signalsApi = {
  // Get signals with filtering and pagination
  getSignals: async (params: SignalsQueryParams = {}): Promise<ApiResponse<SignalsResponse>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `/signals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return retryRequest(() => api.get<SignalsResponse>(url));
  },

  // Get top signals (for dashboard)
  getTopSignals: async (limit: number = 20): Promise<ApiResponse<Signal[]>> => {
    return retryRequest(() => 
      api.get<Signal[]>(`/signals?limit=${limit}&sort=finalScore&order=desc`)
    );
  },

  // Get strong buy signals
  getStrongBuySignals: async (minScore: number = 80): Promise<ApiResponse<Signal[]>> => {
    return retryRequest(() => 
      api.get<Signal[]>(`/signals?minScore=${minScore}&action=STRONG_BUY`)
    );
  },

  // Get signals by timeframe
  getSignalsByTimeframe: async (timeframe: string): Promise<ApiResponse<Signal[]>> => {
    return retryRequest(() => 
      api.get<Signal[]>(`/signals?timeframe=${timeframe}`)
    );
  },

  // Get signal by ID
  getSignalById: async (signalId: string): Promise<ApiResponse<Signal>> => {
    return retryRequest(() => 
      api.get<Signal>(`/signals/${signalId}`)
    );
  },

  // Get signal persistence prediction
  getSignalPersistence: async (signalId: string): Promise<ApiResponse<{
    signalId: string;
    persistenceScore: number;
    confidence: number;
    predictedDuration: number;
    factors: string[];
  }>> => {
    return retryRequest(() => 
      api.get(`/signal-persistence/predict?signalId=${signalId}`)
    );
  },

  // Get personalized recommendations
  getPersonalizedRecommendations: async (userId: string): Promise<ApiResponse<{
    suggestedTimeframes: string[];
    suggestedCoins: string[];
    riskLevel: number;
    maxDailySignals: number;
    tradingStrategy: object;
    signalFilters: object;
    positionSizing: object;
    alertSettings: object;
    marketAdaptation: object;
    confidence: number;
    lastUpdated: string;
    profileCompleteness: number;
  }>> => {
    return retryRequest(() => 
      api.get(`/personalization/recommendations/${userId}`)
    );
  },

  // Get signal statistics
  getSignalStats: async (): Promise<ApiResponse<{
    totalSignals: number;
    strongSignals: number;
    averageScore: number;
    topPerformingCoins: string[];
    signalDistribution: {
      timeframe: string;
      count: number;
    }[];
  }>> => {
    return retryRequest(() => 
      api.get('/signals/stats')
    );
  },

  // Get real-time signal updates (for WebSocket fallback)
  getRealTimeUpdates: async (lastUpdate: string): Promise<ApiResponse<{
    newSignals: Signal[];
    updatedSignals: Signal[];
    deletedSignals: string[];
    timestamp: string;
  }>> => {
    return retryRequest(() => 
      api.get(`/signals/updates?since=${lastUpdate}`)
    );
  },
};
