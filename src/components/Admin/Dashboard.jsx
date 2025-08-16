import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

function Dashboard() {
  return (
    <>
      <Global />
      <Container>
        <Sidebar>
          <Logo>RESPAWN Admin</Logo>
          <Nav>
            <NavItem data-active="true"> 대시보드</NavItem>
            <NavItem> 회원 관리</NavItem>
            <NavItem> 공지</NavItem>
            <NavItem> 문의</NavItem>
            <NavItem> 설정</NavItem>
          </Nav>
          <SideFooter>RESPAWN</SideFooter>
        </Sidebar>

        <Main>
          <Header>
            <Title>대시보드</Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Search>
                <input placeholder="검색 ( / )" />
              </Search>
              <Avatar />
            </div>
          </Header>

          <Content>
            <KPIGrid>
              <Card>
                <CardTitle>이용 회원 수</CardTitle>
                <KPIValue>1512명</KPIValue>
              </Card>
              <Card>
                <CardTitle>주문 수</CardTitle>
                <KPIValue>328건</KPIValue>
              </Card>
              <Card>
                <CardTitle>신규 회원</CardTitle>
                <KPIValue>
                  24명 <Trend type="up">+3.1%</Trend>
                </KPIValue>
              </Card>
              <Card>
                <CardTitle>미해결 문의</CardTitle>
                <KPIValue>7건</KPIValue>
              </Card>
            </KPIGrid>

            <RowGrid>
              <Card>
                <CardTitle>최근 주문</CardTitle>
                <List>
                  <Item>
                    <span>#1029 · 박**</span>
                    <small>₩58,000</small>
                  </Item>
                  <Item>
                    <span>#1028 · 이**</span>
                    <small>₩112,000</small>
                  </Item>
                  <Item>
                    <span>#1027 · 김**</span>
                    <small>₩34,000</small>
                  </Item>
                  <Item>
                    <span>#1026 · 최**</span>
                    <small>₩210,000</small>
                  </Item>
                </List>
              </Card>

              <Card>
                <CardTitle>알림</CardTitle>
                <List>
                  <Item>
                    <span>문의 수</span>
                    <small>13</small>
                  </Item>
                  <Item>
                    <span>홈페이지 업데이트</span>
                    <small>공지</small>
                  </Item>
                </List>
              </Card>

              <Card>
                <CardTitle>빠른 만들기</CardTitle>
                <Quick>
                  <button>배너 교체</button>
                  <button>공지 작성</button>
                </Quick>
              </Card>
            </RowGrid>
            <RowGrid>
              <Card>
                <CardTitle>보안 현황</CardTitle>
                <MiniTable>
                  <tbody>
                    <tr>
                      <td>2FA 적용률</td>
                      <td className="right">
                        <strong>82%</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>실패 로그인(24h)</td>
                      <td className="right">
                        <strong>12회</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>권한 변경(7d)</td>
                      <td className="right">
                        <strong>5건</strong>
                      </td>
                    </tr>
                  </tbody>
                </MiniTable>
              </Card>

              <Card>
                <CardTitle>시스템 연동 상태</CardTitle>
                <MiniTable>
                  <thead>
                    <tr>
                      <th>서비스</th>
                      <th className="right">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>결제</td>
                      <td className="right">
                        <StatBadge type="ok">정상</StatBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>푸시/SMS</td>
                      <td className="right">
                        <StatBadge type="ok">정상</StatBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>스토리지</td>
                      <td className="right">
                        <StatBadge type="warn">지연</StatBadge>
                      </td>
                    </tr>
                  </tbody>
                </MiniTable>
              </Card>

              <Card>
                <CardTitle>감사 로그(최근)</CardTitle>
                <MiniTable>
                  <thead>
                    <tr>
                      <th>시간</th>
                      <th>이벤트</th>
                      <th className="right">사용자</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>12:21</td>
                      <td>역할 변경: CS → Manager</td>
                      <td className="right">admin01</td>
                    </tr>
                    <tr>
                      <td>11:55</td>
                      <td>배너 수정</td>
                      <td className="right">marketer</td>
                    </tr>
                    <tr>
                      <td>11:10</td>
                      <td>회원 비활성화</td>
                      <td className="right">ops02</td>
                    </tr>
                  </tbody>
                </MiniTable>
              </Card>
            </RowGrid>
            {/* 추가 섹션 끝 */}
          </Content>
        </Main>
      </Container>
    </>
  );
}

export default Dashboard;

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

const NavItem = styled.button`
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
  &[data-active='true'] {
    background: linear-gradient(
      180deg,
      rgba(37, 50, 77, 0.08),
      rgba(37, 50, 77, 0.04)
    );
    border: 1px solid ${colors.accentBorder};
    color: ${colors.accent};
  }
`;

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

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.section`
  background: ${colors.card};
  border: 1px solid ${colors.border};
  border-radius: 14px;
  padding: 14px 16px;
  transition: 160ms ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  }
`;

const CardTitle = styled.div`
  font-size: 13px;
  color: ${colors.textMute};
  margin-bottom: 8px;
`;

const KPIValue = styled.div`
  font-size: 26px;
  font-weight: 800;
  color: ${colors.text};
`;

const Trend = styled.span`
  font-size: 12px;
  margin-left: 8px;
  color: ${(p) => (p.type === 'up' ? colors.success : colors.danger)};
`;

const RowGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.3fr 1fr;
  gap: 16px;
  margin-top: 16px;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.cardAlt};
  border: 1px solid ${colors.border};
  padding: 12px;
  border-radius: 12px;
  small {
    color: ${colors.textMute};
  }
`;

const Quick = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  button {
    all: unset;
    text-align: center;
    padding: 12px 10px;
    cursor: pointer;
    background: linear-gradient(
      180deg,
      rgba(37, 50, 77, 0.12),
      rgba(37, 50, 77, 0.06)
    );
    color: ${colors.accent};
    border: 1px solid ${colors.accentBorder};
    border-radius: 12px;
    transition: 160ms ease;
  }
  button:hover {
    filter: brightness(0.98);
    transform: translateY(-1px);
  }
`;

/* 관리자 전용 추가 컴포넌트 */
const MiniTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 10px 8px;
    border-bottom: 1px solid ${colors.border};
    font-size: 13px;
  }
  th {
    color: ${colors.textMute};
    text-align: left;
  }
  td.right,
  th.right {
    text-align: right;
  }
`;

const StatBadge = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: ${colors.card};
  background: ${(props) =>
    props.type === 'ok'
      ? '#16A34A'
      : props.type === 'warn'
      ? '#B45309'
      : '#DC2626'};
`;
