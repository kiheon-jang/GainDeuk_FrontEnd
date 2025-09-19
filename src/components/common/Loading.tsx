import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import AnimatedLoader from './AnimatedLoader';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.xl};
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  border: 3px solid ${theme.colors.border};
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  ${props => {
    switch (props.size) {
      case 'sm':
        return `width: 20px; height: 20px;`;
      case 'lg':
        return `width: 60px; height: 60px; border-width: 4px;`;
      default:
        return `width: 40px; height: 40px;`;
    }
  }}
`;

const LoadingText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0;
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
`;

const SkeletonItem = styled.div<{ width?: string; height?: string }>`
  background: linear-gradient(90deg, ${theme.colors.surface} 25%, ${theme.colors.border} 50%, ${theme.colors.surface} 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.5s infinite;
  border-radius: ${theme.borderRadius.sm};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
`;

const SkeletonCard = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
`;

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  type?: 'spinner' | 'skeleton' | 'dots' | 'pulse' | 'wave' | 'bars';
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = '로딩 중...', 
  type = 'spinner',
  fullScreen = false
}) => {
  if (type === 'skeleton') {
    return (
      <SkeletonContainer>
        <SkeletonCard>
          <SkeletonItem height="24px" width="60%" />
          <SkeletonItem height="16px" width="100%" />
          <SkeletonItem height="16px" width="80%" />
          <SkeletonItem height="16px" width="90%" />
        </SkeletonCard>
        <SkeletonCard>
          <SkeletonItem height="24px" width="70%" />
          <SkeletonItem height="16px" width="100%" />
          <SkeletonItem height="16px" width="85%" />
        </SkeletonCard>
      </SkeletonContainer>
    );
  }

  // Map old type to new AnimatedLoader variant
  const variantMap = {
    spinner: 'spinner' as const,
    dots: 'dots' as const,
    pulse: 'pulse' as const,
    wave: 'wave' as const,
    bars: 'bars' as const
  };

  return (
    <AnimatedLoader
      size={size}
      variant={variantMap[type as keyof typeof variantMap] || 'spinner'}
      text={text}
      fullScreen={fullScreen}
    />
  );
};

export default Loading;
