import React from 'react';
import styled from 'styled-components';

const generatePageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    // 전체 페이지가 7개 이하이면 모든 페이지 번호를 보여줌
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 현재 페이지가 시작 부분에 가까울 때 (예: 1, 2, 3, 4)
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  // 현재 페이지가 끝 부분에 가까울 때
  if (currentPage >= totalPages - 3) {
    return [
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // 현재 페이지가 중간에 있을 때
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isFirst,
  isLast,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
      >
        이전
      </PageButton>
      {pages.map((page, index) =>
        typeof page === 'string' ? (
          // '...'는 버튼이 아닌 텍스트로 표시
          <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
        ) : (
          <PageNumber
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </PageNumber>
        )
      )}
      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
      >
        다음
      </PageButton>
    </PaginationContainer>
  );
}

export default Pagination;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  margin: 0 4px;
  border: none;
  background-color: #eee;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.button`
  padding: 8px 12px;
  margin: 0 4px;
  border: none;
  background-color: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
  &.active {
    background-color: rgb(85, 90, 130);
    color: white;
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  color: #6b7280;
`;
