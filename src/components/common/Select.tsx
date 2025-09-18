import React, { useState, useRef, useEffect, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
}

const SelectContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs};
`;

const SelectWrapper = styled.div<{ 
  variant?: string; 
  size?: string; 
  hasError?: boolean;
  isOpen?: boolean;
  disabled?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;
  
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

  ${props => {
    switch (props.variant) {
      case 'filled':
        return css`
          background-color: ${theme.colors.surface};
          border-radius: ${theme.borderRadius.sm};
          border: 1px solid transparent;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.background};
            border-color: ${theme.colors.primary};
          }
        `;
      case 'outlined':
        return css`
          background-color: transparent;
          border-radius: ${theme.borderRadius.sm};
          border: 1px solid ${props.hasError ? theme.colors.error : theme.colors.border};
          
          &:hover:not(:disabled) {
            border-color: ${props.hasError ? theme.colors.error : theme.colors.primary};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.surface};
          border-radius: ${theme.borderRadius.sm};
          border: 1px solid ${props.hasError ? theme.colors.error : theme.colors.border};
          
          &:hover:not(:disabled) {
            border-color: ${props.hasError ? theme.colors.error : theme.colors.primary};
          }
        `;
    }
  }}

  ${props => props.isOpen && css`
    border-color: ${props.hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 2px ${props.hasError ? 'rgba(229, 9, 20, 0.2)' : 'rgba(229, 9, 20, 0.2)'};
  `}
`;

const SelectDisplay = styled.div<{ size?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.text};
  font-size: 1rem;
  
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
    }
  }}
`;

const SelectValue = styled.span<{ placeholder?: boolean }>`
  color: ${props => props.placeholder ? theme.colors.textSecondary : theme.colors.text};
  flex: 1;
  text-align: left;
`;

const SelectIcon = styled(motion.div)`
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dropdown = styled(motion.div)<{ size?: string }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  box-shadow: ${theme.shadows.lg};
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: ${theme.spacing.xs};
`;

const Option = styled.div<{ 
  selected?: boolean; 
  disabled?: boolean;
  size?: string;
}>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${props => props.disabled ? theme.colors.textSecondary : theme.colors.text};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
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
    }
  }}

  &:hover:not(:disabled) {
    background-color: ${theme.colors.background};
  }

  ${props => props.selected && css`
    background-color: ${theme.colors.primary};
    color: white;
  `}
`;

const SearchInput = styled.input<{ size?: string }>`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
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
    }
  }}
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
  }
`;

const HelperText = styled.span<{ hasError?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.hasError ? theme.colors.error : theme.colors.textSecondary};
  margin-top: ${theme.spacing.xs};
`;

const Select = forwardRef<HTMLDivElement, SelectProps>(({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  disabled = false,
  searchable = false,
  clearable = false,
  className,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const hasError = Boolean(error);

  const selectedOption = options.find(option => option.value === value);
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange('');
    }
  };

  return (
    <SelectContainer ref={ref} fullWidth={fullWidth} className={className}>
      {label && <Label>{label}</Label>}
      <SelectWrapper
        ref={selectRef}
        variant={variant}
        size={size}
        hasError={hasError}
        isOpen={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <SelectDisplay size={size}>
          <SelectValue placeholder={!selectedOption}>
            {selectedOption ? selectedOption.label : placeholder}
          </SelectValue>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            {clearable && selectedOption && (
              <ClearButton onClick={handleClear} type="button">
                ×
              </ClearButton>
            )}
            <SelectIcon
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </SelectIcon>
          </div>
        </SelectDisplay>
        
        <AnimatePresence>
          {isOpen && (
            <Dropdown
              size={size}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {searchable && (
                <SearchInput
                  size={size}
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {filteredOptions.map((option) => (
                <Option
                  key={option.value}
                  size={size}
                  selected={option.value === value}
                  disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  {option.label}
                </Option>
              ))}
            </Dropdown>
          )}
        </AnimatePresence>
      </SelectWrapper>
      {(error || helperText) && (
        <HelperText hasError={hasError}>
          {error || helperText}
        </HelperText>
      )}
    </SelectContainer>
  );
});

Select.displayName = 'Select';

export default Select;
