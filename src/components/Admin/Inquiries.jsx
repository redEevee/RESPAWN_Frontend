import React from 'react';
import styled from 'styled-components';

function Inquiries() {
  return (
    <Wrap>
      <Filters>
        <select defaultValue="all">
          <option value="all">전체</option>
          <option value="open">미해결</option>
          <option value="closed">해결</option>
        </select>
        <input placeholder="검색어" />
      </Filters>

      <Table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>상태</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1003</td>
            <td>환불 문의</td>
            <td>
              <Badge type="open">미해결</Badge>
            </td>
            <td>박**</td>
          </tr>
          <tr>
            <td>1002</td>
            <td>배송 지연</td>
            <td>
              <Badge type="closed">해결</Badge>
            </td>
            <td>이**</td>
          </tr>
        </tbody>
      </Table>
    </Wrap>
  );
}

export default Inquiries;

const Wrap = styled.div`
  display: grid;
  gap: 12px;
  h2 {
    margin: 0;
    font-size: 18px;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  select,
  input {
    padding: 8px 10px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    border-radius: 8px;
  }
  input {
    flex: 1;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  overflow: hidden;
  th,
  td {
    padding: 10px 8px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    font-size: 14px;
  }
  th {
    text-align: left;
    color: #6b7280;
  }
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: #fff;
  background: ${(p) => (p.type === 'open' ? '#DC2626' : '#16A34A')};
`;
