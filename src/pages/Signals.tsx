import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { 
  SignalCard, 
  SignalFilters, 
  SignalSorting, 
  SignalDetailModal,
  ConnectionStatus,
  Pagination,
  VirtualizedGrid,
  useScrollPosition,
  SEOHead
} from '../components/common';
import { useSignals } from '../hooks/useSignals';
import { useWebSocket } from '../hooks/useWebSocket';
import { createPageSEOMeta, createWebPageStructuredData } from '../utils/seoUtils';
import type { Signal, SignalFilters as SignalFiltersType } from '../types';

const SignalsContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${theme.colors.text};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
`;

const ComingSoonCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const ComingSoonTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  margin-bottom: ${theme.spacing.md};
`;

const ComingSoonText = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.lg};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
`;

const FeatureItem = styled.li`
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background-color: rgba(229, 9, 20, 0.05);
`;

// SignalsGrid is now replaced by VirtualizedGrid

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
`;

const NoResultsTitle = styled.h3`
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`;

const NoResultsText = styled.p`
  margin-bottom: ${theme.spacing.lg};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  background-color: rgba(229, 9, 20, 0.1);
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.lg};
`;

const Signals: React.FC = () => {
  // State for filters and sorting
  const [filters, setFilters] = useState<SignalFiltersType>({});
  const [sortBy, setSortBy] = useState<string>('finalScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Scroll position management
  const { saveScrollPosition } = useScrollPosition('signals-grid');

  // SEO 메타데이터 생성
  const seoMeta = createPageSEOMeta('signals');
  const structuredData = createWebPageStructuredData(
    seoMeta.title,
    seoMeta.description,
    'https://gaindeuk.com/signals',
    [
      { name: '홈', url: 'https://gaindeuk.com/' },
      { name: '신호 분석', url: 'https://gaindeuk.com/signals' }
    ]
  );

  // WebSocket connection for real-time updates
  useWebSocket({
    autoConnect: true,
    reconnectOnMount: true,
  });

  // Fetch signals with filters
  const { data: signalsData, isLoading, error } = useSignals({
    ...filters,
    action: filters.action as 'STRONG_BUY' | 'BUY' | 'HOLD' | 'WEAK_SELL' | 'SELL' | 'STRONG_SELL' | undefined,
    timeframe: filters.timeframe as 'SCALPING' | 'DAY_TRADING' | 'SWING_TRADING' | 'LONG_TERM' | undefined,
    priority: filters.priority as 'high_priority' | 'medium_priority' | 'low_priority' | undefined,
    sort: sortBy as 'finalScore' | 'createdAt' | 'rank',
    order: sortOrder,
    page: currentPage,
    limit: 20,
  });

  // Filter and sort signals
  const filteredAndSortedSignals = useMemo(() => {
    if (!signalsData?.data?.signals) return [];

    let filtered = signalsData.data.signals;

    // Apply additional client-side filtering if needed
    if (filters.coinSymbol) {
      filtered = filtered.filter((signal: Signal) => 
        signal.symbol.toLowerCase().includes(filters.coinSymbol!.toLowerCase()) ||
        signal.name.toLowerCase().includes(filters.coinSymbol!.toLowerCase())
      );
    }

    return filtered;
  }, [signalsData?.data?.signals, filters]);

  const handleFiltersChange = (newFilters: SignalFiltersType) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignalClick = (signal: Signal) => {
    setSelectedSignal(signal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSignal(null);
  };

  // Virtualized grid render function
  const renderSignalCard = useCallback(({ 
    style, 
    item
  }: { 
    columnIndex: number; 
    rowIndex: number; 
    style: React.CSSProperties; 
    item: Signal;
    index: number;
  }) => {
    return (
      <div style={style}>
        <SignalCard
          signal={item}
          onClick={handleSignalClick}
        />
      </div>
    );
  }, []);

  // Handle scroll position
  const handleScroll = useCallback((scrollTop: number) => {
    saveScrollPosition(scrollTop);
  }, [saveScrollPosition]);

  // Calculate grid dimensions
  const getGridColumns = useCallback(() => {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  }, []);

  const [gridColumns, setGridColumns] = useState(getGridColumns());

  // Update grid columns on resize
  React.useEffect(() => {
    const handleResize = () => {
      setGridColumns(getGridColumns());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getGridColumns]);

  if (error) {
    return (
      <SignalsContainer>
        <PageTitle>📊 신호 분석</PageTitle>
        <ErrorContainer>
          <h3>신호 데이터를 불러올 수 없습니다</h3>
          <p>잠시 후 다시 시도해주세요.</p>
        </ErrorContainer>
      </SignalsContainer>
    );
  }

  return (
    <>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        canonicalUrl="/signals"
        ogTitle={seoMeta.title}
        ogDescription={seoMeta.description}
        ogUrl="/signals"
        ogType={seoMeta.ogType}
        structuredData={structuredData}
      />
      <SignalsContainer>
      <PageTitle>📊 신호 분석</PageTitle>
      
      <ConnectionStatus />
      
      {isLoading ? (
        <LoadingContainer>
          <div>신호 데이터를 불러오는 중...</div>
        </LoadingContainer>
      ) : signalsData?.data?.signals && signalsData.data.signals.length > 0 ? (
        <>
          <SignalFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
          
          <SignalSorting
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          
          <ResultsInfo>
            <span>
              총 {signalsData?.data?.total || 0}개의 신호 중 {filteredAndSortedSignals.length}개 표시
            </span>
            <span>
              {Object.keys(filters).length > 0 && '필터 적용됨'}
            </span>
          </ResultsInfo>

          {filteredAndSortedSignals.length > 0 ? (
            <VirtualizedGrid
              items={filteredAndSortedSignals}
              itemHeight={400}
              itemWidth={350}
              height={600}
              columns={gridColumns}
              renderItem={renderSignalCard}
              onScroll={handleScroll}
              overscanCount={3}
            />
          ) : (
            <NoResultsContainer>
              <NoResultsTitle>검색 결과가 없습니다</NoResultsTitle>
              <NoResultsText>
                필터 조건을 조정하거나 초기화해보세요.
              </NoResultsText>
            </NoResultsContainer>
          )}

          {signalsData?.data?.totalPages && signalsData.data.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={signalsData.data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <ComingSoonCard>
          <ComingSoonTitle>🚧 개발 중</ComingSoonTitle>
          <ComingSoonText>
            AI 기반 신호 분석 기능이 곧 제공됩니다.
          </ComingSoonText>
          <FeatureList>
            <FeatureItem>
              <strong>실시간 신호 모니터링</strong><br />
              AI가 분석한 실시간 투자 신호를 확인하세요
            </FeatureItem>
            <FeatureItem>
              <strong>신호 필터링</strong><br />
              점수, 액션 타입, 타임프레임별로 신호를 필터링하세요
            </FeatureItem>
            <FeatureItem>
              <strong>신호 상세 분석</strong><br />
              각 신호의 상세한 분석 결과를 확인하세요
            </FeatureItem>
            <FeatureItem>
              <strong>개인화 추천</strong><br />
              사용자 프로필에 맞는 맞춤형 신호를 받아보세요
            </FeatureItem>
          </FeatureList>
        </ComingSoonCard>
      )}

      <SignalDetailModal
        signal={selectedSignal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      </SignalsContainer>
    </>
  );
};

export default Signals;
