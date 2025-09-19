import React from 'react';
import { render } from '@testing-library/react';
import { SEOHead } from '../SEOHead';

// Mock document methods
const mockSetMetaTag = jest.fn();
const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();
const mockQuerySelector = jest.fn();
const mockQuerySelectorAll = jest.fn();

// Mock document object
Object.defineProperty(document, 'title', {
  value: '',
  writable: true,
});

Object.defineProperty(document, 'head', {
  value: {
    appendChild: mockAppendChild,
  },
  writable: true,
});

Object.defineProperty(document, 'querySelector', {
  value: mockQuerySelector,
  writable: true,
});

Object.defineProperty(document, 'querySelectorAll', {
  value: mockQuerySelectorAll,
  writable: true,
});

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
  writable: true,
});

describe('SEOHead', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuerySelector.mockReturnValue(null);
    mockQuerySelectorAll.mockReturnValue([]);
    mockCreateElement.mockReturnValue({
      setAttribute: jest.fn(),
      rel: '',
      href: '',
      type: '',
      textContent: '',
    });
  });

  it('기본 props로 렌더링되어야 합니다', () => {
    render(<SEOHead />);
    
    expect(document.title).toBe('GainDeuk - 암호화폐 신호 분석 플랫폼');
  });

  it('커스텀 title을 설정해야 합니다', () => {
    const customTitle = '커스텀 페이지 제목';
    render(<SEOHead title={customTitle} />);
    
    expect(document.title).toBe(customTitle);
  });

  it('커스텀 description을 설정해야 합니다', () => {
    const customDescription = '커스텀 페이지 설명';
    render(<SEOHead description={customDescription} />);
    
    expect(mockQuerySelector).toHaveBeenCalledWith('meta[name="description"]');
  });

  it('Open Graph 태그를 설정해야 합니다', () => {
    render(
      <SEOHead
        ogTitle="OG 제목"
        ogDescription="OG 설명"
        ogImage="/og-image.jpg"
      />
    );
    
    expect(mockQuerySelector).toHaveBeenCalledWith('meta[property="og:title"]');
    expect(mockQuerySelector).toHaveBeenCalledWith('meta[property="og:description"]');
    expect(mockQuerySelector).toHaveBeenCalledWith('meta[property="og:image"]');
  });

  it('Twitter Card 태그를 설정해야 합니다', () => {
    render(
      <SEOHead
        twitterTitle="Twitter 제목"
        twitterDescription="Twitter 설명"
        twitterImage="/twitter-image.jpg"
      />
    );
    
    expect(mockQuerySelector).toHaveBeenCalledWith('meta[name="twitter:title"]');
    expect(mockQuerySelector).toHaveBeenCalledWith('meta[name="twitter:description"]');
    expect(mockQuerySelector).toHaveBeenCalledWith('meta[name="twitter:image"]');
  });

  it('구조화된 데이터를 설정해야 합니다', () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: '테스트 페이지',
    };

    render(<SEOHead structuredData={structuredData} />);
    
    expect(mockQuerySelectorAll).toHaveBeenCalledWith('script[type="application/ld+json"]');
    expect(mockCreateElement).toHaveBeenCalledWith('script');
  });

  it('배열 형태의 구조화된 데이터를 처리해야 합니다', () => {
    const structuredData = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'GainDeuk',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'GainDeuk',
      },
    ];

    render(<SEOHead structuredData={structuredData} />);
    
    expect(mockCreateElement).toHaveBeenCalledTimes(2);
  });

  it('canonical URL을 설정해야 합니다', () => {
    render(<SEOHead canonicalUrl="/test-page" />);
    
    expect(mockQuerySelector).toHaveBeenCalledWith('link[rel="canonical"]');
  });

  it('robots 메타 태그를 설정해야 합니다', () => {
    render(<SEOHead robots="noindex, nofollow" />);
    
    expect(mockQuerySelector).toHaveBeenCalledWith('meta[name="robots"]');
  });

  it('props 변경 시 메타 태그를 업데이트해야 합니다', () => {
    const { rerender } = render(<SEOHead title="첫 번째 제목" />);
    
    expect(document.title).toBe('첫 번째 제목');
    
    rerender(<SEOHead title="두 번째 제목" />);
    
    expect(document.title).toBe('두 번째 제목');
  });
});
