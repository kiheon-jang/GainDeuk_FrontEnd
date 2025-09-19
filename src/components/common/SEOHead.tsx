import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  robots?: string;
  structuredData?: object | object[];
}

/**
 * SEO 최적화를 위한 메타 태그 관리 컴포넌트
 * 페이지별로 동적으로 메타 태그를 설정할 수 있습니다.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'GainDeuk - 암호화폐 신호 분석 플랫폼',
  description = '실시간 암호화폐 신호 분석과 거래 전략을 제공하는 전문 플랫폼입니다.',
  keywords = '암호화폐, 비트코인, 신호분석, 거래전략, 투자, 트레이딩',
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = '/og-image.png',
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage = '/twitter-image.png',
  twitterSite = '@GainDeuk',
  twitterCreator = '@GainDeuk',
  robots = 'index, follow',
  structuredData,
}) => {
  const siteUrl = 'https://gaindeuk.com';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const fullOgUrl = ogUrl ? `${siteUrl}${ogUrl}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  const fullTwitterImage = twitterImage.startsWith('http') ? twitterImage : `${siteUrl}${twitterImage}`;

  useEffect(() => {
    // 페이지 제목 설정
    document.title = title;

    // 메타 태그 설정 함수
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // 기본 메타 태그 설정
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('robots', robots);

    // Open Graph 태그 설정
    setMetaTag('og:title', ogTitle || title, true);
    setMetaTag('og:description', ogDescription || description, true);
    setMetaTag('og:image', fullOgImage, true);
    setMetaTag('og:url', fullOgUrl, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:site_name', 'GainDeuk', true);
    setMetaTag('og:locale', 'ko_KR', true);

    // Twitter Card 태그 설정
    setMetaTag('twitter:card', twitterCard);
    setMetaTag('twitter:title', twitterTitle || title);
    setMetaTag('twitter:description', twitterDescription || description);
    setMetaTag('twitter:image', fullTwitterImage);
    setMetaTag('twitter:site', twitterSite);
    setMetaTag('twitter:creator', twitterCreator);

    // 추가 메타 태그 설정
    setMetaTag('theme-color', '#1a1a1a');
    setMetaTag('author', 'GainDeuk Team');
    setMetaTag('generator', 'React');

    // Canonical URL 설정
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = fullCanonicalUrl;

    // 구조화된 데이터 설정
    if (structuredData) {
      // 기존 구조화된 데이터 스크립트 제거
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => script.remove());

      // 새로운 구조화된 데이터 추가
      const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
      dataArray.forEach((data) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }
  }, [
    title,
    description,
    keywords,
    robots,
    ogTitle,
    ogDescription,
    fullOgImage,
    fullOgUrl,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    fullTwitterImage,
    twitterSite,
    twitterCreator,
    fullCanonicalUrl,
    structuredData,
  ]);

  return null; // 이 컴포넌트는 DOM을 렌더링하지 않음
};

export default SEOHead;
