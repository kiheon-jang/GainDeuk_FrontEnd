import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import ConnectionStatus from './ConnectionStatus';
// import RealtimeAlerts from './RealtimeAlerts'; // Temporarily disabled
import ErrorBoundary from './ErrorBoundary';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
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
  // Initialize WebSocket connection with error handling
  try {
    useWebSocket({ autoConnect: true });
  } catch (error) {
    console.warn('WebSocket initialization failed:', error);
  }

  // Monitor network status
  useNetworkStatus({
    onOffline: () => {
      console.warn('Network connection lost');
    },
    onOnline: () => {
      console.log('Network connection restored');
    },
    onSlowConnection: () => {
      console.warn('Slow network connection detected');
    }
  });

  const handleError = (error: Error, errorInfo: any, errorId: string) => {
    console.error('Layout Error Boundary caught error:', error, errorInfo, errorId);
    // Additional error handling logic can be added here
  };

  return (
    <LayoutContainer>
      
      <ErrorBoundary onError={handleError}>
        <Header user={user} notificationCount={notificationCount} />
      </ErrorBoundary>
      
      <MainContent id="main-content" role="main">
        <ContentWrapper>
          <ErrorBoundary onError={handleError}>
            <PageTransition>
              {children}
            </PageTransition>
          </ErrorBoundary>
        </ContentWrapper>
      </MainContent>
      
      <ErrorBoundary onError={handleError}>
        <Footer id="footer" />
      </ErrorBoundary>
      
      {/* WebSocket related components */}
      <ErrorBoundary onError={handleError}>
        <ConnectionStatus />
      </ErrorBoundary>
      {/* <RealtimeAlerts /> */}
      
    </LayoutContainer>
  );
};

export default Layout;
