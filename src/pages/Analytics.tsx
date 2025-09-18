import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const AnalyticsContainer = styled.div`
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

const Analytics: React.FC = () => {
  return (
    <AnalyticsContainer>
      <PageTitle>📊 분석 도구</PageTitle>
      
      <ComingSoonCard>
        <ComingSoonTitle>🚧 개발 중</ComingSoonTitle>
        <ComingSoonText>
          고급 분석 도구와 인사이트가 곧 제공됩니다.
        </ComingSoonText>
        <FeatureList>
          <FeatureItem>
            <strong>온체인 분석</strong><br />
            고래 움직임과 대용량 거래를 실시간으로 추적합니다
          </FeatureItem>
          <FeatureItem>
            <strong>소셜미디어 감정</strong><br />
            Twitter, Telegram, Discord의 감정을 분석합니다
          </FeatureItem>
          <FeatureItem>
            <strong>한국 커뮤니티</strong><br />
            디시인사이드, 네이버카페 등 한국 커뮤니티를 분석합니다
          </FeatureItem>
          <FeatureItem>
            <strong>데이터 품질</strong><br />
            실시간 데이터 품질을 모니터링하고 검증합니다
          </FeatureItem>
        </FeatureList>
      </ComingSoonCard>
    </AnalyticsContainer>
  );
};

export default Analytics;
