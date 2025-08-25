import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled from 'styled-components';

const Coupon = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        // TODO: 실제 서버 연동 시
        // const res = await axios.get('/api/coupons/my');
        // if (!cancel) setCoupons(res.data);

        // 더미 데이터
        const dummy = [
          {
            id: 1,
            name: '신규가입 3,000원 할인',
            discountAmount: 3000,
            minimum: 10000,
            expireDate: '2025-08-22',
          },
          {
            id: 2,
            name: '여름 맞이 10% 할인',
            discountRate: 10,
            minimum: 20000,
            expireDate: '2025-09-01',
          },
        ];
        if (!cancel) setCoupons(dummy);
      } catch (e) {
        console.error(e);
        if (!cancel) setCoupons([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <Container>
      <Title>내 쿠폰</Title>

      {loading ? (
        <Message>불러오는 중...</Message>
      ) : coupons.length === 0 ? (
        <Message>사용 가능한 쿠폰이 없습니다.</Message>
      ) : (
        <CouponList>
          {coupons.map((c) => (
            <CouponCard key={c.id}>
              <CouponName>{c.name}</CouponName>
              {c.discountAmount ? (
                <CouponDiscount>
                  {c.discountAmount.toLocaleString()}원 할인
                </CouponDiscount>
              ) : (
                <CouponDiscount>{c.discountRate}% 할인</CouponDiscount>
              )}
              <CouponCondition>
                {c.minimum.toLocaleString()}원 이상 구매 시 사용 가능
              </CouponCondition>
              <CouponExpire>
                {formatDate(c.expireDate)} 까지 사용 가능
              </CouponExpire>
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
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const Message = styled.div`
  font-size: 1rem;
  color: #666;
  text-align: center;
  padding: 2rem 0;
`;

const CouponList = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

const CouponCard = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CouponName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const CouponDiscount = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #e53935;
`;

const CouponCondition = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const CouponExpire = styled.div`
  font-size: 0.85rem;
  color: #888;
`;
