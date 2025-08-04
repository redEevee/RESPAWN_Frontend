import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../../../api/axios';

function OrderDetail() {
  const { orderItemId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const statusMap = {
    TEMPORARY: '임시주문',
    ORDERED: '주문접수',
    PAID: '결제완료',
    CANCELED: '주문취소',
    RETURNED: '반품',
    REFUND_REQUESTED: '환불신청',
    REFUNDED: '환불',
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(
          `/api/orders/seller/orders/${orderItemId}`
        );
        setOrder(response.data);
      } catch (error) {
        console.error('주문 상세 정보 조회 실패:', error);
      }
    };

    fetchOrderDetail();
  }, [orderItemId]);

  if (!order) return <Wrapper>로딩 중...</Wrapper>;

  return (
    <Wrapper>
      <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>
      <Title>주문서 상세 내역</Title>

      <Section>
        <SectionTitle>주문 정보</SectionTitle>
        <Table>
          <tbody>
            <tr>
              <th>주문번호</th>
              <td className="highlight">{order.orderId}</td>
              <th>주문일시</th>
              <td>{new Date(order.orderDate).toLocaleString('ko-KR')}</td>
            </tr>
            <tr>
              <th>상품명</th>
              <td className="highlight">{order.itemName}</td>
              <th>수량</th>
              <td>{order.count}</td>
            </tr>
            <tr>
              <th>총 결제금액</th>
              <td className="highlight">
                {order.totalPrice.toLocaleString()}원
              </td>
              <th>주문상태</th>
              <td>
                <StatusBadge status={order.orderStatus}>
                  {statusMap[order.orderStatus]}
                </StatusBadge>
              </td>
            </tr>
          </tbody>
        </Table>
      </Section>

      <FlexContainer>
        <Section>
          <SectionTitle>구매자 정보</SectionTitle>
          <Table>
            <tbody>
              <tr>
                <th>이름</th>
                <td>{order.buyerName || '정보 없음'}</td>
              </tr>
              <tr>
                <th>전화번호</th>
                <td>{order.buyerPhone || '정보 없음'}</td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>{order.buyerEmail || '정보 없음'}</td>
              </tr>
            </tbody>
          </Table>
        </Section>

        <Section>
          <SectionTitle>배송지 정보</SectionTitle>
          <Table>
            <tbody>
              <tr>
                <th>수령인</th>
                <td>{order.recipient || '정보 없음'}</td>
              </tr>
              <tr>
                <th>우편번호</th>
                <td>{order.zoneCode || '정보 없음'}</td>
              </tr>
              <tr>
                <th>주소</th>
                <td>
                  {order.baseAddress || ''} {order.detailAddress || ''}
                </td>
              </tr>
              <tr>
                <th>전화번호</th>
                <td>{order.phone || '정보 없음'}</td>
              </tr>
              <tr>
                <th>보조전화번호</th>
                <td>{order.subPhone || '정보 없음'}</td>
              </tr>
              <tr>
                <th>배송상태</th>
                <td>{order.deliveryStatus || '정보 없음'}</td>
              </tr>
            </tbody>
          </Table>
        </Section>
      </FlexContainer>
    </Wrapper>
  );
}

export default OrderDetail;

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 70px auto 100px;
  padding: 0 30px;
  font-family: 'Noto Sans KR', sans-serif;
  color: #000;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #000;
  margin-bottom: 40px;
  letter-spacing: -0.02em;
`;

const Section = styled.section`
  background: #fff;
  border: 1.5px solid #c3c9db;
  border-radius: 10px;
  padding: 36px 48px;
  margin-bottom: 48px;
  box-shadow: 0 6px 15px rgb(0 0 0 / 0.07);
`;

const SectionTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 28px;
  color: #000;
  border-bottom: 3px solid #696f94;
  padding-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 18px;

  th,
  td {
    padding: 20px 24px;
    font-size: 18px;
    vertical-align: middle;
  }

  th {
    width: 160px;
    font-weight: 700;
    color: #555a82;
    text-align: left;
    background: rgba(105, 111, 148, 0.1);
    border-radius: 8px 0 0 8px;
  }

  td {
    background: #f9fafc;
    border-radius: 0 8px 8px 0;
    font-weight: 600;
    color: #000;
  }

  tr {
    box-shadow: 0 1px 6px rgb(0 0 0 / 0.06);
  }

  .highlight {
    font-weight: 900;
    font-size: 20px;
    color: #000;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 48px;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #696f94;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 36px;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 18px;
  border-radius: 24px;
  font-weight: 700;
  color: white;

  background-color: ${(props) => {
    switch (props.status) {
      case 'TEMPORARY':
        return '#bdbdbd';
      case 'ORDERED':
        return '#4caf50';
      case 'PAID':
        return '#2196f3';
      case 'CANCELED':
        return '#f44336';
      case 'RETURNED':
        return '#ff9800';
      case 'REFUND_REQUESTED':
        return '#673ab7';
      case 'REFUNDED':
        return '#9c27b0';
      default:
        return '#696f94';
    }
  }};
`;
