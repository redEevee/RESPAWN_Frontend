import React from 'react';
import styled from 'styled-components';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </PageButton>
      {pages.map((page) => (
        <PageNumber
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? 'active' : ''}
        >
          {page}
        </PageNumber>
      ))}
      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
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
