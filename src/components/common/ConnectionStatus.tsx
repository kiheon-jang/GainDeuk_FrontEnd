import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWebSocketStatus } from '../../hooks/useWebSocket';
import { theme } from '../../styles/theme';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
`;

const StatusDot = styled.div<{ $status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.$status) {
      case 'OPEN':
        return theme.colors.success;
      case 'CONNECTING':
        return theme.colors.warning;
      case 'CLOSED':
      case 'CLOSING':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  }};
  
  ${props => props.$status === 'CONNECTING' && `
    animation: ${pulse} 1.5s ease-in-out infinite;
  `}
`;

const StatusText = styled.span<{ $status: string }>`
  color: ${props => {
    switch (props.$status) {
      case 'OPEN':
        return theme.colors.success;
      case 'CONNECTING':
        return theme.colors.warning;
      case 'CLOSED':
      case 'CLOSING':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  }};
`;

const getStatusText = (status: string): string => {
  switch (status) {
    case 'OPEN':
      return '실시간 연결됨';
    case 'CONNECTING':
      return '연결 중...';
    case 'CLOSED':
      return '연결 끊김';
    case 'CLOSING':
      return '연결 종료 중';
    default:
      return '알 수 없음';
  }
};

interface ConnectionStatusProps {
  showText?: boolean;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  showText = true, 
  className 
}) => {
  const { isConnected, connectionState } = useWebSocketStatus();

  return (
    <StatusContainer className={className}>
      <StatusDot $status={connectionState} />
      {showText && (
        <StatusText $status={connectionState}>
          {getStatusText(connectionState)}
        </StatusText>
      )}
    </StatusContainer>
  );
};

export default ConnectionStatus;
