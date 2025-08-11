import React, { useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../../components/common/Logo';

const FindIdDoneStep = ({ onPrev }) => {
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('type');
  }, []);

  return (
    <Container>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <ResultContainer>
        <SuccessText>아이디 안내가 정상적으로 발송되었습니다!</SuccessText>
        <ButtonWrapper>
          <BackButton onClick={onPrev}>메인으로</BackButton>
        </ButtonWrapper>
      </ResultContainer>
    </Container>
  );
};

export default FindIdDoneStep;

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

const ResultContainer = styled.div`
  background: #fff;
  min-width: 480px;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SuccessText = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: rgb(105, 111, 148);
  text-align: center;
  line-height: 1.4;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
`;

const BackButton = styled.button`
  background: rgba(105, 111, 148, 0.1);
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  color: rgb(105, 111, 148);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(105, 111, 148, 0.2);
  }
  &:focus {
    outline: none;
  }
`;
