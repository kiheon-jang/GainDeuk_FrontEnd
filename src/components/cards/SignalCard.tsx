import React, { memo, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { theme, mediaQueries } from '../../styles/theme';
import type { Signal } from '../../types';

interface SignalCardProps {
  signal: Signal;
  onClick?: (signal: Signal) => void;
  className?: string;
  isLoading?: boolean;
}

const CardContainer = styled(motion.div)<{ 
  signalStrength: string;
  isClickable: boolean;
}>`
  background: linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  
  /* Signal strength based styling */
  ${props => {
    switch (props.signalStrength) {
      case 'very_strong':
        return css`
          border-left: 4px solid ${theme.colors.success};
          box-shadow: 0 4px 20px rgba(0, 212, 170, 0.1);
        `;
      case 'strong':
        return css`
          border-left: 4px solid ${theme.colors.info};
          box-shadow: 0 4px 16px rgba(0, 113, 235, 0.1);
        `;
      case 'moderate':
        return css`
          border-left: 4px solid ${theme.colors.warning};
          box-shadow: 0 4px 12px rgba(255, 184, 0, 0.1);
        `;
      case 'weak':
        return css`
          border-left: 4px solid ${theme.colors.textSecondary};
          box-shadow: 0 4px 8px rgba(179, 179, 179, 0.1);
        `;
      default:
        return css`
          border-left: 4px solid ${theme.colors.border};
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        `;
    }
  }}

  &:hover {
    transform: scale(1.02);
    box-shadow: ${theme.shadows.lg};
    
    ${props => {
      switch (props.signalStrength) {
        case 'very_strong':
          return css`
            box-shadow: 0 8px 32px rgba(0, 212, 170, 0.2);
          `;
        case 'strong':
          return css`
            box-shadow: 0 8px 28px rgba(0, 113, 235, 0.2);
          `;
        case 'moderate':
          return css`
            box-shadow: 0 8px 24px rgba(255, 184, 0, 0.2);
          `;
        default:
          return css`
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          `;
      }
    }}
  }

  ${mediaQueries.mobile} {
    padding: ${theme.spacing.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const CoinIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: ${theme.colors.text};
`;

const CoinDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoinName = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
`;

const CoinSymbol = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
`;

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ScoreLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  margin-bottom: ${theme.spacing.xs};
`;

const ScoreValue = styled.div<{ score: number }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => {
    if (props.score >= 80) return theme.colors.success;
    if (props.score >= 60) return theme.colors.info;
    if (props.score >= 40) return theme.colors.warning;
    return theme.colors.error;
  }};
`;

const CardContent = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const RecommendationSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
`;

const ActionBadge = styled.div<{ action: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.action) {
      case 'STRONG_BUY':
      case 'BUY':
        return css`
          background-color: rgba(0, 212, 170, 0.2);
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success};
        `;
      case 'STRONG_SELL':
      case 'SELL':
        return css`
          background-color: rgba(229, 9, 20, 0.2);
          color: ${theme.colors.error};
          border: 1px solid ${theme.colors.error};
        `;
      case 'WEAK_SELL':
        return css`
          background-color: rgba(255, 184, 0, 0.2);
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning};
        `;
      default:
        return css`
          background-color: rgba(179, 179, 179, 0.2);
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.textSecondary};
        `;
    }
  }}
`;

const ConfidenceBadge = styled.div<{ confidence: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  
  ${props => {
    switch (props.confidence) {
      case 'HIGH':
        return css`
          background-color: rgba(0, 212, 170, 0.1);
          color: ${theme.colors.success};
        `;
      case 'MEDIUM':
        return css`
          background-color: rgba(255, 184, 0, 0.1);
          color: ${theme.colors.warning};
        `;
      default:
        return css`
          background-color: rgba(179, 179, 179, 0.1);
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

const TimeframeBadge = styled.div`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  background-color: rgba(0, 113, 235, 0.1);
  color: ${theme.colors.info};
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.sm};
  border-top: 1px solid ${theme.colors.border};
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CurrentPrice = styled.span`
  color: ${theme.colors.text};
  font-size: 1rem;
  font-weight: 600;
`;

const PriceChange = styled.span<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
  font-size: 0.8rem;
  font-weight: 500;
`;

const RankInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const RankLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.7rem;
  margin-bottom: ${theme.spacing.xs};
`;

const RankValue = styled.span`
  color: ${theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
`;

const SkeletonContainer = styled.div`
  background: linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
`;

const SkeletonLine = styled.div<{ width: string; height: string }>`
  background-color: ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  width: ${props => props.width};
  height: ${props => props.height};
  margin-bottom: ${theme.spacing.sm};
`;

const SignalCard: React.FC<SignalCardProps> = memo(({
  signal,
  onClick,
  className,
  isLoading = false,
}) => {
  const handleClick = useCallback(() => {
    if (onClick && !isLoading) {
      onClick(signal);
    }
  }, [onClick, signal, isLoading]);

  const isPositiveChange = useMemo(() => 
    signal.metadata.priceData.change_24h >= 0, 
    [signal.metadata.priceData.change_24h]
  );
  
  const priceChangePercentage = useMemo(() => 
    Math.abs(signal.metadata.priceData.change_24h), 
    [signal.metadata.priceData.change_24h]
  );

  const cardVariants = useMemo(() => ({
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  }), []);

  const cardTransition = useMemo(() => ({
    duration: 0.2
  }), []);

  if (isLoading) {
    return (
      <SkeletonContainer className={className}>
        <SkeletonLine width="60%" height="20px" />
        <SkeletonLine width="40%" height="16px" />
        <SkeletonLine width="80%" height="16px" />
        <SkeletonLine width="30%" height="16px" />
      </SkeletonContainer>
    );
  }

  return (
    <CardContainer
      signalStrength={signal.signalStrength}
      isClickable={!!onClick}
      onClick={handleClick}
      className={className}
      whileHover={cardVariants.hover}
      whileTap={cardVariants.tap}
      transition={cardTransition}
    >
      <CardHeader>
        <CoinInfo>
          <CoinIcon>
            {signal.symbol.charAt(0)}
          </CoinIcon>
          <CoinDetails>
            <CoinName>{signal.name}</CoinName>
            <CoinSymbol>{signal.symbol}</CoinSymbol>
          </CoinDetails>
        </CoinInfo>
        <ScoreContainer>
          <ScoreLabel>AI Score</ScoreLabel>
          <ScoreValue score={signal.finalScore}>
            {signal.finalScore}
          </ScoreValue>
        </ScoreContainer>
      </CardHeader>

      <CardContent>
        <RecommendationSection>
          <ActionBadge action={signal.recommendation.action}>
            {signal.recommendation.action.replace('_', ' ')}
          </ActionBadge>
          <ConfidenceBadge confidence={signal.recommendation.confidence}>
            {signal.recommendation.confidence} Confidence
          </ConfidenceBadge>
        </RecommendationSection>
        
        <TimeframeBadge>
          {signal.timeframe.replace('_', ' ')}
        </TimeframeBadge>
      </CardContent>

      <CardFooter>
        <PriceInfo>
          <CurrentPrice>
            ${signal.currentPrice.toLocaleString()}
          </CurrentPrice>
          <PriceChange isPositive={isPositiveChange}>
            {isPositiveChange ? '+' : '-'}{priceChangePercentage.toFixed(2)}%
          </PriceChange>
        </PriceInfo>
        
        <RankInfo>
          <RankLabel>Rank</RankLabel>
          <RankValue>#{signal.rank}</RankValue>
        </RankInfo>
      </CardFooter>
    </CardContainer>
  );
});

SignalCard.displayName = 'SignalCard';

export default SignalCard;
