import React, { useState } from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../styles/theme';
import { PriceChart, KimchiPremium } from '../components/common';
import { useChartData } from '../hooks';

const DashboardContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const WelcomeTitle = styled.h1`
  color: ${theme.colors.text};
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.md};
  background: linear-gradient(45deg, ${theme.colors.primary}, #FF6B6B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.2rem;
  margin-bottom: ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ComingSoonSection = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const ComingSoonTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  margin-bottom: ${theme.spacing.md};
`;

const ComingSoonText = styled.p`
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.lg};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

const FeatureItem = styled.li`
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.sm};
  border-left: 3px solid ${theme.colors.primary};
  background-color: rgba(229, 9, 20, 0.1);
  border-radius: ${theme.borderRadius.sm};
`;

const ChartSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const PremiumSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const PremiumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Dashboard: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  
  const { data: chartData, isLoading, error } = useChartData(selectedSymbol, selectedTimeframe);

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>🚀 GainDeuk 대시보드</WelcomeTitle>
        <WelcomeSubtitle>
          AI 기반 암호화폐 투자 신호 분석 서비스
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatValue>24</StatValue>
          <StatLabel>활성 신호</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>+12.5%</StatValue>
          <StatLabel>평균 수익률</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>156</StatValue>
          <StatLabel>추적 코인</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>98.7%</StatValue>
          <StatLabel>신호 정확도</StatLabel>
        </StatCard>
      </StatsGrid>

      <PremiumSection>
        <SectionTitle>
          🥟 김치 프리미엄
        </SectionTitle>
        <PremiumGrid>
          <KimchiPremium symbol="BTC" />
          <KimchiPremium symbol="ETH" />
          <KimchiPremium symbol="ADA" />
        </PremiumGrid>
      </PremiumSection>

      <ChartSection>
        <SectionTitle>
          📈 실시간 가격 차트
        </SectionTitle>
        <PriceChart
          data={chartData}
          symbol={selectedSymbol}
          timeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          isLoading={isLoading}
          error={error}
        />
      </ChartSection>

      <ComingSoonSection>
        <ComingSoonTitle>🎯 주요 기능</ComingSoonTitle>
        <ComingSoonText>
          실시간 신호 분석, 개인화된 투자 전략, 고급 분석 도구가 곧 제공됩니다.
        </ComingSoonText>
        <FeatureList>
          <FeatureItem>📊 실시간 신호 분석</FeatureItem>
          <FeatureItem>🎯 개인화된 투자 전략</FeatureItem>
          <FeatureItem>📈 고급 차트 분석</FeatureItem>
          <FeatureItem>🔔 스마트 알림 시스템</FeatureItem>
          <FeatureItem>🐋 고래 움직임 추적</FeatureItem>
          <FeatureItem>📱 모바일 최적화</FeatureItem>
        </FeatureList>
      </ComingSoonSection>
    </DashboardContainer>
  );
};

export default Dashboard;
