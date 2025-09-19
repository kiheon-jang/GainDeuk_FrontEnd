import {
  createOrganizationStructuredData,
  createWebSiteStructuredData,
  createWebPageStructuredData,
  createProductStructuredData,
  createPageSEOMeta,
  generatePageTitle,
  optimizeMetaDescription,
  formatKeywords,
  normalizeUrl,
} from '../seoUtils';

describe('seoUtils', () => {
  describe('createOrganizationStructuredData', () => {
    it('조직 정보를 위한 구조화된 데이터를 생성해야 합니다', () => {
      const result = createOrganizationStructuredData();

      expect(result).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'GainDeuk',
        url: 'https://gaindeuk.com',
        logo: 'https://gaindeuk.com/logo.png',
        description: '실시간 암호화폐 신호 분석과 거래 전략을 제공하는 전문 플랫폼',
        sameAs: [
          'https://twitter.com/GainDeuk',
          'https://facebook.com/GainDeuk',
          'https://linkedin.com/company/gaindeuk',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+82-2-1234-5678',
          contactType: 'customer service',
        },
      });
    });
  });

  describe('createWebSiteStructuredData', () => {
    it('웹사이트 정보를 위한 구조화된 데이터를 생성해야 합니다', () => {
      const result = createWebSiteStructuredData();

      expect(result).toEqual({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'GainDeuk',
        url: 'https://gaindeuk.com',
        description: '실시간 암호화폐 신호 분석과 거래 전략을 제공하는 전문 플랫폼',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://gaindeuk.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      });
    });
  });

  describe('createWebPageStructuredData', () => {
    it('기본 웹페이지 구조화된 데이터를 생성해야 합니다', () => {
      const result = createWebPageStructuredData(
        '테스트 페이지',
        '테스트 페이지 설명',
        'https://gaindeuk.com/test'
      );

      expect(result).toEqual({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: '테스트 페이지',
        description: '테스트 페이지 설명',
        url: 'https://gaindeuk.com/test',
        isPartOf: {
          '@type': 'WebSite',
          name: 'GainDeuk',
          url: 'https://gaindeuk.com',
        },
      });
    });

    it('브레드크럼과 함께 웹페이지 구조화된 데이터를 생성해야 합니다', () => {
      const breadcrumbs = [
        { name: '홈', url: 'https://gaindeuk.com/' },
        { name: '테스트', url: 'https://gaindeuk.com/test' },
      ];

      const result = createWebPageStructuredData(
        '테스트 페이지',
        '테스트 페이지 설명',
        'https://gaindeuk.com/test',
        breadcrumbs
      );

      expect(result.breadcrumb).toEqual({
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '홈',
            item: 'https://gaindeuk.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '테스트',
            item: 'https://gaindeuk.com/test',
          },
        ],
      });
    });
  });

  describe('createProductStructuredData', () => {
    it('제품 구조화된 데이터를 생성해야 합니다', () => {
      const result = createProductStructuredData(
        'GainDeuk Pro',
        '프리미엄 암호화폐 분석 서비스',
        'Software'
      );

      expect(result).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'GainDeuk Pro',
        description: '프리미엄 암호화폐 분석 서비스',
        category: 'Software',
        brand: {
          '@type': 'Brand',
          name: 'GainDeuk',
        },
        offers: {
          '@type': 'Offer',
          price: '무료',
          priceCurrency: 'KRW',
          availability: 'https://schema.org/InStock',
        },
      });
    });

    it('커스텀 가격으로 제품 구조화된 데이터를 생성해야 합니다', () => {
      const result = createProductStructuredData(
        'GainDeuk Pro',
        '프리미엄 암호화폐 분석 서비스',
        'Software',
        '99000',
        'KRW'
      );

      expect(result.offers).toEqual({
        '@type': 'Offer',
        price: '99000',
        priceCurrency: 'KRW',
        availability: 'https://schema.org/InStock',
      });
    });
  });

  describe('createPageSEOMeta', () => {
    it('대시보드 페이지 메타데이터를 생성해야 합니다', () => {
      const result = createPageSEOMeta('dashboard');

      expect(result.title).toBe('대시보드 - GainDeuk');
      expect(result.description).toBe('실시간 암호화폐 시장 현황과 신호 분석을 한눈에 확인하세요.');
      expect(result.keywords).toBe('암호화폐 대시보드, 실시간 시장, 가격 차트, 거래량');
      expect(result.ogType).toBe('website');
    });

    it('신호 페이지 메타데이터를 생성해야 합니다', () => {
      const result = createPageSEOMeta('signals');

      expect(result.title).toBe('신호 분석 - GainDeuk');
      expect(result.description).toBe('전문가가 분석한 암호화폐 거래 신호와 투자 기회를 확인하세요.');
      expect(result.keywords).toBe('암호화폐 신호, 거래 신호, 투자 기회, 매매 타이밍');
      expect(result.ogType).toBe('article');
    });

    it('알 수 없는 페이지 타입에 대해 기본 메타데이터를 반환해야 합니다', () => {
      const result = createPageSEOMeta('unknown');

      expect(result.title).toBe('대시보드 - GainDeuk');
      expect(result.description).toBe('실시간 암호화폐 시장 현황과 신호 분석을 한눈에 확인하세요.');
    });

    it('추가 데이터와 함께 메타데이터를 생성해야 합니다', () => {
      const additionalData = {
        title: '커스텀 제목',
        description: '커스텀 설명',
      };

      const result = createPageSEOMeta('dashboard', additionalData);

      expect(result.title).toBe('커스텀 제목');
      expect(result.description).toBe('커스텀 설명');
    });
  });

  describe('generatePageTitle', () => {
    it('기본 사이트명으로 페이지 제목을 생성해야 합니다', () => {
      const result = generatePageTitle('테스트 페이지');

      expect(result).toBe('테스트 페이지 - GainDeuk');
    });

    it('커스텀 사이트명으로 페이지 제목을 생성해야 합니다', () => {
      const result = generatePageTitle('테스트 페이지', '커스텀 사이트');

      expect(result).toBe('테스트 페이지 - 커스텀 사이트');
    });
  });

  describe('optimizeMetaDescription', () => {
    it('짧은 설명은 그대로 반환해야 합니다', () => {
      const description = '짧은 설명';
      const result = optimizeMetaDescription(description);

      expect(result).toBe('짧은 설명');
    });

    it('긴 설명을 160자로 자르고 ...을 추가해야 합니다', () => {
      const description = 'a'.repeat(200);
      const result = optimizeMetaDescription(description);

      expect(result.length).toBe(160);
      expect(result.endsWith('...')).toBe(true);
    });

    it('단어 경계에서 자르기를 시도해야 합니다', () => {
      const description = 'This is a very long description that should be truncated at word boundaries to maintain readability and proper formatting.';
      const result = optimizeMetaDescription(description, 50);

      expect(result.length).toBeLessThanOrEqual(50);
      expect(result.endsWith('...')).toBe(true);
    });

    it('커스텀 최대 길이를 사용해야 합니다', () => {
      const description = 'a'.repeat(100);
      const result = optimizeMetaDescription(description, 50);

      expect(result.length).toBe(50);
      expect(result.endsWith('...')).toBe(true);
    });
  });

  describe('formatKeywords', () => {
    it('키워드 배열을 문자열로 변환해야 합니다', () => {
      const keywords = ['암호화폐', '비트코인', '투자'];
      const result = formatKeywords(keywords);

      expect(result).toBe('암호화폐, 비트코인, 투자');
    });

    it('빈 배열에 대해 빈 문자열을 반환해야 합니다', () => {
      const result = formatKeywords([]);

      expect(result).toBe('');
    });
  });

  describe('normalizeUrl', () => {
    it('이미 완전한 URL은 그대로 반환해야 합니다', () => {
      const url = 'https://example.com/test';
      const result = normalizeUrl(url);

      expect(result).toBe('https://example.com/test');
    });

    it('상대 경로를 절대 URL로 변환해야 합니다', () => {
      const url = '/test';
      const result = normalizeUrl(url);

      expect(result).toBe('https://gaindeuk.com/test');
    });

    it('슬래시가 없는 경로에 슬래시를 추가해야 합니다', () => {
      const url = 'test';
      const result = normalizeUrl(url);

      expect(result).toBe('https://gaindeuk.com/test');
    });

    it('커스텀 기본 URL을 사용해야 합니다', () => {
      const url = '/test';
      const result = normalizeUrl(url, 'https://example.com');

      expect(result).toBe('https://example.com/test');
    });
  });
});
