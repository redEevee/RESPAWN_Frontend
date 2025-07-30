import React from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  {
    title: 'MY 쇼핑',
    items: [{ key: 'orders', label: '주문목록/배송조회' }],
  },
  {
    title: 'MY 활동',
    items: [
      { key: 'inquiry', label: '문의하기' },
      { key: 'inquiry_history', label: '문의내역 확인' },
      { key: 'review', label: '구매후기' },
    ],
  },
  {
    title: 'MY 정보',
    items: [{ key: 'profile', label: '개인정보확인/수정' }],
  },
];

function MypageDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Wrapper>
      <Sidebar>
        <MenuTitle
          className={location.pathname === '/mypage' ? 'active' : ''}
          onClick={() => navigate('/mypage')}
        >
          My Page
        </MenuTitle>
        {menuItems.map(({ title, items }) => (
          <div key={title}>
            <SubMenuTitle>{title}</SubMenuTitle>
            <MenuList>
              {items.map(({ key, label }) => {
                const currentKey = location.pathname.split('/').pop();
                return (
                  <MenuItem
                    key={key}
                    $active={currentKey === key}
                    onClick={() => navigate(`/mypage/${key}`)}
                  >
                    {label}
                  </MenuItem>
                );
              })}
            </MenuList>
          </div>
        ))}
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </Wrapper>
  );
}

export default MypageDetail;

// Styled Components

const Wrapper = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 40px auto;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Sidebar = styled.aside`
  width: 220px;
  padding: 20px 10px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

const MenuTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: 900;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: rgb(85, 90, 130);
  }
`;

const SubMenuTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 700;
  color: #444;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  margin-bottom: 5px;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? '700' : '500')};
  font-size: 16px;
  color: ${(props) => (props.$active ? 'rgb(85, 90, 130)' : '#111')};
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &::before {
    content: '▶';
    font-size: 13px;
    color: ${(props) => (props.$active ? 'rgb(85, 90, 130)' : 'transparent')};
    transition: color 0.2s ease;
  }

  &:hover {
    background-color: #f3f6ff;
    color: rgb(85, 90, 130);

    &::before {
      color: rgb(85, 90, 130);
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 30px 40px;
  min-height: 600px;
  overflow-y: auto;
  border-radius: 8px;
`;
