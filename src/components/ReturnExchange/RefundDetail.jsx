import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled from 'styled-components';

const RefundDetail = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getKoreanStatus = (status) => {
    switch (status) {
      case 'REQUESTED':
        return '환불 요청됨';
      case 'REFUNDED':
        return '환불 완료';
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/orders/refund-requests');
        setRefunds(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            '환불 내역을 불러오는 중 오류가 발생했습니다.'
        );
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  if (loading) return <Container>로딩중...</Container>;
  if (error) return <Container>에러: {error}</Container>;

  return (
    <Container>
      <Title>내 환불 요청 내역</Title>
      {refunds.length === 0 && <NoData>환불 요청 내역이 없습니다.</NoData>}
      {refunds.map((order) => (
        <div key={order.orderId}>
          {order.items.map((item) => (
            <RefundCard key={item.orderItemId}>
              <Header>
                <OrderInfo>
                  <p>주문번호: {order.orderId}</p>
                  <p>
                    주문일:{' '}
                    {new Date(order.orderDate).toLocaleDateString('ko-KR')}
                  </p>
                </OrderInfo>
                <StatusBadge status={item.refundStatus}>
                  {getKoreanStatus(item.refundStatus)}
                </StatusBadge>
              </Header>

              <ProductSection>
                <ProductImage src={item.imageUrl} alt={item.itemName} />
                <ProductDetails>
                  <h4>{item.itemName}</h4>
                  <p>수량: {item.count}개</p>
                  <p>
                    총 가격:{' '}
                    <strong>
                      {(item.count * item.orderPrice).toLocaleString()}원
                    </strong>
                  </p>
                </ProductDetails>
              </ProductSection>

              <Reason>
                <p>
                  <strong>환불 사유:</strong> {item.refundReason || '-'}
                </p>
                <p>
                  <strong>상세 내용:</strong> {item.refundDetail || '-'}
                </p>
              </Reason>
            </RefundCard>
          ))}
        </div>
      ))}
    </Container>
  );
};

export default RefundDetail;

const Container = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 1rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
`;

const NoData = styled.p`
  text-align: center;
  color: #666;
`;

const RefundCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background-color: #fafafa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const OrderInfo = styled.div`
  font-size: 0.95rem;
  color: #444;
  p {
    margin: 0.2rem 0;
  }
`;

const StatusBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
  background-color: ${({ status }) => {
    switch (status) {
      case 'REQUESTED':
        return '#f39c12';
      case 'REFUNDED':
      case 'APPROVED':
        return '#27ae60';
      case 'REJECTED':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  }};
`;

const ProductSection = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
  border: 1px solid #ccc;
`;

const ProductDetails = styled.div`
  h4 {
    margin: 0 0 0.4rem 0;
    font-size: 1rem;
  }

  p {
    margin: 0.2rem 0;
    color: #555;
  }
`;

const Reason = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #444;

  p {
    margin: 0.3rem 0;
  }

  strong {
    color: #333;
  }
`;
