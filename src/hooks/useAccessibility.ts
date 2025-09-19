import { useEffect, useRef, useCallback, useState } from 'react';

// Hook for managing focus trap in modals/dialogs
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (focusableElements.length === 1) {
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};

// Hook for keyboard navigation in lists/grids
export const useKeyboardNavigation = (
  itemsLength: number,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'grid';
    columns?: number;
    loop?: boolean;
    onActivate?: (index: number) => void;
  } = {}
) => {
  const { orientation = 'vertical', columns = 1, loop = true, onActivate } = options;
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!containerRef.current) return;

    let newIndex = activeIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (orientation === 'grid') {
          newIndex = Math.min(activeIndex + columns, itemsLength - 1);
        } else if (orientation === 'vertical') {
          newIndex = loop 
            ? (activeIndex + 1) % itemsLength 
            : Math.min(activeIndex + 1, itemsLength - 1);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (orientation === 'grid') {
          newIndex = Math.max(activeIndex - columns, 0);
        } else if (orientation === 'vertical') {
          newIndex = loop 
            ? (activeIndex - 1 + itemsLength) % itemsLength 
            : Math.max(activeIndex - 1, 0);
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (orientation === 'grid') {
          newIndex = Math.min(activeIndex + 1, itemsLength - 1);
        } else if (orientation === 'horizontal') {
          newIndex = loop 
            ? (activeIndex + 1) % itemsLength 
            : Math.min(activeIndex + 1, itemsLength - 1);
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (orientation === 'grid') {
          newIndex = Math.max(activeIndex - 1, 0);
        } else if (orientation === 'horizontal') {
          newIndex = loop 
            ? (activeIndex - 1 + itemsLength) % itemsLength 
            : Math.max(activeIndex - 1, 0);
        }
        break;

      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;

      case 'End':
        e.preventDefault();
        newIndex = itemsLength - 1;
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        onActivate?.(activeIndex);
        break;

      default:
        return;
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, itemsLength, orientation, columns, loop, onActivate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { activeIndex, setActiveIndex, containerRef };
};

// Hook for screen reader announcements
export const useScreenReader = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  return { announce };
};

// Hook for managing skip links
export const useSkipLinks = () => {
  const skipLinksRef = useRef<HTMLDivElement>(null);

  const addSkipLink = useCallback((target: string, label: string) => {
    if (!skipLinksRef.current) return;

    const link = document.createElement('a');
    link.href = `#${target}`;
    link.textContent = label;
    link.className = 'skip-link';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetElement = document.getElementById(target);
      if (targetElement) {
        targetElement.focus();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });

    skipLinksRef.current.appendChild(link);
  }, []);

  return { skipLinksRef, addSkipLink };
};

// Hook for high contrast mode
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('high-contrast') === 'true';
  });

  const toggleHighContrast = useCallback(() => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('high-contrast', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }, [isHighContrast]);

  return { isHighContrast, toggleHighContrast };
};

// Hook for detecting reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Generate unique IDs for ARIA relationships
export const useId = (prefix?: string) => {
  const id = useRef<string>();
  
  if (!id.current) {
    id.current = `${prefix || 'id'}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return id.current;
};

export default {
  useFocusTrap,
  useKeyboardNavigation,
  useScreenReader,
  useSkipLinks,
  useHighContrast,
  useReducedMotion,
  useId
};
