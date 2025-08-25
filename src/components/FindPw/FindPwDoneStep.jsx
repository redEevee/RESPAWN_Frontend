import React from 'react';
import Logo from '../../components/common/Logo';
import {
  Container,
  LogoWrapper,
  ResultContainer,
  SuccessText,
  ButtonWrapper,
  BackButton,
} from '../../styles/FindDoneStyles';

const FindPwDoneStep = ({ onPrev }) => (
  <Container>
    <LogoWrapper>
      <Logo />
    </LogoWrapper>
    <ResultContainer>
      <SuccessText>비밀번호 안내가 정상적으로 발송되었습니다!</SuccessText>
      <ButtonWrapper>
        <BackButton onClick={onPrev}>메인으로</BackButton>
      </ButtonWrapper>
    </ResultContainer>
  </Container>
);

export default FindPwDoneStep;
