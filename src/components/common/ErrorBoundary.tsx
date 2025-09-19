import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from './index';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${theme.spacing.xl};
  text-align: center;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  margin: ${theme.spacing.lg};
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.error};
`;

const ErrorTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
  margin-bottom: ${theme.spacing.lg};
  max-width: 600px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-top: ${theme.spacing.lg};
  text-align: left;
  max-width: 800px;
  width: 100%;
`;

const ErrorSummary = styled.summary`
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  font-weight: 500;
  margin-bottom: ${theme.spacing.md};
  
  &:hover {
    color: ${theme.colors.text};
  }
`;

const ErrorStack = styled.pre`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ErrorId = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.md};
  font-family: monospace;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    const { errorId } = this.state;

    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error ID:', errorId);
      console.groupEnd();
    }

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo, errorId);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo, errorId);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange) {
      if (resetKeys) {
        const hasResetKeyChanged = resetKeys.some(
          (key, index) => key !== prevProps.resetKeys?.[index]
        );
        if (hasResetKeyChanged) {
          this.resetErrorBoundary();
        }
      } else {
        // Reset on any prop change if no resetKeys specified
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo, errorId: string) => {
    // In a real application, you would send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    const errorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('userId') || 'anonymous'
    };

    // Example: Send to external service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // }).catch(console.error);

    console.log('Error report prepared:', errorReport);
  };

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  private handleRetry = () => {
    this.resetErrorBoundary();
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReportError = () => {
    const { error, errorId } = this.state;
    
    // Create error report for user to copy
    const errorReport = {
      errorId,
      message: error?.message,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    const reportText = `에러 ID: ${errorId}\n메시지: ${error?.message}\n시간: ${errorReport.timestamp}\nURL: ${errorReport.url}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText).then(() => {
        alert('에러 정보가 클립보드에 복사되었습니다. 개발팀에 전달해주세요.');
      }).catch(() => {
        // Fallback: show in prompt
        prompt('에러 정보를 복사하여 개발팀에 전달해주세요:', reportText);
      });
    } else {
      prompt('에러 정보를 복사하여 개발팀에 전달해주세요:', reportText);
    }
  };

  render() {
    const { hasError, error, errorInfo, errorId } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>문제가 발생했습니다</ErrorTitle>
          <ErrorMessage>
            예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
          </ErrorMessage>
          
          <ActionButtons>
            <Button onClick={this.handleRetry} variant="primary">
              다시 시도
            </Button>
            <Button onClick={this.handleReload} variant="secondary">
              페이지 새로고침
            </Button>
            <Button onClick={this.handleReportError} variant="outline">
              에러 신고
            </Button>
          </ActionButtons>

          {process.env.NODE_ENV === 'development' && errorInfo && (
            <ErrorDetails>
              <ErrorSummary>개발자 정보 (클릭하여 확장)</ErrorSummary>
              <ErrorStack>
                <strong>Error:</strong> {error?.toString()}
                {'\n\n'}
                <strong>Component Stack:</strong>
                {errorInfo.componentStack}
              </ErrorStack>
            </ErrorDetails>
          )}

          <ErrorId>에러 ID: {errorId}</ErrorId>
        </ErrorContainer>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
