import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../styles/theme';
import { Input, Select, Button, Skeleton, Toggle } from '../components/common';
import type { InvestmentStrategy } from '../types';

const StrategyContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  
  ${mediaQueries.mobile} {
    padding: ${theme.spacing.md};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const PageTitle = styled.h1`
  color: ${theme.colors.text};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
  background: linear-gradient(45deg, ${theme.colors.primary}, #FF6B6B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const Section = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
`;

const SectionHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const SectionDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

const StrategyForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: end;
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const GenerateButton = styled(Button)`
  grid-column: 1 / -1;
  justify-self: center;
  min-width: 200px;
  margin-top: ${theme.spacing.md};
`;

const StrategiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const StrategyCard = styled.div<{ timeframe: string }>`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.timeframe) {
        case 'SCALPING': return 'linear-gradient(90deg, #FF6B6B, #FF8E8E)';
        case 'DAY_TRADING': return 'linear-gradient(90deg, #4ECDC4, #6EDDD6)';
        case 'SWING_TRADING': return 'linear-gradient(90deg, #45B7D1, #6BC5D8)';
        case 'LONG_TERM': return 'linear-gradient(90deg, #96CEB4, #A8D5BA)';
        default: return theme.colors.primary;
      }
    }};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const StrategyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const StrategyTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const StrategyIcon = styled.div<{ timeframe: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: ${props => {
    switch (props.timeframe) {
      case 'SCALPING': return 'linear-gradient(135deg, #FF6B6B, #FF8E8E)';
      case 'DAY_TRADING': return 'linear-gradient(135deg, #4ECDC4, #6EDDD6)';
      case 'SWING_TRADING': return 'linear-gradient(135deg, #45B7D1, #6BC5D8)';
      case 'LONG_TERM': return 'linear-gradient(135deg, #96CEB4, #A8D5BA)';
      default: return theme.colors.primary;
    }
  }};
  color: white;
`;

const StrategyStatus = styled.div<{ status: 'active' | 'optimizing' | 'paused' }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background-color: rgba(0, 212, 170, 0.1);
          color: ${theme.colors.success};
        `;
      case 'optimizing':
        return `
          background-color: rgba(255, 193, 7, 0.1);
          color: ${theme.colors.warning};
        `;
      case 'paused':
        return `
          background-color: rgba(108, 117, 125, 0.1);
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

const StrategyDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: ${theme.spacing.md};
`;

const StrategyMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div<{ isPositive?: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
  margin-bottom: ${theme.spacing.xs};
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StrategyActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const ActionButton = styled(Button)`
  flex: 1;
  font-size: 0.9rem;
`;

const OptimizationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const OptimizationCard = styled.div`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
`;

const OptimizationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const OptimizationTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const OptimizationToggle = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const OptimizationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background-color: rgba(0, 212, 170, 0.1);
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.success};
  font-size: 0.9rem;
  font-weight: 500;
`;

const BacktestingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const BacktestingCard = styled.div`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
`;

const BacktestingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const BacktestingTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const BacktestingResults = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const BacktestingMetric = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.sm};
`;

const BacktestingValue = styled.div<{ isPositive?: boolean }>`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
  margin-bottom: ${theme.spacing.xs};
`;

const BacktestingLabel = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.border};
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background-color: rgba(0, 212, 170, 0.1);
  border: 1px solid ${theme.colors.success};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  color: ${theme.colors.success};
  font-weight: 500;
  margin-bottom: ${theme.spacing.lg};
`;

const ErrorMessage = styled.div`
  background-color: rgba(229, 9, 20, 0.1);
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  color: ${theme.colors.error};
  font-weight: 500;
  margin-bottom: ${theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
  font-style: italic;
`;

const Strategy: React.FC = () => {
  const [formData, setFormData] = useState({
    riskLevel: 'moderate',
    timeframe: 'DAY_TRADING',
    investmentAmount: 1000,
    experienceLevel: 'intermediate',
    preferredCoins: ['BTC', 'ETH'],
    autoOptimize: true,
  });
  
  const [strategies, setStrategies] = useState<InvestmentStrategy[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateStrategies = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowSuccess(false);
    setShowError(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated strategies
      const mockStrategies: InvestmentStrategy[] = [
        {
          _id: '1',
          timeframe: 'SCALPING',
          name: '고빈도 스캘핑 전략',
          description: '5분-15분 타임프레임에서 작은 가격 변동을 이용한 고빈도 거래 전략',
          riskLevel: 'high',
          expectedReturn: 15.2,
          maxDrawdown: -8.5,
          winRate: 68.3,
          sharpeRatio: 1.8,
          status: 'active',
          lastOptimized: new Date().toISOString(),
          backtestingResults: {
            totalReturn: 45.2,
            maxDrawdown: -12.3,
            sharpeRatio: 1.6,
            winRate: 65.8,
            totalTrades: 1247,
            profitableTrades: 820
          }
        },
        {
          _id: '2',
          timeframe: 'DAY_TRADING',
          name: '데이트레이딩 모멘텀 전략',
          description: '일봉 기반 모멘텀과 기술적 지표를 활용한 데이트레이딩 전략',
          riskLevel: 'moderate',
          expectedReturn: 8.7,
          maxDrawdown: -5.2,
          winRate: 72.1,
          sharpeRatio: 2.1,
          status: 'active',
          lastOptimized: new Date().toISOString(),
          backtestingResults: {
            totalReturn: 28.7,
            maxDrawdown: -8.1,
            sharpeRatio: 1.9,
            winRate: 71.2,
            totalTrades: 156,
            profitableTrades: 111
          }
        },
        {
          _id: '3',
          timeframe: 'SWING_TRADING',
          name: '스윙 트레이딩 추세 전략',
          description: '주봉 기반 추세 분석과 지지/저항을 활용한 스윙 트레이딩 전략',
          riskLevel: 'moderate',
          expectedReturn: 12.4,
          maxDrawdown: -6.8,
          winRate: 75.6,
          sharpeRatio: 2.3,
          status: 'optimizing',
          lastOptimized: new Date().toISOString(),
          backtestingResults: {
            totalReturn: 35.4,
            maxDrawdown: -9.2,
            sharpeRatio: 2.0,
            winRate: 74.8,
            totalTrades: 89,
            profitableTrades: 67
          }
        },
        {
          _id: '4',
          timeframe: 'LONG_TERM',
          name: '장기 투자 DCA 전략',
          description: '달러 코스트 애버리징과 기본적 분석을 활용한 장기 투자 전략',
          riskLevel: 'low',
          expectedReturn: 6.2,
          maxDrawdown: -3.1,
          winRate: 82.3,
          sharpeRatio: 1.9,
          status: 'active',
          lastOptimized: new Date().toISOString(),
          backtestingResults: {
            totalReturn: 18.2,
            maxDrawdown: -5.8,
            sharpeRatio: 1.7,
            winRate: 81.5,
            totalTrades: 24,
            profitableTrades: 20
          }
        }
      ];
      
      setStrategies(mockStrategies);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrorMessage('전략 생성 중 오류가 발생했습니다.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'SCALPING': return '⚡';
      case 'DAY_TRADING': return '📊';
      case 'SWING_TRADING': return '📈';
      case 'LONG_TERM': return '🌱';
      default: return '📋';
    }
  };

  const getTimeframeName = (timeframe: string) => {
    switch (timeframe) {
      case 'SCALPING': return '스캘핑';
      case 'DAY_TRADING': return '데이트레이딩';
      case 'SWING_TRADING': return '스윙 트레이딩';
      case 'LONG_TERM': return '장기 투자';
      default: return '알 수 없음';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성';
      case 'optimizing': return '최적화 중';
      case 'paused': return '일시정지';
      default: return '알 수 없음';
    }
  };

  return (
    <StrategyContainer>
      <PageHeader>
        <PageTitle>📈 AI 투자 전략</PageTitle>
        <PageDescription>
          AI가 분석한 개인화된 투자 전략을 확인하고 실시간으로 최적화하세요. 
          당신의 투자 스타일과 목표에 맞는 맞춤형 전략을 제공합니다.
        </PageDescription>
      </PageHeader>

      <MainContent>
        {/* Strategy Generation Form */}
        <Section>
          <SectionHeader>
            <SectionTitle>🤖 AI 전략 생성</SectionTitle>
            <SectionDescription>
              투자 목표와 선호도를 설정하여 AI가 맞춤형 전략을 생성합니다.
            </SectionDescription>
          </SectionHeader>

          {showSuccess && (
            <SuccessMessage>
              ✅ AI가 {strategies.length}개의 개인화된 투자 전략을 생성했습니다!
            </SuccessMessage>
          )}

          {showError && (
            <ErrorMessage>
              ❌ {errorMessage}
            </ErrorMessage>
          )}

          <StrategyForm onSubmit={handleGenerateStrategies}>
            <FormGroup>
              <FormLabel>위험 수준</FormLabel>
              <Select
                options={[
                  { value: 'low', label: '낮음 - 안정적인 수익 추구' },
                  { value: 'moderate', label: '중간 - 균형잡힌 투자' },
                  { value: 'high', label: '높음 - 높은 수익 추구' },
                ]}
                value={formData.riskLevel}
                onChange={(value) => handleInputChange('riskLevel', value)}
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>선호 타임프레임</FormLabel>
              <Select
                options={[
                  { value: 'SCALPING', label: '스캘핑 (분 단위)' },
                  { value: 'DAY_TRADING', label: '데이트레이딩 (일 단위)' },
                  { value: 'SWING_TRADING', label: '스윙 트레이딩 (주 단위)' },
                  { value: 'LONG_TERM', label: '장기 투자 (월 단위)' },
                ]}
                value={formData.timeframe}
                onChange={(value) => handleInputChange('timeframe', value)}
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>투자 금액 (USDT)</FormLabel>
              <Input
                type="number"
                min="100"
                step="100"
                value={formData.investmentAmount}
                onChange={(e) => handleInputChange('investmentAmount', parseFloat(e.target.value))}
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>경험 수준</FormLabel>
              <Select
                options={[
                  { value: 'beginner', label: '초보자' },
                  { value: 'intermediate', label: '중급자' },
                  { value: 'advanced', label: '고급자' },
                  { value: 'expert', label: '전문가' },
                ]}
                value={formData.experienceLevel}
                onChange={(value) => handleInputChange('experienceLevel', value)}
                fullWidth
              />
            </FormGroup>

            <GenerateButton
              type="submit"
              disabled={isGenerating}
            >
              {isGenerating ? 'AI 전략 생성 중...' : '🚀 AI 전략 생성하기'}
            </GenerateButton>
          </StrategyForm>

          {isGenerating && (
            <LoadingState>
              <LoadingSpinner />
              <LoadingText>AI가 당신을 위한 맞춤형 투자 전략을 생성하고 있습니다...</LoadingText>
            </LoadingState>
          )}
        </Section>

        {/* Generated Strategies */}
        {strategies.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>📋 생성된 투자 전략</SectionTitle>
              <SectionDescription>
                AI가 분석한 {strategies.length}개의 개인화된 투자 전략입니다.
              </SectionDescription>
            </SectionHeader>

            <StrategiesGrid>
              {strategies.map((strategy) => (
                <StrategyCard key={strategy._id} timeframe={strategy.timeframe}>
                  <StrategyHeader>
                    <StrategyTitle>
                      <StrategyIcon timeframe={strategy.timeframe}>
                        {getTimeframeIcon(strategy.timeframe)}
                      </StrategyIcon>
                      {strategy.name}
                    </StrategyTitle>
                    <StrategyStatus status={strategy.status as any}>
                      {getStatusText(strategy.status)}
                    </StrategyStatus>
                  </StrategyHeader>

                  <StrategyDescription>
                    {strategy.description}
                  </StrategyDescription>

                  <StrategyMetrics>
                    <Metric>
                      <MetricValue isPositive={strategy.expectedReturn > 0}>
                        +{strategy.expectedReturn}%
                      </MetricValue>
                      <MetricLabel>예상 수익률</MetricLabel>
                    </Metric>
                    <Metric>
                      <MetricValue isPositive={strategy.winRate > 50}>
                        {strategy.winRate}%
                      </MetricValue>
                      <MetricLabel>승률</MetricLabel>
                    </Metric>
                    <Metric>
                      <MetricValue isPositive={strategy.maxDrawdown > -10}>
                        {strategy.maxDrawdown}%
                      </MetricValue>
                      <MetricLabel>최대 손실</MetricLabel>
                    </Metric>
                    <Metric>
                      <MetricValue isPositive={strategy.sharpeRatio > 1}>
                        {strategy.sharpeRatio}
                      </MetricValue>
                      <MetricLabel>샤프 비율</MetricLabel>
                    </Metric>
                  </StrategyMetrics>

                  <StrategyActions>
                    <ActionButton variant="outline" size="sm">
                      상세 보기
                    </ActionButton>
                    <ActionButton size="sm">
                      전략 적용
                    </ActionButton>
                  </StrategyActions>
                </StrategyCard>
              ))}
            </StrategiesGrid>
          </Section>
        )}

        {/* Real-time Optimization */}
        <Section>
          <SectionHeader>
            <SectionTitle>⚡ 실시간 전략 최적화</SectionTitle>
            <SectionDescription>
              시장 상황 변화에 따라 전략을 실시간으로 최적화합니다.
            </SectionDescription>
          </SectionHeader>

          <OptimizationSection>
            <OptimizationCard>
              <OptimizationHeader>
                <OptimizationTitle>
                  🔄 자동 최적화
                </OptimizationTitle>
                <OptimizationToggle>
                  <Toggle
                    checked={formData.autoOptimize}
                    onChange={(e) => handleInputChange('autoOptimize', e.target.checked)}
                  />
                  <span>활성화</span>
                </OptimizationToggle>
              </OptimizationHeader>
              <OptimizationStatus>
                ✅ 실시간 최적화가 활성화되어 있습니다
              </OptimizationStatus>
            </OptimizationCard>

            <OptimizationCard>
              <OptimizationHeader>
                <OptimizationTitle>
                  📊 최적화 통계
                </OptimizationTitle>
              </OptimizationHeader>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: theme.spacing.md }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.success, marginBottom: theme.spacing.xs }}>
                    24
                  </div>
                  <div style={{ fontSize: '0.8rem', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    최적화 횟수
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.primary, marginBottom: theme.spacing.xs }}>
                    2.3%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    성능 개선
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.warning, marginBottom: theme.spacing.xs }}>
                    15분
                  </div>
                  <div style={{ fontSize: '0.8rem', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    마지막 최적화
                  </div>
                </div>
              </div>
            </OptimizationCard>
          </OptimizationSection>
        </Section>

        {/* Backtesting Results */}
        <Section>
          <SectionHeader>
            <SectionTitle>📈 백테스팅 결과</SectionTitle>
            <SectionDescription>
              과거 데이터를 기반으로 한 전략 성과 분석 결과입니다.
            </SectionDescription>
          </SectionHeader>

          <BacktestingSection>
            {strategies.length > 0 ? (
              strategies.map((strategy) => (
                <BacktestingCard key={`backtest-${strategy._id}`}>
                  <BacktestingHeader>
                    <BacktestingTitle>
                      {getTimeframeIcon(strategy.timeframe)} {strategy.name}
                    </BacktestingTitle>
                  </BacktestingHeader>
                  
                  <BacktestingResults>
                    <BacktestingMetric>
                      <BacktestingValue isPositive={strategy.backtestingResults.totalReturn > 0}>
                        +{strategy.backtestingResults.totalReturn}%
                      </BacktestingValue>
                      <BacktestingLabel>총 수익률</BacktestingLabel>
                    </BacktestingMetric>
                    <BacktestingMetric>
                      <BacktestingValue isPositive={strategy.backtestingResults.maxDrawdown > -10}>
                        {strategy.backtestingResults.maxDrawdown}%
                      </BacktestingValue>
                      <BacktestingLabel>최대 손실</BacktestingLabel>
                    </BacktestingMetric>
                    <BacktestingMetric>
                      <BacktestingValue isPositive={strategy.backtestingResults.sharpeRatio > 1}>
                        {strategy.backtestingResults.sharpeRatio}
                      </BacktestingValue>
                      <BacktestingLabel>샤프 비율</BacktestingLabel>
                    </BacktestingMetric>
                    <BacktestingMetric>
                      <BacktestingValue isPositive={strategy.backtestingResults.winRate > 50}>
                        {strategy.backtestingResults.winRate}%
                      </BacktestingValue>
                      <BacktestingLabel>승률</BacktestingLabel>
                    </BacktestingMetric>
                    <BacktestingMetric>
                      <BacktestingValue>
                        {strategy.backtestingResults.totalTrades}
                      </BacktestingValue>
                      <BacktestingLabel>총 거래 수</BacktestingLabel>
                    </BacktestingMetric>
                    <BacktestingMetric>
                      <BacktestingValue isPositive={strategy.backtestingResults.profitableTrades > strategy.backtestingResults.totalTrades / 2}>
                        {strategy.backtestingResults.profitableTrades}
                      </BacktestingValue>
                      <BacktestingLabel>수익 거래</BacktestingLabel>
                    </BacktestingMetric>
                  </BacktestingResults>
                </BacktestingCard>
              ))
            ) : (
              <EmptyState>
                전략을 생성하면 백테스팅 결과를 확인할 수 있습니다.
              </EmptyState>
            )}
          </BacktestingSection>
        </Section>
      </MainContent>
    </StrategyContainer>
  );
};

export default Strategy;