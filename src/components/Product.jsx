import React from 'react';
import styled from 'styled-components';
import productImg from '../assets/product1.jpg';

const Product = () => {
  return (
    <ProductContainer>
      <ProductImg src={productImg} alt="헤드셋1" />
      <ProductStoreName>YS Market</ProductStoreName>
      <ProductName>핑크 고양이 헤드셋</ProductName>
      <ProcuctPrice>20000원</ProcuctPrice>
    </ProductContainer>
  );
};

export default Product;

const ProductContainer = styled.div`
  width: 100%;
  border: 1px solid #eee;
  padding: 10px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: 0.3s;
  }
`;

const ProductImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: 3 / 3.5; // 예쁘게 고정된 비율
`;

const ProductStoreName = styled.div`
  margin-top: 5px;
  font-size: 16px;
`;

const ProductName = styled.div`
  margin: 5px 0 5px 0;
  font-size: 25px;
`;

const ProcuctPrice = styled.div`
  margin-top: 5px;
  font-size: 20px;
`;
