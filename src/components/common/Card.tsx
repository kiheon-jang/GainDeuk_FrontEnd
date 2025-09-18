import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const CardContainer = styled(motion.div)<{ 
  variant?: string; 
  size?: string; 
  hoverable?: boolean;
  clickable?: boolean;
}>`
  border-radius: ${theme.borderRadius.md};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.md};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.xl};
        `;
      default:
        return css`
          padding: ${theme.spacing.lg};
        `;
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'elevated':
        return css`
          background-color: ${theme.colors.surface};
          box-shadow: ${theme.shadows.md};
          border: none;
        `;
      case 'outlined':
        return css`
          background-color: transparent;
          border: 1px solid ${theme.colors.border};
        `;
      case 'filled':
        return css`
          background-color: ${theme.colors.background};
          border: none;
        `;
      default:
        return css`
          background-color: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}

  ${props => props.clickable && css`
    cursor: pointer;
  `}

  ${props => props.hoverable && css`
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
  `}
`;

const CardHeader = styled.div<{ size?: string }>`
  margin-bottom: ${theme.spacing.md};
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          margin-bottom: ${theme.spacing.sm};
        `;
      case 'lg':
        return css`
          margin-bottom: ${theme.spacing.lg};
        `;
    }
  }}
`;

const CardTitle = styled.h3<{ size?: string }>`
  color: ${theme.colors.text};
  font-weight: 600;
  margin: 0;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          font-size: 1rem;
        `;
      case 'lg':
        return css`
          font-size: 1.5rem;
        `;
      default:
        return css`
          font-size: 1.25rem;
        `;
    }
  }}
`;

const CardSubtitle = styled.p<{ size?: string }>`
  color: ${theme.colors.textSecondary};
  margin: ${theme.spacing.xs} 0 0 0;
  
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

const CardContent = styled.div<{ size?: string }>`
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

const CardFooter = styled.div<{ size?: string }>`
  margin-top: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          margin-top: ${theme.spacing.sm};
        `;
      case 'lg':
        return css`
          margin-top: ${theme.spacing.lg};
        `;
    }
  }}
`;

const CardActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Actions: typeof CardActions;
} = ({
  children,
  variant = 'default',
  size = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className,
  style,
}) => {
  const cardVariants = {
    initial: { scale: 1 },
    hover: hoverable ? { scale: 1.02 } : { scale: 1 },
    tap: clickable ? { scale: 0.98 } : { scale: 1 },
  };

  return (
    <CardContainer
      variant={variant}
      size={size}
      hoverable={hoverable}
      clickable={clickable}
      onClick={onClick}
      className={className}
      style={style}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.2 }}
    >
      {children}
    </CardContainer>
  );
};

// Sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Actions = CardActions;

export default Card;
