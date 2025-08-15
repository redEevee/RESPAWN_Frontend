import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from '../../components/common/Logo';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const FindPwInputStep = ({ onComplete }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('phone');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (!username.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }

    try {
      let requestData = { name, username };
      let res;

      if (mode === 'phone') {
        if (!/^\d{11}$/.test(phoneNumber)) {
          return setError('올바른 전화번호를 입력해주세요.');
        }
        requestData.phoneNumber = phoneNumber;
      } else {
        if (!/\S+@\S+\.\S+/.test(email)) {
          return setError('올바른 이메일을 입력해주세요.');
        }
        requestData.email = email;
      }

      res = await axios.post('/find-password', requestData);

      if (res.data) {
        const receivedPhoneNumber = res.data.phoneNumber;
        const receivedEmail = res.data.email;
        sessionStorage.setItem('userId', res.data.userId);
        onComplete({
          name,
          phoneNumber: receivedPhoneNumber,
          email: receivedEmail,
        });
      } else {
        setError(res.data?.message || '조회 실패');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <TopBar>
        <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>
      </TopBar>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <Box>
        <Title>비밀번호 찾기</Title>
        <TabWrapper>
          <Tab isActive={mode === 'phone'} onClick={() => setMode('phone')}>
            전화번호로 찾기
          </Tab>
          <Tab isActive={mode === 'email'} onClick={() => setMode('email')}>
            이메일로 찾기
          </Tab>
        </TabWrapper>
        <InputGroup>
          <Label>이름</Label>
          <Input
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>아이디</Label>
          <Input
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputGroup>

        {mode === 'phone' ? (
          <InputGroup>
            <Label>전화번호</Label>
            <Input
              placeholder="예: 01012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </InputGroup>
        ) : (
          <InputGroup>
            <Label>이메일</Label>
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
        )}

        {error && <Message>{error}</Message>}
        <SubmitButton onClick={handleSubmit}>비밀번호 찾기</SubmitButton>
      </Box>
    </Container>
  );
};

export default FindPwInputStep;

const Container = styled.div`
  min-height: 100vh;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
`;

const LogoWrapper = styled.div`
  width: 100%;
  max-width: 460px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;

  & > div img {
    height: 70px;
    object-fit: contain;
  }
`;

const TopBar = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 10px 0 5px 10px;
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: rgb(105, 111, 148);
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;

  &:hover {
    background: rgba(105, 111, 148, 0.1);
  }
`;

const Box = styled.div`
  background: white;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 28px;
  text-align: center;
`;

const TabWrapper = styled.div`
  display: flex;
  border-bottom: 2px solid #ddd;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  flex: 1;
  background: none;
  border: none;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.isActive ? 'rgb(105, 111, 148)' : '#888')};
  border-bottom: ${(props) =>
    props.isActive ? '3px solid rgb(105, 111, 148)' : '3px solid transparent'};
  cursor: pointer;
  transition: color 0.25s ease, border-bottom 0.25s ease;

  &:hover {
    color: rgb(105, 111, 148);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 12px 14px;
  font-size: 16px;
  border: none;
  border-bottom: 1px solid #ccc;
  background: transparent;

  &:focus {
    outline: none;
    border-bottom: 2px solid rgb(105, 111, 148);
  }

  &::placeholder {
    color: #a3a9c1;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background: rgb(105, 111, 148);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.25s ease;
  margin-top: 4px;

  &:hover {
    background: rgb(85, 90, 130);
  }
`;

const Message = styled.p`
  color: #d93025;
  font-size: 14px;
  margin-top: 12px;
  text-align: center;
  font-weight: 600;
`;
