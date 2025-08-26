// AppAuthGate.jsx
import { useEffect, useState, useRef } from 'react';
import axios from './api/axios';

export default function AppAuthGate({ children }) {
  const [ready, setReady] = useState(false);
  const didSyncRef = useRef(false);

  useEffect(() => {
    if (didSyncRef.current) return;
    didSyncRef.current = true;

    const sync = async () => {
      try {
        // 서버 세션 확인 API (로그인 상태면 유저 정보 반환, 아니면 401/빈값)
        const res = await axios.get('/bring-me'); // 기존에 쓰던 엔드포인트 재사용
        sessionStorage.setItem('userData', JSON.stringify(res.data));
      } catch (e) {
        sessionStorage.removeItem('userData');
      } finally {
        setReady(true);
      }
    };
    sync();
  }, []);

  if (!ready) return null; // 전역 스플래시 UI가 있으면 그걸 렌더

  return children;
}
