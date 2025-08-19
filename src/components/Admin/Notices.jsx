import React from 'react';
import styled from 'styled-components';

function Notices() {
  return (
    <Wrap>
      <Actions>
        <button>새 공지 작성</button>
      </Actions>
      <List>
        <Item>
          <strong>시스템 점검 안내</strong>
          <small>2025-08-18</small>
        </Item>
        <Item>
          <strong>신규 기능 출시</strong>
          <small>2025-08-10</small>
        </Item>
      </List>
    </Wrap>
  );
}

export default Notices;

const Wrap = styled.div`
  display: grid;
  gap: 12px;
  h2 {
    margin: 0;
    font-size: 18px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  button {
    all: unset;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    background: #25324d;
    color: #fff;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafc;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 12px;
  border-radius: 10px;
  small {
    color: #6b7280;
  }
`;
