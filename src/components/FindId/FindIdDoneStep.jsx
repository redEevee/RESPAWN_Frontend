import React, { useEffect } from 'react';
import Logo from '../../components/common/Logo';
import {
  Container,
  LogoWrapper,
  ResultContainer,
  SuccessText,
  ButtonWrapper,
  BackButton,
} from '../../styles/FindDoneStyles';

const FindIdDoneStep = ({ onPrev }) => {
  useEffect(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('type');
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
