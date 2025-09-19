// 간단한 유틸리티 함수 테스트
describe('Format Utils', () => {
  // 가격 포맷팅 함수 테스트
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // 퍼센트 포맷팅 함수 테스트
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // 숫자 포맷팅 함수 테스트
  const formatNumber = (num: number): string => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    }
    return num.toString();
  };

  describe('formatPrice', () => {
    it('should format positive numbers correctly', () => {
      expect(formatPrice(50000)).toBe('$50,000.00');
      expect(formatPrice(1234.56)).toBe('$1,234.56');
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should format negative numbers correctly', () => {
      expect(formatPrice(-1000)).toBe('-$1,000.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format positive percentages correctly', () => {
      expect(formatPercentage(5.2)).toBe('+5.20%');
      expect(formatPercentage(0)).toBe('+0.00%');
    });

    it('should format negative percentages correctly', () => {
      expect(formatPercentage(-3.5)).toBe('-3.50%');
    });
  });

  describe('formatNumber', () => {
    it('should format large numbers correctly', () => {
      expect(formatNumber(1000000000)).toBe('1.0B');
      expect(formatNumber(1500000000)).toBe('1.5B');
      expect(formatNumber(1000000)).toBe('1.0M');
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(1000)).toBe('1.0K');
      expect(formatNumber(1500)).toBe('1.5K');
    });

    it('should format small numbers correctly', () => {
      expect(formatNumber(500)).toBe('500');
      expect(formatNumber(50)).toBe('50');
      expect(formatNumber(5)).toBe('5');
    });
  });
});
