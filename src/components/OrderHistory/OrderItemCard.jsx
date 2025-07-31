// OrderItemCard.jsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const OrderItemCard = ({ item, orderId, orderStatus }) => {
  const navigate = useNavigate();

  const status = String(item?.status ?? '').toUpperCase();
  const statusMap = {
    TEMPORARY: '임시주문',
    ORDERED: '주문접수',
    PAID: '결제완료',
    CANCELED: '주문취소',
    RETURNED: '반품',
    REFUND_REQUESTED: '환불신청',
    REFUNDED: '환불완료',
  };
  const statusText = statusMap[status] || status;

  const orderSt = String(orderStatus ?? '').toUpperCase();
  const itemRefundSt = String(item?.refundStatus ?? 'NONE').toUpperCase();
  const canRequestRefund = orderSt === 'PAID' && itemRefundSt === 'NONE';

  const deliverSt = String(item?.deliverState ?? '').toUpperCase();
  const canWriteReview = deliverSt === 'DELIVERED';

  const goToRefundPage = () => {
    navigate(
      `/mypage/orders/${orderId}/items/${item.orderItemId}/registerRefund`
    );
  };

  const goToReviewPage = () => {
    navigate(
      `/mypage/orders/${orderId}/items/${item.orderItemId}/registerReview`
    );
  };

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
        <Price>{(item.orderPrice * item.count).toLocaleString()}원</Price>
      </Info>
      <ButtonGroup>
        <StatusText>{statusText}</StatusText>
        {canRequestRefund && (
          <RefundButton onClick={goToRefundPage}>환불 신청</RefundButton>
        )}
        {canWriteReview && (
          <ReviewButton onClick={goToReviewPage}>리뷰 작성하기</ReviewButton>
        )}
      </ButtonGroup>
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

const StatusText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151; /* 글자색만 */
`;

const RefundButton = styled.button`
  font-size: 0.9rem;
  font-weight: 600;
  padding: 8px 14px;
  border: 1.5px solid rgb(105, 111, 148); /* 테두리 색상 */
  border-radius: 8px;
  cursor: pointer;
  align-items: center;
  background: transparent; /* 배경 투명 */
  color: rgb(105, 111, 148); /* 글자색 */
  height: fit-content;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(105, 111, 148, 0.1); /* hover 시 살짝 배경 강조 */
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: flex-end;
`;

const ReviewButton = styled.button`
  font-size: 0.9rem;
  font-weight: 600;
  padding: 8px 14px;
  border: 1.5px solid #4b5563;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  color: #4b5563;
  height: fit-content;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(75, 85, 99, 0.1);
  }
`;
