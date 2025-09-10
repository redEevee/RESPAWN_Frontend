import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import axios from '../../api/axios';
import SmallBanner from '../Banner/SmallBanner';
import OrderCard from './OrderHistory/OrderCard';
import Pagination from '../Pagination';

const ORDERS_PER_PAGE = 3;

function MainInfo() {
  const [user, setUser] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [userRes, orderRes] = await Promise.allSettled([
          axios.get('/myPage/summary', { signal: controller.signal }),
          axios.get('/api/orders/history/recent-month', {
            signal: controller.signal,
          }),
        ]);

        if (!active) return;

        console.log('userRes', userRes.value.data);
        console.log('orderRes', orderRes.value.data);

        // user 처리
        if (userRes.status === 'fulfilled') {
          setUser(userRes.value.data.result);
        }

        // orders 처리: 배열 -> 최신 1건 선택
        if (orderRes.status === 'fulfilled') {
          const orders = Array.isArray(orderRes.value.data)
            ? orderRes.value.data
            : [];
          setRecentOrders(orders);
          setCurrentPage(1);
        }
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

  // 정렬: 최신 주문이 먼저
  const sortedOrders = useMemo(
    () =>
      recentOrders
        .slice()
        .sort(
          (a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        ),
    [recentOrders]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOrders.length / ORDERS_PER_PAGE)
  );
  const startIdx = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIdx = startIdx + ORDERS_PER_PAGE;
  const currentOrders = sortedOrders.slice(startIdx, endIdx);

  // totalPages가 줄어든 경우 페이지 보정
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

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
            <span>{user.couponCount} 개</span>
          </InfoItem>
          <InfoItem>
            <label>회원등급</label>
            <span>{user.grade}</span>
          </InfoItem>
          <InfoItem>
            <label>적립금</label>
            <span>{user.activePoint} P</span>
          </InfoItem>
        </TopInfoBox>

        <SectionTitle>주문배송조회</SectionTitle>

        {sortedOrders.length > 0 ? (
          <>
            {currentOrders.map((o) => (
              <OrderCard key={o.orderId} order={o} />
            ))}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
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
