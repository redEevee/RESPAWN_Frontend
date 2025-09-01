import React, { useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function LoginOkPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleLogin = async () => {
      try {
        const response = await axios.get('/loginOk');
        const data = response.data;
        sessionStorage.setItem('userData', JSON.stringify(data));

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'LOGIN_SUCCESS' }, '*');
        }

        localStorage.setItem('auth:updated', String(Date.now()));
        window.close();
        setTimeout(() => {
          if (!window.closed) {
            navigate('/');
          }
        }, 500);
      } catch (err) {
        console.error('유저 정보 불러오기 실패:', err);
      }
    };

    handleLogin();
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}

export default LoginOkPage;
