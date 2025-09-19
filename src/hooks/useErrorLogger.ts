import { useCallback } from 'react';

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

interface UseErrorLoggerOptions {
  enableConsoleLogging?: boolean;
  enableLocalStorage?: boolean;
  enableRemoteLogging?: boolean;
  remoteEndpoint?: string;
  maxLocalLogs?: number;
  logLevel?: 'error' | 'warning' | 'info';
}

export const useErrorLogger = (options: UseErrorLoggerOptions = {}) => {
  const {
    enableConsoleLogging = true,
    enableLocalStorage = true,
    enableRemoteLogging = false,
    remoteEndpoint = '/api/logs',
    maxLocalLogs = 100,
    logLevel = 'error'
  } = options;

  const generateLogId = useCallback(() => {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }, []);

  const getUserId = useCallback(() => {
    return localStorage.getItem('userId') || 'anonymous';
  }, []);

  const createErrorLog = useCallback((
    level: 'error' | 'warning' | 'info',
    message: string,
    error?: Error,
    componentStack?: string,
    metadata?: Record<string, any>
  ): ErrorLog => {
    return {
      id: generateLogId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      stack: error?.stack,
      componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: getUserId(),
      sessionId: getSessionId(),
      metadata
    };
  }, [generateLogId, getUserId, getSessionId]);

  const logToConsole = useCallback((log: ErrorLog) => {
    if (!enableConsoleLogging) return;

    const consoleMethod = log.level === 'error' ? 'error' : 
                         log.level === 'warning' ? 'warn' : 'log';

    console.group(`🚨 ${log.level.toUpperCase()} - ${log.id}`);
    console[consoleMethod](log.message);
    if (log.stack) console.error('Stack:', log.stack);
    if (log.componentStack) console.error('Component Stack:', log.componentStack);
    if (log.metadata) console.log('Metadata:', log.metadata);
    console.log('Timestamp:', log.timestamp);
    console.log('URL:', log.url);
    console.groupEnd();
  }, [enableConsoleLogging]);

  const logToLocalStorage = useCallback((log: ErrorLog) => {
    if (!enableLocalStorage) return;

    try {
      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      const updatedLogs = [log, ...existingLogs].slice(0, maxLocalLogs);
      localStorage.setItem('errorLogs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.warn('Failed to save error log to localStorage:', error);
    }
  }, [enableLocalStorage, maxLocalLogs]);

  const logToRemote = useCallback(async (log: ErrorLog) => {
    if (!enableRemoteLogging) return;

    try {
      await fetch(remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      });
    } catch (error) {
      console.warn('Failed to send error log to remote endpoint:', error);
    }
  }, [enableRemoteLogging, remoteEndpoint]);

  const logError = useCallback((
    message: string,
    error?: Error,
    componentStack?: string,
    metadata?: Record<string, any>
  ) => {
    const log = createErrorLog('error', message, error, componentStack, metadata);
    
    logToConsole(log);
    logToLocalStorage(log);
    logToRemote(log);
  }, [createErrorLog, logToConsole, logToLocalStorage, logToRemote]);

  const logWarning = useCallback((
    message: string,
    error?: Error,
    componentStack?: string,
    metadata?: Record<string, any>
  ) => {
    if (logLevel === 'error') return; // Skip if log level is too high

    const log = createErrorLog('warning', message, error, componentStack, metadata);
    
    logToConsole(log);
    logToLocalStorage(log);
    logToRemote(log);
  }, [createErrorLog, logToConsole, logToLocalStorage, logToRemote, logLevel]);

  const logInfo = useCallback((
    message: string,
    metadata?: Record<string, any>
  ) => {
    if (logLevel !== 'info') return; // Skip if log level is too high

    const log = createErrorLog('info', message, undefined, undefined, metadata);
    
    logToConsole(log);
    logToLocalStorage(log);
    logToRemote(log);
  }, [createErrorLog, logToConsole, logToLocalStorage, logToRemote, logLevel]);

  const getLocalLogs = useCallback((): ErrorLog[] => {
    try {
      return JSON.parse(localStorage.getItem('errorLogs') || '[]');
    } catch (error) {
      console.warn('Failed to retrieve error logs from localStorage:', error);
      return [];
    }
  }, []);

  const clearLocalLogs = useCallback(() => {
    try {
      localStorage.removeItem('errorLogs');
    } catch (error) {
      console.warn('Failed to clear error logs from localStorage:', error);
    }
  }, []);

  const exportLogs = useCallback(() => {
    const logs = getLocalLogs();
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalLogs: logs.length,
      logs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getLocalLogs]);

  return {
    logError,
    logWarning,
    logInfo,
    getLocalLogs,
    clearLocalLogs,
    exportLogs
  };
};

export default useErrorLogger;
