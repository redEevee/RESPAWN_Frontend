import React from 'react';
import styled from 'styled-components';
import Logo from './common/Logo';

const SellerHeader = () => {
  //   const userData = JSON.parse(localStorage.getItem('userData'));
  //   console.log(userData);

  return (
    <HeaderContainer>
      <TopBar>
        <TopMenu>
          <Left>
            <Logo />
          </Left>
          <Right>
            <span>로그아웃</span>
            <span>회원관리</span>
            <span>상품등록</span>
            <span>상품관리</span>
            <span>고객센터</span>
          </Right>
        </TopMenu>
      </TopBar>
    </HeaderContainer>
  );
};

export default SellerHeader;

const HeaderContainer = styled.header`
  width: 100%;
  border-bottom: 1px solid #eee;
`;

const TopBar = styled.div`
  padding: 8px 20px;
  border-bottom: 1px solid #ddd;
`;

const TopMenu = styled.div`
  display: flex;
  justify-content: space-between; // 변경
  align-items: center;
  font-size: 13px;
  color: #666;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
