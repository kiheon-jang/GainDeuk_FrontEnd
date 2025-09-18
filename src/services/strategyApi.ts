import { api, retryRequest } from './api';
import { InvestmentStrategy, ApiResponse } from '../types';

export interface StrategyGenerateData {
  userId: string;
  strategyType: 'scalping' | 'dayTrading' | 'swingTrading' | 'longTerm';
  riskLevel: 'low' | 'medium' | 'high';
  preferredCoins?: string[];
  maxPositionSize?: number;
  availableTime?: 'minimal' | 'part-time' | 'full-time';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface StrategyUpdateData {
  timeframe?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  expectedReturn?: number;
  maxDrawdown?: number;
  recommendedCoins?: string[];
  entryConditions?: string[];
  exitConditions?: string[];
  stopLoss?: number;
  takeProfit?: number;
}

export const strategyApi = {
  // Generate AI-based investment strategy
  generateStrategy: async (data: StrategyGenerateData): Promise<ApiResponse<InvestmentStrategy>> => {
    return retryRequest(() => 
      api.post<InvestmentStrategy>('/investment-strategy/generate', data)
    );
  },

  // Get strategy by ID
  getStrategyById: async (strategyId: string): Promise<ApiResponse<InvestmentStrategy>> => {
    return retryRequest(() => 
      api.get<InvestmentStrategy>(`/investment-strategy/${strategyId}`)
    );
  },

  // Get user's strategies
  getUserStrategies: async (userId: string): Promise<ApiResponse<InvestmentStrategy[]>> => {
    return retryRequest(() => 
      api.get<InvestmentStrategy[]>(`/investment-strategy/user/${userId}`)
    );
  },

  // Update strategy
  updateStrategy: async (
    strategyId: string,
    data: StrategyUpdateData
  ): Promise<ApiResponse<InvestmentStrategy>> => {
    return retryRequest(() => 
      api.put<InvestmentStrategy>(`/investment-strategy/${strategyId}`, data)
    );
  },

  // Delete strategy
  deleteStrategy: async (strategyId: string): Promise<ApiResponse<{ message: string }>> => {
    return retryRequest(() => 
      api.delete(`/investment-strategy/${strategyId}`)
    );
  },

  // Get strategy performance
  getStrategyPerformance: async (strategyId: string): Promise<ApiResponse<{
    strategyId: string;
    performanceMetrics: {
      winRate: number;
      averageReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      totalReturn: number;
      volatility: number;
    };
    backtestResults: {
      startDate: string;
      endDate: string;
      totalTrades: number;
      winningTrades: number;
      losingTrades: number;
      averageWin: number;
      averageLoss: number;
      profitFactor: number;
    };
    recentTrades: {
      date: string;
      coinSymbol: string;
      action: 'buy' | 'sell';
      price: number;
      quantity: number;
      pnl: number;
      status: 'open' | 'closed';
    }[];
    lastUpdated: string;
  }>> => {
    return retryRequest(() => 
      api.get(`/investment-strategy/${strategyId}/performance`)
    );
  },

  // Get real-time optimization status
  getOptimizationStatus: async (strategyId: string): Promise<ApiResponse<{
    strategyId: string;
    isOptimizing: boolean;
    optimizationProgress: number;
    currentParameters: object;
    optimizationHistory: {
      timestamp: string;
      parameters: object;
      performance: number;
    }[];
    estimatedCompletion: string;
    lastOptimization: string;
  }>> => {
    return retryRequest(() => 
      api.get(`/real-time-optimization/status?strategyId=${strategyId}`)
    );
  },

  // Start strategy optimization
  startOptimization: async (strategyId: string): Promise<ApiResponse<{ message: string }>> => {
    return retryRequest(() => 
      api.post(`/real-time-optimization/start`, { strategyId })
    );
  },

  // Stop strategy optimization
  stopOptimization: async (strategyId: string): Promise<ApiResponse<{ message: string }>> => {
    return retryRequest(() => 
      api.post(`/real-time-optimization/stop`, { strategyId })
    );
  },

  // Get strategy recommendations
  getStrategyRecommendations: async (userId: string): Promise<ApiResponse<{
    recommendedStrategies: {
      strategyType: string;
      confidence: number;
      expectedReturn: number;
      riskLevel: string;
      reasoning: string;
    }[];
    marketConditions: {
      volatility: 'low' | 'medium' | 'high';
      trend: 'bullish' | 'bearish' | 'sideways';
      sentiment: 'positive' | 'negative' | 'neutral';
    };
    personalizedFactors: string[];
    lastUpdated: string;
  }>> => {
    return retryRequest(() => 
      api.get(`/investment-strategy/recommendations/${userId}`)
    );
  },

  // Backtest strategy
  backtestStrategy: async (
    strategyId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{
    backtestId: string;
    strategyId: string;
    startDate: string;
    endDate: string;
    results: {
      totalReturn: number;
      annualizedReturn: number;
      volatility: number;
      sharpeRatio: number;
      maxDrawdown: number;
      winRate: number;
      totalTrades: number;
      averageTrade: number;
    };
    trades: {
      date: string;
      coinSymbol: string;
      action: 'buy' | 'sell';
      price: number;
      quantity: number;
      pnl: number;
    }[];
    equityCurve: {
      date: string;
      value: number;
    }[];
    status: 'completed' | 'running' | 'failed';
    createdAt: string;
  }>> => {
    return retryRequest(() => 
      api.post(`/investment-strategy/${strategyId}/backtest`, { startDate, endDate })
    );
  },

  // Get backtest results
  getBacktestResults: async (backtestId: string): Promise<ApiResponse<{
    backtestId: string;
    status: 'completed' | 'running' | 'failed';
    results?: object;
    error?: string;
    createdAt: string;
    completedAt?: string;
  }>> => {
    return retryRequest(() => 
      api.get(`/investment-strategy/backtest/${backtestId}`)
    );
  },
};
