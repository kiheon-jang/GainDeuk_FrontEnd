import { api, retryRequest } from './api';
import { AnalyticsData, ApiResponse } from '../types';

export interface OnchainDataParams {
  network?: 'ethereum' | 'bitcoin' | 'bsc' | 'polygon';
  limit?: number;
  minValue?: number;
  timeRange?: '1h' | '24h' | '7d' | '30d';
}

export interface SocialSentimentParams {
  platform?: 'twitter' | 'telegram' | 'discord' | 'reddit';
  coinSymbol?: string;
  timeRange?: '1h' | '24h' | '7d' | '30d';
}

export const analyticsApi = {
  // Get on-chain data
  getOnchainData: async (params: OnchainDataParams = {}): Promise<ApiResponse<AnalyticsData['onchainData']>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `/onchain/data${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return retryRequest(() => api.get<AnalyticsData['onchainData']>(url));
  },

  // Get social media sentiment
  getSocialSentiment: async (params: SocialSentimentParams = {}): Promise<ApiResponse<AnalyticsData['socialSentiment']>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `/social-media/sentiment${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return retryRequest(() => api.get<AnalyticsData['socialSentiment']>(url));
  },

  // Get Korean community sentiment
  getKoreanCommunitySentiment: async (symbol: string): Promise<ApiResponse<AnalyticsData['koreanCommunity']>> => {
    return retryRequest(() => 
      api.get<AnalyticsData['koreanCommunity']>(`/korean-market/community-sentiment/${symbol}`)
    );
  },

  // Get data quality status
  getDataQualityStatus: async (): Promise<ApiResponse<AnalyticsData['dataQuality']>> => {
    return retryRequest(() => 
      api.get<AnalyticsData['dataQuality']>('/data-quality/status')
    );
  },

  // Get performance metrics
  getPerformanceMetrics: async (): Promise<ApiResponse<AnalyticsData['performanceMetrics']>> => {
    return retryRequest(() => 
      api.get<AnalyticsData['performanceMetrics']>('/performance/metrics')
    );
  },

  // Get whale movements
  getWhaleMovements: async (params: {
    network?: string;
    minAmount?: number;
    timeRange?: string;
    limit?: number;
  } = {}): Promise<ApiResponse<{
    movements: AnalyticsData['onchainData']['whaleMovements'];
    summary: {
      totalInflow: number;
      totalOutflow: number;
      netFlow: number;
      topWhales: string[];
    };
  }>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `/onchain/whale-movements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return retryRequest(() => api.get(url));
  },

  // Get large transactions
  getLargeTransactions: async (params: {
    network?: string;
    minValue?: number;
    timeRange?: string;
    limit?: number;
  } = {}): Promise<ApiResponse<{
    transactions: AnalyticsData['onchainData']['largeTransactions'];
    summary: {
      totalVolume: number;
      averageSize: number;
      topExchanges: string[];
    };
  }>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `/onchain/large-transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return retryRequest(() => api.get(url));
  },

  // Get token unlocks
  getTokenUnlocks: async (params: {
    upcoming?: boolean;
    limit?: number;
    daysAhead?: number;
  } = {}): Promise<ApiResponse<{
    unlocks: AnalyticsData['onchainData']['tokenUnlocks'];
    summary: {
      totalUnlockValue: number;
      upcomingUnlocks: number;
      highImpactUnlocks: string[];
    };
  }>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `/onchain/token-unlocks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return retryRequest(() => api.get(url));
  },

  // Get market sentiment analysis
  getMarketSentiment: async (): Promise<ApiResponse<{
    overallSentiment: 'positive' | 'negative' | 'neutral';
    sentimentScore: number;
    fearGreedIndex: number;
    socialVolume: number;
    newsSentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
    platformBreakdown: {
      twitter: { sentiment: number; volume: number };
      reddit: { sentiment: number; volume: number };
      telegram: { sentiment: number; volume: number };
      discord: { sentiment: number; volume: number };
    };
    trendingTopics: string[];
    lastUpdated: string;
  }>> => {
    return retryRequest(() => 
      api.get('/analytics/market-sentiment')
    );
  },

  // Get correlation analysis
  getCorrelationAnalysis: async (params: {
    coins?: string[];
    timeRange?: string;
    correlationType?: 'price' | 'volume' | 'sentiment';
  } = {}): Promise<ApiResponse<{
    correlations: {
      coin1: string;
      coin2: string;
      correlation: number;
      significance: number;
    }[];
    heatmap: {
      coins: string[];
      matrix: number[][];
    };
    insights: string[];
    lastUpdated: string;
  }>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const url = `/analytics/correlation${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return retryRequest(() => api.get(url));
  },

  // Get volatility analysis
  getVolatilityAnalysis: async (params: {
    coins?: string[];
    timeRange?: string;
    period?: string;
  } = {}): Promise<ApiResponse<{
    volatilities: {
      coinSymbol: string;
      currentVolatility: number;
      historicalAverage: number;
      volatilityRank: number;
      riskLevel: 'low' | 'medium' | 'high';
    }[];
    marketVolatility: {
      average: number;
      trend: 'increasing' | 'decreasing' | 'stable';
      percentile: number;
    };
    insights: string[];
    lastUpdated: string;
  }>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const url = `/analytics/volatility${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return retryRequest(() => api.get(url));
  },
};
