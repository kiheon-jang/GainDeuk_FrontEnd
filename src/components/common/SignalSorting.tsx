import React from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../../styles/theme';
import { Select } from './index';

interface SignalSortingProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

const SortingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: ${theme.spacing.sm};
  }
`;

const SortingLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
`;

const SortingControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: ${theme.spacing.sm};
  }
`;

const SortSelect = styled(Select)`
  min-width: 150px;
  
  ${mediaQueries.mobile} {
    min-width: auto;
  }
`;

const OrderButton = styled.button<{ isActive: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${props => props.isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${props => props.isActive ? theme.colors.primary : 'transparent'};
  color: ${props => props.isActive ? theme.colors.text : theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  
  &:hover {
    border-color: ${theme.colors.primary};
    background-color: ${props => props.isActive ? theme.colors.primary : 'rgba(229, 9, 20, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SignalSorting: React.FC<SignalSortingProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  className,
}) => {
  const sortOptions = [
    { value: 'finalScore', label: 'AI 점수' },
    { value: 'rank', label: '순위' },
    { value: 'currentPrice', label: '현재 가격' },
    { value: 'marketCap', label: '시가총액' },
    { value: 'createdAt', label: '생성 시간' },
    { value: 'priority', label: '우선순위' },
  ];

  const handleSortByChange = (value: string) => {
    onSortChange(value, sortOrder);
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    onSortChange(sortBy, order);
  };

  return (
    <SortingContainer className={className}>
      <SortingLabel>정렬 기준:</SortingLabel>
      
      <SortingControls>
        <SortSelect
          value={sortBy}
          onChange={handleSortByChange}
          options={sortOptions}
          placeholder="정렬 기준 선택"
        />
        
        <OrderButton
          isActive={sortOrder === 'desc'}
          onClick={() => handleOrderChange('desc')}
        >
          ↓ 내림차순
        </OrderButton>
        
        <OrderButton
          isActive={sortOrder === 'asc'}
          onClick={() => handleOrderChange('asc')}
        >
          ↑ 오름차순
        </OrderButton>
      </SortingControls>
    </SortingContainer>
  );
};

export default SignalSorting;
