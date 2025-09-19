import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
  loading?: 'lazy' | 'eager';
  quality?: 'low' | 'medium' | 'high';
  blurDataURL?: string;
}

const ImageContainer = styled.div<{ width?: number | string; height?: number | string }>`
  position: relative;
  overflow: hidden;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.sm};
  
  ${props => props.width && `width: ${typeof props.width === 'number' ? `${props.width}px` : props.width};`}
  ${props => props.height && `height: ${typeof props.height === 'number' ? `${props.height}px` : props.height};`}
`;

const StyledImage = styled.img<{ 
  loaded: boolean; 
  quality: 'low' | 'medium' | 'high';
  hasBlur: boolean;
}>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease, filter 0.3s ease;
  opacity: ${props => props.loaded ? 1 : 0};
  
  ${props => props.hasBlur && !props.loaded && `
    filter: blur(5px);
  `}
  
  ${props => props.quality === 'low' && `
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  `}
  
  ${props => props.quality === 'high' && `
    image-rendering: auto;
  `}
`;

const Placeholder = styled.div<{ 
  width?: number | string; 
  height?: number | string;
  hasBlur: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.surface} 25%, ${theme.colors.border} 50%, ${theme.colors.surface} 75%);
  background-size: 200% 100%;
  animation: ${props => props.hasBlur ? 'none' : 'shimmer 1.5s infinite'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const ErrorPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.surface};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ErrorIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${theme.spacing.sm};
  opacity: 0.5;
`;

const BlurImage = styled.img<{ loaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px);
  transform: scale(1.1);
  opacity: ${props => props.loaded ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  fallback,
  width,
  height,
  className,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  loading = 'lazy',
  quality = 'medium',
  blurDataURL
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Create intersection observer
  useEffect(() => {
    if (loading === 'eager' || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, isInView, threshold, rootMargin]);

  // Load image when in view
  useEffect(() => {
    if (!isInView || isLoaded || hasError) return;

    setIsLoading(true);
    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };
    
    img.src = src;
  }, [isInView, src, isLoaded, hasError, onLoad, onError]);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoaded(false);
    setIsLoading(false);
  }, []);

  // Generate optimized src based on quality
  const getOptimizedSrc = useCallback((originalSrc: string, quality: 'low' | 'medium' | 'high') => {
    // In a real application, you would use an image optimization service
    // like Cloudinary, ImageKit, or Next.js Image Optimization
    const qualityMap = {
      low: '?q=60&w=400',
      medium: '?q=80&w=800',
      high: '?q=95&w=1200'
    };
    
    return originalSrc + qualityMap[quality];
  }, []);

  const optimizedSrc = getOptimizedSrc(src, quality);

  return (
    <ImageContainer
      ref={containerRef}
      width={width}
      height={height}
      className={className}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <BlurImage
          src={blurDataURL}
          alt=""
          loaded={isLoaded}
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {isInView && (
        <StyledImage
          ref={imgRef}
          src={hasError ? fallback : optimizedSrc}
          alt={alt}
          loaded={isLoaded}
          quality={quality}
          hasBlur={!!blurDataURL}
          onLoad={() => {
            setIsLoaded(true);
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
            onError?.();
          }}
        />
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <Placeholder
          width={width}
          height={height}
          hasBlur={!!blurDataURL}
        >
          {placeholder || '🖼️'}
        </Placeholder>
      )}
      
      {/* Error placeholder */}
      {hasError && (
        <ErrorPlaceholder>
          <ErrorIcon>❌</ErrorIcon>
          <div>이미지를 불러올 수 없습니다</div>
          {fallback && (
            <button
              onClick={handleRetry}
              style={{
                marginTop: theme.spacing.sm,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                backgroundColor: theme.colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.sm,
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              다시 시도
            </button>
          )}
        </ErrorPlaceholder>
      )}
    </ImageContainer>
  );
};

export default LazyImage;
