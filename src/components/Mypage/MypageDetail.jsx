import React, { useState } from 'react';
import styled from 'styled-components';
import UserInfo from '../Mypage/UserInfo';
import MainInfo from './MainInfo';

function MypageInfo() {
  return <MainInfo />;
}

function ProfileManagement() {
  return <UserInfo />;
}

function OrderHistory() {
  return <div>주문내역 화면입니다.</div>;
}

function DeliveryTracking() {
  return <div>주문배송조회 화면입니다.</div>;
}

function Review() {
  return <div>사용후기 화면입니다.</div>;
}

function Inquiry() {
  return <div>1:1 문의 화면입니다.</div>;
}

function MypageDetail() {
  const [selectedMenu, setSelectedMenu] = useState('mypage');

  return (
    <Wrapper>
      <Sidebar>
        <MenuTitle onClick={() => setSelectedMenu('mypage')}>My Page</MenuTitle>
        <MenuList>
          <li
            className={selectedMenu === 'profile' ? 'active' : ''}
            onClick={() => setSelectedMenu('profile')}
          >
            내정보관리
          </li>
          <li
            className={selectedMenu === 'orders' ? 'active' : ''}
            onClick={() => setSelectedMenu('orders')}
          >
            주문내역
          </li>
          <li
            className={selectedMenu === 'delivery' ? 'active' : ''}
            onClick={() => setSelectedMenu('delivery')}
          >
            주문배송조회
          </li>
          <li
            className={selectedMenu === 'review' ? 'active' : ''}
            onClick={() => setSelectedMenu('review')}
          >
            사용후기
          </li>
          <li
            className={selectedMenu === 'inquiry' ? 'active' : ''}
            onClick={() => setSelectedMenu('inquiry')}
          >
            1:1 문의
          </li>
        </MenuList>
      </Sidebar>

      <MainContent>
        {selectedMenu === 'mypage' && <MypageInfo />}
        {selectedMenu === 'profile' && <ProfileManagement />}
        {selectedMenu === 'orders' && <OrderHistory />}
        {selectedMenu === 'delivery' && <DeliveryTracking />}
        {selectedMenu === 'review' && <Review />}
        {selectedMenu === 'inquiry' && <Inquiry />}
      </MainContent>
    </Wrapper>
  );
}

export default MypageDetail;

const Wrapper = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 40px auto;
  font-family: 'Noto Sans KR', sans-serif;
  /* 박스 그림자와 둥근 테두리 제거 */
  background: transparent;
  border-radius: 0;
  box-shadow: none;
`;

const Sidebar = styled.aside`
  width: 220px;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  box-sizing: border-box;
  background-color: transparent;
  color: #111;
  /* 연한 실선 (1px, 밝은 회색) */
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

const MenuTitle = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 20px;
  cursor: pointer;
  user-select: none;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: #111;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 10px 12px;
    margin-bottom: 6px;
    border-radius: 0; /* 둥근 모서리 제거 */
    cursor: pointer;
    font-weight: 500;
    font-size: 1rem;
    transition: background-color 0.15s ease, color 0.15s ease;
    user-select: none;
    color: #111;

    &.active {
      background-color: transparent; /* 배경 없음 */
      color: #2563eb; /* 파란색 글씨 강조 */
      font-weight: 700;
      box-shadow: none;
    }

    &:hover {
      background-color: #f0f4ff; /* 아주 연한 파란 배경 (부드럽게) */
      color: #2563eb;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 30px 0 0 40px;
  background-color: transparent; /* 배경 투명 */
  min-height: 600px;
  box-sizing: border-box;
  border-left: none; /* 테두리 제거 */
  border-radius: 0;
  overflow-y: auto;
  box-shadow: none;
`;
