import React from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../../styles/theme';
import { Select, Button } from './index';
import type { SignalFilters as SignalFiltersType } from '../../types';

interface SignalFiltersProps {
  filters: SignalFiltersType;
  onFiltersChange: (filters: SignalFiltersType) => void;
  onReset: () => void;
  className?: string;
}

const FiltersContainer = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const FiltersTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.md} 0;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const FilterLabel = styled.label`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const RangeInput = styled.input`
  flex: 1;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
  }
  
  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
`;

const RangeSeparator = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  
  ${mediaQueries.mobile} {
    justify-content: stretch;
    
    button {
      flex: 1;
    }
  }
`;

const SignalFilters: React.FC<SignalFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  className,
}) => {
  const handleFilterChange = (key: keyof SignalFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleScoreRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    const newFilters = { ...filters };
    
    if (type === 'min') {
      newFilters.minScore = numValue;
    } else {
      newFilters.maxScore = numValue;
    }
    
    onFiltersChange(newFilters);
  };

  const actionOptions = [
    { value: '', label: '모든 액션' },
    { value: 'STRONG_BUY', label: '강력 매수' },
    { value: 'BUY', label: '매수' },
    { value: 'HOLD', label: '보유' },
    { value: 'WEAK_SELL', label: '약한 매도' },
    { value: 'SELL', label: '매도' },
    { value: 'STRONG_SELL', label: '강력 매도' },
  ];

  const timeframeOptions = [
    { value: '', label: '모든 시간대' },
    { value: 'SCALPING', label: '스캘핑' },
    { value: 'DAY_TRADING', label: '데이 트레이딩' },
    { value: 'SWING_TRADING', label: '스윙 트레이딩' },
    { value: 'LONG_TERM', label: '장기 투자' },
  ];

  const priorityOptions = [
    { value: '', label: '모든 우선순위' },
    { value: 'high_priority', label: '높음' },
    { value: 'medium_priority', label: '보통' },
    { value: 'low_priority', label: '낮음' },
  ];

  return (
    <FiltersContainer className={className}>
      <FiltersTitle>🔍 신호 필터</FiltersTitle>
      
      <FiltersGrid>
        <FilterGroup>
          <FilterLabel>AI 점수 범위</FilterLabel>
          <RangeContainer>
            <RangeInput
              type="number"
              placeholder="최소"
              min="0"
              max="100"
              value={filters.minScore || ''}
              onChange={(e) => handleScoreRangeChange('min', e.target.value)}
            />
            <RangeSeparator>~</RangeSeparator>
            <RangeInput
              type="number"
              placeholder="최대"
              min="0"
              max="100"
              value={filters.maxScore || ''}
              onChange={(e) => handleScoreRangeChange('max', e.target.value)}
            />
          </RangeContainer>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>추천 액션</FilterLabel>
          <Select
            value={filters.action || ''}
            onChange={(value) => handleFilterChange('action', value)}
            options={actionOptions}
            placeholder="액션 선택"
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>시간대</FilterLabel>
          <Select
            value={filters.timeframe || ''}
            onChange={(value) => handleFilterChange('timeframe', value)}
            options={timeframeOptions}
            placeholder="시간대 선택"
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>우선순위</FilterLabel>
          <Select
            value={filters.priority || ''}
            onChange={(value) => handleFilterChange('priority', value)}
            options={priorityOptions}
            placeholder="우선순위 선택"
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>코인 심볼</FilterLabel>
          <RangeInput
            type="text"
            placeholder="예: BTC, ETH"
            value={filters.coinSymbol || ''}
            onChange={(e) => handleFilterChange('coinSymbol', e.target.value.toUpperCase())}
          />
        </FilterGroup>
      </FiltersGrid>

      <ActionsContainer>
        <Button
          variant="outlined"
          onClick={onReset}
        >
          필터 초기화
        </Button>
      </ActionsContainer>
    </FiltersContainer>
  );
};

export default SignalFilters;
