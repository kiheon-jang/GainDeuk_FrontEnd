import { useState, useCallback, useRef } from 'react';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) => boolean;
}

interface RecoveryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: any;
  canRetry: boolean;
}

export const useErrorRecovery = (options: RetryOptions = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = (error) => {
      // Default retry condition: retry on network errors and 5xx server errors
      return error?.type === 'NETWORK_ERROR' || 
             (error?.status >= 500 && error?.status < 600) ||
             error?.status === 429; // Rate limiting
    }
  } = options;

  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
    canRetry: true
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateDelay = useCallback((retryCount: number): number => {
    const delay = initialDelay * Math.pow(backoffFactor, retryCount);
    return Math.min(delay, maxDelay);
  }, [initialDelay, backoffFactor, maxDelay]);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    customOptions?: Partial<RetryOptions>
  ): Promise<T> => {
    const finalOptions = { ...options, ...customOptions };
    const finalMaxRetries = finalOptions.maxRetries || maxRetries;
    const finalRetryCondition = finalOptions.retryCondition || retryCondition;

    let lastError: any = null;

    for (let attempt = 0; attempt <= finalMaxRetries; attempt++) {
      try {
        setRecoveryState(prev => ({
          ...prev,
          isRetrying: attempt > 0,
          retryCount: attempt,
          lastError: null
        }));

        const result = await operation();
        
        // Success - reset retry state
        setRecoveryState({
          isRetrying: false,
          retryCount: 0,
          lastError: null,
          canRetry: true
        });

        return result;
      } catch (error: any) {
        lastError = error;
        
        setRecoveryState(prev => ({
          ...prev,
          lastError: error,
          canRetry: attempt < finalMaxRetries && finalRetryCondition(error)
        }));

        // Don't retry if condition is not met or max retries reached
        if (attempt >= finalMaxRetries || !finalRetryCondition(error)) {
          setRecoveryState(prev => ({
            ...prev,
            isRetrying: false,
            canRetry: false
          }));
          throw error;
        }

        // Wait before retrying
        const delay = calculateDelay(attempt);
        await new Promise(resolve => {
          retryTimeoutRef.current = setTimeout(resolve, delay);
        });
      }
    }

    throw lastError;
  }, [options, maxRetries, retryCondition, calculateDelay]);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    return executeWithRetry(operation);
  }, [executeWithRetry]);

  const reset = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setRecoveryState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
      canRetry: true
    });
  }, []);

  const canRetry = useCallback((error?: any) => {
    if (error) {
      return retryCondition(error);
    }
    return recoveryState.canRetry && recoveryState.retryCount < maxRetries;
  }, [retryCondition, recoveryState.canRetry, recoveryState.retryCount, maxRetries]);

  return {
    ...recoveryState,
    executeWithRetry,
    retry,
    reset,
    canRetry
  };
};

// Specialized hooks for common use cases
export const useApiRetry = (options?: RetryOptions) => {
  return useErrorRecovery({
    maxRetries: 3,
    initialDelay: 1000,
    backoffFactor: 2,
    retryCondition: (error) => {
      // Retry on network errors, 5xx errors, and rate limiting
      return error?.type === 'NETWORK_ERROR' || 
             (error?.status >= 500 && error?.status < 600) ||
             error?.status === 429;
    },
    ...options
  });
};

export const useWebSocketRetry = (options?: RetryOptions) => {
  return useErrorRecovery({
    maxRetries: 5,
    initialDelay: 2000,
    backoffFactor: 1.5,
    retryCondition: (error) => {
      // Retry on connection errors
      return error?.type === 'CONNECTION_ERROR' || 
             error?.code === 'ECONNREFUSED' ||
             error?.code === 'ETIMEDOUT';
    },
    ...options
  });
};

export const useFileUploadRetry = (options?: RetryOptions) => {
  return useErrorRecovery({
    maxRetries: 2,
    initialDelay: 3000,
    backoffFactor: 2,
    retryCondition: (error) => {
      // Retry on network errors and server errors, but not on client errors
      return error?.type === 'NETWORK_ERROR' || 
             (error?.status >= 500 && error?.status < 600);
    },
    ...options
  });
};

export default useErrorRecovery;
