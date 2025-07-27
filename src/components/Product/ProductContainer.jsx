import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled from 'styled-components';
import ProductCard from './ProductCard';
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

  const handleAddToCart = (product) => {
    axios
      .post('/api/cart/add', {
        itemId: product.id,
        count: 1,
      })
      .then(() => {
        alert(`${product.name}이(가) 장바구니에 담겼습니다.`);
      })
      .catch((err) => {
        console.error('장바구니 담기 실패:', err);
        alert('장바구니 담기 실패');
      });
  };

  return (
    <ProductWrapper>
      {showMoreButton && (
        <MoreButton onClick={() => navigate('/productlist')}>
          + 더보기
        </MoreButton>
      )}
      <Grid>
        {limitedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
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
  margin: 0 10px 20px auto;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background-color: #f0f0f0;
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  &:active {
    background-color: #d4d4d4;
  }
`;
