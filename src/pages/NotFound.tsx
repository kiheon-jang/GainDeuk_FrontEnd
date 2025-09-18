import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import { Button } from '../components/common';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: ${theme.spacing.xl};
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
  text-shadow: 0 0 20px rgba(229, 9, 20, 0.3);

  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
  max-width: 500px;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const HomeLink = styled(Link)`
  text-decoration: none;
`;

const NotFound: React.FC = () => {
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>페이지를 찾을 수 없습니다</ErrorTitle>
      <ErrorMessage>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        <br />
        URL을 다시 확인하시거나 홈페이지로 돌아가세요.
      </ErrorMessage>
      <ActionButtons>
        <HomeLink to="/">
          <Button variant="primary" size="lg">
            🏠 홈으로 돌아가기
          </Button>
        </HomeLink>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => window.history.back()}
        >
          ← 이전 페이지
        </Button>
      </ActionButtons>
    </NotFoundContainer>
  );
};

export default NotFound;
