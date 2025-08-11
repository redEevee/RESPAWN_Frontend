import React, { useState } from 'react';
import styled from 'styled-components';
import axios from '../../api/axios';
import Logo from '../../components/common/Logo';

const FindIdSendStep = ({ userInfo, onNext, onPrev }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendToEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const type = 'email';
      const res = await axios.post('/find-id/send', {
        userId: userId,
        token: token,
        type: type,
      });
      alert(res.data.message || '아이디가 이메일로 전송되었습니다.');
      onNext();
    } catch (e) {
      setError('이메일 발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const sendToPhone = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const type = 'phone';
      const res = await axios.post('/find-id/send', {
        token: token,
        userId: userId,
        type: type,
      });
      alert(res.data.message || '아이디가 휴대폰으로 전송되었습니다.');
      onNext();
    } catch (e) {
      setError('문자 발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>

      <Card>
        <Title>아이디 찾기</Title>
        <UserInfo>
          <Label>이름</Label>
          <Value>{userInfo.name}</Value>
        </UserInfo>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <SendOptions>
          <Option>
            <OptionLabel>이메일 주소로 받기</OptionLabel>
            <OptionValue>{userInfo.email}</OptionValue>
            <SendButton onClick={sendToEmail} disabled={loading}>
              {loading ? '발송중...' : '발송하기'}
            </SendButton>
          </Option>

          <Option>
            <OptionLabel>휴대폰 번호로 받기</OptionLabel>
            <OptionValue>{userInfo.phoneNumber}</OptionValue>
            <SendButton onClick={sendToPhone} disabled={loading}>
              {loading ? '발송중...' : '발송하기'}
            </SendButton>
          </Option>
        </SendOptions>

        <ButtonRow>
          <BackButton onClick={onPrev} disabled={loading}>
            이전
          </BackButton>
        </ButtonRow>
      </Card>
    </Container>
  );
};

export default FindIdSendStep;

const Container = styled.div`
  min-height: 100vh;
  background: #fafafa;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoWrapper = styled.div`
  margin-bottom: 40px;

  & > div img {
    height: 70px;
    object-fit: contain;
  }
`;

const Card = styled.div`
  background: #fff;
  min-width: 480px;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const UserInfo = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 30px;
`;

const Label = styled.span`
  flex: 0 0 70px;
  font-weight: 600;
  color: #666;
`;

const Value = styled.span`
  flex: 1;
  font-weight: 600;
  color: #333;
`;

const ErrorMsg = styled.p`
  color: #e53e3e;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
`;

const SendOptions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 35px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px 20px;
  gap: 20px;
`;

const OptionLabel = styled.span`
  flex: 0 0 140px;
  font-weight: 600;
  color: #555;
`;

const OptionValue = styled.span`
  flex: 1;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SendButton = styled.button`
  background: rgb(105, 111, 148);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.25s ease;
  min-width: 100px;

  &:hover:enabled {
    background: rgb(85, 90, 130);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const BackButton = styled.button`
  background: rgba(105, 111, 148, 0.1);
  border: none;
  padding: 12px 26px;
  border-radius: 8px;
  font-size: 15px;
  color: rgb(105, 111, 148);
  font-weight: 700;
  cursor: pointer;

  &:hover:enabled {
    background: rgba(105, 111, 148, 0.2);
  }

  &:disabled {
    background: #eee;
    cursor: not-allowed;
  }
`;
