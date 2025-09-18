import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coinsApi, CoinsQueryParams } from '../services/coinsApi';
import { Coin } from '../types';

// Query keys
export const coinsKeys = {
  all: ['coins'] as const,
  lists: () => [...coinsKeys.all, 'list'] as const,
  list: (params: CoinsQueryParams) => [...coinsKeys.lists(), params] as const,
  details: () => [...coinsKeys.all, 'detail'] as const,
  detail: (id: string) => [...coinsKeys.details(), id] as const,
  top: () => [...coinsKeys.all, 'top'] as const,
  search: (query: string) => [...coinsKeys.all, 'search', query] as const,
  kimchiPremium: (symbol: string) => [...coinsKeys.all, 'kimchi-premium', symbol] as const,
  kimchiPremiums: (symbols: string[]) => [...coinsKeys.all, 'kimchi-premiums', symbols] as const,
  koreanMarketStats: () => [...coinsKeys.all, 'korean-market-stats'] as const,
  priceHistory: (coinId: string, timeframe: string) => [...coinsKeys.detail(coinId), 'price-history', timeframe] as const,
  marketData: (coinId: string) => [...coinsKeys.detail(coinId), 'market-data'] as const,
  trending: () => [...coinsKeys.all, 'trending'] as const,
  sentiment: (coinId: string) => [...coinsKeys.detail(coinId), 'sentiment'] as const,
};

// Get coins with filters and pagination
export const useCoins = (params: CoinsQueryParams = {}) => {
  return useQuery({
    queryKey: coinsKeys.list(params),
    queryFn: () => coinsApi.getCoins(params),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Get top coins by market cap
export const useTopCoins = (limit: number = 10) => {
  return useQuery({
    queryKey: coinsKeys.top(),
    queryFn: () => coinsApi.getTopCoins(limit),
    staleTime: 30 * 1000,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Get coin by ID
export const useCoin = (coinId: string) => {
  return useQuery({
    queryKey: coinsKeys.detail(coinId),
    queryFn: () => coinsApi.getCoinById(coinId),
    enabled: !!coinId,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

// Search coins
export const useSearchCoins = (query: string) => {
  return useQuery({
    queryKey: coinsKeys.search(query),
    queryFn: () => coinsApi.searchCoins(query),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Kimchi Premium for a single coin
export const useKimchiPremium = (symbol: string) => {
  return useQuery({
    queryKey: coinsKeys.kimchiPremium(symbol),
    queryFn: () => coinsApi.getKimchiPremium(symbol),
    enabled: !!symbol,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Get Kimchi Premium for multiple coins
export const useKimchiPremiums = (symbols: string[]) => {
  return useQuery({
    queryKey: coinsKeys.kimchiPremiums(symbols),
    queryFn: () => coinsApi.getKimchiPremiums(symbols),
    enabled: symbols.length > 0,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};

// Get Korean market statistics
export const useKoreanMarketStats = () => {
  return useQuery({
    queryKey: coinsKeys.koreanMarketStats(),
    queryFn: () => coinsApi.getKoreanMarketStats(),
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

// Get coin price history
export const useCoinPriceHistory = (
  coinId: string,
  timeframe: '1h' | '4h' | '1d' | '1w' = '1d',
  limit: number = 100
) => {
  return useQuery({
    queryKey: coinsKeys.priceHistory(coinId, timeframe),
    queryFn: () => coinsApi.getCoinPriceHistory(coinId, timeframe, limit),
    enabled: !!coinId,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

// Get coin market data
export const useCoinMarketData = (coinId: string) => {
  return useQuery({
    queryKey: coinsKeys.marketData(coinId),
    queryFn: () => coinsApi.getCoinMarketData(coinId),
    enabled: !!coinId,
    staleTime: 30 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};

// Get trending coins
export const useTrendingCoins = () => {
  return useQuery({
    queryKey: coinsKeys.trending(),
    queryFn: () => coinsApi.getTrendingCoins(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Get coin social sentiment
export const useCoinSentiment = (coinId: string) => {
  return useQuery({
    queryKey: coinsKeys.sentiment(coinId),
    queryFn: () => coinsApi.getCoinSentiment(coinId),
    enabled: !!coinId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

// Mutations
export const useUpdateCoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ coinId, updates }: { coinId: string; updates: Partial<Coin> }) => {
      // This would be an actual API call in a real implementation
      return Promise.resolve({ coinId, updates });
    },
    onSuccess: ({ coinId, updates }) => {
      // Update the specific coin in all relevant queries
      queryClient.setQueryData(coinsKeys.detail(coinId), (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            data: { ...oldData.data, ...updates },
          };
        }
        return oldData;
      });

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: coinsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: coinsKeys.top() });
    },
  });
};

// Utility hooks
export const useInvalidateCoins = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: coinsKeys.all }),
    invalidateLists: () => queryClient.invalidateQueries({ queryKey: coinsKeys.lists() }),
    invalidateTop: () => queryClient.invalidateQueries({ queryKey: coinsKeys.top() }),
    invalidateKimchiPremiums: () => queryClient.invalidateQueries({ 
      queryKey: [...coinsKeys.all, 'kimchi-premium'] 
    }),
    invalidateKoreanMarketStats: () => queryClient.invalidateQueries({ 
      queryKey: coinsKeys.koreanMarketStats() 
    }),
  };
};
