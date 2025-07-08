import React, { useState } from 'react';
import styled from 'styled-components';

const LoginPage = () => {
  const [userType, setUserType] = useState('buyer'); // 'buyer' or 'seller'
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`[${userType}] 로그인 시도:`, { id, pw });
  };

  return (
    <Container>
      <LoginBox>
        <TabHeader>
          <Tab
            active={userType === 'buyer'}
            onClick={() => setUserType('buyer')}
          >
            구매회원 로그인
          </Tab>
          <Tab
            active={userType === 'seller'}
            onClick={() => setUserType('seller')}
          >
            판매회원 로그인
          </Tab>
        </TabHeader>

        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
          <Button type="submit">로그인</Button>
        </form>
      </LoginBox>
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
`;

const LoginBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
`;

const TabHeader = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 0;
  background: ${({ active }) => (active ? '#fff' : '#f1f1f1')};
  border: none;
  border-bottom: ${({ active }) =>
    active ? '2px solid rgb(105, 111, 148);' : '1px solid #ddd'};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  cursor: pointer;
  border-radius: 8px 8px 0 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 15px;
  background: transparent;

  &:focus {
    outline: none;
    border-bottom: 2px solid rgb(105, 111, 148);
  }
`;

const Button = styled.button`
  width: 100%;
  background: rgb(105, 111, 148);
  color: white;
  padding: 14px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgb(105, 111, 148);
  }
`;
