import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Dashboard from '../Dashboard';
import { theme } from '../../styles/theme';

// Test wrapper with all providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Page', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Basic check that component renders
    expect(container).toBeDefined();
  });

  it('should contain main content structure', () => {
    const { container } = render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Check that the component has rendered some content
    expect(container.firstChild).toBeTruthy();
  });
});