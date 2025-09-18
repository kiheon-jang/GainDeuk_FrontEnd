import React from 'react';
import styled from 'styled-components';
import { useUIStore } from '../../stores/uiStore';
import { theme } from '../../styles/theme';

const AlertsContainer = styled.div`
  position: fixed;
  top: 100px;
  right: ${theme.spacing.lg};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-width: 400px;
  pointer-events: none;

  @media (max-width: 768px) {
    right: ${theme.spacing.md};
    left: ${theme.spacing.md};
    max-width: none;
  }
`;

const AlertItem = styled.div<{ $type: string }>`
  background-color: ${props => {
    switch (props.$type) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
      default:
        return theme.colors.info;
    }
  }};
  color: white;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  pointer-events: auto;
  animation: slideIn 0.3s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.sm};
`;

const AlertTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: white;
`;

const AlertCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const AlertMessage = styled.p`
  font-size: 0.8rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
`;

const RealtimeAlerts: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <AlertsContainer>
      {toasts.map((toast) => (
        <AlertItem key={toast.id} $type={toast.type}>
          <AlertHeader>
            <AlertTitle>{toast.title}</AlertTitle>
            <AlertCloseButton onClick={() => removeToast(toast.id)}>
              ×
            </AlertCloseButton>
          </AlertHeader>
          <AlertMessage>{toast.message}</AlertMessage>
        </AlertItem>
      ))}
    </AlertsContainer>
  );
};

export default RealtimeAlerts;
