// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Signal Types
export interface Signal {
  _id: string;
  coinId: string;
  symbol: string;
  name: string;
  finalScore: number;
  breakdown: {
    price: number;
    volume: number;
    market: number;
    sentiment: number;
    whale: number;
  };
  recommendation: {
    action: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'WEAK_SELL' | 'SELL' | 'STRONG_SELL';
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  timeframe: 'SCALPING' | 'DAY_TRADING' | 'SWING_TRADING' | 'LONG_TERM';
  priority: 'high_priority' | 'medium_priority' | 'low_priority';
  rank: number;
  currentPrice: number;
  marketCap: number;
  metadata: {
    priceData: {
      change_1h: number;
      change_24h: number;
      change_7d: number;
      change_30d: number;
    };
    volumeRatio: number;
    whaleActivity: number;
    newsCount: number;
    lastUpdated: string;
    calculationTime: number;
    dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  isStrongSignal: boolean;
  isBuySignal: boolean;
  isSellSignal: boolean;
  signalStrength: 'very_strong' | 'strong' | 'moderate' | 'weak' | 'neutral';
}

// Coin Types
export interface Coin {
  _id: string;
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  totalVolume: number;
  priceChange: {
    '1h': number;
    '24h': number;
    '7d': number;
    '30d': number;
  };
  lastUpdated: string;
  metadata: {
    circulatingSupply: number;
    totalSupply: number;
    maxSupply: number;
    ath: number;
    athChangePercentage: number;
    atl: number;
    atlChangePercentage: number;
    priceChange24h: number;
    marketCapChange24h: number;
    priceChangePercentage24h: number;
    marketCapChangePercentage24h: number;
    totalVolumeChange24h: number;
    totalVolumeChangePercentage24h: number;
  };
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  volumeToMarketCapRatio: number;
  priceChange24hPercentage: number;
}

// User Profile Types
export interface UserProfile {
  _id: string;
  userId: string;
  investmentStyle: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
  riskTolerance: number; // 1-10
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tradingExperience: number; // 거래 경험 년수
  availableTime: 'minimal' | 'part-time' | 'full-time';
  preferredTimeframes: string[];
  activeHours: {
    start: string;
    end: string;
    timezone: string;
  };
  preferredCoins: string[];
  maxPositionSize: number;
  notificationSettings: {
    email: {
      enabled: boolean;
      frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    };
    push: {
      enabled: boolean;
      highPriorityOnly: boolean;
    };
    discord: {
      enabled: boolean;
      webhookUrl: string;
    };
  };
  personalizationSettings: {
    signalSensitivity: number; // 1-10
    preferredSignalTypes: string[];
    autoTradingEnabled: boolean;
    maxDailySignals: number;
  };
  learningData: {
    successfulTrades: number;
    totalTrades: number;
    averageHoldTime: number;
    preferredStrategies: string[];
  };
  lastActive: string;
  profileCompleteness: number; // 0-100
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  successRate: number;
  calculatedCompleteness: number;
}

// Dashboard Data Types
export interface DashboardData {
  topSignals: Signal[];
  topCoins: Coin[];
  koreanMarketStats: {
    kimchiPremium: number;
    totalVolume: number;
    activeUsers: number;
  };
  personalizedRecommendations: {
    suggestedTimeframes: string[];
    suggestedCoins: string[];
    riskLevel: number; // 1-10
    maxDailySignals: number;
    tradingStrategy: object;
    signalFilters: object;
    positionSizing: object;
    alertSettings: object;
    marketAdaption: object;
    confidence: number;
    lastUpdated: string;
    profileCompleteness: number;
  };
}

// Investment Strategy Types
export interface InvestmentStrategy {
  _id: string;
  userId: string;
  strategyType: 'scalping' | 'dayTrading' | 'swingTrading' | 'longTerm';
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  maxDrawdown: number;
  recommendedCoins: string[];
  entryConditions: string[];
  exitConditions: string[];
  stopLoss: number;
  takeProfit: number;
  aiAnalysis: {
    reasoning: string;
    confidence: number;
    riskFactors: string[];
    opportunityFactors: string[];
  };
  performanceMetrics: {
    winRate: number;
    averageReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Alert Types
export interface Alert {
  _id: string;
  userId: string;
  type: 'signal' | 'price' | 'volume' | 'news' | 'whale' | 'social';
  title: string;
  message: string;
  coinSymbol: string;
  signalScore?: number;
  price?: number;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  isDelivered: boolean;
  deliveryMethod: 'push' | 'email' | 'discord';
  metadata: {
    signalId?: string;
    coinId?: string;
    originalData?: object;
  };
  createdAt: string;
  sentAt?: string;
  readAt?: string;
}

// Analytics Types
export interface AnalyticsData {
  onchainData: {
    largeTransactions: {
      hash: string;
      from: string;
      to: string;
      value: string;
      timestamp: string;
      network: string;
    }[];
    whaleMovements: {
      address: string;
      amount: number;
      type: 'inflow' | 'outflow';
      timestamp: string;
      network: string;
    }[];
    tokenUnlocks: {
      tokenAddress: string;
      tokenSymbol: string;
      unlockDate: string;
      unlockAmount: string;
      unlockPercentage: number;
      description: string;
      daysUntilUnlock: number;
    }[];
  };
  socialSentiment: {
    platform: 'twitter' | 'telegram' | 'discord' | 'reddit';
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    volume: number;
    keywords: string[];
    lastUpdate: string;
  };
  koreanCommunity: {
    platform: string;
    sentiment: number;
    activity: number;
    keywords: string[];
    kimchiPremium: number;
    lastUpdate: string;
  };
  dataQuality: {
    score: number;
    lastUpdate: string;
    issues: string[];
    validationResults: object[];
    anomalyDetection: object[];
  };
  performanceMetrics: {
    system: {
      cpu: { usage: number; loadAverage: number[] };
      memory: { used: number; free: number; total: number; usage: number };
      disk: { used: number; free: number; total: number; usage: number };
    };
    application: {
      responseTime: { average: number; min: number; max: number; p95: number; p99: number };
      requestCount: { total: number; perSecond: number; errors: number };
      errorRate: number;
    };
  };
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'signal_update' | 'price_update' | 'market_update' | 'error';
  data: any;
  timestamp: string;
}

// Filter Types
export interface SignalFilters {
  minScore?: number;
  maxScore?: number;
  action?: string;
  timeframe?: string;
  priority?: string;
  coinSymbol?: string;
}

export interface CoinFilters {
  minMarketCap?: number;
  maxMarketCap?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'marketCapRank' | 'price' | 'volume' | 'change24h';
  sortOrder?: 'asc' | 'desc';
}

// Chart Types
export interface ChartData {
  timestamp: string;
  price: number;
  volume: number;
  marketCap?: number;
}

export interface TimeframeOption {
  value: string;
  label: string;
  interval: string;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}
