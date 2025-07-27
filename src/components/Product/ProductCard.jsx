import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <ProductContainer>
      <StyledLink to={`/ProductDetail/${product.id}`}>
        <ImageWrapper>
          <ProductImg
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
          />
          <Overlay>
            <AddToCartButton
              onClick={(e) => {
                e.preventDefault(); // Link 클릭 막기
                onAddToCart(product);
              }}
            >
              장바구니
            </AddToCartButton>
          </Overlay>
        </ImageWrapper>
        <Info>
          <ProductStoreName>YS Market</ProductStoreName>
          <ProductName>{product.name}</ProductName>
          <ProcuctPrice>{product.price.toLocaleString()}원</ProcuctPrice>
        </Info>
      </StyledLink>
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

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 3.5;
  overflow: hidden;
  border-radius: 8px;
`;

const ProductImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;

  ${ProductContainer}:hover & {
    opacity: 1;
  }
`;

const AddToCartButton = styled.button`
  background-color: #f5f5f5;
  color: #555;
  border: none;
  padding: 14px 28px;
  font-size: 16px;
  border-radius: 24px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;

  &:focus,
  &:visited,
  &:active {
    outline: none;
    text-decoration: none;
    color: inherit;
  }
`;
