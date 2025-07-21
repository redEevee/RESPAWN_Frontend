import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

const ProductContainer = ({ limit, showMoreButton }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/items')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('상품 불러오기 실패:', err));
  }, []);

  const limitedProducts = limit ? products.slice(0, limit) : products;

  return (
    <ProductWrapper>
      {showMoreButton && (
        <MoreButton onClick={() => navigate('/productlist')}>
          + 더보기
        </MoreButton>
      )}
      <Grid>
        {limitedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Grid>
    </ProductWrapper>
  );
};

export default ProductContainer;

const ProductWrapper = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const MoreButton = styled.button`
  display: block;
  margin: 0 10px 20px auto; // 오른쪽 마진을 자동으로 줘서 오른쪽 정렬
  padding: 10px 10px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
