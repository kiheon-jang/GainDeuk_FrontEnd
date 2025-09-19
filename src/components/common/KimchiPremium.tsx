import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme, mediaQueries } from '../../styles/theme';
import { Loading, Skeleton } from './index';

interface KimchiPremiumData {
  symbol: string;
  koreanPrice: number;
  globalPrice: number;
  premium: number;
  premiumPercentage: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  volume24h: number;
  marketCap: number;
}

interface KimchiPremiumProps {
  symbol?: string;
  className?: string;
}

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const Container = styled(motion.div)`
  background: linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const Title = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const LastUpdated = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  font-weight: 400;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const PriceLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PriceValue = styled(motion.div)<{ isKorean?: boolean }>`
  color: ${props => props.isKorean ? theme.colors.primary : theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const PremiumSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${theme.spacing.md};
  background: linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%);
  border-radius: ${theme.borderRadius.md};
  border: 1px solid rgba(229, 9, 20, 0.2);
`;

const PremiumLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: ${theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PremiumValue = styled(motion.div)<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const TrendIndicator = styled(motion.div)<{ trend: 'up' | 'down' | 'stable' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => {
    switch (props.trend) {
      case 'up': return theme.colors.success;
      case 'down': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  }};
`;

const DetailsSection = styled.div`
  grid-column: 1 / -1;
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
`;

const DetailItem = styled.div`
  text-align: center;
`;

const DetailLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: ${theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div`
  color: ${theme.colors.text};
  font-size: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.error};
  text-align: center;
  gap: ${theme.spacing.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const LoadingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Mock data generator
const generateMockKimchiPremium = (symbol: string): KimchiPremiumData => {
  const basePrices: { [key: string]: number } = {
    'BTC': 45000,
    'ETH': 3000,
    'ADA': 0.5,
    'DOT': 25,
    'LINK': 15,
    'UNI': 8,
  };

  const globalPrice = basePrices[symbol] || 100;
  const premiumPercentage = (Math.random() - 0.5) * 10; // -5% to +5%
  const koreanPrice = globalPrice * (1 + premiumPercentage / 100);
  
  const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
  const trend = trends[Math.floor(Math.random() * trends.length)];

  return {
    symbol,
    koreanPrice,
    globalPrice,
    premium: koreanPrice - globalPrice,
    premiumPercentage,
    trend,
    lastUpdated: new Date().toISOString(),
    volume24h: Math.random() * 1000000000,
    marketCap: koreanPrice * 1000000,
  };
};

const KimchiPremium: React.FC<KimchiPremiumProps> = ({ 
  symbol = 'BTC', 
  className 
}) => {
  const [data, setData] = useState<KimchiPremiumData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newData = generateMockKimchiPremium(symbol);
      setData(newData);
    } catch (err) {
      setError('데이터를 불러올 수 없습니다');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every minute
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('ko-KR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(volume);
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('ko-KR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(marketCap);
  };

  if (isLoading) {
    return (
      <Container className={className}>
        <Header>
          <Skeleton width={200} height={24} />
          <Skeleton width={100} height={16} />
        </Header>
        <LoadingContainer>
          <LoadingRow>
            <Skeleton width={120} height={20} />
            <Skeleton width={100} height={20} />
          </LoadingRow>
          <LoadingRow>
            <Skeleton width={120} height={20} />
            <Skeleton width={100} height={20} />
          </LoadingRow>
          <Skeleton width="100%" height={80} />
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={className}>
        <ErrorMessage>
          <div>🚫 김치 프리미엄 데이터를 불러올 수 없습니다</div>
          <div>{error}</div>
        </ErrorMessage>
      </Container>
    );
  }

  if (!data) return null;

  const isPositive = data.premiumPercentage > 0;
  const trendIcon = data.trend === 'up' ? '📈' : data.trend === 'down' ? '📉' : '➡️';

  return (
    <Container
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <Title>
          🥟 {data.symbol} 김치 프리미엄
        </Title>
        <LastUpdated>
          {new Date(data.lastUpdated).toLocaleString('ko-KR')}
        </LastUpdated>
      </Header>

      <Content>
        <PriceSection>
          <PriceLabel>한국 가격</PriceLabel>
          <PriceValue
            isKorean={true}
            key={data.koreanPrice}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
          >
            {formatPrice(data.koreanPrice)}
          </PriceValue>
        </PriceSection>

        <PriceSection>
          <PriceLabel>글로벌 가격</PriceLabel>
          <PriceValue
            key={data.globalPrice}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
          >
            {formatPrice(data.globalPrice)}
          </PriceValue>
        </PriceSection>

        <PremiumSection>
          <PremiumLabel>프리미엄</PremiumLabel>
          <PremiumValue
            isPositive={isPositive}
            key={data.premiumPercentage}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.4 }}
          >
            {isPositive ? '+' : ''}{data.premiumPercentage.toFixed(2)}%
          </PremiumValue>
          <TrendIndicator trend={data.trend}>
            {trendIcon} {data.trend === 'up' ? '상승' : data.trend === 'down' ? '하락' : '안정'}
          </TrendIndicator>
        </PremiumSection>
      </Content>

      <DetailsSection>
        <DetailItem>
          <DetailLabel>프리미엄 금액</DetailLabel>
          <DetailValue>
            {isPositive ? '+' : ''}{formatPrice(data.premium)}
          </DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>24시간 거래량</DetailLabel>
          <DetailValue>{formatVolume(data.volume24h)}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>시가총액</DetailLabel>
          <DetailValue>{formatVolume(data.marketCap)}</DetailValue>
        </DetailItem>
      </DetailsSection>

      {isRefreshing && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(20, 20, 20, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.borderRadius.lg,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loading />
        </motion.div>
      )}
    </Container>
  );
};

export default KimchiPremium;
