import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { signalsApi } from '../services/signalsApi';
import type { SignalsQueryParams } from '../services/signalsApi';
import type { Signal } from '../types';

// Query keys
export const signalsKeys = {
  all: ['signals'] as const,
  lists: () => [...signalsKeys.all, 'list'] as const,
  list: (params: SignalsQueryParams) => [...signalsKeys.lists(), params] as const,
  details: () => [...signalsKeys.all, 'detail'] as const,
  detail: (id: string) => [...signalsKeys.details(), id] as const,
  top: () => [...signalsKeys.all, 'top'] as const,
  strong: (minScore: number) => [...signalsKeys.all, 'strong', minScore] as const,
  timeframe: (timeframe: string) => [...signalsKeys.all, 'timeframe', timeframe] as const,
  stats: () => [...signalsKeys.all, 'stats'] as const,
  recommendations: (userId: string) => [...signalsKeys.all, 'recommendations', userId] as const,
};

// Get signals with filters and pagination
export const useSignals = (params: SignalsQueryParams = {}) => {
  return useQuery({
    queryKey: signalsKeys.list(params),
    queryFn: () => signalsApi.getSignals(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Get top signals for dashboard
export const useTopSignals = (limit: number = 20) => {
  return useQuery({
    queryKey: signalsKeys.top(),
    queryFn: () => signalsApi.getTopSignals(limit),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// Get strong buy signals
export const useStrongBuySignals = (minScore: number = 80) => {
  return useQuery({
    queryKey: signalsKeys.strong(minScore),
    queryFn: () => signalsApi.getStrongBuySignals(minScore),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};

// Get signals by timeframe
export const useSignalsByTimeframe = (timeframe: string) => {
  return useQuery({
    queryKey: signalsKeys.timeframe(timeframe),
    queryFn: () => signalsApi.getSignalsByTimeframe(timeframe),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};

// Get signal by ID
export const useSignal = (signalId: string) => {
  return useQuery({
    queryKey: signalsKeys.detail(signalId),
    queryFn: () => signalsApi.getSignalById(signalId),
    enabled: !!signalId,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get signal persistence prediction
export const useSignalPersistence = (signalId: string) => {
  return useQuery({
    queryKey: [...signalsKeys.detail(signalId), 'persistence'],
    queryFn: () => signalsApi.getSignalPersistence(signalId),
    enabled: !!signalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get personalized recommendations
export const usePersonalizedRecommendations = (userId: string) => {
  return useQuery({
    queryKey: signalsKeys.recommendations(userId),
    queryFn: () => signalsApi.getPersonalizedRecommendations(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get signal statistics
export const useSignalStats = () => {
  return useQuery({
    queryKey: signalsKeys.stats(),
    queryFn: () => signalsApi.getSignalStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Get real-time updates
export const useRealTimeUpdates = (lastUpdate: string) => {
  return useQuery({
    queryKey: [...signalsKeys.all, 'updates', lastUpdate],
    queryFn: () => signalsApi.getRealTimeUpdates(lastUpdate),
    enabled: !!lastUpdate,
    staleTime: 0, // Always consider stale
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  });
};

// Mutations
export const useUpdateSignal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ signalId, updates }: { signalId: string; updates: Partial<Signal> }) => {
      // This would be an actual API call in a real implementation
      return Promise.resolve({ signalId, updates });
    },
    onSuccess: ({ signalId, updates }) => {
      // Update the specific signal in all relevant queries
      queryClient.setQueryData(signalsKeys.detail(signalId), (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            data: { ...oldData.data, ...updates },
          };
        }
        return oldData;
      });

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: signalsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: signalsKeys.top() });
    },
  });
};

export const useDeleteSignal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (signalId: string) => {
      // This would be an actual API call in a real implementation
      return Promise.resolve(signalId);
    },
    onSuccess: (signalId) => {
      // Remove the signal from all queries
      queryClient.removeQueries({ queryKey: signalsKeys.detail(signalId) });
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: signalsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: signalsKeys.top() });
    },
  });
};

// Utility hooks
export const useInvalidateSignals = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: signalsKeys.all }),
    invalidateLists: () => queryClient.invalidateQueries({ queryKey: signalsKeys.lists() }),
    invalidateTop: () => queryClient.invalidateQueries({ queryKey: signalsKeys.top() }),
    invalidateStats: () => queryClient.invalidateQueries({ queryKey: signalsKeys.stats() }),
  };
};
