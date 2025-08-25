import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <Container>
      <Content>
        <Brand>RESPAWN</Brand>
        <Info>
          <InfoRow>
            <InfoLabel>대표</InfoLabel>
            <InfoValue>ooo</InfoValue>
            <Separator>|</Separator>
            <InfoLabel>사업자등록번호</InfoLabel>
            <InfoValue>123-45-67890</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>주소</InfoLabel>
            <InfoValue>서울특별시 어디구 어디동 123</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>고객센터</InfoLabel>
            <InfoValue>
              <InfoValue>0000-0000</InfoValue>
            </InfoValue>
            <Separator>|</Separator>
            <InfoLabel>이메일</InfoLabel>
            <InfoValue>
              <InfoValue>hello@respawn.com</InfoValue>
            </InfoValue>
          </InfoRow>
        </Info>
        <Copyright>ⓒ 2025 RESPAWN. All rights reserved.</Copyright>
      </Content>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
  background-color: #f8f8f8;
  border-top: 1px solid #e0e0e0;
  padding: 40px 20px;
  font-size: 14px;
  color: #555;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
`;

const Brand = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #222;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 14px;
  line-height: 1.7;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  align-items: baseline;
`;

const InfoLabel = styled.span`
  color: #000;
`;

const InfoValue = styled.span`
  color: #000;
`;

const Separator = styled.span`
  color: #000;
  margin: 0 4px;
`;

const Copyright = styled.div`
  font-size: 12px;
  color: #999;
`;
