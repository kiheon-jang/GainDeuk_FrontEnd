import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

interface SkeletonTextProps {
  lines?: number;
  lineHeight?: string | number;
  spacing?: string | number;
  variant?: 'text' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

interface SkeletonCardProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  showContent?: boolean;
  showActions?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

const SkeletonBase = styled.div<{ 
  width?: string | number; 
  height?: string | number;
  variant?: string;
  animation?: string;
}>`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.sm};
  display: inline-block;
  position: relative;
  overflow: hidden;
  
  ${props => {
    const width = typeof props.width === 'number' ? `${props.width}px` : props.width || '100%';
    const height = typeof props.height === 'number' ? `${props.height}px` : props.height || '1em';
    
    return css`
      width: ${width};
      height: ${height};
    `;
  }}

  ${props => {
    switch (props.variant) {
      case 'circular':
        return css`
          border-radius: 50%;
        `;
      case 'rectangular':
        return css`
          border-radius: ${theme.borderRadius.sm};
        `;
      case 'text':
        return css`
          border-radius: ${theme.borderRadius.sm};
        `;
      case 'card':
        return css`
          border-radius: ${theme.borderRadius.md};
        `;
      default:
        return css`
          border-radius: ${theme.borderRadius.sm};
        `;
    }
  }}

  ${props => {
    switch (props.animation) {
      case 'wave':
        return css`
          background: linear-gradient(
            90deg,
            ${theme.colors.surface} 25%,
            ${theme.colors.background} 50%,
            ${theme.colors.surface} 75%
          );
          background-size: 200px 100%;
          animation: ${shimmer} 1.5s infinite;
        `;
      case 'pulse':
        return css`
          animation: ${pulse} 1.5s ease-in-out infinite;
        `;
      case 'none':
        return css`
          animation: none;
        `;
      default:
        return css`
          animation: ${pulse} 1.5s ease-in-out infinite;
        `;
    }
  }}
`;

const SkeletonTextContainer = styled.div<{ 
  lineHeight?: string | number;
  spacing?: string | number;
}>`
  display: flex;
  flex-direction: column;
  gap: ${props => {
    const spacing = typeof props.spacing === 'number' ? `${props.spacing}px` : props.spacing || '8px';
    return spacing;
  }};
`;

const SkeletonTextLine = styled(SkeletonBase)<{ 
  lineHeight?: string | number;
  isLast?: boolean;
}>`
  height: ${props => {
    const lineHeight = typeof props.lineHeight === 'number' ? `${props.lineHeight}px` : props.lineHeight || '1em';
    return lineHeight;
  }};
  
  ${props => props.isLast && css`
    width: 60%;
  `}
`;

const SkeletonCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
`;

const SkeletonCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const SkeletonCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const SkeletonCardActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${theme.spacing.md};
`;

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
  className,
}) => {
  return (
    <SkeletonBase
      width={width}
      height={height}
      variant={variant}
      animation={animation}
      className={className}
    />
  );
};

const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lineHeight = '1em',
  spacing = '8px',
  variant = 'text',
  animation = 'pulse',
  className,
}) => {
  return (
    <SkeletonTextContainer lineHeight={lineHeight} spacing={spacing} className={className}>
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonTextLine
          key={index}
          variant={variant}
          animation={animation}
          lineHeight={lineHeight}
          isLast={index === lines - 1}
        />
      ))}
    </SkeletonTextContainer>
  );
};

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = true,
  showTitle = true,
  showContent = true,
  showActions = true,
  animation = 'pulse',
  className,
}) => {
  return (
    <SkeletonCardContainer className={className}>
      {showAvatar && (
        <SkeletonCardHeader>
          <Skeleton
            width={40}
            height={40}
            variant="circular"
            animation={animation}
          />
          {showTitle && (
            <div style={{ flex: 1 }}>
              <SkeletonText
                lines={1}
                lineHeight="1.2em"
                animation={animation}
              />
            </div>
          )}
        </SkeletonCardHeader>
      )}
      
      {showContent && (
        <SkeletonCardContent>
          <SkeletonText
            lines={3}
            lineHeight="1em"
            animation={animation}
          />
        </SkeletonCardContent>
      )}
      
      {showActions && (
        <SkeletonCardActions>
          <Skeleton
            width={80}
            height={32}
            variant="rectangular"
            animation={animation}
          />
          <Skeleton
            width={80}
            height={32}
            variant="rectangular"
            animation={animation}
          />
        </SkeletonCardActions>
      )}
    </SkeletonCardContainer>
  );
};

// Compound component pattern
const SkeletonWithSubComponents = Skeleton as typeof Skeleton & {
  Text: typeof SkeletonText;
  Card: typeof SkeletonCard;
};

SkeletonWithSubComponents.Text = SkeletonText;
SkeletonWithSubComponents.Card = SkeletonCard;

export default SkeletonWithSubComponents;
