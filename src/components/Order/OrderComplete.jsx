import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';

function OrderComplete() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/orders/${orderId}/complete-info`
        );
        console.log(response.data);
        setOrderInfo(response.data);
      } catch (err) {
        console.error('주문 정보 불러오기 실패:', err);
        setError('주문 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [orderId]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoMyPage = () => {
    navigate('/mypage');
  };

  if (loading) return <Container>주문 정보를 불러오는 중입니다...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <Title>주문이 완료되었습니다!</Title>
      <Message>감사합니다. 주문이 정상적으로 접수되었습니다.</Message>

      {orderInfo && (
        <>
          <Section>
            <SectionTitle>주문 정보</SectionTitle>
            <InfoItem>
              <strong>주문번호:</strong> {orderInfo.orderId}
            </InfoItem>
            <InfoItem>
              <strong>주문일시:</strong>{' '}
              {new Date(orderInfo.orderDate).toLocaleString('ko-KR')}
            </InfoItem>
            <InfoItem>
              <strong>상품명:</strong> {orderInfo.orderName}
            </InfoItem>
            <InfoItem>
              <strong>수량:</strong> {orderInfo.itemCount}
            </InfoItem>
            <InfoItem>
              <strong>총 결제금액:</strong>{' '}
              {orderInfo.totalAmount.toLocaleString()}원
            </InfoItem>
          </Section>

          <Section>
            <SectionTitle>구매자 정보</SectionTitle>
            <InfoItem>
              <strong>이름:</strong> {orderInfo.name || '정보 없음'}
            </InfoItem>
            <InfoItem>
              <strong>전화번호:</strong> {orderInfo.phoneNumber || '정보 없음'}
            </InfoItem>
            <InfoItem>
              <strong>이메일:</strong> {orderInfo.email || '정보 없음'}
            </InfoItem>
          </Section>

          {/* <Section>
            <SectionTitle>배송지 정보</SectionTitle>
            <InfoItem>
              <strong>수령인:</strong> {orderInfo.recipient || '정보 없음'}
            </InfoItem>
            <InfoItem>
              <strong>우편번호:</strong> {orderInfo.zoneCode || '정보 없음'}
            </InfoItem>
            <InfoItem>
              <strong>주소:</strong> {orderInfo.baseAddress || ''}{' '}
              {orderInfo.detailAddress || ''}
            </InfoItem>
            <InfoItem>
              <strong>전화번호:</strong> {orderInfo.phone || '정보 없음'}
            </InfoItem>
            <InfoItem>
              <strong>보조전화번호:</strong> {orderInfo.subPhone || '정보 없음'}
            </InfoItem>
            <InfoItem>
              <strong>배송상태:</strong>{' '}
              {orderInfo.deliveryStatus || '정보 없음'}
            </InfoItem>
          </Section> */}
        </>
      )}

      <ButtonWrapper>
        <Button onClick={handleGoHome}>홈으로</Button>
        <Button onClick={handleGoMyPage}>마이페이지</Button>
      </ButtonWrapper>
    </Container>
  );
}

export default OrderComplete;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 20px 0 10px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 40px;
`;

const Section = styled.div`
  background: #f9fafc;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  width: 100%;
  max-width: 560px;
  text-align: left;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #333;
`;

const InfoItem = styled.p`
  font-size: 16px;
  color: #000;
  margin-bottom: 8px;
`;

const ButtonWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #43a047;
  }
`;
