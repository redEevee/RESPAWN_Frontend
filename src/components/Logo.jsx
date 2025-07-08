import React from 'react';
import styled from 'styled-components';
import logo from '../assets/respawn_logo.png';

const Logo = () => {
  return (
    <LogoWrapper>
      <a href="/">
        <img src={logo} alt="respawn logo" />
      </a>
    </LogoWrapper>
  );
};

export default Logo;

const LogoWrapper = styled.a`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;

  img {
    height: 60px;
    object-fit: contain;
  }
`;
