// Import commands.js using ES2015 syntax:
import './commands';

// Import Cypress commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      visitDashboard(): Chainable<void>;
    }
  }
}
