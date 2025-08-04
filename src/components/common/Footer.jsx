import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <Container>
      <Content>
        <Brand>RESPAWN</Brand>
        <Info>
          <div>대표: ooo | 사업자등록번호: 123-45-67890</div>
          <div>주소: 서울특별시 어디구 어디동 123</div>
          <div>고객센터: 0000-0000 | 이메일: hello@respawn.com</div>
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
  margin-bottom: 16px;
  line-height: 1.6;
`;

const Copyright = styled.div`
  font-size: 12px;
  color: #999;
`;
