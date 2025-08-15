import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  // localStorage의 userData가 있으면 로그인 상태로 간주
  const userData = sessionStorage.getItem('userData');

  if (userData) {
    // 이미 로그인 상태면 /home으로 리다이렉트
    return <Navigate to="/home" replace />;
  }

  // 로그인 안 한 사용자만 접근 가능
  return children;
};

export default PublicRoute;
