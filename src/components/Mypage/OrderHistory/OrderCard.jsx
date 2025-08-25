import React from 'react';
import styled from 'styled-components';
import OrderItemCard from './OrderItemCard';

const OrderCard = ({ order }) => {
  return (
    <CardWrapper>
      <Header>
        <Left>
          <OrderDate>
            {new Date(order.orderDate).toLocaleDateString()}
          </OrderDate>
          <OrderId>주문번호: {order.orderId}</OrderId>
        </Left>
      </Header>
      <ItemList>
        {order.items.map((item) => (
          <OrderItemCard
            key={item.itemId}
            item={item}
            orderId={order.orderId}
            orderStatus={order.status}
          />
        ))}
      </ItemList>
      <OrderPrice>
        총 결제 금액: {order.totalAmount.toLocaleString()}원
      </OrderPrice>
    </CardWrapper>
  );
};

export default OrderCard;

const CardWrapper = styled.div`
  border: 1px solid #d1d5db;
  border-radius: 16px;
  padding: 24px;
  background-color: #f9fafb;
  margin-bottom: 32px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderDate = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #374151;
`;

const OrderId = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderPrice = styled.div`
  font-weight: 700;
  font-size: 18px;
  text-align: right;
  margin-top: 24px;
  color: #374151;
`;
