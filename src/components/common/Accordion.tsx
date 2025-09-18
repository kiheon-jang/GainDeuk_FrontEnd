import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  variant?: 'default' | 'bordered' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface AccordionItemProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  variant?: string;
  size?: string;
  className?: string;
}

const AccordionContainer = styled.div<{ variant?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  
  ${props => {
    switch (props.variant) {
      case 'bordered':
        return css`
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.md};
          padding: ${theme.spacing.md};
        `;
      case 'filled':
        return css`
          background-color: ${theme.colors.surface};
          border-radius: ${theme.borderRadius.md};
          padding: ${theme.spacing.md};
        `;
      default:
        return css`
          gap: ${theme.spacing.xs};
        `;
    }
  }}
`;

const AccordionItemContainer = styled.div<{ 
  variant?: string; 
  size?: string;
  disabled?: boolean;
}>`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  ${props => {
    switch (props.variant) {
      case 'bordered':
        return css`
          border: none;
          border-radius: 0;
          border-bottom: 1px solid ${theme.colors.border};
          
          &:last-child {
            border-bottom: none;
          }
        `;
      case 'filled':
        return css`
          background-color: ${theme.colors.background};
          border: none;
        `;
    }
  }}
`;

const AccordionHeader = styled.button<{ 
  variant?: string; 
  size?: string;
  isOpen?: boolean;
  disabled?: boolean;
}>`
  width: 100%;
  background: none;
  border: none;
  padding: ${theme.spacing.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  transition: all 0.2s ease;
  color: ${theme.colors.text};
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 0.875rem;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.lg};
          font-size: 1.125rem;
        `;
    }
  }}

  &:hover:not(:disabled) {
    background-color: ${theme.colors.background};
  }

  ${props => props.isOpen && css`
    background-color: ${theme.colors.background};
  `}
`;

const AccordionTitle = styled.span<{ size?: string }>`
  font-weight: 500;
  color: ${theme.colors.text};
  
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

const AccordionIcon = styled(motion.div)`
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
`;

const AccordionContent = styled(motion.div)<{ size?: string }>`
  overflow: hidden;
  background-color: ${theme.colors.surface};
  
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
    }
  }}
`;

const AccordionContentInner = styled.div<{ size?: string }>`
  padding: ${theme.spacing.md};
  color: ${theme.colors.text};
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.lg};
        `;
    }
  }}
`;

const AccordionItemComponent: React.FC<AccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
  variant = 'default',
  size = 'md',
  className,
}) => {
  return (
    <AccordionItemContainer
      variant={variant}
      size={size}
      disabled={item.disabled}
      className={className}
    >
      <AccordionHeader
        variant={variant}
        size={size}
        isOpen={isOpen}
        disabled={item.disabled}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${item.id}`}
        id={`accordion-header-${item.id}`}
      >
        <AccordionTitle size={size}>
          {item.title}
        </AccordionTitle>
        <AccordionIcon
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </AccordionIcon>
      </AccordionHeader>
      
      <AnimatePresence>
        {isOpen && (
          <AccordionContent
            size={size}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            id={`accordion-content-${item.id}`}
            role="region"
            aria-labelledby={`accordion-header-${item.id}`}
          >
            <AccordionContentInner size={size}>
              {item.content}
            </AccordionContentInner>
          </AccordionContent>
        )}
      </AnimatePresence>
    </AccordionItemContainer>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenItems = [],
  variant = 'default',
  size = 'md',
  className,
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems);

  const handleToggle = (itemId: string) => {
    setOpenItems(prev => {
      if (allowMultiple) {
        return prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId];
      } else {
        return prev.includes(itemId) ? [] : [itemId];
      }
    });
  };

  return (
    <AccordionContainer variant={variant} className={className}>
      {items.map((item) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isOpen={openItems.includes(item.id)}
          onToggle={() => !item.disabled && handleToggle(item.id)}
          variant={variant}
          size={size}
        />
      ))}
    </AccordionContainer>
  );
};

export default Accordion;
