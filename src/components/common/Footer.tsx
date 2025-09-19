import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme, mediaQueries } from '../../styles/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.surface};
  border-top: 1px solid ${theme.colors.border};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};

  ${mediaQueries.mobile} {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};

  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FooterTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const FooterText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};

  ${mediaQueries.mobile} {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${theme.colors.border};
  border-radius: 50%;
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text};
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};

  ${mediaQueries.mobile} {
    flex-direction: column;
    gap: ${theme.spacing.md};
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};

  ${mediaQueries.mobile} {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const LegalLink = styled(Link)`
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.success};
  font-size: 0.9rem;
  font-weight: 500;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${theme.colors.success};
  border-radius: 50%;
  animation: pulse 2s infinite;
`;

interface FooterProps {
  id?: string;
}

const Footer: React.FC<FooterProps> = ({ id }) => {
  return (
    <FooterContainer id={id}>
      <FooterContent>
        <FooterTop>
          <FooterSection>
            <FooterTitle>GainDeuk</FooterTitle>
            <FooterText>
              AI 기반 암호화폐 투자 신호 분석 서비스로 
              개인 맞춤형 투자 전략을 제공합니다.
            </FooterText>
            <StatusIndicator>
              <StatusDot />
              서비스 정상 운영 중
            </StatusIndicator>
          </FooterSection>

          <FooterSection>
            <FooterTitle>서비스</FooterTitle>
            <FooterLink to="/signals">신호 분석</FooterLink>
            <FooterLink to="/coins">코인 분석</FooterLink>
            <FooterLink to="/strategy">투자 전략</FooterLink>
            <FooterLink to="/alerts">알림 센터</FooterLink>
            <FooterLink to="/analytics">분석 도구</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>고객 지원</FooterTitle>
            <FooterText>이메일: support@gaindeuk.com</FooterText>
            <FooterText>운영시간: 24시간</FooterText>
            <SocialLinks>
              <SocialLink href="#" aria-label="Twitter">
                🐦
              </SocialLink>
              <SocialLink href="#" aria-label="Discord">
                💬
              </SocialLink>
              <SocialLink href="#" aria-label="Telegram">
                📱
              </SocialLink>
            </SocialLinks>
          </FooterSection>
        </FooterTop>

        <FooterBottom>
          <Copyright>
            © 2024 GainDeuk. All rights reserved.
          </Copyright>
          <LegalLinks>
            <LegalLink to="/privacy">개인정보처리방침</LegalLink>
            <LegalLink to="/terms">이용약관</LegalLink>
            <LegalLink to="/disclaimer">면책조항</LegalLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
