import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  timestamp: number;
  type: 'render' | 'api' | 'navigation' | 'memory' | 'custom';
  metadata?: Record<string, any>;
}

interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

interface UsePerformanceMetricsOptions {
  enableWebVitals?: boolean;
  enableMemoryMonitoring?: boolean;
  enableNavigationTiming?: boolean;
  enableResourceTiming?: boolean;
  sampleRate?: number; // 0-1, percentage of metrics to collect
  maxMetrics?: number; // Maximum number of metrics to store
}

export const usePerformanceMetrics = (options: UsePerformanceMetricsOptions = {}) => {
  const {
    enableWebVitals = true,
    enableMemoryMonitoring = true,
    enableNavigationTiming = true,
    enableResourceTiming = false,
    sampleRate = 1.0,
    maxMetrics = 1000
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);

  // Add a metric
  const addMetric = useCallback((
    name: string,
    value: number,
    type: PerformanceMetric['type'] = 'custom',
    metadata?: Record<string, any>
  ) => {
    if (Math.random() > sampleRate) return; // Sample rate filtering

    const metric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      value,
      timestamp: Date.now(),
      type,
      metadata
    };

    setMetrics(prev => {
      const newMetrics = [metric, ...prev].slice(0, maxMetrics);
      return newMetrics;
    });

    // Log slow metrics
    if (type === 'render' && value > 16) {
      console.warn(`🐌 Slow render: ${name} took ${value.toFixed(2)}ms`);
    } else if (type === 'api' && value > 1000) {
      console.warn(`🐌 Slow API call: ${name} took ${value.toFixed(2)}ms`);
    }
  }, [sampleRate, maxMetrics]);

  // Measure function execution time
  const measureFunction = useCallback(<T>(
    name: string,
    fn: () => T,
    type: PerformanceMetric['type'] = 'custom'
  ): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    addMetric(name, end - start, type);
    return result;
  }, [addMetric]);

  // Measure async function execution time
  const measureAsyncFunction = useCallback(async <T>(
    name: string,
    fn: () => Promise<T>,
    type: PerformanceMetric['type'] = 'custom'
  ): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    addMetric(name, end - start, type);
    return result;
  }, [addMetric]);

  // Get memory usage
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }, []);

  // Collect memory metrics
  const collectMemoryMetrics = useCallback(() => {
    const memory = getMemoryUsage();
    if (memory) {
      addMetric('memory_used', memory.used / 1024 / 1024, 'memory', {
        total: memory.total / 1024 / 1024,
        limit: memory.limit / 1024 / 1024
      });
    }
  }, [getMemoryUsage, addMetric]);

  // Collect navigation timing metrics
  const collectNavigationMetrics = useCallback(() => {
    if (!enableNavigationTiming) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const metrics = [
        { name: 'dom_content_loaded', value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart },
        { name: 'load_complete', value: navigation.loadEventEnd - navigation.loadEventStart },
        { name: 'first_byte', value: navigation.responseStart - navigation.requestStart },
        { name: 'dom_processing', value: navigation.domComplete - (navigation as any).domLoading }
      ];

      metrics.forEach(metric => {
        if (metric.value > 0) {
          addMetric(metric.name, metric.value, 'navigation');
        }
      });
    }
  }, [enableNavigationTiming, addMetric]);

  // Web Vitals collection
  const collectWebVitals = useCallback(() => {
    if (!enableWebVitals) return;

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          addMetric('FCP', entry.startTime, 'navigation');
        }
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      addMetric('LCP', lastEntry.startTime, 'navigation');
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        addMetric('FID', (entry as any).processingStart - entry.startTime, 'navigation');
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      addMetric('CLS', clsValue, 'navigation');
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [enableWebVitals, addMetric]);

  // Resource timing collection
  const collectResourceMetrics = useCallback(() => {
    if (!enableResourceTiming) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.requestStart;
      if (duration > 0) {
        addMetric(`resource_${resource.name.split('/').pop()}`, duration, 'api', {
          type: resource.initiatorType,
          size: resource.transferSize
        });
      }
    });
  }, [enableResourceTiming, addMetric]);

  // Start collecting metrics
  const startCollection = useCallback(() => {
    if (isCollecting) return;

    setIsCollecting(true);

    // Collect initial metrics
    collectNavigationMetrics();
    collectResourceMetrics();

    // Set up periodic memory collection
    const memoryInterval = setInterval(collectMemoryMetrics, 5000);

    // Set up Web Vitals collection
    const cleanupWebVitals = collectWebVitals();

    return () => {
      clearInterval(memoryInterval);
      cleanupWebVitals?.();
      setIsCollecting(false);
    };
  }, [isCollecting, collectNavigationMetrics, collectResourceMetrics, collectMemoryMetrics, collectWebVitals]);

  // Stop collecting metrics
  const stopCollection = useCallback(() => {
    setIsCollecting(false);
  }, []);

  // Clear all metrics
  const clearMetrics = useCallback(() => {
    setMetrics([]);
  }, []);

  // Get metrics by type
  const getMetricsByType = useCallback((type: PerformanceMetric['type']) => {
    return metrics.filter(metric => metric.type === type);
  }, [metrics]);

  // Get average metric value
  const getAverageMetric = useCallback((name: string, type?: PerformanceMetric['type']) => {
    const filteredMetrics = type 
      ? metrics.filter(m => m.name === name && m.type === type)
      : metrics.filter(m => m.name === name);
    
    if (filteredMetrics.length === 0) return 0;
    
    const sum = filteredMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / filteredMetrics.length;
  }, [metrics]);

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    const renderMetrics = getMetricsByType('render');
    const apiMetrics = getMetricsByType('api');
    const memoryMetrics = getMetricsByType('memory');

    return {
      totalMetrics: metrics.length,
      renderMetrics: {
        count: renderMetrics.length,
        average: renderMetrics.length > 0 ? renderMetrics.reduce((sum, m) => sum + m.value, 0) / renderMetrics.length : 0,
        slowRenders: renderMetrics.filter(m => m.value > 16).length
      },
      apiMetrics: {
        count: apiMetrics.length,
        average: apiMetrics.length > 0 ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length : 0,
        slowCalls: apiMetrics.filter(m => m.value > 1000).length
      },
      memoryMetrics: {
        count: memoryMetrics.length,
        latest: memoryMetrics.length > 0 ? memoryMetrics[0].value : 0
      }
    };
  }, [metrics, getMetricsByType]);

  // Export metrics
  const exportMetrics = useCallback(() => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      summary: getPerformanceSummary(),
      metrics: metrics.map(metric => ({
        ...metric,
        timestamp: new Date(metric.timestamp).toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [metrics, getPerformanceSummary]);

  // Auto-start collection on mount
  useEffect(() => {
    const cleanup = startCollection();
    return cleanup;
  }, [startCollection]);

  return {
    metrics,
    isCollecting,
    addMetric,
    measureFunction,
    measureAsyncFunction,
    getMemoryUsage,
    startCollection,
    stopCollection,
    clearMetrics,
    getMetricsByType,
    getAverageMetric,
    getPerformanceSummary,
    exportMetrics
  };
};

export default usePerformanceMetrics;
