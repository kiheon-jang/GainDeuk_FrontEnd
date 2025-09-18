import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  fullWidth?: boolean;
}

const ToggleContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const ToggleWrapper = styled.label<{ disabled?: boolean }>`
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

const ToggleTrack = styled.div<{ 
  size?: string; 
  checked?: boolean; 
  hasError?: boolean;
  variant?: string;
}>`
  position: relative;
  border-radius: 50px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          width: 32px;
          height: 18px;
        `;
      case 'lg':
        return css`
          width: 48px;
          height: 26px;
        `;
      default:
        return css`
          width: 40px;
          height: 22px;
        `;
    }
  }}

  ${props => {
    if (props.checked) {
      return css`
        background-color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
      `;
    } else {
      return css`
        background-color: ${props.variant === 'filled' ? theme.colors.surface : 'transparent'};
        border: 2px solid ${props.hasError ? theme.colors.error : theme.colors.border};
      `;
    }
  }}

  ${ToggleWrapper}:hover & {
    border-color: ${props => props.hasError ? theme.colors.error : theme.colors.primary};
  }
`;

const ToggleThumb = styled(motion.div)<{ size?: string }>`
  position: absolute;
  top: 50%;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          width: 14px;
          height: 14px;
          left: 2px;
          transform: translateY(-50%);
        `;
      case 'lg':
        return css`
          width: 22px;
          height: 22px;
          left: 2px;
          transform: translateY(-50%);
        `;
      default:
        return css`
          width: 18px;
          height: 18px;
          left: 2px;
          transform: translateY(-50%);
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

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className,
  disabled,
  ...props
}, ref) => {
  const hasError = Boolean(error);
  const isChecked = Boolean(props.checked);

  const getThumbPosition = () => {
    switch (size) {
      case 'sm':
        return isChecked ? 16 : 2;
      case 'lg':
        return isChecked ? 24 : 2;
      default:
        return isChecked ? 20 : 2;
    }
  };

  return (
    <ToggleContainer fullWidth={fullWidth} className={className}>
      <ToggleWrapper disabled={disabled}>
        <HiddenInput
          ref={ref}
          type="checkbox"
          disabled={disabled}
          {...props}
        />
        <ToggleTrack
          size={size}
          checked={isChecked}
          hasError={hasError}
          variant={variant}
        >
          <ToggleThumb
            size={size}
            animate={{ x: getThumbPosition() }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </ToggleTrack>
        {label && <LabelText size={size}>{label}</LabelText>}
      </ToggleWrapper>
      {(error || helperText) && (
        <HelperText hasError={hasError}>
          {error || helperText}
        </HelperText>
      )}
    </ToggleContainer>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;
