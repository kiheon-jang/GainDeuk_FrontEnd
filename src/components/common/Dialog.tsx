import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';
import Modal from './Modal';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'warning' | 'error' | 'success' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

interface DialogActionsProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContainer = styled.div<{ variant?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const DialogIcon = styled.div<{ variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 auto;
  font-size: 24px;
  
  ${props => {
    switch (props.variant) {
      case 'warning':
        return `
          background-color: rgba(255, 184, 0, 0.1);
          color: ${theme.colors.warning};
        `;
      case 'error':
        return `
          background-color: rgba(229, 9, 20, 0.1);
          color: ${theme.colors.error};
        `;
      case 'success':
        return `
          background-color: rgba(0, 212, 170, 0.1);
          color: ${theme.colors.success};
        `;
      case 'info':
        return `
          background-color: rgba(0, 113, 235, 0.1);
          color: ${theme.colors.info};
        `;
      default:
        return `
          background-color: ${theme.colors.background};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

const DialogTitle = styled.h3<{ variant?: string }>`
  color: ${theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const DialogMessage = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
`;

const DialogActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: center;
  margin-top: ${theme.spacing.md};
`;

const Dialog: React.FC<DialogProps> & {
  Actions: React.FC<DialogActionsProps>;
} = ({
  isOpen,
  onClose,
  title,
  message,
  children,
  variant = 'default',
  size = 'md',
  showCloseButton = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  const getModalSize = () => {
    switch (size) {
      case 'sm':
        return 'sm';
      case 'lg':
        return 'lg';
      default:
        return 'md';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={getModalSize()}
      showCloseButton={showCloseButton}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEscape={closeOnEscape}
      className={className}
    >
      <DialogContainer variant={variant}>
        <DialogIcon variant={variant}>
          {getIcon()}
        </DialogIcon>
        
        {title && (
          <DialogTitle variant={variant}>
            {title}
          </DialogTitle>
        )}
        
        {message && (
          <DialogMessage>
            {message}
          </DialogMessage>
        )}
        
        {children}
      </DialogContainer>
    </Modal>
  );
};

// Sub-component for actions
const DialogActionsComponent: React.FC<DialogActionsProps> = ({ children, className }) => {
  return (
    <DialogActions className={className}>
      {children}
    </DialogActions>
  );
};

Dialog.Actions = DialogActionsComponent;

export default Dialog;
