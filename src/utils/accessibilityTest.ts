// Accessibility testing utilities
export const accessibilityTest = {
  // Check if all images have alt text
  checkImageAltText: (): { passed: boolean; issues: string[] } => {
    const images = document.querySelectorAll('img');
    const issues: string[] = [];
    
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        issues.push(`Image ${index + 1} is missing alt text`);
      }
    });
    
    return {
      passed: issues.length === 0,
      issues
    };
  },

  // Check heading hierarchy
  checkHeadingHierarchy: (): { passed: boolean; issues: string[] } => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const issues: string[] = [];
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && currentLevel !== 1) {
        issues.push('Page should start with h1');
      }
      
      if (currentLevel > previousLevel + 1) {
        issues.push(`Heading ${heading.tagName} at index ${index} skips levels`);
      }
      
      previousLevel = currentLevel;
    });
    
    return {
      passed: issues.length === 0,
      issues
    };
  },

  // Check for proper ARIA labels
  checkAriaLabels: (): { passed: boolean; issues: string[] } => {
    const interactiveElements = document.querySelectorAll(
      'button, input, select, textarea, [role="button"], [role="link"]'
    );
    const issues: string[] = [];
    
    interactiveElements.forEach((element, index) => {
      const hasLabel = element.getAttribute('aria-label') || 
                      element.getAttribute('aria-labelledby') ||
                      element.getAttribute('title') ||
                      (element as HTMLElement).textContent?.trim();
      
      if (!hasLabel) {
        issues.push(`Interactive element ${index + 1} is missing accessible label`);
      }
    });
    
    return {
      passed: issues.length === 0,
      issues
    };
  },

  // Check color contrast (basic check)
  checkColorContrast: (): { passed: boolean; issues: string[] } => {
    const issues: string[] = [];
    const elements = document.querySelectorAll('*');
    
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Basic contrast check (simplified)
      if (color && backgroundColor && 
          color !== 'rgba(0, 0, 0, 0)' && 
          backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // This is a simplified check - in production, use a proper contrast checker
        const textColor = color.includes('255') ? 'light' : 'dark';
        const bgColor = backgroundColor.includes('255') ? 'light' : 'dark';
        
        if (textColor === bgColor) {
          issues.push(`Potential contrast issue with element: ${element.tagName}`);
        }
      }
    });
    
    return {
      passed: issues.length === 0,
      issues
    };
  },

  // Check keyboard navigation
  checkKeyboardNavigation: (): { passed: boolean; issues: string[] } => {
    const issues: string[] = [];
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push(`Element ${index + 1} has positive tabindex: ${tabIndex}`);
      }
    });
    
    return {
      passed: issues.length === 0,
      issues
    };
  },

  // Check for skip links
  checkSkipLinks: (): { passed: boolean; issues: string[] } => {
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    const issues: string[] = [];
    
    if (skipLinks.length === 0) {
      issues.push('No skip links found');
    }
    
    return {
      passed: issues.length === 0,
      issues
    };
  },

  // Run all accessibility tests
  runAllTests: () => {
    const results = {
      imageAltText: accessibilityTest.checkImageAltText(),
      headingHierarchy: accessibilityTest.checkHeadingHierarchy(),
      ariaLabels: accessibilityTest.checkAriaLabels(),
      colorContrast: accessibilityTest.checkColorContrast(),
      keyboardNavigation: accessibilityTest.checkKeyboardNavigation(),
      skipLinks: accessibilityTest.checkSkipLinks()
    };
    
    const totalIssues = Object.values(results).reduce((sum, result) => sum + result.issues.length, 0);
    const passedTests = Object.values(results).filter(result => result.passed).length;
    const totalTests = Object.keys(results).length;
    
    return {
      results,
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        totalIssues,
        score: Math.round((passedTests / totalTests) * 100)
      }
    };
  }
};

// Console helper for running accessibility tests
if (typeof window !== 'undefined') {
  (window as any).accessibilityTest = accessibilityTest;
  console.log('Accessibility test utilities loaded. Run accessibilityTest.runAllTests() to test the page.');
}
