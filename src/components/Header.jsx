import React from 'react';
import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>RESPAWN</Logo>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  width: 100%;
  height: 90px;
  background-color: #fff;
  box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    height: 70px;
    padding: 0 20px;
  }
`;

const Logo = styled.h1`
  font-size: 24px;
  color: #333;
`;
