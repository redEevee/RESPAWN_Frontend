import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <ProductContainer>
      <Link to={`/ProductDetail/${product.id}`}>
        <ProductImg
          src={`http://localhost:8080${product.imageUrl}`}
          alt={product.name}
        />
        <Info>
          <ProductStoreName>YS Market</ProductStoreName>
          <ProductName>{product.name}</ProductName>
          <ProcuctPrice>{product.price.toLocaleString()}원</ProcuctPrice>
        </Info>
      </Link>
    </ProductContainer>
  );
};

export default ProductCard;

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

const Info = styled.div`
  padding: 12px;
`;

const ProductStoreName = styled.div`
  margin-top: 5px;
  font-size: 16px;
`;

const ProductName = styled.h3`
  margin: 5px 0 5px 0;
  font-size: 22px;
`;

const ProcuctPrice = styled.p`
  margin-top: 5px;
  font-size: 18px;
  font-weight: bold;
`;
