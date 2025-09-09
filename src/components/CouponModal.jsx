import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';

const CouponModal = ({ onClose, onApply, orderSummary }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await axios.get('/api/coupons/view', {
          params: {
            orderId: orderSummary.orderId,
          },
        });
        console.log(res.data);
        if (!cancel) setCoupons(Array.isArray(res.data) ? res.data : []);
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

  const handleApply = async (coupon) => {
    // API 호출 중이면 중복 실행 방지
    if (isChecking) return;

    // orderId가 없으면 실행 중단 (오류 방지)
    if (!orderSummary?.orderId) {
      alert('주문 정보가 없어 쿠폰을 확인할 수 없습니다.');
      return;
    }

    setIsChecking(true); // 확인 시작

    try {
      // 백엔드의 /check API 호출
      const res = await axios.get('/api/coupons/check', {
        params: {
          orderId: orderSummary.orderId,
          code: coupon.code,
        },
      });
      console.log(res.data);

      if (res.data.usable) {
        onApply({
          coupon: coupon.code,
          discountAmount: coupon.couponAmount,
        });
      } else {
        alert(res.data.reason || '쿠폰을 적용할 수 없습니다.');
      }
    } catch (e) {
      console.error('쿠폰 적용 확인 중 오류 발생:', e);
      alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsChecking(false); // 확인 종료
    }
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
                  <CouponName>{c.coupon.name}</CouponName>
                  <CouponCondition>
                    {c.coupon.couponAmount.toLocaleString()}원
                  </CouponCondition>
                  <CouponExpire>
                    {c.coupon.expiresAt} 까지 사용 가능
                  </CouponExpire>
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
