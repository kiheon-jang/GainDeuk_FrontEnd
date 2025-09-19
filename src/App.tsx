import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout, SEOHead } from './components/common';
import { GlobalStyles } from './styles/GlobalStyles';
import { queryClient } from './hooks';
import { createOrganizationStructuredData, createWebSiteStructuredData } from './utils/seoUtils';
import { 
  Dashboard, 
  Signals, 
  Coins, 
  Profile, 
  Strategy, 
  Alerts, 
  Analytics, 
  Components,
  NotFound 
} from './pages';

function App() {
  const user = {
    name: '사용자',
    avatar: undefined
  };

  // 전역 SEO 메타데이터
  const organizationData = createOrganizationStructuredData();
  const websiteData = createWebSiteStructuredData();

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <SEOHead
        title="GainDeuk - 암호화폐 신호 분석 플랫폼"
        description="실시간 암호화폐 신호 분석과 거래 전략을 제공하는 전문 플랫폼입니다."
        keywords="암호화폐, 비트코인, 신호분석, 거래전략, 투자, 트레이딩"
        structuredData={[organizationData, websiteData]}
      />
      <Router>
        <Layout user={user} notificationCount={3}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/coins" element={<Coins />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/components" element={<Components />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
