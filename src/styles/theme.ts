import { Theme } from '../types';

export const theme: Theme = {
  colors: {
    primary: '#E50914', // Netflix Red
    secondary: '#221F1F', // Netflix Dark Gray
    background: '#141414', // Netflix Background
    surface: '#1F1F1F', // Netflix Surface
    text: '#FFFFFF', // White text
    textSecondary: '#B3B3B3', // Light gray text
    border: '#333333', // Dark border
    success: '#00D4AA', // Success green
    warning: '#FFB800', // Warning yellow
    error: '#E50914', // Error red
    info: '#0071EB', // Info blue
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.3)',
  },
};

export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1025px',
};

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  tabletAndUp: `@media (min-width: ${breakpoints.mobile})`,
  desktopAndUp: `@media (min-width: ${breakpoints.desktop})`,
};
