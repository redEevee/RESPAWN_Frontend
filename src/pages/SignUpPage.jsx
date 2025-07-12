import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const SignupPage = () => {
  const navigate = useNavigate('');

  const initialUsernameState = {
    username: '',
    isRequiredUsername: false, // 정규식
    isDuplicateUsername: false, // 중복
    success: '',
    error: '',
  };

  const initialPasswordState = {
    password: '',
    isRequiredPassword: false, // 정규식
    error: '',
  };

  const initialConfirmPasswordState = {
    confirmPassword: '',
    isCheckPassword: false, // 일치 확인
  };

  const initialPhoneNumberState = {
    phoneNumber: '',
    isRequiredPhoneNumber: false,
    isValidPhoneNumber: false, // 인증
  };

  const initialConfirmPhoneState = {
    confirmPhone: '',
    isValidConfirmPhonee: false, // 인증확인
  };

  const initialEmailState = {
    email: '',
    isRequiredEmail: false, // 정규식
    isValidEmail: false, // 인증
  };

  const initialConfirmEmailState = {
    confirmEmail: '',
    isValidConfirmEmail: false, // 인증확인
    error: '',
  };

  // 선택 약관
  // const checkHandler = () => {
  //   setIsChecked();
  // }

  const [userType, setUserType] = useState('buyer'); // 'buyer' or 'seller'

  const [name, setName] = useState('');
  const [username, setUsername] = useState(initialUsernameState);
  const [password, setPassword] = useState(initialPasswordState);
  const [confirmPassword, setConfirmPassword] = useState(
    initialConfirmPasswordState
  );
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumberState);
  const [confirmPhone, setConfirmPhone] = useState(initialConfirmPhoneState);
  const [email, setEmail] = useState(initialEmailState);
  const [confirmEmail, setConfirmEmail] = useState(initialConfirmEmailState);

  // const [isChecked, setIsChecked] = useState(false);

  // 중복 아이디 검사
  const checkId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/buyers/signup/${username.username}`
      );
      if (response.data === false) {
        setUsername({
          ...username,
          isDuplicateUsername: true,
          success: '사용 가능한 어아디입니다.',
          error: '',
        });
      } else {
        setUsername({
          ...username,
          isDuplicateUsername: false,
          success: '',
          error: '이미 사용중인 아이디입니다.',
        });
      }
    } catch (error) {
      setUsername({ ...username, error: ' 사용중인 아이디입니다.' });
    }
  };

  // 유효성 검사
  const onChangeHandler = (name) => (e) => {
    const value = e.target.value;

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'username':
        const requiredUsername = /^[a-zA-Z0-9]{5,15}$/.test(value);
        setUsername({
          ...username,
          username: value,
          isRequiredUsername: requiredUsername,
          error: requiredUsername
            ? ''
            : '5~15자의 영문자, 숫자만 사용 가능합니다.',
        });
        break;
      case 'password':
        const requiredPassword =
          /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(value);
        setPassword({
          ...password,
          password: value,
          isRequiredPassword: requiredPassword,
          error: requiredPassword
            ? ''
            : '8자 이상의 영문자, 숫자, 특수문자를 사용해야합니다.',
        });
        break;
      case 'confirmPassword':
        setConfirmPassword({
          ...confirmPassword,
          confirmPassword: value,
          isCheckPassword: value === password.password,
          error:
            value === password.password ? '' : '비밀번호가 일치하지 않습니다.',
        });
        break;
      case 'phoneNumber':
        const requiredPhoneNumber = /^[0-9\b -]{0,13}$/.test(value);
        if (requiredPhoneNumber)
          setPhoneNumber({
            ...phoneNumber,
            phoneNumber: value,
          });
        break;
      case 'confirmPhone':
        setConfirmPhone(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'confirmEmail':
        setConfirmEmail(value);
        break;
      default:
        break;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // 새로고침 방지

    const signupData = {
      name,
      username: username.username,
      password: password.password,
      phoneNumber: phoneNumber.phoneNumber,
      email: email.email,
    };

    try {
      const response = await axios.post(
        `http://localhost:8080/buyers/createNewBuyer`,
        signupData
      );
      console.log('회원가입 성공', response.data);
      navigate('/login');
    } catch (error) {
      if (error.response) {
        alert(
          '회원가입 실패: ' + (error.response.data.message || '알 수 없는 오류')
        );
      } else {
        alert('서버와 통신 중 오류가 발생했습니다.');
      }
      console.error('Axios error:', error);
    }

    console.log(`[${userType}] 회원가입 정보:`, {
      name,
      username,
      password,
      phoneNumber,
      email,
    });
  };

  return (
    <Container>
      <SignupBox>
        {/* <TabHeader>
          <Tab
            active={userType === 'buyer'}
            onClick={() => setUserType('buyer')}
          >
            구매회원 가입
          </Tab>
          <Tab
            active={userType === 'seller'}
            onClick={() => setUserType('seller')}
          >
            판매회원 가입
          </Tab>
        </TabHeader> */}

        <form onSubmit={handleSignup}>
          <Input
            name="name"
            type="text"
            placeholder="이름"
            value={name.name}
            onChange={onChangeHandler('name')}
            required
          />

          <CheckWrapper>
            <CheckInput
              name="username"
              type="text"
              placeholder="아이디"
              value={username.username}
              onChange={onChangeHandler('username')}
              required
            />
            <CheckButton type="button" onClick={checkId}>
              중복확인
            </CheckButton>
          </CheckWrapper>
          {username.success && <SuccessText>{username.success}</SuccessText>}
          {username.error && <ErrorText>{username.error}</ErrorText>}

          <Input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={password.password}
            onChange={onChangeHandler('password')}
            required
          />
          {password.error && <ErrorText>{password.error}</ErrorText>}

          <Input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword.confirmPassword}
            onChange={onChangeHandler('confirmPassword')}
            required
          />
          {confirmPassword.error && (
            <ErrorText>{confirmPassword.error}</ErrorText>
          )}

          <CheckWrapper>
            <CheckInput
              name="phoneNumber"
              type="text"
              placeholder="전화번호"
              value={phoneNumber.phoneNumber}
              onChange={onChangeHandler('phoneNumber')}
              required
            />
            <CheckButton type="button">인증하기</CheckButton>
          </CheckWrapper>
          <Input
            name="confirmPhone"
            type="text"
            placeholder="전화번호 확인"
            value={confirmPhone.confirmPhone}
            onChange={onChangeHandler('confirmPhone')}
            required
          />

          <CheckWrapper>
            <CheckInput
              name="email"
              type="email"
              placeholder="이메일"
              value={email.email}
              onChange={onChangeHandler('email')}
              required
            />
            <CheckButton type="button">인증하기</CheckButton>
          </CheckWrapper>
          <Input
            name="confirmEmail"
            type="text"
            placeholder="이메일 확인"
            value={confirmEmail.confirmEmail}
            onChange={onChangeHandler('confirmEmail')}
            required
          />

          <JoinButton type="submit">회원가입</JoinButton>
        </form>
      </SignupBox>
    </Container>
  );
};

export default SignupPage;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
`;

const SignupBox = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
`;

const TabHeader = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 0;
  background: ${({ active }) => (active ? '#fff' : '#f1f1f1')};
  border: none;
  border-bottom: ${({ active }) =>
    active ? '2px solid rgb(105, 111, 148)' : '1px solid #ddd'};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  cursor: pointer;
  border-radius: 8px 8px 0 0;
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

const CheckInput = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  background: transparent;

  &:focus {
    border-bottom: 2px solid rgb(105, 111, 148);
    outline: none;
  }
`;

const CheckButton = styled.button`
  margin-left: 12px;
  height: 44px;
  background: rgb(105, 111, 148);
  color: white;
  padding: 0 16px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgb(85, 90, 130);
  }
`;

const JoinButton = styled.button`
  width: 100%;
  background: rgb(105, 111, 148);
  color: white;
  padding: 14px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgb(105, 111, 148);
  }
`;

const CheckWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-top: -12px;
  margin-bottom: 12px;
`;

const SuccessText = styled.p`
  color: green;
  font-size: 12px;
  margin-top: -12px;
  margin-bottom: 12px;
`;
