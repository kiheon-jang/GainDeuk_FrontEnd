import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const StrategyContainer = styled.div`
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

const Strategy: React.FC = () => {
  return (
    <StrategyContainer>
      <PageTitle>📈 투자 전략</PageTitle>
      
      <ComingSoonCard>
        <ComingSoonTitle>🚧 개발 중</ComingSoonTitle>
        <ComingSoonText>
          AI 기반 개인화 투자 전략 기능이 곧 제공됩니다.
        </ComingSoonText>
        <FeatureList>
          <FeatureItem>
            <strong>AI 전략 생성</strong><br />
            사용자 프로필에 맞는 개인화된 투자 전략을 생성합니다
          </FeatureItem>
          <FeatureItem>
            <strong>타임프레임별 전략</strong><br />
            스켈핑, 데이트레이딩, 스윙, 장기 투자 전략을 제공합니다
          </FeatureItem>
          <FeatureItem>
            <strong>실시간 최적화</strong><br />
            시장 상황에 따라 전략을 실시간으로 최적화합니다
          </FeatureItem>
          <FeatureItem>
            <strong>백테스팅</strong><br />
            과거 데이터를 기반으로 전략의 성과를 검증합니다
          </FeatureItem>
        </FeatureList>
      </ComingSoonCard>
    </StrategyContainer>
  );
};

export default Strategy;
