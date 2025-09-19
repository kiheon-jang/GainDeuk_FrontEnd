import React, { useState } from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../styles/theme';
import { PriceChart, KimchiPremium, Skeleton, AnimatedSection, HoverEffect, SEOHead } from '../components/common';
import { SignalCard } from '../components/cards';
import { useChartData, useTopSignals, useKoreanMarketStats } from '../hooks';
import { createPageSEOMeta, createWebPageStructuredData } from '../utils/seoUtils';
import type { Signal } from '../types';

const DashboardContainer = styled.div`
  padding: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    padding: ${theme.spacing.md};
  }
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

// Market Overview Section
const MarketOverviewSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const MarketStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.md};
  }
`;

const MarketStatCard = styled.div`
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

const MarketStatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const MarketStatLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Personalized Signals Section
const PersonalizedSignalsSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SignalsContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const SignalsScrollContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  overflow-x: auto;
  padding: ${theme.spacing.sm} 0;
  scroll-behavior: smooth;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SignalCardWrapper = styled.div`
  flex: 0 0 320px;
  min-width: 320px;
  
  ${mediaQueries.mobile} {
    flex: 0 0 280px;
    min-width: 280px;
  }
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
    box-shadow: ${theme.shadows.md};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ScrollButtonLeft = styled(ScrollButton)`
  left: -20px;
  
  ${mediaQueries.mobile} {
    left: -10px;
    width: 32px;
    height: 32px;
  }
`;

const ScrollButtonRight = styled(ScrollButton)`
  right: -20px;
  
  ${mediaQueries.mobile} {
    right: -10px;
    width: 32px;
    height: 32px;
  }
`;

// Timeframe Strategies Section
const TimeframeStrategiesSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const StrategiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const StrategyCard = styled.div<{ timeframe: string }>`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;

  ${props => {
    switch (props.timeframe) {
      case 'SCALPING':
        return `
          border-left: 4px solid ${theme.colors.error};
          background: linear-gradient(135deg, rgba(229, 9, 20, 0.05) 0%, ${theme.colors.surface} 100%);
        `;
      case 'DAY_TRADING':
        return `
          border-left: 4px solid ${theme.colors.warning};
          background: linear-gradient(135deg, rgba(255, 184, 0, 0.05) 0%, ${theme.colors.surface} 100%);
        `;
      case 'SWING_TRADING':
        return `
          border-left: 4px solid ${theme.colors.info};
          background: linear-gradient(135deg, rgba(0, 113, 235, 0.05) 0%, ${theme.colors.surface} 100%);
        `;
      case 'LONG_TERM':
        return `
          border-left: 4px solid ${theme.colors.success};
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, ${theme.colors.surface} 100%);
        `;
      default:
        return '';
    }
  }}

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const StrategyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${theme.spacing.md};
`;

const StrategyTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.sm};
`;

const StrategyDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: ${theme.spacing.md};
`;

const StrategyStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
`;

const StrategyStat = styled.div`
  text-align: center;
`;

const StrategyStatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const StrategyStatLabel = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

// Real-time Alert Banner
const AlertBanner = styled.div<{ type: 'success' | 'warning' | 'error' | 'info' }>`
  background: ${props => {
    switch (props.type) {
      case 'success':
        return `linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(0, 212, 170, 0.05) 100%)`;
      case 'warning':
        return `linear-gradient(135deg, rgba(255, 184, 0, 0.1) 0%, rgba(255, 184, 0, 0.05) 100%)`;
      case 'error':
        return `linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(229, 9, 20, 0.05) 100%)`;
      case 'info':
        return `linear-gradient(135deg, rgba(0, 113, 235, 0.1) 0%, rgba(0, 113, 235, 0.05) 100%)`;
      default:
        return theme.colors.surface;
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.border;
    }
  }};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const AlertIcon = styled.div`
  font-size: 1.5rem;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.h4`
  color: ${theme.colors.text};
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const AlertMessage = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

const AlertTime = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  white-space: nowrap;
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
  const [selectedSymbol] = useState('BTC');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Data fetching hooks
  const { data: chartData, isLoading: chartLoading, error: chartError } = useChartData(selectedSymbol, selectedTimeframe);
  const { data: topSignals, isLoading: signalsLoading } = useTopSignals(10);
  const { data: koreanMarketStats, isLoading: marketStatsLoading } = useKoreanMarketStats();

  // SEO 메타데이터 생성
  const seoMeta = createPageSEOMeta('dashboard');
  const structuredData = createWebPageStructuredData(
    seoMeta.title,
    seoMeta.description,
    'https://gaindeuk.com/dashboard',
    [
      { name: '홈', url: 'https://gaindeuk.com/' },
      { name: '대시보드', url: 'https://gaindeuk.com/dashboard' }
    ]
  );

  // Handle signal card click
  const handleSignalClick = (signal: Signal) => {
    console.log('Signal clicked:', signal);
    // Navigate to signal detail or open modal
  };

  // Handle horizontal scroll
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('signals-scroll-container');
    if (container) {
      // Responsive scroll amount based on screen size
      const isMobile = window.innerWidth <= 768;
      const scrollAmount = isMobile ? 280 : 320; // Card width + gap
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  // Mock alert data - in real app, this would come from WebSocket or API
  const mockAlert = {
    type: 'success' as const,
    icon: '🚀',
    title: '새로운 강력한 매수 신호',
    message: 'BTC가 85점의 높은 신호 점수를 기록했습니다.',
    time: '2분 전'
  };

  // Timeframe strategies data
  const timeframeStrategies = [
    {
      timeframe: 'SCALPING',
      icon: '⚡',
      title: '스캘핑',
      description: '단기간 빠른 수익 추구',
      winRate: '78%',
      avgReturn: '+2.3%',
      riskLevel: '높음'
    },
    {
      timeframe: 'DAY_TRADING',
      icon: '📈',
      title: '데이트레이딩',
      description: '하루 내 포지션 정리',
      winRate: '65%',
      avgReturn: '+5.8%',
      riskLevel: '중간'
    },
    {
      timeframe: 'SWING_TRADING',
      icon: '🌊',
      title: '스윙 트레이딩',
      description: '중기 트렌드 포착',
      winRate: '72%',
      avgReturn: '+12.4%',
      riskLevel: '중간'
    },
    {
      timeframe: 'LONG_TERM',
      icon: '🏔️',
      title: '장기 투자',
      description: '장기적 가치 투자',
      winRate: '85%',
      avgReturn: '+45.2%',
      riskLevel: '낮음'
    }
  ];

  return (
    <>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        canonicalUrl="/dashboard"
        ogTitle={seoMeta.title}
        ogDescription={seoMeta.description}
        ogUrl="/dashboard"
        ogType={seoMeta.ogType}
        structuredData={structuredData}
      />
      <DashboardContainer>
      <AnimatedSection animation="fadeIn" delay={0.1}>
        <WelcomeSection>
          <WelcomeTitle>🚀 GainDeuk 대시보드</WelcomeTitle>
          <WelcomeSubtitle>
            AI 기반 암호화폐 투자 신호 분석 서비스
          </WelcomeSubtitle>
        </WelcomeSection>
      </AnimatedSection>

      {/* Real-time Alert Banner */}
      <AnimatedSection animation="slideUp" delay={0.2}>
        <AlertBanner type={mockAlert.type}>
          <AlertIcon>{mockAlert.icon}</AlertIcon>
          <AlertContent>
            <AlertTitle>{mockAlert.title}</AlertTitle>
            <AlertMessage>{mockAlert.message}</AlertMessage>
          </AlertContent>
          <AlertTime>{mockAlert.time}</AlertTime>
        </AlertBanner>
      </AnimatedSection>

      {/* Market Overview Section */}
      <AnimatedSection animation="slideUp" delay={0.3}>
        <MarketOverviewSection>
          <SectionTitle>
            📊 실시간 시장 개요
          </SectionTitle>
          
          <MarketStatsGrid>
          {marketStatsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <MarketStatCard key={index}>
                <Skeleton width="80px" height="32px" />
                <Skeleton width="120px" height="16px" />
              </MarketStatCard>
            ))
          ) : (
            <>
              <MarketStatCard>
                <MarketStatValue>
                  {koreanMarketStats?.data?.kimchiPremium?.toFixed(2) || '2.45'}%
                </MarketStatValue>
                <MarketStatLabel>김치 프리미엄</MarketStatLabel>
              </MarketStatCard>
              <MarketStatCard>
                <MarketStatValue>
                  ${koreanMarketStats?.data?.totalVolume?.toLocaleString() || '1.2B'}
                </MarketStatValue>
                <MarketStatLabel>24시간 거래량</MarketStatLabel>
              </MarketStatCard>
              <MarketStatCard>
                <MarketStatValue>
                  {koreanMarketStats?.data?.activeUsers?.toLocaleString() || '15,432'}
                </MarketStatValue>
                <MarketStatLabel>활성 사용자</MarketStatLabel>
              </MarketStatCard>
              <MarketStatCard>
                <MarketStatValue>
                  {topSignals?.data?.length || '24'}
                </MarketStatValue>
                <MarketStatLabel>활성 신호</MarketStatLabel>
              </MarketStatCard>
            </>
          )}
        </MarketStatsGrid>
        </MarketOverviewSection>
      </AnimatedSection>

      {/* Personalized Signals Section */}
      <AnimatedSection animation="slideUp" delay={0.4}>
        <PersonalizedSignalsSection>
          <SectionTitle>
            🎯 개인화된 투자 신호
          </SectionTitle>
        
        <SignalsContainer>
          <ScrollButtonLeft 
            onClick={() => handleScroll('left')}
            disabled={scrollPosition <= 0}
          >
            ‹
          </ScrollButtonLeft>
          
          <SignalsScrollContainer id="signals-scroll-container">
            {signalsLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SignalCardWrapper key={index}>
                  <SignalCard 
                    signal={{} as Signal} 
                    isLoading={true}
                  />
                </SignalCardWrapper>
              ))
            ) : (
              topSignals?.data?.map((signal) => (
                <SignalCardWrapper key={signal._id}>
                  <SignalCard 
                    signal={signal}
                    onClick={handleSignalClick}
                  />
                </SignalCardWrapper>
              ))
            )}
          </SignalsScrollContainer>
          
          <ScrollButtonRight 
            onClick={() => handleScroll('right')}
            disabled={scrollPosition >= (topSignals?.data?.length || 0) * (window.innerWidth <= 768 ? 280 : 320)}
          >
            ›
          </ScrollButtonRight>
        </SignalsContainer>
        </PersonalizedSignalsSection>
      </AnimatedSection>

      {/* Timeframe Strategies Section */}
      <AnimatedSection animation="slideUp" delay={0.5}>
        <TimeframeStrategiesSection>
          <SectionTitle>
            ⏰ 타임프레임별 투자 전략
          </SectionTitle>
          
          <StrategiesGrid>
            {timeframeStrategies.map((strategy, index) => (
              <AnimatedSection key={strategy.timeframe} animation="scale" delay={0.6 + index * 0.1}>
                <HoverEffect effect="lift" intensity="medium">
                  <StrategyCard timeframe={strategy.timeframe}>
                    <StrategyIcon>{strategy.icon}</StrategyIcon>
                    <StrategyTitle>{strategy.title}</StrategyTitle>
                    <StrategyDescription>{strategy.description}</StrategyDescription>
                    <StrategyStats>
                      <StrategyStat>
                        <StrategyStatValue>{strategy.winRate}</StrategyStatValue>
                        <StrategyStatLabel>승률</StrategyStatLabel>
                      </StrategyStat>
                      <StrategyStat>
                        <StrategyStatValue>{strategy.avgReturn}</StrategyStatValue>
                        <StrategyStatLabel>평균 수익</StrategyStatLabel>
                      </StrategyStat>
                      <StrategyStat>
                        <StrategyStatValue>{strategy.riskLevel}</StrategyStatValue>
                        <StrategyStatLabel>위험도</StrategyStatLabel>
                      </StrategyStat>
                    </StrategyStats>
                  </StrategyCard>
                </HoverEffect>
              </AnimatedSection>
            ))}
          </StrategiesGrid>
        </TimeframeStrategiesSection>
      </AnimatedSection>

      <AnimatedSection animation="slideUp" delay={0.6}>
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
      </AnimatedSection>

      <AnimatedSection animation="slideUp" delay={0.7}>
        <ChartSection>
          <SectionTitle>
            📈 실시간 가격 차트
          </SectionTitle>
          <PriceChart
            data={chartData}
            symbol={selectedSymbol}
            timeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            isLoading={chartLoading}
            error={chartError?.message || null}
          />
        </ChartSection>
      </AnimatedSection>

      <AnimatedSection animation="fadeIn" delay={0.8}>
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
      </AnimatedSection>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
