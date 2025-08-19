import React from 'react';
import styled from 'styled-components';

function Dashboard() {
  return (
    <>
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
    </>
  );
}

export default Dashboard;

/* 필요한 최소 스타일만 포함 */
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
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
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
  color: #6b7280;
  margin-bottom: 8px;
`;

const KPIValue = styled.div`
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
`;

const Trend = styled.span`
  font-size: 12px;
  margin-left: 8px;
  color: ${(p) => (p.type === 'up' ? '#166534' : '#9F1239')};
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
  background: #f9fafc;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 12px;
  border-radius: 12px;
  small {
    color: #6b7280;
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
    color: #25324d;
    border: 1px solid rgba(37, 50, 77, 0.5);
    border-radius: 12px;
    transition: 160ms ease;
  }
  button:hover {
    filter: brightness(0.98);
    transform: translateY(-1px);
  }
`;

const MiniTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 10px 8px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    font-size: 13px;
  }
  th {
    color: #6b7280;
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
  color: #ffffff;
  background: ${(p) =>
    p.type === 'ok' ? '#16A34A' : p.type === 'warn' ? '#B45309' : '#DC2626'};
`;
