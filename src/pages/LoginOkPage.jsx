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
        localStorage.setItem('userData', JSON.stringify(response.data));

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'LOGIN_SUCCESS' }, '*');
        }

        window.close();
        // 창이 닫히지 않으면 0.5초 후 홈으로 강제 이동
        setTimeout(() => {
          if (!window.closed) {
            navigate('/');
          }
        }, 500);
      })
      .catch((err) => {
        console.error('유저 정보 불러오기 실패:', err);
      });
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}

export default LoginOkPage;
