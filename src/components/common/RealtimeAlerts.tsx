import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useUIStore } from '../../stores/uiStore';
import { theme } from '../../styles/theme';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const AlertContainer = styled.div`
  position: fixed;
  top: 100px;
  right: ${theme.spacing.lg};
  z-index: 1000;
  max-width: 400px;
  pointer-events: none;

  @media (max-width: 768px) {
    right: ${theme.spacing.md};
    left: ${theme.spacing.md};
    max-width: none;
  }
`;

const AlertItem = styled(motion.div)<{ $type: 'info' | 'success' | 'warning' | 'error' }>`
  background-color: ${props => {
    switch (props.$type) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.info;
    }
  }};
  color: white;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.lg};
  pointer-events: auto;
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
`;

const AlertHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xs};
`;

const AlertTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const AlertCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const AlertMessage = styled.p`
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.4;
  opacity: 0.9;
`;

const AlertTimestamp = styled.span`
  font-size: 0.7rem;
  opacity: 0.7;
  margin-top: ${theme.spacing.xs};
  display: block;
`;

const ProgressBar = styled.div<{ $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  animation: progress ${props => props.$duration}ms linear forwards;

  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

interface RealtimeAlert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  duration?: number;
}

const RealtimeAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([]);
  const { lastMessage } = useWebSocket();
  const { addToast } = useUIStore();

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'signal_update') {
      const { data } = lastMessage.data;
      
      if (data.type === 'strong_signal') {
        const newAlert: RealtimeAlert = {
          id: `alert-${Date.now()}`,
          type: 'success',
          title: '🚨 강한 신호',
          message: `${data.symbol}에 대한 강한 투자 신호가 도착했습니다!`,
          timestamp: new Date().toLocaleTimeString(),
          duration: 8000,
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]); // Keep max 5 alerts
        
        // Auto remove after duration
        setTimeout(() => {
          setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, newAlert.duration);
      } else if (data.type === 'new_signal') {
        const newAlert: RealtimeAlert = {
          id: `alert-${Date.now()}`,
          type: 'info',
          title: '📊 새로운 신호',
          message: `${data.symbol}에 대한 새로운 투자 신호가 도착했습니다.`,
          timestamp: new Date().toLocaleTimeString(),
          duration: 5000,
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
        
        setTimeout(() => {
          setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, newAlert.duration);
      }
    }
  }, [lastMessage]);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <AlertContainer>
      <AnimatePresence>
        {alerts.map((alert) => (
          <AlertItem
            key={alert.id}
            $type={alert.type}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <AlertHeader>
              <AlertTitle>
                {alert.title}
              </AlertTitle>
              <AlertCloseButton onClick={() => removeAlert(alert.id)}>
                ×
              </AlertCloseButton>
            </AlertHeader>
            <AlertMessage>{alert.message}</AlertMessage>
            <AlertTimestamp>{alert.timestamp}</AlertTimestamp>
            {alert.duration && (
              <ProgressBar $duration={alert.duration} />
            )}
          </AlertItem>
        ))}
      </AnimatePresence>
    </AlertContainer>
  );
};

export default RealtimeAlerts;
