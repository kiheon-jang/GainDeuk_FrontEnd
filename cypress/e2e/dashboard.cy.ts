describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    // Intercept API calls to prevent real API requests
    cy.intercept('GET', '/api/signals*', { fixture: 'signals.json' }).as('getSignals');
    cy.intercept('GET', '/api/coins*', { fixture: 'coins.json' }).as('getCoins');
  });

  it('should load dashboard page successfully', () => {
    cy.visit('/');
    
    // Check that the dashboard loads
    cy.contains('환영합니다').should('be.visible');
    cy.contains('안녕하세요').should('be.visible');
  });

  it('should navigate to different pages', () => {
    cy.visit('/');
    
    // Navigate to signals page
    cy.get('nav').contains('시그널').click();
    cy.url().should('include', '/signals');
    
    // Navigate to coins page
    cy.get('nav').contains('코인').click();
    cy.url().should('include', '/coins');
    
    // Navigate to alerts page
    cy.get('nav').contains('알림').click();
    cy.url().should('include', '/alerts');
    
    // Navigate to analytics page
    cy.get('nav').contains('분석').click();
    cy.url().should('include', '/analytics');
  });

  it('should display loading states', () => {
    cy.visit('/signals');
    
    // Should show loading skeleton initially
    cy.get('[data-testid="skeleton"]').should('be.visible');
    
    // Wait for API call to complete
    cy.wait('@getSignals');
    
    // Loading should be gone
    cy.get('[data-testid="skeleton"]').should('not.exist');
  });

  it('should handle responsive design', () => {
    // Test desktop view
    cy.viewport(1280, 720);
    cy.visit('/');
    cy.get('nav').should('be.visible');
    
    // Test mobile view
    cy.viewport(375, 667);
    cy.visit('/');
    
    // Mobile menu should be available
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
  });
});
