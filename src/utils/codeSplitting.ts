import { lazy, ComponentType } from 'react';

// Generic lazy loading wrapper with error boundary and loading fallback
export const createLazyComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ComponentType
) => {
  const LazyComponent = lazy(importFunc);
  
  // Wrap with error boundary and loading fallback
  return (props: any) => {
    return (
      <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
};

// Preload function for components
export const preloadComponent = (importFunc: () => Promise<any>) => {
  return () => {
    importFunc().catch(error => {
      console.warn('Failed to preload component:', error);
    });
  };
};

// Route-based code splitting
export const createLazyRoute = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  routeName: string
) => {
  const LazyComponent = lazy(importFunc);
  
  // Add route name to component for debugging
  LazyComponent.displayName = `LazyRoute(${routeName})`;
  
  return LazyComponent;
};

// Component-based code splitting with retry logic
export const createLazyComponentWithRetry = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  maxRetries: number = 3,
  retryDelay: number = 1000
) => {
  const LazyComponent = lazy(() => {
    return new Promise((resolve, reject) => {
      let retries = 0;
      
      const attemptImport = () => {
        importFunc()
          .then(resolve)
          .catch(error => {
            retries++;
            if (retries < maxRetries) {
              console.warn(`Failed to load component, retrying... (${retries}/${maxRetries})`);
              setTimeout(attemptImport, retryDelay * retries);
            } else {
              console.error('Failed to load component after all retries:', error);
              reject(error);
            }
          });
      };
      
      attemptImport();
    });
  });
  
  return LazyComponent;
};

// Bundle analyzer helper
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === 'development') {
    // In development, we can provide bundle analysis
    const modules = (window as any).__webpack_require__?.cache;
    if (modules) {
      const moduleSizes = Object.keys(modules).map(key => ({
        name: key,
        size: modules[key].size || 0
      })).sort((a, b) => b.size - a.size);
      
      console.group('📦 Bundle Analysis');
      console.table(moduleSizes.slice(0, 20)); // Top 20 largest modules
      console.groupEnd();
      
      return moduleSizes;
    }
  }
  return [];
};

// Performance monitoring for code splitting
export const measureChunkLoadTime = (chunkName: string) => {
  const startTime = performance.now();
  
  return {
    end: () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`📦 Chunk "${chunkName}" loaded in ${loadTime.toFixed(2)}ms`);
      
      // Send to analytics if available
      if ((window as any).gtag) {
        (window as any).gtag('event', 'chunk_load', {
          chunk_name: chunkName,
          load_time: loadTime
        });
      }
      
      return loadTime;
    }
  };
};

// Preload critical chunks
export const preloadCriticalChunks = () => {
  const criticalChunks = [
    // Add critical chunk names here
    'vendor',
    'common',
    'main'
  ];
  
  criticalChunks.forEach(chunkName => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = `/static/js/${chunkName}.js`;
    document.head.appendChild(link);
  });
};

// Dynamic import with loading state
export const dynamicImport = async <T>(
  importFunc: () => Promise<T>,
  onLoading?: () => void,
  onError?: (error: Error) => void
): Promise<T> => {
  try {
    onLoading?.();
    const result = await importFunc();
    return result;
  } catch (error) {
    onError?.(error as Error);
    throw error;
  }
};

// Route preloading strategy
export const preloadRoute = (routePath: string) => {
  // Preload route based on user behavior
  const preloadMap: Record<string, () => Promise<any>> = {
    '/dashboard': () => import('../pages/Dashboard'),
    '/signals': () => import('../pages/Signals'),
    '/coins': () => import('../pages/Coins'),
    '/alerts': () => import('../pages/Alerts'),
    '/analytics': () => import('../pages/Analytics'),
    '/profile': () => import('../pages/Profile'),
    '/strategy': () => import('../pages/Strategy')
  };
  
  const preloadFunc = preloadMap[routePath];
  if (preloadFunc) {
    preloadFunc().catch(error => {
      console.warn(`Failed to preload route ${routePath}:`, error);
    });
  }
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Lazy load images
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = createIntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        img.src = src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });
  
  observer.observe(img);
  return observer;
};

// Webpack bundle analyzer integration
export const getBundleInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      chunks: (window as any).__webpack_require__?.cache || {},
      modules: Object.keys((window as any).__webpack_require__?.cache || {}),
      totalModules: Object.keys((window as any).__webpack_require__?.cache || {}).length
    };
  }
  return null;
};

export default {
  createLazyComponent,
  preloadComponent,
  createLazyRoute,
  createLazyComponentWithRetry,
  analyzeBundle,
  measureChunkLoadTime,
  preloadCriticalChunks,
  dynamicImport,
  preloadRoute,
  createIntersectionObserver,
  lazyLoadImage,
  getBundleInfo
};
