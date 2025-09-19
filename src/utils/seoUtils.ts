/**
 * SEO 관련 유틸리티 함수들
 */

export interface OrganizationStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': string;
    telephone: string;
    contactType: string;
  };
}

export interface WebSiteStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

export interface WebPageStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  isPartOf: {
    '@type': string;
    name: string;
    url: string;
  };
  breadcrumb?: {
    '@type': string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      item: string;
    }>;
  };
}

export interface ProductStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  category: string;
  brand: {
    '@type': string;
    name: string;
  };
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

/**
 * 조직 정보를 위한 구조화된 데이터 생성
 */
export const createOrganizationStructuredData = (): OrganizationStructuredData => ({
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

/**
 * 웹사이트 정보를 위한 구조화된 데이터 생성
 */
export const createWebSiteStructuredData = (): WebSiteStructuredData => ({
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

/**
 * 웹페이지 정보를 위한 구조화된 데이터 생성
 */
export const createWebPageStructuredData = (
  name: string,
  description: string,
  url: string,
  breadcrumbs?: Array<{ name: string; url: string }>
): WebPageStructuredData => {
  const structuredData: WebPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'GainDeuk',
      url: 'https://gaindeuk.com',
    },
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredData.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }

  return structuredData;
};

/**
 * 제품 정보를 위한 구조화된 데이터 생성
 */
export const createProductStructuredData = (
  name: string,
  description: string,
  category: string,
  price: string = '무료',
  priceCurrency: string = 'KRW'
): ProductStructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  description,
  category,
  brand: {
    '@type': 'Brand',
    name: 'GainDeuk',
  },
  offers: {
    '@type': 'Offer',
    price,
    priceCurrency,
    availability: 'https://schema.org/InStock',
  },
});

/**
 * 페이지별 SEO 메타데이터 생성
 */
export const createPageSEOMeta = (pageType: string, additionalData?: Record<string, any>) => {
  const baseMeta = {
    siteUrl: 'https://gaindeuk.com',
    defaultTitle: 'GainDeuk - 암호화폐 신호 분석 플랫폼',
    defaultDescription: '실시간 암호화폐 신호 분석과 거래 전략을 제공하는 전문 플랫폼입니다.',
    defaultKeywords: '암호화폐, 비트코인, 신호분석, 거래전략, 투자, 트레이딩',
  };

  const pageMetaMap: Record<string, any> = {
    dashboard: {
      title: '대시보드 - GainDeuk',
      description: '실시간 암호화폐 시장 현황과 신호 분석을 한눈에 확인하세요.',
      keywords: '암호화폐 대시보드, 실시간 시장, 가격 차트, 거래량',
      ogType: 'website',
    },
    signals: {
      title: '신호 분석 - GainDeuk',
      description: '전문가가 분석한 암호화폐 거래 신호와 투자 기회를 확인하세요.',
      keywords: '암호화폐 신호, 거래 신호, 투자 기회, 매매 타이밍',
      ogType: 'article',
    },
    analytics: {
      title: '분석 도구 - GainDeuk',
      description: '고급 차트 분석 도구와 기술적 지표로 시장을 분석하세요.',
      keywords: '차트 분석, 기술적 지표, 암호화폐 분석, 트레이딩 도구',
      ogType: 'website',
    },
    profile: {
      title: '프로필 - GainDeuk',
      description: '개인화된 투자 설정과 포트폴리오를 관리하세요.',
      keywords: '개인 설정, 포트폴리오, 투자 관리, 사용자 프로필',
      ogType: 'profile',
    },
    alerts: {
      title: '알림 설정 - GainDeuk',
      description: '중요한 시장 변화와 거래 기회를 놓치지 않도록 알림을 설정하세요.',
      keywords: '알림 설정, 가격 알림, 거래 알림, 시장 알림',
      ogType: 'website',
    },
    strategy: {
      title: '거래 전략 - GainDeuk',
      description: '검증된 거래 전략과 백테스팅 결과를 확인하세요.',
      keywords: '거래 전략, 백테스팅, 투자 전략, 수익률',
      ogType: 'article',
    },
  };

  const pageMeta = pageMetaMap[pageType] || pageMetaMap.dashboard;
  
  return {
    ...baseMeta,
    ...pageMeta,
    ...additionalData,
  };
};

/**
 * 동적 페이지 제목 생성
 */
export const generatePageTitle = (pageName: string, siteName: string = 'GainDeuk'): string => {
  return `${pageName} - ${siteName}`;
};

/**
 * 메타 설명 최적화 (160자 제한)
 */
export const optimizeMetaDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) {
    return description;
  }
  
  const truncated = description.substring(0, maxLength - 3);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

/**
 * 키워드 배열을 문자열로 변환
 */
export const formatKeywords = (keywords: string[]): string => {
  return keywords.join(', ');
};

/**
 * URL 정규화
 */
export const normalizeUrl = (url: string, baseUrl: string = 'https://gaindeuk.com'): string => {
  if (url.startsWith('http')) {
    return url;
  }
  
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
};
