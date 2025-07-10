import React from 'react';
import styled from 'styled-components';
import Product from './Product';

const ProductContainer = () => {
  return (
    <ProductWrapper>
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
    </ProductWrapper>
  );
};

export default ProductContainer;

const ProductWrapper = styled.main`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 40px 20px;
  max-width: 1320px;
  margin: 0 auto;

  max-height: 1000px;
`;
