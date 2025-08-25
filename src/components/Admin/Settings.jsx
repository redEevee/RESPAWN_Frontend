import React from 'react';
import styled from 'styled-components';

function Settings() {
  return (
    <Wrap>
      <Section>
        <h3>일반</h3>
        <Row>
          <label>사이트 이름</label>
          <input defaultValue="RESPAWN" />
        </Row>
        <Row>
          <label>관리자 이메일</label>
          <input defaultValue="admin@respawn.example" />
        </Row>
        <Actions>
          <button>저장</button>
        </Actions>
      </Section>

      <Section>
        <h3>보안</h3>
        <Row>
          <label>2FA 강제</label>
          <input type="checkbox" defaultChecked />
        </Row>
        <Row>
          <label>세션 타임아웃(분)</label>
          <input type="number" defaultValue={30} min={5} />
        </Row>
        <Actions>
          <button>저장</button>
        </Actions>
      </Section>
    </Wrap>
  );
}

export default Settings;

const Wrap = styled.div`
  display: grid;
  gap: 16px;
  h2 {
    margin: 0;
    font-size: 18px;
  }
`;

const Section = styled.section`
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 16px;
  h3 {
    margin: 0 0 12px;
    font-size: 16px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
  label {
    color: #374151;
  }
  input[type='text'],
  input[type='number'] {
    padding: 8px 10px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    border-radius: 8px;
  }
`;

const Actions = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  button {
    all: unset;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    background: #25324d;
    color: #fff;
  }
`;
