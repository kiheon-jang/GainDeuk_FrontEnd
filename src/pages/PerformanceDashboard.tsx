import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { 
  Button,
  PerformanceProfiler,
  LazyImage
} from '../components/common';
import { 
  usePerformanceMetrics,
  useApiCache
} from '../hooks';

const DashboardContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: ${theme.colors.text};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
  background: linear-gradient(45deg, ${theme.colors.primary}, #4ECDC4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const MetricCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
`;

const MetricTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
`;

const MetricValue = styled.div<{ isGood?: boolean; isWarning?: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => {
    if (props.isGood) return theme.colors.success;
    if (props.isWarning) return theme.colors.warning;
    return theme.colors.error;
  }};
  margin-bottom: ${theme.spacing.sm};
`;

const MetricLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: ${theme.spacing.xs};
`;

const MetricDescription = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.75rem;
  line-height: 1.4;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
`;

const ChartContainer = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const ChartTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
`;

const SimpleChart = styled.div`
  height: 200px;
  background: linear-gradient(90deg, 
    ${theme.colors.primary}20 0%, 
    ${theme.colors.success}20 50%, 
    ${theme.colors.warning}20 100%
  );
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: end;
  justify-content: space-around;
  padding: ${theme.spacing.md};
`;

const ChartBar = styled.div<{ height: number; color: string }>`
  width: 20px;
  height: ${props => props.height}%;
  background-color: ${props => props.color};
  border-radius: ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0;
  transition: height 0.3s ease;
`;

const TestSection = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const TestCard = styled.div`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  text-align: center;
`;

const PerformanceDashboard: React.FC = () => {
  const [isProfiling, setIsProfiling] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const {
    metrics,
    isCollecting,
    addMetric,
    measureFunction,
    measureAsyncFunction,
    getMemoryUsage,
    getPerformanceSummary,
    exportMetrics,
    clearMetrics
  } = usePerformanceMetrics({
    enableWebVitals: true,
    enableMemoryMonitoring: true,
    enableNavigationTiming: true
  });

  const {
    getCacheStats,
    clearCache,
    isOnline
  } = useApiCache();

  const performanceSummary = getPerformanceSummary();
  const cacheStats = getCacheStats();
  const memoryUsage = getMemoryUsage();

  // Performance test functions
  const runRenderTest = useCallback(() => {
    const result = measureFunction('render_test', () => {
      // Simulate expensive render
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += Math.random();
      }
      return sum;
    }, 'render');
    
    setTestResults(prev => [...prev, `렌더 테스트 완료: ${result.toFixed(2)}ms`]);
  }, [measureFunction]);

  const runApiTest = useCallback(async () => {
    const result = await measureAsyncFunction('api_test', async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
      return { data: 'test' };
    }, 'api');
    
    setTestResults(prev => [...prev, `API 테스트 완료: ${result.toFixed(2)}ms`]);
  }, [measureAsyncFunction]);

  const runMemoryTest = useCallback(() => {
    const memory = getMemoryUsage();
    if (memory) {
      addMetric('memory_test', memory.used / 1024 / 1024, 'memory');
      setTestResults(prev => [...prev, 
        `메모리 사용량: ${(memory.used / 1024 / 1024).toFixed(2)}MB`,
        `총 메모리: ${(memory.total / 1024 / 1024).toFixed(2)}MB`,
        `메모리 한계: ${(memory.limit / 1024 / 1024).toFixed(2)}MB`
      ]);
    }
  }, [getMemoryUsage, addMetric]);

  const runCacheTest = useCallback(() => {
    const stats = getCacheStats();
    setTestResults(prev => [...prev, 
      `캐시 항목: ${stats.total}개`,
      `유효한 캐시: ${stats.valid}개`,
      `만료된 캐시: ${stats.expired}개`
    ]);
  }, [getCacheStats]);

  const clearTestResults = useCallback(() => {
    setTestResults([]);
  }, []);

  // Generate chart data
  const chartData = [
    { label: '렌더', value: performanceSummary.renderMetrics.average, color: theme.colors.primary },
    { label: 'API', value: performanceSummary.apiMetrics.average, color: theme.colors.success },
    { label: '메모리', value: performanceSummary.memoryMetrics.latest, color: theme.colors.warning }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <DashboardContainer>
      <PageTitle>⚡ 성능 모니터링 대시보드</PageTitle>
      
      {/* Controls */}
      <ControlsSection>
        <Button 
          onClick={() => setIsProfiling(!isProfiling)}
          variant={isProfiling ? 'secondary' : 'primary'}
        >
          {isProfiling ? '프로파일링 중지' : '프로파일링 시작'}
        </Button>
        <Button onClick={exportMetrics} variant="outline">
          메트릭 내보내기
        </Button>
        <Button onClick={clearMetrics} variant="outline">
          메트릭 지우기
        </Button>
        <Button onClick={clearCache} variant="outline">
          캐시 지우기
        </Button>
      </ControlsSection>

      {/* Performance Metrics */}
      <MetricsGrid>
        <MetricCard>
          <MetricTitle>렌더 성능</MetricTitle>
          <MetricValue 
            isGood={performanceSummary.renderMetrics.average < 16}
            isWarning={performanceSummary.renderMetrics.average < 32}
          >
            {performanceSummary.renderMetrics.average.toFixed(2)}ms
          </MetricValue>
          <MetricLabel>평균 렌더 시간</MetricLabel>
          <MetricDescription>
            {performanceSummary.renderMetrics.count}회 렌더링 중 
            {performanceSummary.renderMetrics.slowRenders}회 느린 렌더링
          </MetricDescription>
        </MetricCard>

        <MetricCard>
          <MetricTitle>API 성능</MetricTitle>
          <MetricValue 
            isGood={performanceSummary.apiMetrics.average < 500}
            isWarning={performanceSummary.apiMetrics.average < 1000}
          >
            {performanceSummary.apiMetrics.average.toFixed(2)}ms
          </MetricValue>
          <MetricLabel>평균 API 응답 시간</MetricLabel>
          <MetricDescription>
            {performanceSummary.apiMetrics.count}회 API 호출 중 
            {performanceSummary.apiMetrics.slowCalls}회 느린 호출
          </MetricDescription>
        </MetricCard>

        <MetricCard>
          <MetricTitle>메모리 사용량</MetricTitle>
          <MetricValue 
            isGood={performanceSummary.memoryMetrics.latest < 50}
            isWarning={performanceSummary.memoryMetrics.latest < 100}
          >
            {performanceSummary.memoryMetrics.latest.toFixed(2)}MB
          </MetricValue>
          <MetricLabel>현재 메모리 사용량</MetricLabel>
          <MetricDescription>
            {memoryUsage ? 
              `총: ${(memoryUsage.total / 1024 / 1024).toFixed(2)}MB, ` +
              `한계: ${(memoryUsage.limit / 1024 / 1024).toFixed(2)}MB` : 
              '메모리 정보 없음'
            }
          </MetricDescription>
        </MetricCard>

        <MetricCard>
          <MetricTitle>캐시 상태</MetricTitle>
          <MetricValue 
            isGood={cacheStats.valid > 0}
            isWarning={cacheStats.expired > cacheStats.valid}
          >
            {cacheStats.valid}/{cacheStats.total}
          </MetricValue>
          <MetricLabel>유효한 캐시 항목</MetricLabel>
          <MetricDescription>
            {cacheStats.expired}개 만료된 항목, 
            {isOnline ? '온라인' : '오프라인'} 상태
          </MetricDescription>
        </MetricCard>

        <MetricCard>
          <MetricTitle>총 메트릭</MetricTitle>
          <MetricValue>
            {performanceSummary.totalMetrics}
          </MetricValue>
          <MetricLabel>수집된 메트릭 수</MetricLabel>
          <MetricDescription>
            {isCollecting ? '수집 중' : '수집 중지됨'}
          </MetricDescription>
        </MetricCard>

        <MetricCard>
          <MetricTitle>Web Vitals</MetricTitle>
          <MetricValue>
            {metrics.filter(m => m.type === 'navigation').length}
          </MetricValue>
          <MetricLabel>수집된 Web Vitals</MetricLabel>
          <MetricDescription>
            FCP, LCP, FID, CLS 등 핵심 성능 지표
          </MetricDescription>
        </MetricCard>
      </MetricsGrid>

      {/* Performance Chart */}
      <ChartContainer>
        <ChartTitle>성능 메트릭 차트</ChartTitle>
        <SimpleChart>
          {chartData.map((item, index) => (
            <ChartBar
              key={index}
              height={(item.value / maxValue) * 100}
              color={item.color}
              title={`${item.label}: ${item.value.toFixed(2)}ms`}
            />
          ))}
        </SimpleChart>
      </ChartContainer>

      {/* Performance Tests */}
      <TestSection>
        <ChartTitle>성능 테스트</ChartTitle>
        <p>다양한 성능 테스트를 실행하여 시스템 성능을 측정해보세요.</p>
        
        <ControlsSection>
          <Button onClick={runRenderTest} variant="primary">
            렌더 테스트
          </Button>
          <Button onClick={runApiTest} variant="primary">
            API 테스트
          </Button>
          <Button onClick={runMemoryTest} variant="primary">
            메모리 테스트
          </Button>
          <Button onClick={runCacheTest} variant="primary">
            캐시 테스트
          </Button>
          <Button onClick={clearTestResults} variant="outline">
            결과 지우기
          </Button>
        </ControlsSection>

        {testResults.length > 0 && (
          <div style={{ marginTop: theme.spacing.lg }}>
            <h4>테스트 결과:</h4>
            <div style={{ 
              background: theme.colors.background, 
              padding: theme.spacing.md, 
              borderRadius: theme.borderRadius.sm,
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              {testResults.map((result, index) => (
                <div key={index} style={{ marginBottom: theme.spacing.xs }}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </TestSection>

      {/* Lazy Loading Test */}
      <TestSection>
        <ChartTitle>지연 로딩 테스트</ChartTitle>
        <p>이미지 지연 로딩 컴포넌트의 성능을 테스트해보세요.</p>
        
        <TestGrid>
          {Array.from({ length: 6 }, (_, i) => (
            <TestCard key={i}>
              <LazyImage
                src={`https://picsum.photos/200/200?random=${i}`}
                alt={`Test image ${i + 1}`}
                width={200}
                height={200}
                placeholder="🖼️"
                quality="medium"
                onLoad={() => addMetric(`image_load_${i}`, performance.now(), 'custom')}
              />
              <div style={{ marginTop: theme.spacing.sm }}>
                이미지 {i + 1}
              </div>
            </TestCard>
          ))}
        </TestGrid>
      </TestSection>

      {/* Profiled Component */}
      {isProfiling && (
        <PerformanceProfiler
          id="dashboard-profiler"
          showMetrics={true}
          threshold={16}
        >
          <TestSection>
            <ChartTitle>프로파일링된 컴포넌트</ChartTitle>
            <p>이 섹션은 React Profiler로 성능을 모니터링하고 있습니다.</p>
            <div style={{ padding: theme.spacing.lg, background: theme.colors.background }}>
              <h4>프로파일링 정보</h4>
              <p>이 컴포넌트의 렌더링 성능이 실시간으로 모니터링됩니다.</p>
              <p>느린 렌더링이 감지되면 콘솔에 경고가 표시됩니다.</p>
            </div>
          </TestSection>
        </PerformanceProfiler>
      )}
    </DashboardContainer>
  );
};

export default PerformanceDashboard;
