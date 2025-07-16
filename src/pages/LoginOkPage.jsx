import React, { useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function LoginOkPage() {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get('http://localhost:8080/loginOk', { withCredentials: true })
      .then((response) => {
        // 유저 정보 상태 저장 또는 페이지 이동 처리
        console.log(response.data);
        // 예: setUser(res.data);
        localStorage.setItem('userData', JSON.stringify(response.data));
        navigate('/home'); // 홈 등 원하는 경로로 이동
      })
      .catch((err) => {
        console.error('유저 정보 불러오기 실패:', err);
      });
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}

export default LoginOkPage;
