import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled, { css } from 'styled-components';

const Coupon = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [expiredCoupons, setExpiredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await axios.get('/api/coupons/view', {
          signal: controller.signal,
        });
        console.log(res.data);

        setAvailableCoupons(res.data ?? []);
        // setExpiredCoupons(res.data.expired ?? []);
      } catch (e) {
        if (e?.name !== 'CanceledError') {
          console.error(e);
          setAvailableCoupons([]);
          setExpiredCoupons([]);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const renderAmount = (amt) => {
    const n = Number(amt);
    return Number.isFinite(n) ? `${n.toLocaleString()}원 할인` : '할인';
  };

  const renderMinimum = (min) => {
    const n = Number(min);
    return Number.isFinite(n) && n > 0
      ? `${n.toLocaleString()}원 이상 구매 시 사용 가능`
      : '제한 없음';
  };

  const currentList =
    activeTab === 'available' ? availableCoupons : expiredCoupons;

  const emptyMsg =
    activeTab === 'available'
      ? '사용 가능한 쿠폰이 없습니다.'
      : '만료된 쿠폰이 없습니다.';

  return (
    <Container>
      <Title>쿠폰</Title>

      <TabContainer>
        <TabButton
          type="button"
          active={activeTab === 'available'}
          onClick={() => setActiveTab('available')}
        >
          이용 가능 <Count>{availableCoupons.length}</Count>
        </TabButton>
        <TabButton
          type="button"
          active={activeTab === 'expired'}
          onClick={() => setActiveTab('expired')}
        >
          만료됨 <Count>{expiredCoupons.length}</Count>
        </TabButton>
      </TabContainer>

      {loading ? (
        <Message>불러오는 중...</Message>
      ) : currentList.length === 0 ? (
        <Message>{emptyMsg}</Message>
      ) : (
        <CouponList>
          {currentList.map((c) => (
            <CouponCard key={c.id} aria-disabled={activeTab === 'expired'}>
              <CouponName>{c.name}</CouponName>
              <CouponDiscount>{renderAmount(c.couponAmount)}</CouponDiscount>
              <CouponCondition>{renderMinimum(c.minimum)}</CouponCondition>
              {activeTab === 'available' ? (
                <CouponExpire>
                  {formatDate(c.expiresAt)} 까지 사용 가능
                </CouponExpire>
              ) : (
                <CouponExpire>만료일: {formatDate(c.expiresAt)}</CouponExpire>
              )}
            </CouponCard>
          ))}
        </CouponList>
      )}
    </Container>
  );
};

export default Coupon;

const Container = styled.div`
  max-width: 1000px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 15px 0;
  font-size: 16px;
  font-weight: 700;
  color: #888;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-bottom: none;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  ${({ active }) =>
    active &&
    css`
      color: #333;
      background-color: #fff;
      border-bottom: 1px solid #fff;
      position: relative;
      top: 1px;
    `}
`;

const Count = styled.span`
  margin-left: 6px;
  color: #666;
`;

const Message = styled.div`
  font-size: 1rem;
  color: #666;
  text-align: center;
  padding: 2rem 0;
`;

const CouponList = styled.div`
  display: flex; /* Flexbox로 변경하여 내부 아이템 정렬 용이 */
  flex-direction: column; /* 세로 방향으로 아이템 쌓기 */
  gap: 16px;
`;

const CouponCard = styled.div`
  width: 100%;
  max-width: 720px; /* 필요에 따라 640~800px 조정 */
  margin: 0 auto; /* 가운데 정렬 */
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CouponName = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  line-height: 1.35;
  word-break: keep-all;
  overflow-wrap: anywhere; /* 긴 이름 대응 */
`;

const CouponDiscount = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #e53935;
`;

const CouponCondition = styled.div`
  font-size: 0.92rem;
  color: #5f6b7a;
`;

const CouponExpire = styled.div`
  font-size: 0.88rem;
  color: #8b95a1;
  margin-top: 2px;
`;
