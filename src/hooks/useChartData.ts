import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ChartData } from '../types';

// Mock chart data generator
const generateMockChartData = (timeframe: string, symbol: string): ChartData[] => {
  const now = new Date();
  const data: ChartData[] = [];
  
  let interval: number;
  let dataPoints: number;
  
  switch (timeframe) {
    case '1h':
      interval = 5 * 60 * 1000; // 5 minutes
      dataPoints = 12;
      break;
    case '4h':
      interval = 20 * 60 * 1000; // 20 minutes
      dataPoints = 12;
      break;
    case '1d':
      interval = 2 * 60 * 60 * 1000; // 2 hours
      dataPoints = 12;
      break;
    case '1w':
      interval = 12 * 60 * 60 * 1000; // 12 hours
      dataPoints = 14;
      break;
    default:
      interval = 5 * 60 * 1000;
      dataPoints = 12;
  }
  
  // Base price for different symbols
  const basePrices: { [key: string]: number } = {
    'BTC': 45000,
    'ETH': 3000,
    'ADA': 0.5,
    'DOT': 25,
    'LINK': 15,
    'UNI': 8,
  };
  
  const basePrice = basePrices[symbol] || 100;
  let currentPrice = basePrice;
  
  for (let i = dataPoints; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * interval)).toISOString();
    
    // Generate realistic price movement
    const change = (Math.random() - 0.5) * 0.02; // ±1% change
    currentPrice = currentPrice * (1 + change);
    
    // Generate volume (higher volume during price changes)
    const volume = Math.random() * 1000000 + 100000;
    
    data.push({
      timestamp,
      price: Math.max(currentPrice, basePrice * 0.5), // Prevent negative prices
      volume,
      marketCap: currentPrice * 1000000, // Mock market cap
    });
  }
  
  return data;
};

export const useChartData = (symbol: string, timeframe: string) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['chartData', symbol, timeframe],
    queryFn: () => {
      // Simulate API delay
      return new Promise<ChartData[]>((resolve) => {
        setTimeout(() => {
          resolve(generateMockChartData(timeframe, symbol));
        }, 500);
      });
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
  
  // Manual refresh function
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Calculate price change
  const priceChange = useMemo(() => {
    if (!data || data.length < 2) return { value: 0, percentage: 0 };
    
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return {
      value: change,
      percentage,
    };
  }, [data]);
  
  return {
    data: data || [],
    isLoading: isLoading || isRefreshing,
    error,
    priceChange,
    refreshData,
  };
};
