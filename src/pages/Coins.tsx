import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const CoinsContainer = styled.div`
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

const Coins: React.FC = () => {
  return (
    <CoinsContainer>
      <PageTitle>🪙 코인 분석</PageTitle>
      
      <ComingSoonCard>
        <ComingSoonTitle>🚧 개발 중</ComingSoonTitle>
        <ComingSoonText>
          종합적인 코인 분석 기능이 곧 제공됩니다.
        </ComingSoonText>
        <FeatureList>
          <FeatureItem>
            <strong>시가총액 순위</strong><br />
            시가총액 기준으로 정렬된 코인 리스트를 확인하세요
          </FeatureItem>
          <FeatureItem>
            <strong>가격 차트</strong><br />
            실시간 가격 차트와 거래량 분석을 제공합니다
          </FeatureItem>
          <FeatureItem>
            <strong>김치프리미엄</strong><br />
            한국 시장과 글로벌 시장의 가격 차이를 분석합니다
          </FeatureItem>
          <FeatureItem>
            <strong>코인 검색</strong><br />
            원하는 코인을 빠르게 검색하고 분석하세요
          </FeatureItem>
        </FeatureList>
      </ComingSoonCard>
    </CoinsContainer>
  );
};

export default Coins;
