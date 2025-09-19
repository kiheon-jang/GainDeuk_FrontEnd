import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../styles/theme';
import { Select, Skeleton, SEOHead } from '../components/common';
import { PriceChart } from '../components/charts';
import { createPageSEOMeta, createWebPageStructuredData } from '../utils/seoUtils';

const AnalyticsContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
  
  ${mediaQueries.mobile} {
    padding: ${theme.spacing.md};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const PageTitle = styled.h1`
  color: ${theme.colors.text};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
  background: linear-gradient(45deg, ${theme.colors.primary}, #FF6B6B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const Section = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
`;

const SectionHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const SectionDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  align-items: end;
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  min-width: 150px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const StatCard = styled.div`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const StatValue = styled.div<{ isPositive?: boolean; isNegative?: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => {
    if (props.isPositive) return theme.colors.success;
    if (props.isNegative) return theme.colors.error;
    return theme.colors.text;
  }};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChartContainer = styled.div`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const ChartTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.md} 0;
`;

const DataTable = styled.div`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 120px 100px 100px;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  font-weight: 600;
  color: ${theme.colors.text};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr 80px 80px;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const TableRow = styled.div<{ isPositive?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 120px 120px 100px 100px;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(229, 9, 20, 0.02);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr 80px 80px;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const Cell = styled.div<{ align?: 'left' | 'center' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: ${props => {
    switch (props.align) {
      case 'center': return 'center';
      case 'right': return 'flex-end';
      default: return 'flex-start';
    }
  }};
  color: ${theme.colors.text};
  font-size: 0.9rem;
`;

const ValueCell = styled(Cell)<{ isPositive?: boolean; isNegative?: boolean }>`
  color: ${props => {
    if (props.isPositive) return theme.colors.success;
    if (props.isNegative) return theme.colors.error;
    return theme.colors.text;
  }};
  font-weight: 500;
`;

// LoadingContainer removed as it's not used

const ErrorMessage = styled.div`
  background-color: rgba(229, 9, 20, 0.1);
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  color: ${theme.colors.error};
  font-weight: 500;
  margin-bottom: ${theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
  font-style: italic;
`;

// Mock data types
interface OnChainTransaction {
  id: string;
  type: 'whale' | 'exchange' | 'institutional';
  amount: number;
  value: number;
  from: string;
  to: string;
  timestamp: string;
  coin: string;
}

interface SocialSentiment {
  platform: string;
  sentiment: number;
  volume: number;
  mentions: number;
  timestamp: string;
  coin: string;
}

interface KoreanCommunity {
  platform: string;
  activity: number;
  sentiment: number;
  posts: number;
  timestamp: string;
  coin: string;
}

interface DataQuality {
  source: string;
  status: 'healthy' | 'warning' | 'error';
  latency: number;
  accuracy: number;
  lastUpdate: string;
}

const Analytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '4h' | '1d' | '7d'>('1d');
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC');
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // SEO 메타데이터 생성
  const seoMeta = createPageSEOMeta('analytics');
  const structuredData = createWebPageStructuredData(
    seoMeta.title,
    seoMeta.description,
    'https://gaindeuk.com/analytics',
    [
      { name: '홈', url: 'https://gaindeuk.com/' },
      { name: '분석 도구', url: 'https://gaindeuk.com/analytics' }
    ]
  );

  // Mock data
  const mockOnChainData: OnChainTransaction[] = useMemo(() => [
    {
      id: '1',
      type: 'whale',
      amount: 1000,
      value: 43250000,
      from: '0x1234...5678',
      to: '0x8765...4321',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      coin: 'BTC'
    },
    {
      id: '2',
      type: 'exchange',
      amount: 500,
      value: 21625000,
      from: '0x1111...2222',
      to: '0x3333...4444',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      coin: 'BTC'
    },
    {
      id: '3',
      type: 'institutional',
      amount: 2000,
      value: 86500000,
      from: '0x5555...6666',
      to: '0x7777...8888',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      coin: 'BTC'
    }
  ], []);

  const mockSocialData: SocialSentiment[] = useMemo(() => [
    {
      platform: 'Twitter',
      sentiment: 0.75,
      volume: 1250,
      mentions: 850,
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      coin: 'BTC'
    },
    {
      platform: 'Telegram',
      sentiment: 0.65,
      volume: 980,
      mentions: 650,
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      coin: 'BTC'
    },
    {
      platform: 'Discord',
      sentiment: 0.80,
      volume: 750,
      mentions: 420,
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      coin: 'BTC'
    }
  ], []);

  const mockKoreanData: KoreanCommunity[] = useMemo(() => [
    {
      platform: '디시인사이드',
      activity: 0.85,
      sentiment: 0.70,
      posts: 120,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      coin: 'BTC'
    },
    {
      platform: '네이버카페',
      activity: 0.60,
      sentiment: 0.65,
      posts: 85,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      coin: 'BTC'
    },
    {
      platform: '텔레그램',
      activity: 0.90,
      sentiment: 0.75,
      posts: 200,
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      coin: 'BTC'
    }
  ], []);

  const mockQualityData: DataQuality[] = useMemo(() => [
    {
      source: 'Binance API',
      status: 'healthy',
      latency: 45,
      accuracy: 99.8,
      lastUpdate: new Date(Date.now() - 1000 * 30).toISOString()
    },
    {
      source: 'CoinGecko API',
      status: 'healthy',
      latency: 120,
      accuracy: 99.5,
      lastUpdate: new Date(Date.now() - 1000 * 60).toISOString()
    },
    {
      source: 'Twitter API',
      status: 'warning',
      latency: 250,
      accuracy: 95.2,
      lastUpdate: new Date(Date.now() - 1000 * 60 * 2).toISOString()
    }
  ], []);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedTimeframe, selectedCoin]);

  const handleTimeframeChange = (value: string | number) => {
    setSelectedTimeframe(value as any);
    setIsLoading(true);
  };

  const handleCoinChange = (value: string | number) => {
    setSelectedCoin(value as string);
    setIsLoading(true);
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    return `${Math.floor(diff / 86400000)}일 전`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'healthy': return '정상';
      case 'warning': return '주의';
      case 'error': return '오류';
      default: return '알 수 없음';
    }
  };

  if (error) {
    return (
      <AnalyticsContainer>
        <PageTitle>📊 분석 도구</PageTitle>
        <ErrorMessage>{error}</ErrorMessage>
      </AnalyticsContainer>
    );
  }

  return (
    <>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        canonicalUrl="/analytics"
        ogTitle={seoMeta.title}
        ogDescription={seoMeta.description}
        ogUrl="/analytics"
        ogType={seoMeta.ogType}
        structuredData={structuredData}
      />
      <AnalyticsContainer>
      <PageHeader>
        <PageTitle>📊 분석 도구</PageTitle>
        <PageDescription>
          온체인 데이터, 소셜미디어 감정, 한국 커뮤니티 분석을 통해 
          시장의 숨겨진 인사이트를 발견하세요.
        </PageDescription>
      </PageHeader>

      <MainContent>
        {/* Controls */}
        <Section>
          <ControlsSection>
            <FilterGroup>
              <FilterLabel>타임프레임</FilterLabel>
              <Select
                options={[
                  { value: '1h', label: '1시간' },
                  { value: '4h', label: '4시간' },
                  { value: '1d', label: '1일' },
                  { value: '7d', label: '7일' },
                ]}
                value={selectedTimeframe}
                onChange={handleTimeframeChange}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>코인</FilterLabel>
              <Select
                options={[
                  { value: 'BTC', label: 'Bitcoin' },
                  { value: 'ETH', label: 'Ethereum' },
                  { value: 'ADA', label: 'Cardano' },
                  { value: 'DOT', label: 'Polkadot' },
                ]}
                value={selectedCoin}
                onChange={handleCoinChange}
              />
            </FilterGroup>
          </ControlsSection>
        </Section>

        {/* On-Chain Analysis */}
        <Section>
          <SectionHeader>
            <SectionTitle>🐋 온체인 분석</SectionTitle>
            <SectionDescription>
              고래 움직임과 대형 거래를 실시간으로 추적합니다.
            </SectionDescription>
          </SectionHeader>

          <StatsGrid>
            <StatCard>
              <StatValue isPositive={true}>12</StatValue>
              <StatLabel>고래 거래</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>$2.4B</StatValue>
              <StatLabel>총 거래량</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue isPositive={true}>+15%</StatValue>
              <StatLabel>거래 증가율</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>3.2분</StatValue>
              <StatLabel>평균 확인 시간</StatLabel>
            </StatCard>
          </StatsGrid>

          <ChartContainer>
            <ChartTitle>고래 거래 추이</ChartTitle>
            {isLoading ? (
              <Skeleton height="300px" width="100%" />
            ) : (
              <PriceChart
                data={[]}
                timeframe={selectedTimeframe}
                symbol={selectedCoin}
                error={null}
                onTimeframeChange={handleTimeframeChange}
              />
            )}
          </ChartContainer>

          <DataTable>
            <TableHeader>
              <Cell>거래 유형</Cell>
              <Cell align="right">수량</Cell>
              <Cell align="right">가치</Cell>
              <Cell align="center">시간</Cell>
              <Cell align="center">상태</Cell>
            </TableHeader>
            
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <Cell><Skeleton width="100px" height="16px" /></Cell>
                  <Cell align="right"><Skeleton width="60px" height="16px" /></Cell>
                  <Cell align="right"><Skeleton width="80px" height="16px" /></Cell>
                  <Cell align="center"><Skeleton width="50px" height="16px" /></Cell>
                  <Cell align="center"><Skeleton width="40px" height="16px" /></Cell>
                </TableRow>
              ))
            ) : mockOnChainData.length > 0 ? (
              mockOnChainData.map((transaction) => (
                <TableRow key={transaction.id}>
                  <Cell>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {transaction.type === 'whale' ? '🐋 고래' : 
                         transaction.type === 'exchange' ? '🏦 거래소' : '🏢 기관'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: theme.colors.textSecondary }}>
                        {transaction.from.slice(0, 8)}...{transaction.to.slice(-8)}
                      </div>
                    </div>
                  </Cell>
                  <ValueCell align="right">
                    {transaction.amount.toLocaleString()} {transaction.coin}
                  </ValueCell>
                  <ValueCell align="right">
                    {formatValue(transaction.value)}
                  </ValueCell>
                  <Cell align="center">
                    {formatTimestamp(transaction.timestamp)}
                  </Cell>
                  <Cell align="center">
                    <span style={{ 
                      color: theme.colors.success, 
                      fontWeight: 600 
                    }}>
                      완료
                    </span>
                  </Cell>
                </TableRow>
              ))
            ) : (
              <EmptyState>거래 데이터가 없습니다.</EmptyState>
            )}
          </DataTable>
        </Section>

        {/* Social Media Sentiment */}
        <Section>
          <SectionHeader>
            <SectionTitle>📱 소셜미디어 감정 분석</SectionTitle>
            <SectionDescription>
              Twitter, Telegram, Discord의 감정을 실시간으로 분석합니다.
            </SectionDescription>
          </SectionHeader>

          <StatsGrid>
            <StatCard>
              <StatValue isPositive={true}>0.73</StatValue>
              <StatLabel>전체 감정 점수</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>2,980</StatValue>
              <StatLabel>총 언급 수</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue isPositive={true}>+8.5%</StatValue>
              <StatLabel>감정 개선</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>3개</StatValue>
              <StatLabel>모니터링 플랫폼</StatLabel>
            </StatCard>
          </StatsGrid>

          <DataTable>
            <TableHeader>
              <Cell>플랫폼</Cell>
              <Cell align="center">감정 점수</Cell>
              <Cell align="right">언급 수</Cell>
              <Cell align="right">볼륨</Cell>
              <Cell align="center">업데이트</Cell>
            </TableHeader>
            
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <Cell><Skeleton width="80px" height="16px" /></Cell>
                  <Cell align="center"><Skeleton width="60px" height="16px" /></Cell>
                  <Cell align="right"><Skeleton width="50px" height="16px" /></Cell>
                  <Cell align="right"><Skeleton width="60px" height="16px" /></Cell>
                  <Cell align="center"><Skeleton width="50px" height="16px" /></Cell>
                </TableRow>
              ))
            ) : mockSocialData.length > 0 ? (
              mockSocialData.map((sentiment, index) => (
                <TableRow key={index}>
                  <Cell>
                    <div style={{ fontWeight: 600 }}>
                      {sentiment.platform === 'Twitter' ? '🐦 Twitter' :
                       sentiment.platform === 'Telegram' ? '📱 Telegram' : '💬 Discord'}
                    </div>
                  </Cell>
                  <ValueCell align="center" isPositive={sentiment.sentiment > 0.5}>
                    {(sentiment.sentiment * 100).toFixed(1)}%
                  </ValueCell>
                  <ValueCell align="right">
                    {sentiment.mentions.toLocaleString()}
                  </ValueCell>
                  <ValueCell align="right">
                    {sentiment.volume.toLocaleString()}
                  </ValueCell>
                  <Cell align="center">
                    {formatTimestamp(sentiment.timestamp)}
                  </Cell>
                </TableRow>
              ))
            ) : (
              <EmptyState>소셜미디어 데이터가 없습니다.</EmptyState>
            )}
          </DataTable>
        </Section>

        {/* Korean Community Analysis */}
        <Section>
          <SectionHeader>
            <SectionTitle>🇰🇷 한국 커뮤니티 분석</SectionTitle>
            <SectionDescription>
              디시인사이드, 네이버카페 등 한국 커뮤니티를 분석합니다.
            </SectionDescription>
          </SectionHeader>

          <StatsGrid>
            <StatCard>
              <StatValue isPositive={true}>0.78</StatValue>
              <StatLabel>한국 감정 점수</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>405</StatValue>
              <StatLabel>총 게시물</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue isPositive={true}>+12%</StatValue>
              <StatLabel>활동 증가</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>3개</StatValue>
              <StatLabel>모니터링 커뮤니티</StatLabel>
            </StatCard>
          </StatsGrid>

          <DataTable>
            <TableHeader>
              <Cell>커뮤니티</Cell>
              <Cell align="center">활동도</Cell>
              <Cell align="center">감정 점수</Cell>
              <Cell align="right">게시물 수</Cell>
              <Cell align="center">업데이트</Cell>
            </TableHeader>
            
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <Cell><Skeleton width="100px" height="16px" /></Cell>
                  <Cell align="center"><Skeleton width="60px" height="16px" /></Cell>
                  <Cell align="center"><Skeleton width="60px" height="16px" /></Cell>
                  <Cell align="right"><Skeleton width="50px" height="16px" /></Cell>
                  <Cell align="center"><Skeleton width="50px" height="16px" /></Cell>
                </TableRow>
              ))
            ) : mockKoreanData.length > 0 ? (
              mockKoreanData.map((community, index) => (
                <TableRow key={index}>
                  <Cell>
                    <div style={{ fontWeight: 600 }}>
                      {community.platform === '디시인사이드' ? '💬 디시인사이드' :
                       community.platform === '네이버카페' ? '🏠 네이버카페' : '📱 텔레그램'}
                    </div>
                  </Cell>
                  <ValueCell align="center" isPositive={community.activity > 0.7}>
                    {(community.activity * 100).toFixed(1)}%
                  </ValueCell>
                  <ValueCell align="center" isPositive={community.sentiment > 0.5}>
                    {(community.sentiment * 100).toFixed(1)}%
                  </ValueCell>
                  <ValueCell align="right">
                    {community.posts.toLocaleString()}
                  </ValueCell>
                  <Cell align="center">
                    {formatTimestamp(community.timestamp)}
                  </Cell>
                </TableRow>
              ))
            ) : (
              <EmptyState>한국 커뮤니티 데이터가 없습니다.</EmptyState>
            )}
          </DataTable>
        </Section>

        {/* Data Quality Monitoring */}
        <Section>
          <SectionHeader>
            <SectionTitle>🔍 데이터 품질 모니터링</SectionTitle>
            <SectionDescription>
              실시간 데이터 품질을 모니터링하고 검증합니다.
            </SectionDescription>
          </SectionHeader>

          <StatsGrid>
            <StatCard>
              <StatValue isPositive={true}>98.2%</StatValue>
              <StatLabel>전체 정확도</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>138ms</StatValue>
              <StatLabel>평균 지연시간</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue isPositive={true}>99.1%</StatValue>
              <StatLabel>가용성</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>3개</StatValue>
              <StatLabel>모니터링 소스</StatLabel>
            </StatCard>
          </StatsGrid>

          <DataTable>
            <TableHeader>
              <Cell>데이터 소스</Cell>
              <Cell align="center">상태</Cell>
              <Cell align="right">지연시간</Cell>
              <Cell align="right">정확도</Cell>
              <Cell align="center">마지막 업데이트</Cell>
            </TableHeader>
            
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <Cell><Skeleton width="120px" height="16px" /></Cell>
                  <Cell align="center"><Skeleton width="50px" height="16px" /></Cell>
                  <Cell align="right"><Skeleton width="60px" height="16px" /></Cell>
                  <Cell align="right"><Skeleton width="60px" height="16px" /></Cell>
                  <Cell align="center"><Skeleton width="50px" height="16px" /></Cell>
                </TableRow>
              ))
            ) : mockQualityData.length > 0 ? (
              mockQualityData.map((quality, index) => (
                <TableRow key={index}>
                  <Cell>
                    <div style={{ fontWeight: 600 }}>
                      {quality.source}
                    </div>
                  </Cell>
                  <Cell align="center">
                    <span style={{ 
                      color: getStatusColor(quality.status), 
                      fontWeight: 600 
                    }}>
                      {getStatusName(quality.status)}
                    </span>
                  </Cell>
                  <ValueCell align="right">
                    {quality.latency}ms
                  </ValueCell>
                  <ValueCell align="right" isPositive={quality.accuracy > 95}>
                    {quality.accuracy.toFixed(1)}%
                  </ValueCell>
                  <Cell align="center">
                    {formatTimestamp(quality.lastUpdate)}
                  </Cell>
                </TableRow>
              ))
            ) : (
              <EmptyState>데이터 품질 정보가 없습니다.</EmptyState>
            )}
          </DataTable>
        </Section>
      </MainContent>
      </AnalyticsContainer>
    </>
  );
};

export default Analytics;
