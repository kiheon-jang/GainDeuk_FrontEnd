import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../styles/theme';
import { Input, Select, Pagination, Skeleton, KimchiPremium, VirtualizedList, useScrollPosition } from '../components/common';
import { PriceChart } from '../components/charts';
import { useCoins, useCoinPriceHistory, useKimchiPremium } from '../hooks';
import type { Coin } from '../types';

const CoinsContainer = styled.div`
  padding: ${theme.spacing.lg};
  
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

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  ${mediaQueries.mobile} {
    width: 100%;
    justify-content: space-between;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  min-width: 120px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${theme.spacing.xl};
  
  ${mediaQueries.tablet} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const CoinsListSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoinsListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const ResultsCount = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const CoinsList = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
`;

const CoinsListHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 120px 120px 120px 100px;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border};
  font-weight: 600;
  font-size: 0.9rem;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${mediaQueries.mobile} {
    grid-template-columns: 50px 1fr 80px 80px;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: 0.8rem;
  }
`;

const CoinRow = styled.div<{ isSelected?: boolean }>`
  display: grid;
  grid-template-columns: 60px 1fr 120px 120px 120px 100px;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isSelected ? 'rgba(229, 9, 20, 0.05)' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.isSelected ? 'rgba(229, 9, 20, 0.1)' : 'rgba(229, 9, 20, 0.02)'};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${mediaQueries.mobile} {
    grid-template-columns: 50px 1fr 80px 80px;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const RankCell = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const CoinInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const CoinIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: ${theme.colors.text};
  
  ${mediaQueries.mobile} {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
`;

const CoinDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoinName = styled.div`
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.2;
`;

const CoinSymbol = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const PriceCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const CurrentPrice = styled.div`
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: 0.9rem;
`;

const PriceChange = styled.div<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
  font-size: 0.8rem;
  font-weight: 500;
`;

const MarketCapCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.9rem;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const VolumeCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.9rem;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const Change24hCell = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
`;

const AnalysisSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const AnalysisCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
`;

const AnalysisCardTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const NoSelectionMessage = styled.div`
  text-align: center;
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.xl};
  font-style: italic;
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 120px 120px 120px 100px;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 50px 1fr 80px 80px;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const Coins: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'marketCapRank' | 'price' | 'volume' | 'change24h'>('marketCapRank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '4h' | '1d' | '1w'>('1d');
  
  const itemsPerPage = 20;
  
  // Scroll position management
  const { saveScrollPosition } = useScrollPosition('coins-list');
  
  // Fetch coins data
  const { data: coinsData, isLoading: coinsLoading, error: coinsError } = useCoins({
    page: currentPage,
    limit: itemsPerPage,
    sort: sortBy,
    order: sortOrder,
    search: searchTerm || undefined,
  });
  
  // Fetch price history for selected coin
  const { data: priceHistory, isLoading: priceHistoryLoading } = useCoinPriceHistory(
    selectedCoin?.coinId || '',
    selectedTimeframe,
    100
  );
  
  // Fetch kimchi premium for selected coin
  const { data: kimchiPremium, isLoading: kimchiPremiumLoading } = useKimchiPremium(
    selectedCoin?.symbol || ''
  );

  // Filter and sort coins
  const filteredCoins = useMemo(() => {
    if (!coinsData?.data?.coins) return [];
    
    let filtered = [...coinsData.data.coins];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [coinsData?.data?.coins, searchTerm]);

  const handleCoinSelect = (coin: Coin) => {
    setSelectedCoin(coin);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Virtualized list render function
  const renderCoinRow = useCallback(({ index, style, item }: { index: number; style: React.CSSProperties; item: Coin }) => {
    const isPositiveChange = item.priceChange['24h'] >= 0;
    const changePercentage = Math.abs(item.priceChange['24h']);
    
    return (
      <div style={style}>
        <CoinRow
          isSelected={selectedCoin?._id === item._id}
          onClick={() => handleCoinSelect(item)}
        >
          <RankCell>#{item.marketCapRank}</RankCell>
          
          <CoinInfoCell>
            <CoinIcon>
              {item.symbol.charAt(0)}
            </CoinIcon>
            <CoinDetails>
              <CoinName>{item.name}</CoinName>
              <CoinSymbol>{item.symbol}</CoinSymbol>
            </CoinDetails>
          </CoinInfoCell>
          
          <PriceCell>
            <CurrentPrice>
              ${item.currentPrice.toLocaleString()}
            </CurrentPrice>
          </PriceCell>
          
          <MarketCapCell>
            ${(item.marketCap / 1000000000).toFixed(2)}B
          </MarketCapCell>
          
          <VolumeCell>
            ${(item.totalVolume / 1000000000).toFixed(2)}B
          </VolumeCell>
          
          <Change24hCell isPositive={isPositiveChange}>
            {isPositiveChange ? '+' : '-'}{changePercentage.toFixed(2)}%
          </Change24hCell>
        </CoinRow>
      </div>
    );
  }, [selectedCoin]);

  // Handle scroll position
  const handleScroll = useCallback((scrollOffset: number) => {
    saveScrollPosition(scrollOffset);
  }, [saveScrollPosition]);

  const sortOptions = [
    { value: 'marketCapRank', label: '시가총액 순위' },
    { value: 'price', label: '가격' },
    { value: 'volume', label: '거래량' },
    { value: 'change24h', label: '24h 변동률' },
  ];

  const orderOptions = [
    { value: 'asc', label: '오름차순' },
    { value: 'desc', label: '내림차순' },
  ];

  const timeframeOptions = [
    { value: '1h', label: '1시간' },
    { value: '4h', label: '4시간' },
    { value: '1d', label: '1일' },
    { value: '1w', label: '1주' },
  ];

  return (
    <CoinsContainer>
      <PageHeader>
        <PageTitle>🪙 코인 분석</PageTitle>
        
        <ControlsSection>
          <SearchContainer>
            <Input
              placeholder="코인명 또는 심볼로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon="🔍"
              fullWidth
            />
          </SearchContainer>
          
          <FilterContainer>
            <FilterGroup>
              <FilterLabel>정렬 기준</FilterLabel>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(value) => setSortBy(value as any)}
                size="sm"
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>정렬 순서</FilterLabel>
              <Select
                options={orderOptions}
                value={sortOrder}
                onChange={(value) => setSortOrder(value as any)}
                size="sm"
              />
            </FilterGroup>
          </FilterContainer>
        </ControlsSection>
      </PageHeader>

      <MainContent>
        <CoinsListSection>
          <CoinsListHeader>
            <SectionTitle>코인 리스트</SectionTitle>
            <ResultsCount>
              {coinsLoading ? '로딩 중...' : `${filteredCoins.length}개 코인`}
            </ResultsCount>
          </CoinsListHeader>
          
          <CoinsList>
            <CoinsListHeaderRow>
              <div>순위</div>
              <div>코인</div>
              <div>가격</div>
              <div>시가총액</div>
              <div>거래량</div>
              <div>24h 변동</div>
            </CoinsListHeaderRow>
            
            {coinsLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <SkeletonRow key={index}>
                  <Skeleton width="30px" height="16px" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                    <Skeleton width="32px" height="32px" borderRadius="50%" />
                    <div>
                      <Skeleton width="80px" height="16px" />
                      <Skeleton width="40px" height="12px" />
                    </div>
                  </div>
                  <Skeleton width="80px" height="16px" />
                  <Skeleton width="100px" height="16px" />
                  <Skeleton width="90px" height="16px" />
                  <Skeleton width="60px" height="16px" />
                </SkeletonRow>
              ))
            ) : (
              <VirtualizedList
                items={filteredCoins}
                itemHeight={80}
                height={600}
                renderItem={renderCoinRow}
                onScroll={handleScroll}
                overscanCount={5}
              />
            )}
          </CoinsList>
          
          {coinsData?.data && (
            <Pagination
              currentPage={currentPage}
              totalPages={coinsData.data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </CoinsListSection>

        <AnalysisSection>
          {selectedCoin ? (
            <>
              <AnalysisCard>
                <AnalysisCardTitle>
                  📈 {selectedCoin.name} 가격 차트
                </AnalysisCardTitle>
                <PriceChart
                  data={priceHistory?.data?.data}
                  symbol={selectedCoin.symbol}
                  timeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe}
                  isLoading={priceHistoryLoading}
                  error={null}
                />
              </AnalysisCard>
              
              <AnalysisCard>
                <AnalysisCardTitle>
                  🥟 김치 프리미엄
                </AnalysisCardTitle>
                {kimchiPremiumLoading ? (
                  <Skeleton width="100%" height="120px" />
                ) : (
                  <KimchiPremium symbol={selectedCoin.symbol} />
                )}
              </AnalysisCard>
            </>
          ) : (
            <AnalysisCard>
              <NoSelectionMessage>
                코인을 선택하면 상세 분석을 확인할 수 있습니다.
              </NoSelectionMessage>
            </AnalysisCard>
          )}
        </AnalysisSection>
      </MainContent>
    </CoinsContainer>
  );
};

export default Coins;
