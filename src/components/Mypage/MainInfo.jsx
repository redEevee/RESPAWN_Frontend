import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../../api/axios';
import SmallBanner from '../Banner/SmallBanner';
import OrderCard from '../OrderHistory/OrderCard';

function MainInfo() {
  const [user, setUser] = useState({});
  const [latestOrder, setLatestOrder] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:8080/user');
        const orderRes = await axios.get(
          'http://localhost:8080/api/orders/latest'
        );
        const pointsRes = await axios.get(
          'http://localhost:8080/api/points/total/active',
          {
            withCredentials: true, // 세션/쿠키 인증 시 필요
          }
        );
        setPoints(pointsRes.data);
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
            <label>쿠폰</label>
            <span>0 개</span>
          </InfoItem>
          <InfoItem>
            <label>회원등급</label>
            <span>{user.role === 'ROLE_USER' ? '구매자' : '관리자'}</span>
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

const NoOrderText = styled.p`
  color: #999;
  text-align: center;
  font-size: 1rem;
`;
