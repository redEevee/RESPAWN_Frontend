import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Logo from '../components/Logo';
import naver_icon from '../assets/login_naver.png';
import google_icon from '../assets/login_google.png';
import kakao_icon from '../assets/login_kakao.png';

const LoginPage = (e) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const [popup, setPopup] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    if (!user.username) {
      setMsg('아이디를 입력해주세요.');
      return;
    }
    if (!user.password) {
      setMsg('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', user.username);
      formData.append('password', user.password);

      const response = await axios({
        url: 'http://localhost:8080/loginProc',
        method: 'POST',
        data: formData,
        withCredentials: true,
      });
      console.log('로그인 성공', response.data);

      localStorage.setItem('userData', JSON.stringify(response.data));

      navigate('/');
    } catch (error) {
      if (error.response) {
        alert(
          '아이디 또는 비밀번호가 올바르지 않습니다.'
          // '로그인 실패: ' + (error.response.data.message || '알 수 없는 오류')
        );
      } else {
        alert('서버와 통신 중 오류가 발생했습니다.');
      }
      console.error('Axios error:', error);
    }
  };

  useEffect(() => {
    // 팝업창에서 보내준 메시지 처리
    function handleMessage(event) {
      if (event.data?.type === 'LOGIN_SUCCESS') {
        // 로그인 성공 시 홈으로 이동
        console.log('로그인 성공');
        navigate('/');
        // 팝업 변수 초기화
        setPopup(null);
      }
    }
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  // const handleSocialLogin = (provider) => {
  //   window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  // };

  // 팝업창 닫힘 감지용 effect
  useEffect(() => {
    if (!popup) return;

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setPopup(null);
        // 팝업이 닫혔을 때 로그인이 안 됐으면 (서버에서 상태 확인이 안 된 상태) 현재 로그인 화면 유지하거나 알림 띄우는 등 처리 가능
        // 여기선 아무 처리 안 함 (선택적)
      }
    }, 500);

    return () => clearInterval(timer);
  }, [popup]);

  const handleSocialLogin = (provider) => {
    // 크기 지정(필요시)
    const popup = window.open(
      `http://localhost:8080/oauth2/authorization/${provider}`,
      '_blank',
      'width=600,height=700,resizable=yes,scrollbars=yes'
    );
    if (!popup) {
      alert(
        '팝업이 차단되어 새 창을 열 수 없습니다. 팝업 차단을 해제해주세요.'
      );
    }
  };

  return (
    <Container>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <LogInBox>
        <form onSubmit={handleLogIn}>
          <Input
            type="text"
            name="username"
            placeholder="아이디"
            value={user.username}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={user.password}
            onChange={handleChange}
            required
          />
          {msg && <Message>{msg}</Message>}
          <Button type="submit">로그인</Button>
        </form>
        <LWrap>
          <LLink href="/signup">회원가입</LLink>
          <LLink href="/findid">아이디 찾기</LLink>
          <LLink href="/findpw">비밀번호 찾기</LLink>
        </LWrap>

        <SocialButton onClick={() => handleSocialLogin('google')}>
          <img src={google_icon} alt="google" />
        </SocialButton>

        <SocialButton onClick={() => handleSocialLogin('kakao')}>
          <img src={kakao_icon} alt="kakao" />
        </SocialButton>

        <SocialButton onClick={() => handleSocialLogin('naver')}>
          <img src={naver_icon} alt="naver" />
        </SocialButton>
      </LogInBox>
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  padding: 40px 20px;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  & > div img {
    height: 80px;
    object-fit: contain;
  }
`;

const LogInBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  margin-top: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  background: transparent;

  &:focus {
    outline: none;
    border-bottom: 2px solid rgb(105, 111, 148);
  }
`;

const Button = styled.button`
  width: 100%;
  background: rgb(105, 111, 148);
  color: white;
  padding: 14px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: rgb(85, 90, 130);
  }
`;

const LWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
  flex-wrap: wrap;
`;

const LLink = styled.a`
  cursor: pointer;
  color: #666;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    color: rgb(105, 111, 148);
    text-decoration: underline;
  }
`;

const Message = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const SocialButton = styled.button`
  margin-top: 12px;
  width: 100%;
  max-width: 240px;
  height: 48px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  &:hover img {
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;
