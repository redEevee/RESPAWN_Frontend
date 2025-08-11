import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from '../../components/common/Logo';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const FindIdInputStep = ({ onComplete }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('phone');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    try {
      let requestData = { name };

      if (mode === 'phone') {
        if (!/^\d{11}$/.test(phoneNumber)) {
          setError('올바른 전화번호를 입력해주세요.');
          return;
        }
        requestData.phoneNumber = phoneNumber;
      } else {
        if (!/\S+@\S+\.\S+/.test(email)) {
          setError('올바른 이메일을 입력해주세요.');
          return;
        }
        requestData.email = email;
      }

      const res = await axios.post('/find-id', requestData);

      if (res.data && res.data.maskedUsername) {
        const maskedUsername = res.data.maskedUsername;
        const receivedPhoneNumber = res.data.phoneNumber;
        const receivedEmail = res.data.email;

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);

        onComplete(
          { name, phoneNumber: receivedPhoneNumber, email: receivedEmail },
          [
            {
              id: 1,
              username: maskedUsername,
            },
          ]
        );
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
        <Title>아이디 찾기</Title>

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
          <CheckInput
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>

        {mode === 'phone' ? (
          <InputGroup>
            <Label>전화번호</Label>
            <CheckInput
              type="text"
              placeholder="예: 01012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </InputGroup>
        ) : (
          <InputGroup>
            <Label>이메일</Label>
            <CheckInput
              type="email"
              placeholder="가입하신 이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
        )}

        {error && <Message>{error}</Message>}

        <ButtonWrapper>
          <CheckButton type="button" onClick={handleSubmit}>
            확인
          </CheckButton>
        </ButtonWrapper>
      </Box>
    </Container>
  );
};

export default FindIdInputStep;

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
  padding: 6px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(105, 111, 148, 0.15);
  }
`;

const Box = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  min-width: 480px;
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const CheckInput = styled.input`
  flex: 1;
  padding: 12px;
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

const CheckButton = styled.button`
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
  margin-top: 8px;
  text-align: center;
  font-weight: 600;
`;
