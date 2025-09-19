import React, { memo, useCallback, useMemo, useEffect, useRef } from 'react';
import { FixedSizeList as List, FixedSizeGrid as Grid } from 'react-window';
import styled from 'styled-components';
import { theme, mediaQueries } from '../../styles/theme';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  width?: string | number;
  renderItem: (props: { index: number; style: React.CSSProperties; item: T }) => React.ReactNode;
  overscanCount?: number;
  onScroll?: (scrollOffset: number) => void;
  scrollToIndex?: number;
  className?: string;
  // Infinite scrolling props
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  loadNextPage?: () => void;
  threshold?: number; // Distance from bottom to trigger load
  // Scroll restoration props
  restoreScrollPosition?: boolean;
  scrollPositionKey?: string;
}

interface VirtualizedGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  height: number;
  width?: string | number;
  columns: number;
  renderItem: (props: { 
    columnIndex: number; 
    rowIndex: number; 
    style: React.CSSProperties; 
    item: T;
    index: number;
  }) => React.ReactNode;
  overscanCount?: number;
  onScroll?: (scrollOffset: number) => void;
  className?: string;
}

const VirtualizedListContainer = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background-color: ${theme.colors.background};
`;

const VirtualizedGridContainer = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  background-color: ${theme.colors.background};
`;

// Virtualized List Component
export const VirtualizedList = memo(<T,>({
  items,
  itemHeight,
  height,
  width = '100%',
  renderItem,
  overscanCount = 5,
  onScroll,
  scrollToIndex,
  className,
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  threshold = 5,
  restoreScrollPosition = false,
  scrollPositionKey
}: VirtualizedListProps<T>) => {
  const listRef = useRef<List>(null);

  // Scroll restoration logic
  useEffect(() => {
    if (restoreScrollPosition && scrollPositionKey && listRef.current) {
      const savedPosition = sessionStorage.getItem(`scroll-${scrollPositionKey}`);
      if (savedPosition) {
        const position = parseInt(savedPosition, 10);
        listRef.current.scrollTo(position);
      }
    }
  }, [restoreScrollPosition, scrollPositionKey]);

  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: { scrollOffset: number; scrollUpdateWasRequested: boolean }) => {
    onScroll?.(scrollOffset);
    
    // Infinite scroll logic
    if (hasNextPage && !isNextPageLoading && loadNextPage && !scrollUpdateWasRequested) {
      const totalHeight = items.length * itemHeight;
      const visibleHeight = height;
      const scrollBottom = scrollOffset + visibleHeight;
      
      // Check if we're near the bottom
      if (scrollBottom >= totalHeight - (threshold * itemHeight)) {
        loadNextPage();
      }
    }
  }, [onScroll, hasNextPage, isNextPageLoading, loadNextPage, items.length, itemHeight, height, threshold]);

  const itemData = useMemo(() => ({
    items,
    renderItem,
    hasNextPage,
    isNextPageLoading
  }), [items, renderItem, hasNextPage, isNextPageLoading]);

  const ItemRenderer = useCallback(({ index, style, data }: any) => {
    const { items, renderItem, hasNextPage, isNextPageLoading } = data;
    
    // Show loading indicator at the end if there's a next page
    if (index === items.length && hasNextPage) {
      return (
        <div style={style}>
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: theme.colors.textSecondary,
            fontSize: '0.9rem',
            padding: theme.spacing.md
          }}>
            {isNextPageLoading ? '더 많은 데이터를 불러오는 중...' : '더 보기'}
          </div>
        </div>
      );
    }
    
    const item = items[index];
    
    if (!item) {
      return (
        <div style={style}>
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: theme.colors.textSecondary,
            fontSize: '0.9rem'
          }}>
            로딩 중...
          </div>
        </div>
      );
    }

    return renderItem({ index, style, item });
  }, []);

  // Calculate total item count including loading indicator
  const itemCount = items.length + (hasNextPage ? 1 : 0);

  return (
    <VirtualizedListContainer className={className}>
      <List
        ref={listRef}
        height={height}
        itemCount={itemCount}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={overscanCount}
        onScroll={handleScroll}
        width={width}
        initialScrollOffset={scrollToIndex ? scrollToIndex * itemHeight : 0}
      >
        {ItemRenderer}
      </List>
    </VirtualizedListContainer>
  );
}) as <T>(props: VirtualizedListProps<T>) => React.ReactElement;

VirtualizedList.displayName = 'VirtualizedList';

// Virtualized Grid Component
export const VirtualizedGrid = memo(<T,>({
  items,
  itemHeight,
  itemWidth,
  height,
  width = '100%',
  columns,
  renderItem,
  overscanCount = 5,
  onScroll,
  className
}: VirtualizedGridProps<T>) => {
  const rows = Math.ceil(items.length / columns);

  const handleScroll = useCallback(({ scrollTop }: { scrollTop: number }) => {
    onScroll?.(scrollTop);
  }, [onScroll]);

  const itemData = useMemo(() => ({
    items,
    renderItem,
    columns
  }), [items, renderItem, columns]);

  const CellRenderer = useCallback(({ columnIndex, rowIndex, style, data }: any) => {
    const { items, renderItem, columns } = data;
    const index = rowIndex * columns + columnIndex;
    const item = items[index];
    
    if (!item) {
      return (
        <div style={style}>
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: theme.colors.textSecondary,
            fontSize: '0.9rem'
          }}>
            로딩 중...
          </div>
        </div>
      );
    }

    return renderItem({ columnIndex, rowIndex, style, item, index });
  }, []);

  return (
    <VirtualizedGridContainer className={className}>
      <Grid
        height={height}
        width={width}
        columnCount={columns}
        columnWidth={itemWidth}
        rowCount={rows}
        rowHeight={itemHeight}
        itemData={itemData}
        overscanCount={overscanCount}
        onScroll={handleScroll}
      >
        {CellRenderer}
      </Grid>
    </VirtualizedGridContainer>
  );
}) as <T>(props: VirtualizedGridProps<T>) => React.ReactElement;

VirtualizedGrid.displayName = 'VirtualizedGrid';

// Hook for managing scroll position
export const useScrollPosition = (key: string) => {
  const getScrollPosition = useCallback(() => {
    const saved = sessionStorage.getItem(`scroll-${key}`);
    return saved ? parseInt(saved, 10) : 0;
  }, [key]);

  const saveScrollPosition = useCallback((position: number) => {
    sessionStorage.setItem(`scroll-${key}`, position.toString());
  }, [key]);

  const clearScrollPosition = useCallback(() => {
    sessionStorage.removeItem(`scroll-${key}`);
  }, [key]);

  return {
    getScrollPosition,
    saveScrollPosition,
    clearScrollPosition
  };
};

// Hook for infinite loading
export const useInfiniteLoading = (
  hasNextPage: boolean,
  isNextPageLoading: boolean,
  loadNextPage: () => void
) => {
  const itemCount = hasNextPage ? 1 : 0;
  
  const loadMoreItems = useCallback(() => {
    if (isNextPageLoading) return;
    loadNextPage();
  }, [isNextPageLoading, loadNextPage]);

  const isItemLoaded = useCallback((index: number) => {
    return !hasNextPage || index < itemCount;
  }, [hasNextPage, itemCount]);

  return {
    itemCount,
    loadMoreItems,
    isItemLoaded
  };
};

export default VirtualizedList;
