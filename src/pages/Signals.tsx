import React from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../styles/theme';
import { SignalCard } from '../components/common';
import { useTopSignals } from '../hooks/useSignals';
import type { Signal } from '../types';

const SignalsContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${theme.colors.text};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
`;

const ComingSoonCard = styled.div`
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
`;

const FeatureItem = styled.li`
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background-color: rgba(229, 9, 20, 0.05);
`;

const SignalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  background-color: rgba(229, 9, 20, 0.1);
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.lg};
`;

const Signals: React.FC = () => {
  const { data: signalsData, isLoading, error } = useTopSignals(20);

  const handleSignalClick = (signal: Signal) => {
    console.log('Signal clicked:', signal);
    // TODO: Open signal detail modal
  };

  if (error) {
    return (
      <SignalsContainer>
        <PageTitle>📊 신호 분석</PageTitle>
        <ErrorContainer>
          <h3>신호 데이터를 불러올 수 없습니다</h3>
          <p>잠시 후 다시 시도해주세요.</p>
        </ErrorContainer>
      </SignalsContainer>
    );
  }

  return (
    <SignalsContainer>
      <PageTitle>📊 신호 분석</PageTitle>
      
      {isLoading ? (
        <LoadingContainer>
          <div>신호 데이터를 불러오는 중...</div>
        </LoadingContainer>
      ) : signalsData?.data && signalsData.data.length > 0 ? (
        <SignalsGrid>
          {signalsData.data.map((signal) => (
            <SignalCard
              key={signal._id}
              signal={signal}
              onClick={handleSignalClick}
            />
          ))}
        </SignalsGrid>
      ) : (
        <ComingSoonCard>
          <ComingSoonTitle>🚧 개발 중</ComingSoonTitle>
          <ComingSoonText>
            AI 기반 신호 분석 기능이 곧 제공됩니다.
          </ComingSoonText>
          <FeatureList>
            <FeatureItem>
              <strong>실시간 신호 모니터링</strong><br />
              AI가 분석한 실시간 투자 신호를 확인하세요
            </FeatureItem>
            <FeatureItem>
              <strong>신호 필터링</strong><br />
              점수, 액션 타입, 타임프레임별로 신호를 필터링하세요
            </FeatureItem>
            <FeatureItem>
              <strong>신호 상세 분석</strong><br />
              각 신호의 상세한 분석 결과를 확인하세요
            </FeatureItem>
            <FeatureItem>
              <strong>개인화 추천</strong><br />
              사용자 프로필에 맞는 맞춤형 신호를 받아보세요
            </FeatureItem>
          </FeatureList>
        </ComingSoonCard>
      )}
    </SignalsContainer>
  );
};

export default Signals;
