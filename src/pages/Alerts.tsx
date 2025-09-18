import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const AlertsContainer = styled.div`
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

const Alerts: React.FC = () => {
  return (
    <AlertsContainer>
      <PageTitle>🔔 알림 센터</PageTitle>
      
      <ComingSoonCard>
        <ComingSoonTitle>🚧 개발 중</ComingSoonTitle>
        <ComingSoonText>
          스마트 알림 관리 시스템이 곧 제공됩니다.
        </ComingSoonText>
        <FeatureList>
          <FeatureItem>
            <strong>실시간 알림</strong><br />
            중요한 신호와 시장 변화를 실시간으로 알려드립니다
          </FeatureItem>
          <FeatureItem>
            <strong>알림 설정</strong><br />
            신호 강도, 코인별 알림을 개별적으로 설정하세요
          </FeatureItem>
          <FeatureItem>
            <strong>알림 통계</strong><br />
            알림 성공률과 반응률을 분석해드립니다
          </FeatureItem>
          <FeatureItem>
            <strong>다중 채널</strong><br />
            푸시, 이메일, Discord 등 다양한 채널로 알림을 받으세요
          </FeatureItem>
        </FeatureList>
      </ComingSoonCard>
    </AlertsContainer>
  );
};

export default Alerts;
