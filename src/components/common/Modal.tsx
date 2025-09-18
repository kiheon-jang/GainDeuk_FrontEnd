import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'centered' | 'bottom-sheet';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

const ModalContainer = styled(motion.div)<{ 
  size?: string; 
  variant?: string;
}>`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          width: 100%;
          max-width: 400px;
        `;
      case 'lg':
        return css`
          width: 100%;
          max-width: 800px;
        `;
      case 'xl':
        return css`
          width: 100%;
          max-width: 1200px;
        `;
      case 'full':
        return css`
          width: 100vw;
          height: 100vh;
          max-width: none;
          max-height: none;
          border-radius: 0;
        `;
      default:
        return css`
          width: 100%;
          max-width: 600px;
        `;
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'bottom-sheet':
        return css`
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
          max-height: 80vh;
          margin: 0;
        `;
      case 'centered':
        return css`
          margin: auto;
        `;
      default:
        return css`
          margin: auto;
        `;
    }
  }}
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.5rem;
  line-height: 1;
  
  &:hover {
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
  }
`;

const ModalContent = styled.div`
  padding: ${theme.spacing.lg};
  flex: 1;
  overflow-y: auto;
  color: ${theme.colors.text};
`;

const ModalFooter = styled.div`
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  flex-shrink: 0;
`;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    const handleFocus = () => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('focusin', handleFocus);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('focusin', handleFocus);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: variant === 'bottom-sheet' ? '100%' : 0
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: variant === 'bottom-sheet' ? '100%' : 0
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <ModalContainer
            ref={modalRef}
            size={size}
            variant={variant}
            className={className}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {title && (
              <ModalHeader>
                <ModalTitle id="modal-title">{title}</ModalTitle>
                {showCloseButton && (
                  <CloseButton onClick={onClose} aria-label="Close modal">
                    ×
                  </CloseButton>
                )}
              </ModalHeader>
            )}
            <ModalContent>
              {children}
            </ModalContent>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
