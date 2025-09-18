import { api, retryRequest } from './api';
import type { Coin, CoinFilters, ApiResponse } from '../types';

export interface CoinsQueryParams {
  page?: number;
  limit?: number;
  sort?: 'marketCapRank' | 'price' | 'volume' | 'change24h';
  order?: 'asc' | 'desc';
  minMarketCap?: number;
  maxMarketCap?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface CoinsResponse {
  coins: Coin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface KimchiPremiumData {
  symbol: string;
  koreanPrice: number;
  globalPrice: number;
  premium: number;
  premiumPercentage: number;
  lastUpdated: string;
}

export const coinsApi = {
  // Get coins with filtering and pagination
  getCoins: async (params: CoinsQueryParams = {}): Promise<ApiResponse<CoinsResponse>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `/coins${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return retryRequest(() => api.get<CoinsResponse>(url));
  },

  // Get top coins by market cap (for dashboard)
  getTopCoins: async (limit: number = 10): Promise<ApiResponse<Coin[]>> => {
    return retryRequest(() => 
      api.get<Coin[]>(`/coins?limit=${limit}&sort=marketCapRank&order=asc`)
    );
  },

  // Get coin by ID
  getCoinById: async (coinId: string): Promise<ApiResponse<Coin>> => {
    return retryRequest(() => 
      api.get<Coin>(`/coins/${coinId}`)
    );
  },

  // Search coins by name or symbol
  searchCoins: async (query: string): Promise<ApiResponse<Coin[]>> => {
    return retryRequest(() => 
      api.get<Coin[]>(`/coins/search?q=${encodeURIComponent(query)}`)
    );
  },

  // Get Kimchi Premium data
  getKimchiPremium: async (symbol: string): Promise<ApiResponse<KimchiPremiumData>> => {
    return retryRequest(() => 
      api.get<KimchiPremiumData>(`/korean-market/kimchi-premium/${symbol}`)
    );
  },

  // Get multiple Kimchi Premium data
  getKimchiPremiums: async (symbols: string[]): Promise<ApiResponse<KimchiPremiumData[]>> => {
    return retryRequest(() => 
      api.post<KimchiPremiumData[]>('/korean-market/kimchi-premium/batch', { symbols })
    );
  },

  // Get Korean market statistics
  getKoreanMarketStats: async (): Promise<ApiResponse<{
    kimchiPremium: number;
    totalVolume: number;
    activeUsers: number;
    topCoins: string[];
    marketTrend: 'bullish' | 'bearish' | 'neutral';
    lastUpdated: string;
  }>> => {
    return retryRequest(() => 
      api.get('/korean-market/stats')
    );
  },

  // Get coin price history
  getCoinPriceHistory: async (
    coinId: string, 
    timeframe: '1h' | '4h' | '1d' | '1w' = '1d',
    limit: number = 100
  ): Promise<ApiResponse<{
    coinId: string;
    symbol: string;
    timeframe: string;
    data: {
      timestamp: string;
      price: number;
      volume: number;
      marketCap: number;
    }[];
  }>> => {
    return retryRequest(() => 
      api.get(`/coins/${coinId}/price-history?timeframe=${timeframe}&limit=${limit}`)
    );
  },

  // Get coin market data
  getCoinMarketData: async (coinId: string): Promise<ApiResponse<{
    coinId: string;
    symbol: string;
    currentPrice: number;
    priceChange24h: number;
    priceChangePercentage24h: number;
    marketCap: number;
    marketCapRank: number;
    totalVolume: number;
    circulatingSupply: number;
    totalSupply: number;
    maxSupply: number;
    ath: number;
    athChangePercentage: number;
    atl: number;
    atlChangePercentage: number;
    lastUpdated: string;
  }>> => {
    return retryRequest(() => 
      api.get(`/coins/${coinId}/market-data`)
    );
  },

  // Get trending coins
  getTrendingCoins: async (): Promise<ApiResponse<{
    trending: Coin[];
    gainers: Coin[];
    losers: Coin[];
    mostVolume: Coin[];
  }>> => {
    return retryRequest(() => 
      api.get('/coins/trending')
    );
  },

  // Get coin social sentiment
  getCoinSentiment: async (coinId: string): Promise<ApiResponse<{
    coinId: string;
    symbol: string;
    overallSentiment: 'positive' | 'negative' | 'neutral';
    sentimentScore: number;
    socialVolume: number;
    platforms: {
      twitter: { sentiment: number; volume: number };
      reddit: { sentiment: number; volume: number };
      telegram: { sentiment: number; volume: number };
    };
    lastUpdated: string;
  }>> => {
    return retryRequest(() => 
      api.get(`/coins/${coinId}/sentiment`)
    );
  },
};
