import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  etag?: string;
  lastModified?: string;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: number; // Serve stale data while revalidating
  maxAge?: number; // Max age for cache
  etag?: string;
  lastModified?: string;
}

interface UseApiCacheOptions {
  defaultTtl?: number;
  enableBackgroundRefresh?: boolean;
  enableOfflineCache?: boolean;
  maxCacheSize?: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private defaultTtl: number;

  constructor(maxSize: number = 100, defaultTtl: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
  }

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const now = Date.now();
    const ttl = options.ttl ?? this.defaultTtl;
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      etag: options.etag,
      lastModified: options.lastModified
    };

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, entry);
  }

  get<T>(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    
    // Check if expired
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  isStale(key: string, staleWhileRevalidate: number = 0): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;

    const now = Date.now();
    return now > (entry.timestamp + staleWhileRevalidate);
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      hitRate: 0 // This would need to be tracked separately
    };
  }
}

// Global cache instance
const globalCache = new ApiCache();

export const useApiCache = (options: UseApiCacheOptions = {}) => {
  const {
    defaultTtl = 5 * 60 * 1000, // 5 minutes
    enableBackgroundRefresh = true,
    enableOfflineCache = true
  } = options;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const refreshTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cleanup expired entries periodically
  useEffect(() => {
    const interval = setInterval(() => {
      globalCache.cleanup();
    }, 60000); // Clean up every minute

    return () => clearInterval(interval);
  }, []);

  // Get cached data
  const getCachedData = useCallback(<T>(key: string): T | null => {
    const entry = globalCache.get<T>(key);
    return entry ? entry.data : null;
  }, []);

  // Set cached data
  const setCachedData = useCallback(<T>(
    key: string,
    data: T,
    cacheOptions: CacheOptions = {}
  ): void => {
    globalCache.set(key, data, {
      ttl: cacheOptions.ttl || defaultTtl,
      ...cacheOptions
    });
  }, [defaultTtl]);

  // Check if data is cached and valid
  const isCached = useCallback((key: string): boolean => {
    return globalCache.has(key);
  }, []);

  // Check if cached data is stale
  const isStale = useCallback((key: string, staleWhileRevalidate?: number): boolean => {
    return globalCache.isStale(key, staleWhileRevalidate);
  }, []);

  // Fetch with cache
  const fetchWithCache = useCallback(async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    cacheOptions: CacheOptions = {}
  ): Promise<T> => {
    const cachedEntry = globalCache.get<T>(key);
    const now = Date.now();

    // Return cached data if valid and not stale
    if (cachedEntry && now <= cachedEntry.expiresAt) {
      // Background refresh if stale but not expired
      if (enableBackgroundRefresh && isStale(key, cacheOptions.staleWhileRevalidate)) {
        // Don't await - refresh in background
        fetchFn()
          .then(data => {
            setCachedData(key, data, cacheOptions);
          })
          .catch(error => {
            console.warn('Background refresh failed:', error);
          });
      }
      
      return cachedEntry.data;
    }

    // If offline and we have stale data, return it
    if (!isOnline && cachedEntry && enableOfflineCache) {
      console.warn('Offline: serving stale cached data');
      return cachedEntry.data;
    }

    // Fetch fresh data
    try {
      const data = await fetchFn();
      setCachedData(key, data, cacheOptions);
      return data;
    } catch (error) {
      // If fetch fails and we have stale data, return it
      if (cachedEntry && enableOfflineCache) {
        console.warn('Fetch failed: serving stale cached data');
        return cachedEntry.data;
      }
      throw error;
    }
  }, [isOnline, enableBackgroundRefresh, enableOfflineCache, isStale, setCachedData]);

  // Invalidate cache entry
  const invalidate = useCallback((key: string): boolean => {
    return globalCache.delete(key);
  }, []);

  // Invalidate cache entries by pattern
  const invalidatePattern = useCallback((pattern: string | RegExp): number => {
    const keys = globalCache.keys();
    let invalidated = 0;

    keys.forEach(key => {
      if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
        if (globalCache.delete(key)) {
          invalidated++;
        }
      }
    });

    return invalidated;
  }, []);

  // Clear all cache
  const clearCache = useCallback((): void => {
    globalCache.clear();
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return globalCache.getStats();
  }, []);

  // Preload data
  const preload = useCallback(async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    cacheOptions: CacheOptions = {}
  ): Promise<void> => {
    try {
      const data = await fetchFn();
      setCachedData(key, data, cacheOptions);
    } catch (error) {
      console.warn('Preload failed:', error);
    }
  }, [setCachedData]);

  // Schedule background refresh
  const scheduleRefresh = useCallback((
    key: string,
    fetchFn: () => Promise<any>,
    delay: number,
    cacheOptions: CacheOptions = {}
  ): void => {
    // Clear existing timeout
    const existingTimeout = refreshTimeouts.current.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule new refresh
    const timeout = setTimeout(async () => {
      try {
        const data = await fetchFn();
        setCachedData(key, data, cacheOptions);
      } catch (error) {
        console.warn('Scheduled refresh failed:', error);
      }
    }, delay);

    refreshTimeouts.current.set(key, timeout);
  }, [setCachedData]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      refreshTimeouts.current.forEach(timeout => clearTimeout(timeout));
      refreshTimeouts.current.clear();
    };
  }, []);

  return {
    getCachedData,
    setCachedData,
    isCached,
    isStale,
    fetchWithCache,
    invalidate,
    invalidatePattern,
    clearCache,
    getCacheStats,
    preload,
    scheduleRefresh,
    isOnline
  };
};

export default useApiCache;
