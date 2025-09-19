import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  iconOnly?: boolean;
}

const ButtonBase = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-family: inherit;
  font-weight: 500;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  ${props => props.fullWidth && css`
    width: 100%;
  `}

  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: 0.875rem;
          min-height: 32px;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: 1.125rem;
          min-height: 48px;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 1rem;
          min-height: 40px;
        `;
    }
  }}

  /* Color variants */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: linear-gradient(45deg, ${theme.colors.primary}, #FF6B6B);
          color: white;
          box-shadow: ${theme.shadows.sm};

          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }

          &:active {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.border};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: white;
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.textSecondary};

          &:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.1);
            color: ${theme.colors.text};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: white;

          &:hover:not(:disabled) {
            background-color: #d40813;
          }
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  disabled,
  loadingText = '로딩 중...',
  iconOnly = false,
  'aria-label': ariaLabel,
  ...props
}) => {
  const buttonProps = {
    variant,
    size,
    fullWidth,
    disabled: disabled || loading,
    'aria-busy': loading,
    'aria-label': iconOnly ? ariaLabel : undefined,
    ...props
  };

  return (
    <ButtonBase {...buttonProps}>
      {loading && (
        <>
          <LoadingSpinner aria-hidden="true" />
          <span className="sr-only">{loadingText}</span>
        </>
      )}
      {iconOnly && !loading ? (
        <>
          {children}
          <span className="sr-only">{ariaLabel}</span>
        </>
      ) : (
        children
      )}
    </ButtonBase>
  );
};

export default Button;
