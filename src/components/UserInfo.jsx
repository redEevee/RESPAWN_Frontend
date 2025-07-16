import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserInfo() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData?.username;

  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    role: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user`, {
          withCredentials: true,
        });
        setUser(response.data); // ✅ 사용자 정보 저장
      } catch (error) {
        console.error('회원 정보 조회 실패', error);
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8080/logout',
        {},
        { withCredentials: true }
      );
      localStorage.removeItem('userData'); // ✅ 저장된 로그인 정보 삭제
      alert('로그아웃 완료');
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  return (
    <div>
      <h1>마이페이지</h1>
      <p>이름: {user.name}</p>
      <p>유저네임: {user.username}</p>
      <p>이메일: {user.email}</p>
      <p>전화번호: {user.phoneNumber}</p>
      <p>권한: {user.role}</p>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default UserInfo;
