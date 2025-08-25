import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../../api/axios';
import SmallBanner from '../Banner/SmallBanner';
import OrderCard from './OrderHistory/OrderCard';

function MainInfo() {
  const [user, setUser] = useState({});
  const [latestOrder, setLatestOrder] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [userRes, orderRes, pointsRes] = await Promise.allSettled([
          axios.get('/user', { signal: controller.signal }),
          axios.get('/api/orders/latest', { signal: controller.signal }),
          axios.get('/api/points/total/active', { signal: controller.signal }),
        ]);

        if (!active) return;

        console.log('pointsRes', pointsRes.value.data);
        console.log('userRes', userRes.value.data);
        console.log('orderRes', orderRes.value.data);

        if (userRes.status === 'fulfilled') setUser(userRes.value.data.result);
        if (orderRes.status === 'fulfilled')
          setLatestOrder(orderRes.value.data);
        if (pointsRes.status === 'fulfilled') setPoints(pointsRes.value.data);
      } catch (error) {
        console.error('유저 또는 주문 정보 불러오기 실패', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <SmallBanner />
      <MainContent>
        <TopInfoBox>
          <InfoItem>
            <label>쿠폰</label>
            <span>0 개</span>
          </InfoItem>
          <InfoItem>
            <label>회원등급</label>
            <span>{user.grade}</span>
          </InfoItem>
          <InfoItem>
            <label>적립금</label>
            <span>{points.toLocaleString()} P</span>
          </InfoItem>
        </TopInfoBox>

        <SectionTitle>주문배송조회</SectionTitle>

        {latestOrder ? (
          <OrderCard order={latestOrder} />
        ) : (
          <NoOrderText>최근 주문 내역이 없습니다.</NoOrderText>
        )}
      </MainContent>
    </Container>
  );
}

export default MainInfo;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
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
  font-size: 22px;
  margin-bottom: 20px;
  border-bottom: 2px solid #222;
  padding-bottom: 6px;
`;

const NoOrderText = styled.p`
  color: #999;
  text-align: center;
  font-size: 16px;
`;
