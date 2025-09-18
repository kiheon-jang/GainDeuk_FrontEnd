import React from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../../styles/theme';
import { Button } from './index';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    gap: ${theme.spacing.xs};
  }
`;

const PageButton = styled(Button)<{ isActive?: boolean }>`
  min-width: 40px;
  height: 40px;
  padding: 0;
  font-size: 0.9rem;
  font-weight: ${props => props.isActive ? 600 : 500};
  
  ${props => props.isActive && `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text};
    border-color: ${theme.colors.primary};
    
    &:hover {
      background-color: ${theme.colors.primary};
      opacity: 0.9;
    }
  `}
  
  ${mediaQueries.mobile} {
    min-width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }
`;

const Ellipsis = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  padding: 0 ${theme.spacing.sm};
  
  ${mediaQueries.mobile} {
    padding: 0 ${theme.spacing.xs};
    font-size: 0.8rem;
  }
`;

const PaginationInfo = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-right: ${theme.spacing.md};
  
  ${mediaQueries.mobile} {
    margin-right: ${theme.spacing.sm};
    font-size: 0.8rem;
  }
`;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <PaginationContainer className={className}>
      <PaginationInfo>
        {currentPage} / {totalPages} 페이지
      </PaginationInfo>
      
      {showFirstLast && currentPage > 1 && (
        <PageButton
          variant="outlined"
          onClick={() => onPageChange(1)}
          title="첫 페이지"
        >
          «
        </PageButton>
      )}
      
      {showPrevNext && currentPage > 1 && (
        <PageButton
          variant="outlined"
          onClick={() => onPageChange(currentPage - 1)}
          title="이전 페이지"
        >
          ‹
        </PageButton>
      )}
      
      {visiblePages.map((page, index) => {
        if (page === '...') {
          return <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>;
        }
        
        const pageNumber = page as number;
        return (
          <PageButton
            key={pageNumber}
            variant="outlined"
            isActive={pageNumber === currentPage}
            onClick={() => onPageChange(pageNumber)}
            title={`${pageNumber} 페이지`}
          >
            {pageNumber}
          </PageButton>
        );
      })}
      
      {showPrevNext && currentPage < totalPages && (
        <PageButton
          variant="outlined"
          onClick={() => onPageChange(currentPage + 1)}
          title="다음 페이지"
        >
          ›
        </PageButton>
      )}
      
      {showFirstLast && currentPage < totalPages && (
        <PageButton
          variant="outlined"
          onClick={() => onPageChange(totalPages)}
          title="마지막 페이지"
        >
          »
        </PageButton>
      )}
    </PaginationContainer>
  );
};

export default Pagination;
