import type { Signal, Coin, Alert } from '../types';

// Mock data generators for performance testing
export const generateMockSignals = (count: number): Signal[] => {
  const symbols = ['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'SOL', 'MATIC', 'AVAX'];
  const types = ['buy', 'sell', 'hold'] as const;
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;
  
  return Array.from({ length: count }, (_, index) => ({
    _id: `signal-${index}`,
    symbol: symbols[index % symbols.length],
    name: `${symbols[index % symbols.length]} Signal`,
    type: types[index % types.length],
    timeframe: timeframes[index % timeframes.length],
    price: Math.random() * 100000,
    finalScore: Math.floor(Math.random() * 100),
    technicalScore: Math.floor(Math.random() * 100),
    sentimentScore: Math.floor(Math.random() * 100),
    volumeScore: Math.floor(Math.random() * 100),
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    confidence: Math.random(),
    description: `This is a mock signal for ${symbols[index % symbols.length]} with score ${Math.floor(Math.random() * 100)}`,
    indicators: {
      rsi: Math.random() * 100,
      macd: Math.random() * 10 - 5,
      bollinger: {
        upper: Math.random() * 100,
        middle: Math.random() * 100,
        lower: Math.random() * 100
      }
    },
    volume: Math.random() * 1000000000,
    marketCap: Math.random() * 1000000000000
  }));
};

export const generateMockCoins = (count: number): Coin[] => {
  const symbols = ['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'SOL', 'MATIC', 'AVAX', 'ATOM', 'FTM', 'NEAR', 'ALGO', 'VET', 'ICP', 'FIL', 'THETA', 'XTZ', 'EOS'];
  const names = ['Bitcoin', 'Ethereum', 'Cardano', 'Polkadot', 'Chainlink', 'Uniswap', 'Aave', 'Solana', 'Polygon', 'Avalanche', 'Cosmos', 'Fantom', 'NEAR Protocol', 'Algorand', 'VeChain', 'Internet Computer', 'Filecoin', 'Theta Network', 'Tezos', 'EOS'];
  
  return Array.from({ length: count }, (_, index) => ({
    _id: `coin-${index}`,
    symbol: symbols[index % symbols.length],
    name: names[index % names.length],
    currentPrice: Math.random() * 100000,
    marketCap: Math.random() * 1000000000000,
    totalVolume: Math.random() * 10000000000,
    marketCapRank: index + 1,
    priceChange: {
      '1h': (Math.random() - 0.5) * 10,
      '24h': (Math.random() - 0.5) * 20,
      '7d': (Math.random() - 0.5) * 50,
      '30d': (Math.random() - 0.5) * 100
    },
    image: `https://cryptoicons.org/api/icon/${symbols[index % symbols.length].toLowerCase()}/200`,
    lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString()
  }));
};

export const generateMockAlerts = (count: number): Alert[] => {
  const types = ['buy', 'sell', 'warning', 'info'] as const;
  const strengths = ['low', 'medium', 'high'] as const;
  const coins = ['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'SOL', 'MATIC', 'AVAX'];
  const channels = [['push'], ['email'], ['discord'], ['push', 'email'], ['push', 'email', 'discord']];
  
  const titles = [
    '강력한 매수 신호',
    '매도 신호 감지',
    '변동성 증가 경고',
    '김치 프리미엄 알림',
    '돌파 신호',
    '지지선 터치',
    '저항선 돌파',
    '거래량 급증',
    '기술적 분석 신호',
    '시장 상황 알림'
  ];
  
  const messages = [
    '가격이 지지선을 터치하고 반등 신호가 감지되었습니다.',
    '저항선에서 거부당하며 하락 신호가 나타났습니다.',
    '시장 변동성이 급격히 증가하고 있습니다.',
    '김치 프리미엄이 3%를 넘어섰습니다.',
    '주요 저항선을 돌파했습니다.',
    '지지선 근처에서 매수 기회가 생겼습니다.',
    '저항선을 성공적으로 돌파했습니다.',
    '거래량이 평소 대비 3배 증가했습니다.',
    '기술적 지표에서 강한 신호가 나타났습니다.',
    '시장 상황이 급변하고 있습니다.'
  ];
  
  return Array.from({ length: count }, (_, index) => ({
    _id: `alert-${index}`,
    type: types[index % types.length],
    title: titles[index % titles.length],
    message: messages[index % messages.length],
    coin: coins[index % coins.length],
    price: Math.random() * 100000,
    strength: strengths[index % strengths.length],
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    isRead: Math.random() > 0.5,
    channels: channels[index % channels.length]
  }));
};

// Performance testing utilities
export const measureRenderTime = (renderFunction: () => void): number => {
  const start = performance.now();
  renderFunction();
  const end = performance.now();
  return end - start;
};

export const generateLargeDataset = {
  signals: (count: number) => generateMockSignals(count),
  coins: (count: number) => generateMockCoins(count),
  alerts: (count: number) => generateMockAlerts(count)
};

// Test configurations
export const PERFORMANCE_TEST_CONFIGS = {
  small: { signals: 100, coins: 50, alerts: 50 },
  medium: { signals: 1000, coins: 500, alerts: 500 },
  large: { signals: 5000, coins: 2000, alerts: 2000 },
  xlarge: { signals: 10000, coins: 5000, alerts: 5000 }
};

export default {
  generateMockSignals,
  generateMockCoins,
  generateMockAlerts,
  measureRenderTime,
  generateLargeDataset,
  PERFORMANCE_TEST_CONFIGS
};
