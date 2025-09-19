import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useReducedMotion } from '../../hooks/useAccessibility';

interface AnimatedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'bars';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoaderContainer = styled.div<{ fullScreen?: boolean; size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  
  ${props => props.fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
  `}
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return `font-size: 0.875rem;`;
      case 'lg':
        return `font-size: 1.25rem;`;
      default:
        return `font-size: 1rem;`;
    }
  }}
`;

const LoaderText = styled.div<{ color?: string }>`
  color: ${props => props.color || theme.colors.text};
  font-weight: 500;
  text-align: center;
`;

const SpinnerContainer = styled.div<{ size: string }>`
  ${props => {
    switch (props.size) {
      case 'sm':
        return `width: 24px; height: 24px;`;
      case 'lg':
        return `width: 48px; height: 48px;`;
      default:
        return `width: 32px; height: 32px;`;
    }
  }}
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const Dot = styled(motion.div)<{ color?: string; size: string }>`
  background-color: ${props => props.color || theme.colors.primary};
  border-radius: 50%;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return `width: 6px; height: 6px;`;
      case 'lg':
        return `width: 12px; height: 12px;`;
      default:
        return `width: 8px; height: 8px;`;
    }
  }}
`;

const PulseContainer = styled(motion.div)<{ color?: string; size: string }>`
  background-color: ${props => props.color || theme.colors.primary};
  border-radius: 50%;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return `width: 24px; height: 24px;`;
      case 'lg':
        return `width: 48px; height: 48px;`;
      default:
        return `width: 32px; height: 32px;`;
    }
  }}
`;

const WaveContainer = styled.div`
  display: flex;
  gap: 2px;
  align-items: end;
  height: 20px;
`;

const Bar = styled(motion.div)<{ color?: string }>`
  background-color: ${props => props.color || theme.colors.primary};
  width: 3px;
  border-radius: 2px;
`;

const BarsContainer = styled.div`
  display: flex;
  gap: 2px;
  align-items: end;
  height: 20px;
`;

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color,
  text,
  fullScreen = false
}) => {
  const reducedMotion = useReducedMotion();

  const renderLoader = () => {
    if (reducedMotion) {
      return (
        <LoaderText color={color}>
          {text || '로딩 중...'}
        </LoaderText>
      );
    }

    switch (variant) {
      case 'spinner':
        return (
          <SpinnerContainer size={size}>
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                border: `3px solid ${color || theme.colors.primary}20`,
                borderTop: `3px solid ${color || theme.colors.primary}`,
                borderRadius: '50%'
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </SpinnerContainer>
        );

      case 'dots':
        return (
          <DotsContainer>
            {[0, 1, 2].map((index) => (
              <Dot
                key={index}
                color={color}
                size={size}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </DotsContainer>
        );

      case 'pulse':
        return (
          <PulseContainer
            color={color}
            size={size}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        );

      case 'wave':
        return (
          <WaveContainer>
            {[0, 1, 2, 3, 4].map((index) => (
              <Bar
                key={index}
                color={color}
                style={{ height: '100%' }}
                animate={{
                  height: ['20%', '100%', '20%']
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </WaveContainer>
        );

      case 'bars':
        return (
          <BarsContainer>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Bar
                key={index}
                color={color}
                style={{ height: '100%' }}
                animate={{
                  scaleY: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </BarsContainer>
        );

      default:
        return null;
    }
  };

  return (
    <LoaderContainer fullScreen={fullScreen} size={size}>
      {renderLoader()}
      {text && (
        <LoaderText color={color}>
          {text}
        </LoaderText>
      )}
    </LoaderContainer>
  );
};

export default AnimatedLoader;
