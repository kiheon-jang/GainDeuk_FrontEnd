import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import ConnectionStatus from './ConnectionStatus';
import RealtimeAlerts from './RealtimeAlerts';
import { useWebSocket } from '../../hooks/useWebSocket';
import { theme } from '../../styles/theme';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Header height */
  min-height: calc(100vh - 80px);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`;

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
  notificationCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  notificationCount = 0 
}) => {
  // Initialize WebSocket connection
  useWebSocket({ autoConnect: true });

  return (
    <LayoutContainer>
      <Header user={user} notificationCount={notificationCount} />
      <MainContent>
        <ContentWrapper>
          <PageTransition>
            {children}
          </PageTransition>
        </ContentWrapper>
      </MainContent>
      <Footer />
      
      {/* WebSocket related components */}
      <ConnectionStatus />
      <RealtimeAlerts />
    </LayoutContainer>
  );
};

export default Layout;
