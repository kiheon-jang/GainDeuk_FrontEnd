import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme, mediaQueries } from '../../styles/theme';
import { Modal, Button } from '../common';
import type { Signal } from '../../types';

interface SignalDetailModalProps {
  signal: Signal | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  max-width: 800px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const CoinIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  color: ${theme.colors.text};
`;

const CoinDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoinName = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
`;

const CoinSymbol = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
  font-weight: 500;
`;

const CloseButton = styled(Button)`
  padding: ${theme.spacing.sm};
  min-width: auto;
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.lg};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing.xl};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const ScoreValue = styled.div<{ score: number }>`
  font-size: 3rem;
  font-weight: bold;
  color: ${props => {
    if (props.score >= 80) return theme.colors.success;
    if (props.score >= 60) return theme.colors.info;
    if (props.score >= 40) return theme.colors.warning;
    return theme.colors.error;
  }};
`;

const ScoreLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
`;

const RecommendationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const RecommendationCard = styled.div<{ type: string }>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  background-color: ${props => {
    switch (props.type) {
      case 'action':
        return 'rgba(0, 212, 170, 0.1)';
      case 'confidence':
        return 'rgba(0, 113, 235, 0.1)';
      case 'timeframe':
        return 'rgba(255, 184, 0, 0.1)';
      default:
        return 'rgba(179, 179, 179, 0.1)';
    }
  }};
`;

const CardTitle = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: ${theme.spacing.xs};
`;

const CardValue = styled.div`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
`;

const BreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
`;

const BreakdownItem = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background-color: rgba(179, 179, 179, 0.05);
`;

const BreakdownLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: ${theme.spacing.xs};
`;

const BreakdownValue = styled.div<{ value: number }>`
  color: ${props => {
    if (props.value >= 80) return theme.colors.success;
    if (props.value >= 60) return theme.colors.info;
    if (props.value >= 40) return theme.colors.warning;
    return theme.colors.error;
  }};
  font-size: 1.2rem;
  font-weight: bold;
`;

const PriceInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

const PriceItem = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background-color: rgba(179, 179, 179, 0.05);
`;

const PriceLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: ${theme.spacing.xs};
`;

const PriceValue = styled.div<{ isPositive?: boolean }>`
  color: ${props => {
    if (props.isPositive === undefined) return theme.colors.text;
    return props.isPositive ? theme.colors.success : theme.colors.error;
  }};
  font-size: 1.1rem;
  font-weight: 600;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
`;

const MetadataItem = styled.div`
  padding: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetadataLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const MetadataValue = styled.span`
  color: ${theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
`;

const SignalDetailModal: React.FC<SignalDetailModalProps> = ({
  signal,
  isOpen,
  onClose,
}) => {
  if (!signal) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AnimatePresence>
        {isOpen && (
          <ModalContent
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ModalHeader>
              <HeaderInfo>
                <CoinIcon>
                  {signal.symbol.charAt(0)}
                </CoinIcon>
                <CoinDetails>
                  <CoinName>{signal.name}</CoinName>
                  <CoinSymbol>{signal.symbol}</CoinSymbol>
                </CoinDetails>
              </HeaderInfo>
              <CloseButton variant="outlined" onClick={onClose}>
                ✕
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {/* AI Score Section */}
              <Section>
                <SectionTitle>🤖 AI 분석 점수</SectionTitle>
                <ScoreDisplay>
                  <ScoreValue score={signal.finalScore}>
                    {signal.finalScore}
                  </ScoreValue>
                  <ScoreLabel>
                    <div>종합 점수</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                      {signal.signalStrength.replace('_', ' ').toUpperCase()}
                    </div>
                  </ScoreLabel>
                </ScoreDisplay>
              </Section>

              {/* Recommendation Section */}
              <Section>
                <SectionTitle>💡 추천 사항</SectionTitle>
                <RecommendationGrid>
                  <RecommendationCard type="action">
                    <CardTitle>추천 액션</CardTitle>
                    <CardValue>
                      {signal.recommendation.action.replace('_', ' ')}
                    </CardValue>
                  </RecommendationCard>
                  <RecommendationCard type="confidence">
                    <CardTitle>신뢰도</CardTitle>
                    <CardValue>
                      {signal.recommendation.confidence}
                    </CardValue>
                  </RecommendationCard>
                  <RecommendationCard type="timeframe">
                    <CardTitle>권장 시간대</CardTitle>
                    <CardValue>
                      {signal.timeframe.replace('_', ' ')}
                    </CardValue>
                  </RecommendationCard>
                </RecommendationGrid>
              </Section>

              {/* Breakdown Section */}
              <Section>
                <SectionTitle>📊 상세 분석</SectionTitle>
                <BreakdownGrid>
                  <BreakdownItem>
                    <BreakdownLabel>가격 분석</BreakdownLabel>
                    <BreakdownValue value={signal.breakdown.price}>
                      {signal.breakdown.price}
                    </BreakdownValue>
                  </BreakdownItem>
                  <BreakdownItem>
                    <BreakdownLabel>거래량 분석</BreakdownLabel>
                    <BreakdownValue value={signal.breakdown.volume}>
                      {signal.breakdown.volume}
                    </BreakdownValue>
                  </BreakdownItem>
                  <BreakdownItem>
                    <BreakdownLabel>시장 분석</BreakdownLabel>
                    <BreakdownValue value={signal.breakdown.market}>
                      {signal.breakdown.market}
                    </BreakdownValue>
                  </BreakdownItem>
                  <BreakdownItem>
                    <BreakdownLabel>감정 분석</BreakdownLabel>
                    <BreakdownValue value={signal.breakdown.sentiment}>
                      {signal.breakdown.sentiment}
                    </BreakdownValue>
                  </BreakdownItem>
                  <BreakdownItem>
                    <BreakdownLabel>고래 활동</BreakdownLabel>
                    <BreakdownValue value={signal.breakdown.whale}>
                      {signal.breakdown.whale}
                    </BreakdownValue>
                  </BreakdownItem>
                </BreakdownGrid>
              </Section>

              {/* Price Information */}
              <Section>
                <SectionTitle>💰 가격 정보</SectionTitle>
                <PriceInfo>
                  <PriceItem>
                    <PriceLabel>현재 가격</PriceLabel>
                    <PriceValue>
                      {formatPrice(signal.currentPrice)}
                    </PriceValue>
                  </PriceItem>
                  <PriceItem>
                    <PriceLabel>시가총액</PriceLabel>
                    <PriceValue>
                      {formatPrice(signal.marketCap)}
                    </PriceValue>
                  </PriceItem>
                  <PriceItem>
                    <PriceLabel>1시간 변동</PriceLabel>
                    <PriceValue isPositive={signal.metadata.priceData.change_1h >= 0}>
                      {formatPercentage(signal.metadata.priceData.change_1h)}
                    </PriceValue>
                  </PriceItem>
                  <PriceItem>
                    <PriceLabel>24시간 변동</PriceLabel>
                    <PriceValue isPositive={signal.metadata.priceData.change_24h >= 0}>
                      {formatPercentage(signal.metadata.priceData.change_24h)}
                    </PriceValue>
                  </PriceItem>
                  <PriceItem>
                    <PriceLabel>7일 변동</PriceLabel>
                    <PriceValue isPositive={signal.metadata.priceData.change_7d >= 0}>
                      {formatPercentage(signal.metadata.priceData.change_7d)}
                    </PriceValue>
                  </PriceItem>
                  <PriceItem>
                    <PriceLabel>30일 변동</PriceLabel>
                    <PriceValue isPositive={signal.metadata.priceData.change_30d >= 0}>
                      {formatPercentage(signal.metadata.priceData.change_30d)}
                    </PriceValue>
                  </PriceItem>
                </PriceInfo>
              </Section>

              {/* Metadata */}
              <Section>
                <SectionTitle>📋 메타데이터</SectionTitle>
                <MetadataGrid>
                  <div>
                    <MetadataItem>
                      <MetadataLabel>순위</MetadataLabel>
                      <MetadataValue>#{signal.rank}</MetadataValue>
                    </MetadataItem>
                    <MetadataItem>
                      <MetadataLabel>우선순위</MetadataLabel>
                      <MetadataValue>
                        {signal.priority.replace('_', ' ')}
                      </MetadataValue>
                    </MetadataItem>
                    <MetadataItem>
                      <MetadataLabel>데이터 품질</MetadataLabel>
                      <MetadataValue>
                        {signal.metadata.dataQuality}
                      </MetadataValue>
                    </MetadataItem>
                    <MetadataItem>
                      <MetadataLabel>계산 시간</MetadataLabel>
                      <MetadataValue>
                        {signal.metadata.calculationTime}ms
                      </MetadataValue>
                    </MetadataItem>
                  </div>
                  <div>
                    <MetadataItem>
                      <MetadataLabel>거래량 비율</MetadataLabel>
                      <MetadataValue>
                        {signal.metadata.volumeRatio.toFixed(2)}
                      </MetadataValue>
                    </MetadataItem>
                    <MetadataItem>
                      <MetadataLabel>고래 활동</MetadataLabel>
                      <MetadataValue>
                        {signal.metadata.whaleActivity.toFixed(2)}
                      </MetadataValue>
                    </MetadataItem>
                    <MetadataItem>
                      <MetadataLabel>뉴스 수</MetadataLabel>
                      <MetadataValue>
                        {signal.metadata.newsCount}
                      </MetadataValue>
                    </MetadataItem>
                    <MetadataItem>
                      <MetadataLabel>마지막 업데이트</MetadataLabel>
                      <MetadataValue>
                        {formatDate(signal.metadata.lastUpdated)}
                      </MetadataValue>
                    </MetadataItem>
                  </div>
                </MetadataGrid>
              </Section>
            </ModalBody>
          </ModalContent>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default SignalDetailModal;
