import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  fullWidth?: boolean;
  indeterminate?: boolean;
}

const CheckboxContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const CheckboxWrapper = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckboxBox = styled.div<{ 
  size?: string; 
  checked?: boolean; 
  indeterminate?: boolean;
  hasError?: boolean;
  variant?: string;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          width: 16px;
          height: 16px;
        `;
      case 'lg':
        return css`
          width: 24px;
          height: 24px;
        `;
      default:
        return css`
          width: 20px;
          height: 20px;
        `;
    }
  }}

  ${props => {
    if (props.checked || props.indeterminate) {
      return css`
        background-color: ${theme.colors.primary};
        border-color: ${theme.colors.primary};
      `;
    }
    
    if (props.variant === 'filled') {
      return css`
        background-color: ${theme.colors.surface};
      `;
    }
  }}

  ${CheckboxWrapper}:hover & {
    border-color: ${props => props.hasError ? theme.colors.error : theme.colors.primary};
  }
`;

const CheckIcon = styled.svg<{ size?: string }>`
  color: white;
  stroke-width: 2;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          width: 10px;
          height: 10px;
        `;
      case 'lg':
        return css`
          width: 16px;
          height: 16px;
        `;
      default:
        return css`
          width: 12px;
          height: 12px;
        `;
    }
  }}
`;

const IndeterminateIcon = styled.div<{ size?: string }>`
  background-color: white;
  border-radius: 1px;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          width: 8px;
          height: 2px;
        `;
      case 'lg':
        return css`
          width: 12px;
          height: 3px;
        `;
      default:
        return css`
          width: 10px;
          height: 2px;
        `;
    }
  }}
`;

const LabelText = styled.span<{ size?: string }>`
  color: ${theme.colors.text};
  font-weight: 500;
  user-select: none;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          font-size: 0.875rem;
        `;
      case 'lg':
        return css`
          font-size: 1.125rem;
        `;
      default:
        return css`
          font-size: 1rem;
        `;
    }
  }}
`;

const HelperText = styled.span<{ hasError?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.hasError ? theme.colors.error : theme.colors.textSecondary};
  margin-top: ${theme.spacing.xs};
`;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  indeterminate = false,
  className,
  disabled,
  ...props
}, ref) => {
  const hasError = Boolean(error);

  return (
    <CheckboxContainer fullWidth={fullWidth} className={className}>
      <CheckboxWrapper disabled={disabled}>
        <HiddenInput
          ref={ref}
          type="checkbox"
          disabled={disabled}
          {...props}
        />
        <CheckboxBox
          size={size}
          checked={props.checked}
          indeterminate={indeterminate}
          hasError={hasError}
          variant={variant}
        >
          {indeterminate ? (
            <IndeterminateIcon size={size} />
          ) : props.checked ? (
            <CheckIcon size={size} viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </CheckIcon>
          ) : null}
        </CheckboxBox>
        {label && <LabelText size={size}>{label}</LabelText>}
      </CheckboxWrapper>
      {(error || helperText) && (
        <HelperText hasError={hasError}>
          {error || helperText}
        </HelperText>
      )}
    </CheckboxContainer>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
