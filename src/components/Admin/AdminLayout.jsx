import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

function AdminLayout() {
  const { pathname } = useLocation();

  const titleMap = {
    '/admin': '대시보드',
    '/admin/members': '회원 관리',
    '/admin/notices': '공지',
    '/admin/inquiries': '문의',
    '/admin/settings': '설정',
  };
  const headerTitle = titleMap[pathname] || '관리자';

  return (
    <>
      <Global />
      <Container>
        <Sidebar>
          <Logo>RESPAWN Admin</Logo>
          <Nav>
            <NavItem to="/admin" end>
              대시보드
            </NavItem>
            <NavItem to="/admin/members">회원 관리</NavItem>
            <NavItem to="/admin/notices">공지</NavItem>
            <NavItem to="/admin/inquiries">문의</NavItem>
            <NavItem to="/admin/settings">설정</NavItem>
          </Nav>
          <SideFooter>RESPAWN</SideFooter>
        </Sidebar>

        <Main>
          <Header>
            <Title>{headerTitle}</Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Search>
                <input placeholder="검색 ( / )" />
              </Search>
              <Avatar />
            </div>
          </Header>

          <Content>
            {/* 여기서 자식 라우트가 바뀌며 화면이 전환됩니다 */}
            <Outlet />
          </Content>
        </Main>
      </Container>
    </>
  );
}

export default AdminLayout;

/* 기존 스타일 재사용 + NavLink 스타일 추가 */
const colors = {
  pageBg: '#F5F7FA',
  sidebarBg: '#EEF2F7',
  card: '#FFFFFF',
  cardAlt: '#F9FAFC',
  border: 'rgba(15, 23, 42, 0.08)',
  text: '#0F172A',
  textMute: '#6B7280',
  accent: '#25324D',
  accentBorder: 'rgba(37, 50, 77, 0.5)',
  success: '#166534',
  danger: '#9F1239',
};

const Global = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    background: ${colors.pageBg};
    color: ${colors.text};
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.aside`
  width: 248px;
  background: ${colors.sidebarBg};
  border-right: 1px solid ${colors.border};
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  color: ${colors.accent};
  padding: 8px 8px 16px;
  border-bottom: 1px dashed ${colors.border};
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
`;

/* NavItem을 NavLink로 바꾼 스타일 */
const StyledNavLink = styled(NavLink)`
  all: unset;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${colors.textMute};
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: 160ms ease;

  &:hover {
    background: ${colors.cardAlt};
    color: ${colors.text};
  }

  &.active {
    background: linear-gradient(
      180deg,
      rgba(37, 50, 77, 0.08),
      rgba(37, 50, 77, 0.04)
    );
    border: 1px solid ${colors.accentBorder};
    color: ${colors.accent};
  }
`;

// end prop으로 /admin과 /admin/* 구분
function NavItem({ to, end, children }) {
  return (
    <StyledNavLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? 'active' : undefined)}
    >
      {children}
    </StyledNavLink>
  );
}

const SideFooter = styled.div`
  margin-top: auto;
  font-size: 12px;
  color: ${colors.textMute};
  padding: 10px 12px;
  border-top: 1px dashed ${colors.border};
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.border};
  background: #ffffffaa;
  backdrop-filter: saturate(1.2) blur(2px);
`;

const Title = styled.h1`
  font-size: 18px;
  margin: 0;
  letter-spacing: 0.2px;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  input {
    width: 280px;
    background: ${colors.cardAlt};
    border: 1px solid ${colors.border};
    color: ${colors.text};
    padding: 10px 12px;
    border-radius: 10px;
    outline: none;
    transition: 160ms ease;
  }
  input::placeholder {
    color: ${colors.textMute};
  }
  input:focus {
    border-color: ${colors.accentBorder};
    box-shadow: 0 0 0 3px rgba(37, 50, 77, 0.12);
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${colors.accent};
`;

const Content = styled.div`
  padding: 20px;
  overflow: auto;
`;
