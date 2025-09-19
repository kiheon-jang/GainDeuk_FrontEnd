import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../styles/theme';
import { Button, VirtualizedList, VirtualizedGrid, useScrollPosition } from '../components/common';
import { generateLargeDataset, PERFORMANCE_TEST_CONFIGS, measureRenderTime } from '../utils/mockDataGenerator';
import type { Signal, Coin, Alert } from '../types';

const PerformanceTestContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  
  ${mediaQueries.mobile} {
    padding: ${theme.spacing.md};
  }
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
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
  
  ${mediaQueries.mobile} {
    flex-direction: column;
  }
`;

const TestButton = styled(Button)`
  min-width: 120px;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const StatCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  text-align: center;
`;

const StatValue = styled.div<{ isPositive?: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const TestSection = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
`;

const TestResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const TestResult = styled.div`
  padding: ${theme.spacing.sm};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  font-family: monospace;
  font-size: 0.9rem;
`;

const PerformanceTest: React.FC = () => {
  const [testConfig, setTestConfig] = useState<keyof typeof PERFORMANCE_TEST_CONFIGS>('small');
  const [signals, setSignals] = useState<Signal[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Scroll position management
  const { saveScrollPosition: saveSignalsScroll } = useScrollPosition('performance-signals');
  const { saveScrollPosition: saveCoinsScroll } = useScrollPosition('performance-coins');
  const { saveScrollPosition: saveAlertsScroll } = useScrollPosition('performance-alerts');

  const generateData = useCallback(async (config: keyof typeof PERFORMANCE_TEST_CONFIGS) => {
    setIsGenerating(true);
    setTestResults([]);
    
    const configData = PERFORMANCE_TEST_CONFIGS[config];
    
    try {
      // Measure data generation time
      const generationStart = performance.now();
      
      const newSignals = generateLargeDataset.signals(configData.signals);
      const newCoins = generateLargeDataset.coins(configData.coins);
      const newAlerts = generateLargeDataset.alerts(configData.alerts);
      
      const generationEnd = performance.now();
      const generationTime = generationEnd - generationStart;
      
      setSignals(newSignals);
      setCoins(newCoins);
      setAlerts(newAlerts);
      
      setTestResults(prev => [
        ...prev,
        `데이터 생성 완료: ${configData.signals + configData.coins + configData.alerts}개 항목`,
        `생성 시간: ${generationTime.toFixed(2)}ms`,
        `Signals: ${configData.signals}개`,
        `Coins: ${configData.coins}개`,
        `Alerts: ${configData.alerts}개`
      ]);
      
    } catch (error) {
      setTestResults(prev => [...prev, `오류 발생: ${error}`]);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const runPerformanceTest = useCallback(() => {
    setTestResults(prev => [...prev, '=== 성능 테스트 시작 ===']);
    
    // Test virtualized list rendering
    const testRenderTime = measureRenderTime(() => {
      // This would normally trigger a re-render
      setSignals(prev => [...prev]);
    });
    
    setTestResults(prev => [
      ...prev,
      `가상화 리스트 렌더링 시간: ${testRenderTime.toFixed(2)}ms`,
      `메모리 사용량: ${(performance as any).memory?.usedJSHeapSize ? 
        `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 
        '측정 불가'}`
    ]);
  }, []);

  // Render functions for virtualized components
  const renderSignalCard = useCallback(({ style, item }: { style: React.CSSProperties; item: Signal }) => (
    <div style={style}>
      <div style={{
        padding: theme.spacing.sm,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.sm,
        margin: theme.spacing.xs,
        backgroundColor: theme.colors.surface
      }}>
        <div style={{ fontWeight: 600, marginBottom: theme.spacing.xs }}>
          {item.symbol} - {item.type}
        </div>
        <div style={{ fontSize: '0.9rem', color: theme.colors.textSecondary }}>
          Score: {item.finalScore} | Price: ${item.price.toFixed(2)}
        </div>
      </div>
    </div>
  ), []);

  const renderCoinRow = useCallback(({ style, item }: { style: React.CSSProperties; item: Coin }) => (
    <div style={style}>
      <div style={{
        padding: theme.spacing.sm,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.sm,
        margin: theme.spacing.xs,
        backgroundColor: theme.colors.surface,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontWeight: 600 }}>{item.name} ({item.symbol})</div>
          <div style={{ fontSize: '0.9rem', color: theme.colors.textSecondary }}>
            Rank: #{item.marketCapRank}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600 }}>${item.currentPrice.toFixed(2)}</div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: item.priceChange['24h'] >= 0 ? theme.colors.success : theme.colors.error 
          }}>
            {item.priceChange['24h'] >= 0 ? '+' : ''}{item.priceChange['24h'].toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  ), []);

  const renderAlertItem = useCallback(({ style, item }: { style: React.CSSProperties; item: Alert }) => (
    <div style={style}>
      <div style={{
        padding: theme.spacing.sm,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.sm,
        margin: theme.spacing.xs,
        backgroundColor: theme.colors.surface
      }}>
        <div style={{ fontWeight: 600, marginBottom: theme.spacing.xs }}>
          {item.title} - {item.coin}
        </div>
        <div style={{ fontSize: '0.9rem', color: theme.colors.textSecondary }}>
          {item.message}
        </div>
        <div style={{ 
          fontSize: '0.8rem', 
          color: theme.colors.textSecondary,
          marginTop: theme.spacing.xs
        }}>
          {new Date(item.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  ), []);

  const handleScroll = useCallback((scrollOffset: number, type: 'signals' | 'coins' | 'alerts') => {
    switch (type) {
      case 'signals':
        saveSignalsScroll(scrollOffset);
        break;
      case 'coins':
        saveCoinsScroll(scrollOffset);
        break;
      case 'alerts':
        saveAlertsScroll(scrollOffset);
        break;
    }
  }, [saveSignalsScroll, saveCoinsScroll, saveAlertsScroll]);

  return (
    <PerformanceTestContainer>
      <PageTitle>🚀 성능 테스트</PageTitle>
      
      <ControlsSection>
        <TestButton
          onClick={() => generateData('small')}
          disabled={isGenerating}
          variant={testConfig === 'small' ? 'primary' : 'outline'}
        >
          Small (200 items)
        </TestButton>
        <TestButton
          onClick={() => generateData('medium')}
          disabled={isGenerating}
          variant={testConfig === 'medium' ? 'primary' : 'outline'}
        >
          Medium (2,000 items)
        </TestButton>
        <TestButton
          onClick={() => generateData('large')}
          disabled={isGenerating}
          variant={testConfig === 'large' ? 'primary' : 'outline'}
        >
          Large (9,000 items)
        </TestButton>
        <TestButton
          onClick={() => generateData('xlarge')}
          disabled={isGenerating}
          variant={testConfig === 'xlarge' ? 'primary' : 'outline'}
        >
          XLarge (20,000 items)
        </TestButton>
        <TestButton
          onClick={runPerformanceTest}
          disabled={isGenerating}
          variant="secondary"
        >
          성능 측정
        </TestButton>
      </ControlsSection>

      <StatsSection>
        <StatCard>
          <StatValue>{signals.length.toLocaleString()}</StatValue>
          <StatLabel>Signals</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{coins.length.toLocaleString()}</StatValue>
          <StatLabel>Coins</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{alerts.length.toLocaleString()}</StatValue>
          <StatLabel>Alerts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue isPositive={true}>
            {signals.length + coins.length + alerts.length > 0 ? '활성' : '대기'}
          </StatValue>
          <StatLabel>상태</StatLabel>
        </StatCard>
      </StatsSection>

      {testResults.length > 0 && (
        <TestSection>
          <SectionTitle>테스트 결과</SectionTitle>
          <TestResults>
            {testResults.map((result, index) => (
              <TestResult key={index}>{result}</TestResult>
            ))}
          </TestResults>
        </TestSection>
      )}

      {signals.length > 0 && (
        <TestSection>
          <SectionTitle>Signals Grid (가상화)</SectionTitle>
          <VirtualizedGrid
            items={signals}
            itemHeight={120}
            itemWidth={300}
            height={400}
            columns={3}
            renderItem={renderSignalCard}
            onScroll={(scrollTop) => handleScroll(scrollTop, 'signals')}
            overscanCount={3}
          />
        </TestSection>
      )}

      {coins.length > 0 && (
        <TestSection>
          <SectionTitle>Coins List (가상화)</SectionTitle>
          <VirtualizedList
            items={coins}
            itemHeight={80}
            height={400}
            renderItem={renderCoinRow}
            onScroll={(scrollOffset) => handleScroll(scrollOffset, 'coins')}
            overscanCount={5}
            restoreScrollPosition={true}
            scrollPositionKey="performance-coins"
          />
        </TestSection>
      )}

      {alerts.length > 0 && (
        <TestSection>
          <SectionTitle>Alerts List (가상화)</SectionTitle>
          <VirtualizedList
            items={alerts}
            itemHeight={100}
            height={400}
            renderItem={renderAlertItem}
            onScroll={(scrollOffset) => handleScroll(scrollOffset, 'alerts')}
            overscanCount={5}
            restoreScrollPosition={true}
            scrollPositionKey="performance-alerts"
          />
        </TestSection>
      )}
    </PerformanceTestContainer>
  );
};

export default PerformanceTest;
