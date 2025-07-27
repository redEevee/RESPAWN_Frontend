// OrderItemCard.jsx
import React from 'react';
import styled from 'styled-components';

const OrderItemCard = ({ item }) => {
  const openProductPage = () => {
    window.open(`/ProductDetail/${item.itemId}`, '_blank');
  };

  return (
    <ItemBox>
      <ImageWrapper onClick={openProductPage}>
        <img src={item.imageUrl} alt={item.itemName} />
      </ImageWrapper>
      <Info>
        <Name onClick={openProductPage}>{item.itemName}</Name>
        <Quantity>{item.count}개</Quantity>
        <Price>{(item.price * item.count).toLocaleString()}원</Price>
      </Info>
    </ItemBox>
  );
};

export default OrderItemCard;

const ItemBox = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 16px;
  background-color: #ffffff;
`;

const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 8px;
  color: #222;
  cursor: pointer;
`;

const Quantity = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 700;
  margin-top: 6px;
  color: #111;
`;
