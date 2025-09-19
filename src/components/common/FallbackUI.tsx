import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button, AnimatedLoader } from './index';

interface FallbackUIProps {
  type?: 'loading' | 'error' | 'empty' | 'offline' | 'network' | 'maintenance';
  title?: string;
  message?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  showRetry?: boolean;
  onRetry?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const FallbackContainer = styled.div<{ size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${theme.spacing.xl};
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          min-height: 200px;
          padding: ${theme.spacing.lg};
        `;
      case 'lg':
        return `
          min-height: 500px;
          padding: ${theme.spacing.xxl};
        `;
      default:
        return `
          min-height: 300px;
          padding: ${theme.spacing.xl};
        `;
    }
  }}
`;

const FallbackIcon = styled.div<{ type: string }>`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.lg};
  
  ${props => {
    switch (props.type) {
      case 'loading':
        return `color: ${theme.colors.primary};`;
      case 'error':
        return `color: ${theme.colors.error};`;
      case 'empty':
        return `color: ${theme.colors.textSecondary};`;
      case 'offline':
        return `color: ${theme.colors.warning};`;
      case 'network':
        return `color: ${theme.colors.error};`;
      case 'maintenance':
        return `color: ${theme.colors.warning};`;
      default:
        return `color: ${theme.colors.textSecondary};`;
    }
  }}
`;

const FallbackTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
`;

const FallbackMessage = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
  margin-bottom: ${theme.spacing.lg};
  max-width: 400px;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const FallbackUI: React.FC<FallbackUIProps> = ({
  type = 'error',
  title,
  message,
  icon,
  actionText,
  onAction,
  showRetry = true,
  onRetry,
  size = 'md'
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'loading':
        return {
          icon: '⏳',
          title: '로딩 중...',
          message: '데이터를 불러오고 있습니다. 잠시만 기다려주세요.'
        };
      case 'error':
        return {
          icon: '⚠️',
          title: '오류가 발생했습니다',
          message: '예상치 못한 문제가 발생했습니다. 다시 시도해주세요.'
        };
      case 'empty':
        return {
          icon: '📭',
          title: '데이터가 없습니다',
          message: '표시할 데이터가 없습니다.'
        };
      case 'offline':
        return {
          icon: '📡',
          title: '오프라인 상태',
          message: '인터넷 연결을 확인해주세요.'
        };
      case 'network':
        return {
          icon: '🌐',
          title: '네트워크 오류',
          message: '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.'
        };
      case 'maintenance':
        return {
          icon: '🔧',
          title: '서비스 점검 중',
          message: '서비스 점검으로 인해 일시적으로 이용이 제한됩니다.'
        };
      default:
        return {
          icon: '❓',
          title: '알 수 없는 오류',
          message: '예상치 못한 문제가 발생했습니다.'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayIcon = icon || defaultContent.icon;
  const displayTitle = title || defaultContent.title;
  const displayMessage = message || defaultContent.message;

  // Show loading animation for loading type
  if (type === 'loading') {
    return (
      <FallbackContainer size={size}>
        <AnimatedLoader 
          variant="spinner" 
          size={size === 'sm' ? 'md' : size === 'lg' ? 'lg' : 'md'}
          text={displayMessage}
        />
      </FallbackContainer>
    );
  }

  return (
    <FallbackContainer size={size}>
      <FallbackIcon type={type}>{displayIcon}</FallbackIcon>
      <FallbackTitle>{displayTitle}</FallbackTitle>
      <FallbackMessage>{displayMessage}</FallbackMessage>
      
      <ActionButtons>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="primary">
            다시 시도
          </Button>
        )}
        {actionText && onAction && (
          <Button onClick={onAction} variant="secondary">
            {actionText}
          </Button>
        )}
      </ActionButtons>
    </FallbackContainer>
  );
};

// Specialized fallback components
export const LoadingFallback: React.FC<Omit<FallbackUIProps, 'type'>> = (props) => (
  <FallbackUI type="loading" {...props} />
);

export const ErrorFallback: React.FC<Omit<FallbackUIProps, 'type'>> = (props) => (
  <FallbackUI type="error" {...props} />
);

export const EmptyFallback: React.FC<Omit<FallbackUIProps, 'type'>> = (props) => (
  <FallbackUI type="empty" {...props} />
);

export const OfflineFallback: React.FC<Omit<FallbackUIProps, 'type'>> = (props) => (
  <FallbackUI type="offline" {...props} />
);

export const NetworkFallback: React.FC<Omit<FallbackUIProps, 'type'>> = (props) => (
  <FallbackUI type="network" {...props} />
);

export const MaintenanceFallback: React.FC<Omit<FallbackUIProps, 'type'>> = (props) => (
  <FallbackUI type="maintenance" {...props} />
);

export default FallbackUI;
