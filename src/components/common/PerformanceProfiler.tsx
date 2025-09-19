import React, { Profiler, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface PerformanceMetrics {
  id: string;
  phase: 'mount' | 'update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: Set<any>;
}

interface PerformanceProfilerProps {
  id: string;
  children: React.ReactNode;
  onRender?: (metrics: PerformanceMetrics) => void;
  threshold?: number; // ms - log if duration exceeds threshold
  enabled?: boolean;
  showMetrics?: boolean;
}

const MetricsContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.sm};
  font-size: 0.75rem;
  z-index: 9999;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const MetricItem = styled.div<{ isSlow?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xs};
  color: ${props => props.isSlow ? theme.colors.error : theme.colors.text};
  font-weight: ${props => props.isSlow ? '600' : '400'};
`;

const MetricLabel = styled.span`
  color: ${theme.colors.textSecondary};
`;

const MetricValue = styled.span`
  font-family: monospace;
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: 0.75rem;
  cursor: pointer;
  z-index: 10000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: ${theme.colors.primary};
    opacity: 0.9;
  }
`;

const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({
  id,
  children,
  onRender,
  threshold = 16, // 16ms = 60fps threshold
  enabled = process.env.NODE_ENV === 'development',
  showMetrics = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const onRenderCallback = useCallback((
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<any>,
    ...args: any[]
  ) => {
    const performanceMetric: PerformanceMetrics = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions
    };

    // Log slow renders
    if (actualDuration > threshold) {
      console.warn(`🐌 Slow render detected in ${id}:`, {
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
        threshold: `${threshold}ms`
      });
    }

    // Store metrics
    setMetrics(prev => {
      const newMetrics = [performanceMetric, ...prev].slice(0, 50); // Keep last 50 metrics
      return newMetrics;
    });

    // Call custom onRender callback
    onRender?.(performanceMetric);
  }, [threshold, onRender]);

  const averageRenderTime = useMemo(() => {
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, metric) => sum + metric.actualDuration, 0);
    return total / metrics.length;
  }, [metrics]);

  const slowRenders = useMemo(() => {
    return metrics.filter(metric => metric.actualDuration > threshold).length;
  }, [metrics, threshold]);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      {showMetrics && (
        <ToggleButton onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide Metrics' : 'Show Metrics'}
        </ToggleButton>
      )}
      
      {isVisible && (
        <MetricsContainer>
          <div style={{ fontWeight: '600', marginBottom: theme.spacing.sm }}>
            Performance Metrics - {id}
          </div>
          
          <MetricItem>
            <MetricLabel>Total Renders:</MetricLabel>
            <MetricValue>{metrics.length}</MetricValue>
          </MetricItem>
          
          <MetricItem>
            <MetricLabel>Avg Duration:</MetricLabel>
            <MetricValue>{averageRenderTime.toFixed(2)}ms</MetricValue>
          </MetricItem>
          
          <MetricItem isSlow={slowRenders > 0}>
            <MetricLabel>Slow Renders:</MetricLabel>
            <MetricValue>{slowRenders}</MetricValue>
          </MetricItem>
          
          <MetricItem>
            <MetricLabel>Threshold:</MetricLabel>
            <MetricValue>{threshold}ms</MetricValue>
          </MetricItem>
          
          {metrics.length > 0 && (
            <div style={{ marginTop: theme.spacing.sm }}>
              <div style={{ fontWeight: '600', marginBottom: theme.spacing.xs }}>
                Recent Renders:
              </div>
              {metrics.slice(0, 5).map((metric, index) => (
                <MetricItem key={index} isSlow={metric.actualDuration > threshold}>
                  <MetricLabel>{metric.phase}:</MetricLabel>
                  <MetricValue>{metric.actualDuration.toFixed(2)}ms</MetricValue>
                </MetricItem>
              ))}
            </div>
          )}
          
          <button
            onClick={clearMetrics}
            style={{
              marginTop: theme.spacing.sm,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              backgroundColor: theme.colors.error,
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius.sm,
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}
          >
            Clear
          </button>
        </MetricsContainer>
      )}
      
      <Profiler id={id} onRender={onRenderCallback}>
        {children}
      </Profiler>
    </>
  );
};

export default PerformanceProfiler;
