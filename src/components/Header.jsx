import React from 'react';
import styled from 'styled-components';
import Logo from '../components/Logo';
import userIcon from '../assets/user_icon.png';

const Header = () => {
  return (
    <HeaderContainer>
      <InfoLeft>
        <Logo />
      </InfoLeft>
      <InfoRight>
        <UserIcon src={userIcon} alt="User Icon" />
      </InfoRight>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  width: 100%;
  height: 90px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between; // 추가
  box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.05);
  padding: 0 24px; // 여백도 주면 더 이쁨
`;
const UserIcon = styled.img`
  width: 50px;
  height: 50px;
  cursor: pointer;
`;

const InfoLeft = styled.div`
  display: flex;
  align-items: center;
`;

const InfoRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
