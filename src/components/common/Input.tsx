import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs};
`;

const InputWrapper = styled.div<{ 
  variant?: string; 
  size?: string; 
  hasError?: boolean;
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          min-height: 32px;
        `;
      case 'lg':
        return css`
          min-height: 48px;
        `;
      default:
        return css`
          min-height: 40px;
        `;
    }
  }}
`;

const StyledInput = styled.input<{ 
  variant?: string; 
  size?: string; 
  hasError?: boolean;
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
}>`
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  color: ${theme.colors.text};
  background-color: transparent;
  border: none;
  outline: none;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: 0.875rem;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
        `;
    }
  }}

  ${props => {
    if (props.hasLeftIcon) {
      return css`
        padding-left: ${props.size === 'sm' ? '32px' : props.size === 'lg' ? '48px' : '40px'};
      `;
    }
    if (props.hasRightIcon) {
      return css`
        padding-right: ${props.size === 'sm' ? '32px' : props.size === 'lg' ? '48px' : '40px'};
      `;
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'filled':
        return css`
          background-color: ${theme.colors.surface};
          border-radius: ${theme.borderRadius.sm};
          border: 1px solid transparent;
          
          &:focus {
            background-color: ${theme.colors.background};
            border-color: ${theme.colors.primary};
          }
        `;
      case 'outlined':
        return css`
          background-color: transparent;
          border-radius: ${theme.borderRadius.sm};
          border: 1px solid ${props.hasError ? theme.colors.error : theme.colors.border};
          
          &:focus {
            border-color: ${props.hasError ? theme.colors.error : theme.colors.primary};
            box-shadow: 0 0 0 2px ${props.hasError ? 'rgba(229, 9, 20, 0.2)' : 'rgba(229, 9, 20, 0.2)'};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.surface};
          border-radius: ${theme.borderRadius.sm};
          border: 1px solid ${props.hasError ? theme.colors.error : theme.colors.border};
          
          &:focus {
            border-color: ${props.hasError ? theme.colors.error : theme.colors.primary};
            box-shadow: 0 0 0 2px ${props.hasError ? 'rgba(229, 9, 20, 0.2)' : 'rgba(229, 9, 20, 0.2)'};
          }
        `;
    }
  }}
`;

const IconWrapper = styled.div<{ position: 'left' | 'right'; size?: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textSecondary};
  pointer-events: none;
  
  ${props => props.position === 'left' && css`
    left: ${props.size === 'sm' ? theme.spacing.sm : props.size === 'lg' ? theme.spacing.md : theme.spacing.sm};
  `}
  
  ${props => props.position === 'right' && css`
    right: ${props.size === 'sm' ? theme.spacing.sm : props.size === 'lg' ? theme.spacing.md : theme.spacing.sm};
  `}
`;

const HelperText = styled.span<{ hasError?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.hasError ? theme.colors.error : theme.colors.textSecondary};
  margin-top: ${theme.spacing.xs};
`;

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  id,
  required,
  ...props
}, ref) => {
  const hasError = Boolean(error);
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);
  
  // Generate unique IDs for accessibility
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const helperTextId = helperText ? `${inputId}-helper` : undefined;
  
  const ariaDescribedBy = [errorId, helperTextId].filter(Boolean).join(' ') || undefined;

  return (
    <InputContainer fullWidth={fullWidth} className={className}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span aria-label="필수 입력 항목"> *</span>}
        </Label>
      )}
      <InputWrapper 
        variant={variant} 
        size={size} 
        hasError={hasError}
        hasLeftIcon={hasLeftIcon}
        hasRightIcon={hasRightIcon}
      >
        {leftIcon && (
          <IconWrapper position="left" size={size} aria-hidden="true">
            {leftIcon}
          </IconWrapper>
        )}
        <StyledInput
          ref={ref}
          id={inputId}
          variant={variant}
          size={size}
          hasError={hasError}
          hasLeftIcon={hasLeftIcon}
          hasRightIcon={hasRightIcon}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          {...props}
        />
        {rightIcon && (
          <IconWrapper position="right" size={size} aria-hidden="true">
            {rightIcon}
          </IconWrapper>
        )}
      </InputWrapper>
      {error && (
        <HelperText hasError={true} id={errorId} role="alert" aria-live="polite">
          {error}
        </HelperText>
      )}
      {helperText && !error && (
        <HelperText hasError={false} id={helperTextId}>
          {helperText}
        </HelperText>
      )}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input;
