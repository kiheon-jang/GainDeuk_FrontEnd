import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { theme, mediaQueries } from '../../styles/theme';
import { Button, Loading } from '../common';
import type { ChartData } from '../../types';

interface PriceChartProps {
  data: ChartData[];
  symbol: string;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

const ChartContainer = styled.div`
  background: linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.md};
  }
`;

const ChartTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const SymbolName = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xs};
`;

const CurrentPrice = styled.span<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
  font-size: 1.2rem;
  font-weight: 600;
`;

const PriceChange = styled.span<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
  font-size: 0.9rem;
  font-weight: 500;
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  
  ${mediaQueries.mobile} {
    width: 100%;
    justify-content: space-between;
  }
`;

const TimeframeButton = styled(Button)<{ isActive: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 50px;
  
  ${props => props.isActive && `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text};
    border-color: ${theme.colors.primary};
    
    &:hover {
      background-color: ${theme.colors.primary};
      opacity: 0.9;
    }
  `}
  
  ${mediaQueries.mobile} {
    flex: 1;
    min-width: auto;
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  
  ${mediaQueries.mobile} {
    height: 300px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(20, 20, 20, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.lg};
  z-index: 10;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: ${theme.colors.error};
  font-size: 1rem;
  text-align: center;
  flex-direction: column;
  gap: ${theme.spacing.md};
  
  ${mediaQueries.mobile} {
    height: 300px;
    font-size: 0.9rem;
  }
`;

const CustomTooltip = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.lg};
`;

const TooltipLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  margin-bottom: ${theme.spacing.xs};
`;

const TooltipValue = styled.div<{ isPositive?: boolean }>`
  color: ${props => {
    if (props.isPositive === undefined) return theme.colors.text;
    return props.isPositive ? theme.colors.success : theme.colors.error;
  }};
  font-size: 1rem;
  font-weight: 600;
`;

const timeframeOptions = [
  { value: '1h', label: '1시간' },
  { value: '4h', label: '4시간' },
  { value: '1d', label: '1일' },
  { value: '1w', label: '1주' },
];

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  symbol,
  timeframe,
  onTimeframeChange,
  isLoading = false,
  error = null,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate price change
  const priceChange = useMemo(() => {
    if (data.length < 2) return { value: 0, percentage: 0 };
    
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return {
      value: change,
      percentage,
    };
  }, [data]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'price') {
      return formatPrice(value);
    }
    if (name === 'volume') {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value);
    }
    return value;
  };

  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const priceChange = data.price - (data.previousPrice || data.price);
      const isPositive = priceChange >= 0;
      
      return (
        <CustomTooltip>
          <TooltipLabel>
            {new Date(label).toLocaleString('ko-KR')}
          </TooltipLabel>
          <TooltipValue>
            가격: {formatPrice(data.price)}
          </TooltipValue>
          <TooltipValue isPositive={isPositive}>
            변동: {isPositive ? '+' : ''}{formatPrice(priceChange)}
          </TooltipValue>
          <TooltipValue>
            거래량: {formatTooltipValue(data.volume, 'volume')}
          </TooltipValue>
        </CustomTooltip>
      );
    }
    return null;
  };

  if (error) {
    return (
      <ChartContainer className={className}>
        <ErrorMessage>
          <div>📊 차트를 불러올 수 없습니다</div>
          <div>{error}</div>
        </ErrorMessage>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer className={className}>
      <ChartHeader>
        <ChartTitle>
          <SymbolName>{symbol} 가격 차트</SymbolName>
          <PriceInfo>
            {data.length > 0 && (
              <>
                <CurrentPrice isPositive={priceChange.value >= 0}>
                  {formatPrice(data[data.length - 1].price)}
                </CurrentPrice>
                <PriceChange isPositive={priceChange.value >= 0}>
                  {priceChange.value >= 0 ? '+' : ''}{formatPrice(priceChange.value)} 
                  ({priceChange.percentage >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%)
                </PriceChange>
              </>
            )}
          </PriceInfo>
        </ChartTitle>
        
        <TimeframeSelector>
          {timeframeOptions.map((option) => (
            <TimeframeButton
              key={option.value}
              variant="outlined"
              isActive={timeframe === option.value}
              onClick={() => onTimeframeChange(option.value)}
            >
              {option.label}
            </TimeframeButton>
          ))}
        </TimeframeSelector>
      </ChartHeader>

      <ChartWrapper>
        {isLoading && (
          <LoadingOverlay>
            <Loading />
          </LoadingOverlay>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={priceChange.value >= 0 ? theme.colors.success : theme.colors.error} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={priceChange.value >= 0 ? theme.colors.success : theme.colors.error} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.colors.border}
              opacity={0.3}
            />
            
            <XAxis
              dataKey="timestamp"
              stroke={theme.colors.textSecondary}
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (timeframe === '1h' || timeframe === '4h') {
                  return date.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                }
                return date.toLocaleDateString('ko-KR', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
            />
            
            <YAxis
              domain={['dataMin - 0.01', 'dataMax + 0.01']}
              stroke={theme.colors.textSecondary}
              fontSize={12}
              tickFormatter={(value) => formatPrice(value)}
            />
            
            <Tooltip content={<CustomTooltipContent />} />
            
            <Area
              type="monotone"
              dataKey="price"
              stroke={priceChange.value >= 0 ? theme.colors.success : theme.colors.error}
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: priceChange.value >= 0 ? theme.colors.success : theme.colors.error,
                stroke: theme.colors.surface,
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartContainer>
  );
};

export default PriceChart;
