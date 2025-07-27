import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import SmallBanner from '../Banner/SmallBanner';

function MainInfo() {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:8080/user', {
          withCredentials: true,
        });

        // 샘플 주문 데이터
        const sampleOrders = [
          {
            orderId: 1,
            imageUrl: '/images/sample1.jpg',
            tag: '정기구독',
            productName: '무릎담요 (베이지)',
            originalPrice: 25000,
            discountPrice: 17500,
            count: 1,
            shippingFee: 3000,
            status: '배송완료',
          },
          {
            orderId: 2,
            imageUrl: '/images/sample2.jpg',
            tag: '일반구매',
            productName: '달무드등',
            originalPrice: 18000,
            discountPrice: 14500,
            count: 2,
            shippingFee: 2500,
            status: '배송중',
          },
        ];

        setUser(userRes.data);
        setOrders(sampleOrders); // 여기를 샘플 데이터로 설정
      } catch (error) {
        console.error('데이터 불러오기 실패', error);
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

        <OrderTable>
          <thead>
            <tr>
              <th>상품정보</th>
              <th>배송비</th>
              <th>진행상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>
                  <ProductBox>
                    <img src={order.imageUrl} alt="상품 이미지" />
                    <div>
                      <ProductTag>{order.tag || '기본구매'}</ProductTag>
                      <div>{order.productName}</div>
                      <PriceInfo>
                        <del>{order.originalPrice.toLocaleString()}원</del>{' '}
                        <strong>
                          {order.discountPrice.toLocaleString()}원
                        </strong>{' '}
                        / 수량 {order.count}개
                      </PriceInfo>
                    </div>
                  </ProductBox>
                </td>
                <td>{order.shippingFee.toLocaleString()}원</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </OrderTable>
      </MainContent>
    </Wrapper>
  );
}

export default MainInfo;

const Wrapper = styled.div`
  display: flex;
  max-width: 1200px;
  font-family: 'Noto Sans KR', sans-serif;
  flex-direction: column; /* 세로 배치 */
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px 0 0 0;
`;

const TopInfoBox = styled.div`
  display: flex;
  border: 1px solid #ccc;
  margin-bottom: 24px;
  background: #f4f4f4;
`;

const InfoItem = styled.div`
  flex: 1;
  padding: 20px;
  border-right: 1px solid #ccc;
  text-align: center;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &:last-child {
    border-right: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #222;
  padding-bottom: 6px;
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 16px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  th {
    background: #f5f5f5;
  }
`;

const ProductBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 1px solid #ccc;
  }
`;

const ProductTag = styled.div`
  display: inline-block;
  background: #0d6efd;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 4px;
`;

const PriceInfo = styled.div`
  margin-top: 4px;
  color: #e60023;

  del {
    color: #999;
    margin-right: 8px;
  }

  strong {
    font-weight: bold;
  }
`;
