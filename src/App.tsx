import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from './components/common';
import { GlobalStyles } from './styles/GlobalStyles';
import { queryClient } from './hooks';
import { 
  Dashboard, 
  Signals, 
  Coins, 
  Profile, 
  Strategy, 
  Alerts, 
  Analytics, 
  NotFound 
} from './pages';

function App() {
  const user = {
    name: '사용자',
    avatar: undefined
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
