import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from '../components/common/Logo';
import axios from '../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

const initialPasswordState = {
  password: '',
  isRequiredPassword: false,
  error: '',
};

const initialConfirmPasswordState = {
  confirmPassword: '',
  isCheckPassword: false,
  error: '',
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const [password, setPassword] = useState(initialPasswordState);
  const [confirmPassword, setConfirmPassword] = useState(
    initialConfirmPasswordState
  );
  const [loading, setLoading] = useState(false);

  // 유효성 검사
  const onChangeHandler = (name) => (e) => {
    const value = e.target.value;
    if (name === 'password') {
      const valid = PASSWORD_REGEX.test(value);
      setPassword({
        ...password,
        password: value,
        isRequiredPassword: valid,
        error: valid
          ? ''
          : '8~25자의 영문, 숫자, 특수문자를 모두 포함해야 합니다.',
      });
      // 비밀번호 변경 시 확인 비밀번호도 재검증
      if (confirmPassword.confirmPassword) {
        setConfirmPassword({
          ...confirmPassword,
          isCheckPassword: value === confirmPassword.confirmPassword,
          error:
            value === confirmPassword.confirmPassword
              ? ''
              : '비밀번호가 일치하지 않습니다.',
        });
      }
    } else if (name === 'confirmPassword') {
      setConfirmPassword({
        ...confirmPassword,
        confirmPassword: value,
        isCheckPassword: value === password.password,
        error:
          value === password.password ? '' : '비밀번호가 일치하지 않습니다.',
      });
    }
  };

  const handleSubmit = async () => {
    if (!password.isRequiredPassword) {
      alert('비밀번호 조건을 확인해주세요.');
      return;
    }
    if (!confirmPassword.isCheckPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!token) {
      alert('유효하지 않은 요청입니다.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/reset-password', {
        token,
        newPassword: password.password,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setPassword(initialPasswordState);
      setConfirmPassword(initialConfirmPasswordState);
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <Box>
        <Title>비밀번호 재설정</Title>

        <Input
          name="password"
          type="password"
          placeholder="새 비밀번호"
          value={password.password}
          onChange={onChangeHandler('password')}
          required
        />
        {password.error && <ErrorText>{password.error}</ErrorText>}

        <Input
          name="confirmPassword"
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmPassword.confirmPassword}
          onChange={onChangeHandler('confirmPassword')}
          required
        />
        {confirmPassword.error && (
          <ErrorText>{confirmPassword.error}</ErrorText>
        )}

        <ButtonWrapper>
          <CheckButton
            type="button"
            onClick={handleSubmit}
            disabled={
              !password.isRequiredPassword ||
              !confirmPassword.isCheckPassword ||
              loading
            }
          >
            {loading ? '처리 중...' : '확인'}
          </CheckButton>
        </ButtonWrapper>
        <GuideText>
          다른 서비스에서 사용한 적 없는 안전한 비밀번호를 사용하세요.
          <br />
          비밀번호는 8~25자의 영문, 숫자, 특수문자를 포함하며 공백 없이
          입력해주세요.
        </GuideText>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;

const Container = styled.div`
  min-height: 100vh;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
`;

const LogoWrapper = styled.div`
  width: 100%;
  max-width: 460px;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  & > div img {
    height: 70px;
    object-fit: contain;
  }
`;

const Box = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  min-width: 480px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin-bottom: 28px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  margin-bottom: 8px;
  &:focus {
    outline: none;
    border-color: #696f94;
  }
`;

const ErrorText = styled.p`
  color: #d9534f;
  font-size: 13px;
  margin: -4px 0 12px;
`;

const ButtonWrapper = styled.div`
  margin-top: 12px;
`;

const CheckButton = styled.button`
  width: 100%;
  height: 48px;
  background: ${({ disabled }) => (disabled ? '#ccc' : 'rgb(105, 111, 148)')};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.25s ease;

  &:hover {
    background: ${({ disabled }) => (disabled ? '#ccc' : 'rgb(85, 90, 130)')};
  }
`;

const GuideText = styled.p`
  font-size: 13px;
  color: #666;
  margin-top: 16px;
  line-height: 1.5;
  word-break: keep-all;
  white-space: normal;
`;
