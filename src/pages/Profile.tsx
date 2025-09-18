import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const ProfileContainer = styled.div`
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

const Profile: React.FC = () => {
  return (
    <ProfileContainer>
      <PageTitle>👤 프로필 설정</PageTitle>
      
      <ComingSoonCard>
        <ComingSoonTitle>🚧 개발 중</ComingSoonTitle>
        <ComingSoonText>
          개인화된 사용자 프로필 설정 기능이 곧 제공됩니다.
        </ComingSoonText>
        <FeatureList>
          <FeatureItem>
            <strong>투자 스타일 설정</strong><br />
            보수적, 중간, 공격적, 투기적 투자 스타일을 선택하세요
          </FeatureItem>
          <FeatureItem>
            <strong>위험 허용도 설정</strong><br />
            1-10점 척도로 위험 허용도를 설정하세요
          </FeatureItem>
          <FeatureItem>
            <strong>알림 설정</strong><br />
            이메일, 푸시, Discord 알림을 개별적으로 설정하세요
          </FeatureItem>
          <FeatureItem>
            <strong>포트폴리오 관리</strong><br />
            보유 코인과 투자 이력을 관리하세요
          </FeatureItem>
        </FeatureList>
      </ComingSoonCard>
    </ProfileContainer>
  );
};

export default Profile;
