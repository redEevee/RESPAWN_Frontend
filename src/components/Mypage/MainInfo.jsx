import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../../api/axios';
import SmallBanner from '../Banner/SmallBanner';

function MainInfo() {
  const [user, setUser] = useState({});
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:8080/user');
        const orderRes = await axios.get(
          'http://localhost:8080/api/orders/latest'
        );
        setUser(userRes.data);
        setLatestOrder(orderRes.data);
      } catch (error) {
        console.error('유저 또는 주문 정보 불러오기 실패', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Wrapper>
      <SmallBanner />
      <MainContent>
        <TopInfoBox>
          <InfoItem>
            <label>정기구독</label>
            <span>구독내역 없음</span>
          </InfoItem>
          <InfoItem>
            <label>회원등급</label>
            <span>{user.role === 'ROLE_USER' ? '구매자' : '관리자'}</span>
          </InfoItem>
          <InfoItem>
            <label>적립금</label>
            <span>0 P</span>
          </InfoItem>
        </TopInfoBox>

        <SectionTitle>주문배송조회</SectionTitle>

        {latestOrder ? (
          <OrderCardWrapper>
            <OrderHeader>
              <OrderDate>
                {new Date(latestOrder.orderDate).toLocaleDateString()}
              </OrderDate>
              <OrderNumber>주문번호: {latestOrder.orderId}</OrderNumber>
            </OrderHeader>

            {latestOrder.items.map((item) => (
              <OrderItemCard key={item.orderItemId}>
                <ItemImage src={item.imageUrl} alt={item.itemName} />
                <ItemInfo>
                  <ItemName>{item.itemName}</ItemName>
                  <ItemCount>{item.count}개</ItemCount>
                  <ItemPrice>
                    {(item.price * item.count).toLocaleString()}원
                  </ItemPrice>
                </ItemInfo>
              </OrderItemCard>
            ))}

            <OrderTotal>
              총 결제 금액: {latestOrder.totalAmount.toLocaleString()}원
            </OrderTotal>
          </OrderCardWrapper>
        ) : (
          <NoOrderText>최근 주문 내역이 없습니다.</NoOrderText>
        )}
      </MainContent>
    </Wrapper>
  );
}

export default MainInfo;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
  padding: 20px;
`;

const MainContent = styled.div`
  margin-top: 20px;
`;

const TopInfoBox = styled.div`
  display: flex;
  border: 1px solid #ccc;
  background: #f4f4f4;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  flex: 1;
  padding: 20px;
  text-align: center;
  border-right: 1px solid #ccc;

  &:last-child {
    border-right: none;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #222;
  padding-bottom: 6px;
`;

const OrderCardWrapper = styled.div`
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 20px;
  background-color: #fafafa;
`;

const OrderHeader = styled.div`
  margin-bottom: 12px;
  color: #555;
  font-size: 0.9rem;
`;

const OrderDate = styled.div`
  margin-bottom: 4px;
`;

const OrderNumber = styled.div`
  font-weight: 600;
`;

const OrderItemCard = styled.div`
  display: flex;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: #fff;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-right: 16px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.span`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 6px;
`;

const ItemCount = styled.span`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
`;

const ItemPrice = styled.span`
  font-weight: 700;
  color: #e60023;
`;

const OrderTotal = styled.div`
  text-align: right;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 16px;
`;

const NoOrderText = styled.p`
  color: #999;
  text-align: center;
  font-size: 1rem;
`;
