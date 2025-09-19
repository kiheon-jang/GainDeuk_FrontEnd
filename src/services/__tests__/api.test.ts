// 간단한 API 서비스 테스트
describe('API Service Utils', () => {
  // API URL 구성 함수 테스트
  const buildApiUrl = (endpoint: string, baseUrl: string = 'http://localhost:3000/api'): string => {
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  };

  // 에러 메시지 포맷팅 함수 테스트
  const formatApiError = (status: number, message?: string): string => {
    const defaultMessages: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
    };

    return message || defaultMessages[status] || `HTTP Error ${status}`;
  };

  // API 응답 검증 함수 테스트
  const validateApiResponse = (response: any): boolean => {
    return response !== null && response !== undefined && typeof response === 'object' && 'data' in response;
  };

  describe('buildApiUrl', () => {
    it('should build URL with default base URL', () => {
      expect(buildApiUrl('/signals')).toBe('http://localhost:3000/api/signals');
      expect(buildApiUrl('signals')).toBe('http://localhost:3000/api/signals');
    });

    it('should build URL with custom base URL', () => {
      const customBase = 'https://api.example.com';
      expect(buildApiUrl('/coins', customBase)).toBe('https://api.example.com/coins');
      expect(buildApiUrl('coins', customBase)).toBe('https://api.example.com/coins');
    });

    it('should handle empty endpoint', () => {
      expect(buildApiUrl('')).toBe('http://localhost:3000/api/');
    });
  });

  describe('formatApiError', () => {
    it('should return custom message when provided', () => {
      expect(formatApiError(400, 'Invalid request')).toBe('Invalid request');
      expect(formatApiError(500, 'Server error')).toBe('Server error');
    });

    it('should return default message for known status codes', () => {
      expect(formatApiError(400)).toBe('Bad Request');
      expect(formatApiError(401)).toBe('Unauthorized');
      expect(formatApiError(404)).toBe('Not Found');
      expect(formatApiError(500)).toBe('Internal Server Error');
    });

    it('should return generic message for unknown status codes', () => {
      expect(formatApiError(418)).toBe('HTTP Error 418');
      expect(formatApiError(999)).toBe('HTTP Error 999');
    });
  });

  describe('validateApiResponse', () => {
    it('should validate correct API response structure', () => {
      expect(validateApiResponse({ data: [] })).toBe(true);
      expect(validateApiResponse({ data: {}, message: 'success' })).toBe(true);
      expect(validateApiResponse({ data: null })).toBe(true);
    });

    it('should reject invalid response structures', () => {
      expect(validateApiResponse(null)).toBe(false);
      expect(validateApiResponse(undefined)).toBe(false);
      expect(validateApiResponse({})).toBe(false);
      expect(validateApiResponse({ message: 'no data' })).toBe(false);
      expect(validateApiResponse('string')).toBe(false);
      expect(validateApiResponse(42)).toBe(false);
    });
  });
});