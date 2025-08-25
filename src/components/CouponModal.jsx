import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';

const CouponModal = ({ onClose, onApply /*, orderSummary*/ }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        // TODO: 서버 연동 시
        // const res = await axios.get('/api/coupons/available');
        // if (!ignore) setCoupons(Array.isArray(res.data) ? res.data : []);

        // 임시 더미 데이터
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
            name: '신규가입 5,000원 할인',
            discountAmount: 5000,
            minimum: 15000,
            expireDate: '2025-08-25',
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

  const handleApply = (coupon) => {
    onApply({
      coupon,
      discountAmount: coupon.discountAmount,
    });
  };

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>쿠폰함</Header>
        <Body>
          {loading ? (
            <div>불러오는 중...</div>
          ) : coupons.length === 0 ? (
            <div>사용 가능한 쿠폰이 없습니다.</div>
          ) : (
            coupons.map((c) => (
              <Row key={c.id}>
                <CouponInfo>
                  <CouponName>{c.name}</CouponName>
                  <CouponCondition>
                    {c.minimum.toLocaleString()}원 이상 구매 시 사용 가능
                  </CouponCondition>
                  <CouponExpire>{c.expireDate} 까지 사용 가능</CouponExpire>
                </CouponInfo>
                <SmallBtn onClick={() => handleApply(c)}>적용하기</SmallBtn>
              </Row>
            ))
          )}
        </Body>
        <Footer>
          <SmallBtn onClick={onClose}>닫기</SmallBtn>
        </Footer>
      </Modal>
    </Backdrop>
  );
};

export default CouponModal;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 520px;
  max-width: 92vw;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  font-weight: 700;
  font-size: 18px;
`;

const Body = styled.div`
  padding: 16px 20px;
  max-height: 60vh;
  overflow: auto;
`;

const Footer = styled.div`
  padding: 12px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
`;

const CouponInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CouponName = styled.div`
  font-weight: 600;
  font-size: 15px;
`;

const CouponCondition = styled.div`
  font-weight: 400;
  font-size: 13px;
  color: #666;
`;

const CouponExpire = styled.div`
  font-weight: 400;
  font-size: 13px;
  color: #999;
`;

const SmallBtn = styled.button`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
`;
