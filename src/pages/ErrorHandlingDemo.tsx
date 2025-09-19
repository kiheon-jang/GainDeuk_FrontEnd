import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { 
  ErrorBoundary,
  FallbackUI,
  LoadingFallback,
  ErrorFallback,
  EmptyFallback,
  OfflineFallback,
  NetworkFallback,
  MaintenanceFallback,
  Button
} from '../components/common';
import { useNetworkStatus, useErrorLogger, useApiRetry } from '../hooks';

const DemoContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const DemoSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.lg};
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const DemoCard = styled.div`
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
  min-height: 200px;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
`;

const NetworkStatus = styled.div<{ isOnline: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  font-weight: 500;
  background-color: ${props => props.isOnline ? theme.colors.success : theme.colors.error};
  color: white;
  margin-bottom: ${theme.spacing.lg};
`;

// Component that throws an error for testing ErrorBoundary
const ErrorThrowingComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('This is a test error for ErrorBoundary demonstration');
  }
  
  return (
    <div>
      <h3>✅ 정상 작동 중</h3>
      <p>이 컴포넌트는 정상적으로 렌더링되고 있습니다.</p>
    </div>
  );
};

// Component that simulates API errors
const ApiErrorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { executeWithRetry, isRetrying, retryCount, lastError } = useApiRetry();
  const { logError } = useErrorLogger();

  const simulateApiCall = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call that might fail
      await executeWithRetry(async () => {
        // Randomly fail to demonstrate retry logic
        if (Math.random() < 0.7) {
          throw new Error('API Error: 서버 응답 없음');
        }
        return { data: 'API 호출 성공!' };
      });
    } catch (err) {
      setError(err);
      logError('API 호출 실패', err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3>API 에러 처리 테스트</h3>
      <p>API 호출을 시뮬레이션하여 에러 처리와 재시도 로직을 테스트합니다.</p>
      
      <ControlsSection>
        <Button onClick={simulateApiCall} disabled={isLoading || isRetrying}>
          {isLoading || isRetrying ? 'API 호출 중...' : 'API 호출 시뮬레이션'}
        </Button>
      </ControlsSection>

      {isRetrying && (
        <div>
          <p>재시도 중... ({retryCount}/3)</p>
        </div>
      )}

      {error && (
        <div style={{ color: theme.colors.error, marginTop: theme.spacing.md }}>
          <p><strong>에러:</strong> {error.message}</p>
          {lastError && (
            <p><strong>마지막 에러:</strong> {lastError.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

const ErrorHandlingDemo: React.FC = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false);
  const [showFallbackDemo, setShowFallbackDemo] = useState(false);
  const networkStatus = useNetworkStatus();
  const { logError, getLocalLogs, clearLocalLogs, exportLogs } = useErrorLogger();

  const handleThrowError = () => {
    setShouldThrowError(true);
  };

  const handleResetError = () => {
    setShouldThrowError(false);
  };

  const handleLogTestError = () => {
    logError('테스트 에러', new Error('이것은 테스트용 에러입니다'));
  };

  const localLogs = getLocalLogs();

  return (
    <DemoContainer>
      <h1>🛡️ 에러 처리 데모</h1>
      <p>다양한 에러 처리 기능을 테스트해보세요.</p>

      {/* Network Status */}
      <NetworkStatus isOnline={networkStatus.isOnline}>
        {networkStatus.isOnline ? '🟢 온라인' : '🔴 오프라인'} 
        {networkStatus.isSlowConnection && ' (느린 연결)'}
        {networkStatus.effectiveType && ` - ${networkStatus.effectiveType}`}
      </NetworkStatus>

      {/* Error Boundary Demo */}
      <DemoSection>
        <SectionTitle>🚨 Error Boundary 테스트</SectionTitle>
        <p>ErrorBoundary가 컴포넌트 에러를 어떻게 처리하는지 확인해보세요.</p>
        
        <ControlsSection>
          <Button onClick={handleThrowError} variant="primary">
            에러 발생시키기
          </Button>
          <Button onClick={handleResetError} variant="secondary">
            에러 리셋
          </Button>
        </ControlsSection>

        <DemoCard>
          <ErrorBoundary>
            <ErrorThrowingComponent shouldThrow={shouldThrowError} />
          </ErrorBoundary>
        </DemoCard>
      </DemoSection>

      {/* API Error Handling Demo */}
      <DemoSection>
        <SectionTitle>🌐 API 에러 처리 테스트</SectionTitle>
        <DemoCard>
          <ApiErrorComponent />
        </DemoCard>
      </DemoSection>

      {/* Fallback UI Demo */}
      <DemoSection>
        <SectionTitle>🎭 Fallback UI 컴포넌트들</SectionTitle>
        <p>다양한 상황에 대한 폴백 UI를 확인해보세요.</p>
        
        <Button onClick={() => setShowFallbackDemo(!showFallbackDemo)}>
          {showFallbackDemo ? '폴백 UI 숨기기' : '폴백 UI 보기'}
        </Button>

        {showFallbackDemo && (
          <DemoGrid>
            <DemoCard>
              <LoadingFallback />
            </DemoCard>
            <DemoCard>
              <ErrorFallback />
            </DemoCard>
            <DemoCard>
              <EmptyFallback />
            </DemoCard>
            <DemoCard>
              <OfflineFallback />
            </DemoCard>
            <DemoCard>
              <NetworkFallback />
            </DemoCard>
            <DemoCard>
              <MaintenanceFallback />
            </DemoCard>
          </DemoGrid>
        )}
      </DemoSection>

      {/* Error Logging Demo */}
      <DemoSection>
        <SectionTitle>📝 에러 로깅 시스템</SectionTitle>
        <p>에러 로깅 기능을 테스트하고 로그를 확인해보세요.</p>
        
        <ControlsSection>
          <Button onClick={handleLogTestError} variant="primary">
            테스트 에러 로깅
          </Button>
          <Button onClick={clearLocalLogs} variant="secondary">
            로그 지우기
          </Button>
          <Button onClick={exportLogs} variant="outline">
            로그 내보내기
          </Button>
        </ControlsSection>

        <div>
          <h4>로컬 에러 로그 ({localLogs.length}개)</h4>
          {localLogs.length > 0 ? (
            <div style={{ maxHeight: '200px', overflow: 'auto', background: theme.colors.background, padding: theme.spacing.md, borderRadius: theme.borderRadius.sm }}>
              {localLogs.slice(0, 5).map((log, index) => (
                <div key={log.id} style={{ marginBottom: theme.spacing.sm, fontSize: '0.875rem' }}>
                  <div><strong>{log.level.toUpperCase()}</strong> - {log.timestamp}</div>
                  <div>{log.message}</div>
                </div>
              ))}
              {localLogs.length > 5 && <div>... 및 {localLogs.length - 5}개 더</div>}
            </div>
          ) : (
            <p>저장된 에러 로그가 없습니다.</p>
          )}
        </div>
      </DemoSection>

      {/* Network Error Simulation */}
      <DemoSection>
        <SectionTitle>🌐 네트워크 상태 시뮬레이션</SectionTitle>
        <p>네트워크 상태 변화에 따른 에러 처리를 확인해보세요.</p>
        
        <div>
          <h4>현재 네트워크 정보:</h4>
          <ul>
            <li>온라인 상태: {networkStatus.isOnline ? '예' : '아니오'}</li>
            <li>느린 연결: {networkStatus.isSlowConnection ? '예' : '아니오'}</li>
            <li>연결 타입: {networkStatus.connectionType || '알 수 없음'}</li>
            <li>효과적 타입: {networkStatus.effectiveType || '알 수 없음'}</li>
            <li>다운링크: {networkStatus.downlink ? `${networkStatus.downlink} Mbps` : '알 수 없음'}</li>
            <li>RTT: {networkStatus.rtt ? `${networkStatus.rtt}ms` : '알 수 없음'}</li>
          </ul>
        </div>
      </DemoSection>
    </DemoContainer>
  );
};

export default ErrorHandlingDemo;
