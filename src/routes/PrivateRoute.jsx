import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const userData = localStorage.getItem("userData");

  if (!userData) {
    // 로그인 안 된 사용자라면 로그인 페이지로 이동
    return <Navigate to="/login" replace />;
  }

  // 로그인 되어야 접근 가능한 페이지 렌더링
  return children;
};

export default PrivateRoute;
