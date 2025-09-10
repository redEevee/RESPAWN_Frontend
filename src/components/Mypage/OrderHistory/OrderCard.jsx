import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import OrderItemCard from './OrderItemCard';
import OrderDetailModal from './OrderDetailModal';

const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const openDetail = () => setOpen(true);
  const closeDetail = () => setOpen(false);

  return (
    <CardContainer>
      <Header>
        <Left>
          <OrderDate>
            {new Date(order.orderDate).toLocaleDateString()}
          </OrderDate>
          <OrderId>주문번호: {order.orderId}</OrderId>
        </Left>
        <Right>
          <DetailButton type="button" onClick={openDetail} ref={triggerRef}>
            상세보기 &gt;
          </DetailButton>
        </Right>
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

      <OrderDetailModal
        open={open}
        onClose={closeDetail}
        orderId={order.orderId}
        triggerRef={triggerRef}
      />
    </CardContainer>
  );
};

export default OrderCard;

const CardContainer = styled.div`
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

const Right = styled.div`
  display: flex;
  align-items: start;
`;

const DetailButton = styled.button`
  padding: 8px 12px;
  color: #374151;
  background-color: #f9fafb;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
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
