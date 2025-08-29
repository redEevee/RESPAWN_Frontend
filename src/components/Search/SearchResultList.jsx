import React from 'react';
import styled from 'styled-components';
import ProductCard from '../Product/ProductCard';
import axios from '../../api/axios';

const SearchResultList = ({ query, items, loading }) => {
  const handleAddToCart = (product) => {
    axios
      .post('/api/cart/add', { itemId: product.id, count: 1 })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200 && res.data?.success) {
          alert(`${product.name}이(가) 장바구니에 담겼습니다.`);
        } else {
          alert('장바구니 담기에 실패했습니다.');
        }
      })
      .catch((err) => {
        console.error('장바구니 담기 실패:', err);
        alert('장바구니 담기 실패');
      });
  };

  return (
    <Wrapper>
      <Header>
        <Title>
          {query ? (
            <>
              <span>"{query}"</span> 에 대한 검색 결과
            </>
          ) : (
            '전체 상품'
          )}
        </Title>
        <ResultCount>총 {items.length}개</ResultCount>
      </Header>

      {loading ? (
        <LoadingState>상품을 불러오는 중입니다... 🕵️‍♂️</LoadingState>
      ) : items.length === 0 ? (
        <EmptyState>
          <p>검색 결과가 없습니다 😥</p>
        </EmptyState>
      ) : (
        <Grid>
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </Grid>
      )}
    </Wrapper>
  );
};

export default SearchResultList;

const Wrapper = styled.main`
  padding-top: 4px; /* 미세 간격 */
`;
const Header = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;

  span {
    color: #0077ff;
  }
`;

const ResultCount = styled.span`
  font-size: 16px;
  color: #666;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const sharedStateStyle = `
  margin-top: 60px;
  text-align: center;
  font-size: 18px;
  color: #777;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.div`
  ${sharedStateStyle}
`;
const LoadingState = styled.div`
  ${sharedStateStyle}
`;
