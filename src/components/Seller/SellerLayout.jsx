import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';

const SellerLayout = () => {
  return (
    <Wrapper>
      <Sidebar>
        <LogoBox>판매자 센터</LogoBox>
        <Nav>
          <StyledNavLink to="productList">상품 관리</StyledNavLink>
          <StyledNavLink to="orderList">주문 관리</StyledNavLink>
          <StyledNavLink to="refundList">환불 관리</StyledNavLink>
          <StyledNavLink to="reviewList">리뷰</StyledNavLink>
          <StyledNavLink to="inquiryList">문의 관리</StyledNavLink>
          <StyledNavLink to="profile">개인정보확인/수정</StyledNavLink>
        </Nav>
      </Sidebar>
      <Content>
        <InnerBox>
          <Outlet />
        </InnerBox>
      </Content>
    </Wrapper>
  );
};

export default SellerLayout;

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f6fa;
  padding: 20px; /* 전체 여백 */
  gap: 20px; /* Sidebar와 Content 사이 간격 */
`;

const Sidebar = styled.div`
  width: 240px;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const LogoBox = styled.h2`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24px;
  color: #555a82;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  border-radius: 8px;
  margin: 0 16px;

  &:hover {
    background: #f0f2f8;
    color: #555a82;
  }

  &.active {
    background: #e6e8f4;
    font-weight: 700;
    color: #555a82;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
`;

const InnerBox = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
`;
