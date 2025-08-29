import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const didRunRef = useRef(false); // StrictMode 중복 실행 방지[2][3]

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    alert(
      '이미 해당 이메일/전화번호로 가입된 계정이 있습니다. 기존 계정으로 로그인하거나 계정 연동을 진행해 주세요.'
    );

    window.close();

    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return null;
}
