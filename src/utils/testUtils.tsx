import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const mockSignal = {
  _id: '1',
  coinId: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
  currentPrice: 50000,
  rank: 1,
  finalScore: 95,
  breakdown: {
    price: 25,
    volume: 20,
    market: 20,
    sentiment: 15,
    whale: 20,
  },
  recommendation: {
    action: 'BUY' as const,
    confidence: 'HIGH' as const,
  },
  timeframe: 'DAY_TRADING' as const,
  priority: 'high_priority' as const,
  marketCap: 1000000000000,
  metadata: {
    priceData: {
      change_1h: 1.2,
      change_24h: 5.2,
      change_7d: 12.5,
      change_30d: 25.8,
    },
    volumeRatio: 1.5,
    whaleActivity: 0.8,
    newsCount: 15,
    lastUpdated: '2024-01-01T00:00:00Z',
    calculationTime: 150,
    dataQuality: 'excellent' as const,
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  isStrongSignal: true,
  isBuySignal: true,
  isSellSignal: false,
};

export const mockCoin = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
  current_price: 50000,
  market_cap: 1000000000000,
  market_cap_rank: 1,
  fully_diluted_valuation: 1050000000000,
  total_volume: 1000000000,
  high_24h: 52000,
  low_24h: 48000,
  price_change_24h: 2500,
  price_change_percentage_24h: 5.2,
  market_cap_change_24h: 50000000000,
  market_cap_change_percentage_24h: 5.2,
  circulating_supply: 20000000,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 69000,
  ath_change_percentage: -27.5,
  ath_date: '2021-11-10T14:24:11.849Z',
  atl: 67.81,
  atl_change_percentage: 73650.0,
  atl_date: '2013-07-06T00:00:00.000Z',
  roi: null,
  last_updated: '2024-01-01T00:00:00.000Z',
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  sparkline_in_7d: {
    price: [48000, 49000, 50000, 51000, 50000, 52000, 50000],
  },
};

export const mockAlert = {
  id: '1',
  type: 'price_alert' as const,
  coinId: 'bitcoin',
  coinSymbol: 'BTC',
  condition: 'above' as const,
  value: 55000,
  isActive: true,
  message: 'Bitcoin price alert triggered',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  triggeredAt: null,
};

// Mock API responses
export const mockApiResponse = <T>(data: T, delay: number = 0): Promise<{ data: T }> => {
  return new Promise<{ data: T }>((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// Mock error response
export const mockApiError = (message: string = 'API Error', status: number = 500): Promise<never> => {
  return Promise.reject({
    response: {
      status,
      data: { message },
    },
    message,
  });
};

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
};

export const createMockUser = () => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://via.placeholder.com/40',
});

// Mock WebSocket
export const createMockWebSocket = () => {
  const mockWs = {
    send: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    readyState: WebSocket.OPEN,
  };
  return mockWs as any;
};

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockObserver = {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
  
  (global as any).IntersectionObserver = jest.fn(() => mockObserver);
  return mockObserver;
};

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockObserver = {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
  
  (global as any).ResizeObserver = jest.fn(() => mockObserver);
  return mockObserver;
};

// Mock performance
export const mockPerformance = () => {
  const mockPerf = {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  };
  
  Object.defineProperty(window, 'performance', {
    value: mockPerf,
    writable: true,
  });
  
  return mockPerf;
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
