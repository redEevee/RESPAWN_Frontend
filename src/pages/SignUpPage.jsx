import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const SignupPage = () => {
  const navigate = useNavigate("");

  const initialUsernameState = {
    username: "",
    isRequiredUsername: false,
    isUsernameAvailable: false,
    success: "",
    error: "",
  };

  const initialPasswordState = {
    password: "",
    isRequiredPassword: false,
    error: "",
  };

  const initialConfirmPasswordState = {
    confirmPassword: "",
    isCheckPassword: false,
    error: "",
  };

  const initialPhoneNumberState = {
    phoneNumber: "",
    isRequiredPhoneNumber: false,
    isPhoneNumberAvailable: false,
    isValidPhoneNumber: false,
    isCheckedPhoneNumber: false,
    error: "",
  };

  const initialConfirmPhoneState = {
    confirmPhone: "",
    isValidConfirmPhone: false,
  };

  const initialEmailState = {
    email: "",
    isRequiredEmail: false,
    isEmailAvailable: false,
    isValidEmail: false,
    isCheckedEmail: false,
    error: "",
  };

  const initialConfirmEmailState = {
    confirmEmail: "",
    isValidConfirmEmail: false,
  };

  const [userType, setUserType] = useState("buyer");
  const [name, setName] = useState("");
  const [username, setUsername] = useState(initialUsernameState);
  const [password, setPassword] = useState(initialPasswordState);
  const [confirmPassword, setConfirmPassword] = useState(
    initialConfirmPasswordState
  );
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumberState);
  const [confirmPhone, setConfirmPhone] = useState(initialConfirmPhoneState);
  const [email, setEmail] = useState(initialEmailState);
  const [confirmEmail, setConfirmEmail] = useState(initialConfirmEmailState);

  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);

  // 전화번호 인증 타이머 상태
  const [countdown, setCountdown] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  // 이메일 인증 타이머 상태
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [emailTimerActive, setEmailTimerActive] = useState(false);

  // 전화번호 인증 타이머 useEffect
  useEffect(() => {
    let timer = null;
    if (timerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && timerActive) {
      setTimerActive(false);
      setShowPhoneConfirm(false);
      alert("인증 시간이 만료되었습니다. 다시 요청해주세요.");
    }
    return () => clearInterval(timer);
  }, [timerActive, countdown]);

  // 이메일 인증 타이머 useEffect
  useEffect(() => {
    let emailTimer = null;
    if (emailTimerActive && emailCountdown > 0) {
      emailTimer = setInterval(() => {
        setEmailCountdown((prev) => prev - 1);
      }, 1000);
    } else if (emailCountdown === 0 && emailTimerActive) {
      setEmailTimerActive(false);
      setShowEmailConfirm(false);
      alert("이메일 인증 시간이 만료되었습니다. 다시 시도해주세요.");
    }
    return () => clearInterval(emailTimer);
  }, [emailTimerActive, emailCountdown]);

  // 아이디 중복 검사
  const checkId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/buyers/signup/username/${username.username}`
      );
      if (response.data === false) {
        setUsername({
          ...username,
          isUsernameAvailable: true,
          success: "사용 가능한 아이디입니다.",
          error: "",
        });
      } else {
        setUsername({
          ...username,
          isUsernameAvailable: false,
          success: "",
          error: "이미 사용중인 아이디입니다.",
        });
      }
    } catch (error) {
      setUsername({ ...username, error: " 중복확인에 오류가 생겼습니다." });
    }
  };

  // 전화번호 인증하기
  const verifyPhoneNumber = async () => {
    try {
      await axios.post("/verify-phone-number", {
        phoneNumber: phoneNumber.phoneNumber,
      });
      setPhoneNumber({
        ...phoneNumber,
        isPhoneNumberAvailable: true,
        error: "",
      });
      alert("인증번호가 입력하신 전화번호로 전송되었습니다.");
      setCountdown(300);
      setTimerActive(true);
      setShowPhoneConfirm(true);
    } catch (err) {
      console.error(err);
      setPhoneNumber({
        ...phoneNumber,
        isPhoneNumberAvailable: false,
        error: "전화번호 인증 요청 중 오류가 발생했습니다.",
      });
    }
  };

  const confirmPhoneVerificationCode = async () => {
    try {
      await axios.post("/phone-number/verification-code", {
        code: confirmPhone.confirmPhone,
      });
      setConfirmPhone({ ...confirmPhone, isValidConfirmPhone: true });
      setPhoneNumber({
        ...phoneNumber,
        isValidPhoneNumber: true,
        isCheckedPhoneNumber: true,
        error: "",
      });
      setShowPhoneConfirm(false);
      setTimerActive(false);
      alert("전화번호 인증이 완료되었습니다.");
    } catch (error) {
      console.error(error);
      alert("인증번호가 올바르지 않거나, 인증에 실패했습니다.");
      setConfirmPhone({ ...confirmPhone, isValidConfirmPhone: false });
    }
  };

  // 이메일 인증코드 전송
  const verifyEmail = async () => {
    const requiredEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.email);
    if (!requiredEmail) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get("/api/email/auth", {
        params: {
          address: email.email,
        },
      });

      if (response.data.success) {
        setEmail({
          ...email,
          isEmailAvailable: true,
          error: "",
        });

        alert("이메일로 인증코드가 발송되었습니다.");
        setEmailCountdown(600); // 5분
        setEmailTimerActive(true); // 타이머 시작
        setShowEmailConfirm(true);
      } else {
        setEmail({
          ...email,
          error:
            response.data.message || "이메일 인증코드 발송에 실패했습니다.",
        });
      }
    } catch (err) {
      console.error(err);
      setEmail({
        ...email,
        error: "이메일 인증 요청 중 오류가 발생했습니다.",
      });
    }
  };

  // 이메일 인증코드 확인
  const confirmEmailVerificationCode = async () => {
    try {
      const response = await axios.post("/api/email/auth", null, {
        params: {
          address: email.email,
          authCode: confirmEmail.confirmEmail,
        },
      });

      if (response.data.success) {
        alert("이메일 인증이 완료되었습니다.");
        setConfirmEmail({ ...confirmEmail, isValidConfirmEmail: true });
        setEmail({
          ...email,
          isValidEmail: true,
          isCheckedEmail: true,
          error: "",
        });
        setShowEmailConfirm(false);
        setEmailTimerActive(false); // 타이머 종료
      } else {
        alert(response.data.message || "인증번호가 올바르지 않습니다.");
        setConfirmEmail({ ...confirmEmail, isValidConfirmEmail: false });
      }
    } catch (err) {
      console.error(err);
      alert("이메일 인증 확인 중 오류가 발생했습니다.");
    }
  };

  // 유효성 검사
  const onChangeHandler = (name) => (e) => {
    const value = e.target.value;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "username":
        const requiredUsername = /^[a-zA-Z0-9]{5,15}$/.test(value);
        setUsername({
          ...username,
          username: value,
          isRequiredUsername: requiredUsername,
          isUsernameAvailable: false,
          success: "",
          error: requiredUsername
            ? ""
            : "5~15자의 영문자, 숫자만 사용 가능합니다.",
        });
        break;
      case "password":
        const requiredPassword =
          /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(value);
        setPassword({
          ...password,
          password: value,
          isRequiredPassword: requiredPassword,
          error: requiredPassword
            ? ""
            : "8자 이상의 영문자, 숫자, 특수문자를 사용해야합니다.",
        });
        break;
      case "confirmPassword":
        setConfirmPassword({
          ...confirmPassword,
          confirmPassword: value,
          isCheckPassword: value === password.password,
          error:
            value === password.password ? "" : "비밀번호가 일치하지 않습니다.",
        });
        break;
      case "phoneNumber":
        const requiredPhoneNumber = /^\d{11}$/.test(value);
        setPhoneNumber({
          ...phoneNumber,
          phoneNumber: value,
          isRequiredPhoneNumber: requiredPhoneNumber,
          isPhoneNumberAvailable: false,
          isCheckedPhoneNumber: false,
          isValidPhoneNumber: false,
          error: requiredPhoneNumber ? "" : "유효한 전화번호를 입력해주세요.",
        });
        setShowPhoneConfirm(false);
        break;
      case "confirmPhone":
        setConfirmPhone({
          ...confirmPhone,
          confirmPhone: value,
          isValidConfirmPhone: false,
        });
        break;
      case "email":
        const requiredEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmail({
          ...email,
          email: value,
          isRequiredEmail: requiredEmail,
          isEmailAvailable: false,
          isCheckedEmail: false,
          isValidEmail: false,
          error: requiredEmail ? "" : "유효한 이메일을 입력해주세요.",
        });
        break;
      case "confirmEmail":
        setConfirmEmail({
          ...confirmEmail,
          confirmEmail: value,
          isValidConfirmEmail: false,
        });
        break;
      default:
        break;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const signupData = {
      name,
      username: username.username,
      password: password.password,
      phoneNumber: phoneNumber.phoneNumber,
      email: email.email,
    };
    try {
      const response = await axios.post(
        `http://localhost:8080/join`,
        signupData
      );
      console.log("회원가입 성공", response.data);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        alert(
          "회원가입 실패: " + (error.response.data.message || "알 수 없는 오류")
        );
      } else {
        alert("서버와 통신 중 오류가 발생했습니다.");
      }
      console.error("Axios error:", error);
    }
  };

  return (
    <Container>
      <SignupBox>
        <TabHeader>
          <Tab
            active={userType === "buyer"}
            onClick={() => setUserType("buyer")}
          >
            구매회원 가입
          </Tab>
          <Tab
            active={userType === "seller"}
            onClick={() => setUserType("seller")}
          >
            판매회원 가입
          </Tab>
        </TabHeader>

        <form onSubmit={handleSignup}>
          <Input
            name="name"
            type="text"
            placeholder="이름"
            value={name}
            onChange={onChangeHandler("name")}
            required
          />

          <CheckWrapper>
            <CheckInput
              name="username"
              type="text"
              placeholder="아이디"
              value={username.username}
              onChange={onChangeHandler("username")}
              required
            />
            <CheckButton
              type="button"
              onClick={checkId}
              disabled={!username.isRequiredUsername}
            >
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
            onChange={onChangeHandler("password")}
            required
          />
          {password.error && <ErrorText>{password.error}</ErrorText>}

          <Input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword.confirmPassword}
            onChange={onChangeHandler("confirmPassword")}
            required
          />
          {confirmPassword.error && (
            <ErrorText>{confirmPassword.error}</ErrorText>
          )}

          <CheckWrapper>
            <CheckInput
              name="phoneNumber"
              type="text"
              placeholder="전화번호 (예: 01012345678 )"
              value={phoneNumber.phoneNumber}
              onChange={onChangeHandler("phoneNumber")}
              required
              disabled={phoneNumber.isValidPhoneNumber}
            />
            {phoneNumber.isValidPhoneNumber ? (
              <SuccessText>전화번호 인증 완료</SuccessText>
            ) : (
              <CheckButton
                type="button"
                onClick={verifyPhoneNumber}
                disabled={!phoneNumber.isRequiredPhoneNumber}
              >
                인증하기
              </CheckButton>
            )}
          </CheckWrapper>
          {phoneNumber.error && <ErrorText>{phoneNumber.error}</ErrorText>}

          {/* 인증번호 입력칸 및 타이머 */}
          {showPhoneConfirm && !phoneNumber.isValidPhoneNumber && (
            <>
              <TimerText>
                인증 유효 시간: {Math.floor(countdown / 60)}:
                {String(countdown % 60).padStart(2, "0")}
              </TimerText>
              <CheckWrapper>
                <CheckInput
                  name="confirmPhone"
                  type="text"
                  placeholder="전화번호 인증코드 입력"
                  value={confirmPhone.confirmPhone}
                  onChange={onChangeHandler("confirmPhone")}
                  required
                />
                <CheckButton
                  type="button"
                  onClick={confirmPhoneVerificationCode}
                >
                  인증확인
                </CheckButton>
              </CheckWrapper>
            </>
          )}

          <CheckWrapper>
            <CheckInput
              name="email"
              type="email"
              placeholder="이메일"
              value={email.email}
              onChange={onChangeHandler("email")}
              required
              disabled={email.isValidEmail}
            />
            {!email.isValidEmail ? (
              <CheckButton
                type="button"
                onClick={verifyEmail}
                disabled={!email.isRequiredEmail}
              >
                인증하기
              </CheckButton>
            ) : (
              <SuccessText>이메일 인증 완료</SuccessText>
            )}
          </CheckWrapper>
          {email.error && <ErrorText>{email.error}</ErrorText>}

          {showEmailConfirm && (
            <>
              <TimerText>
                인증 유효 시간: {Math.floor(emailCountdown / 60)}:
                {String(emailCountdown % 60).padStart(2, "0")}
              </TimerText>
              <CheckWrapper>
                <CheckInput
                  name="confirmEmail"
                  type="text"
                  placeholder="이메일 인증코드 입력"
                  value={confirmEmail.confirmEmail}
                  onChange={onChangeHandler("confirmEmail")}
                  required
                />
                <CheckButton
                  type="button"
                  onClick={confirmEmailVerificationCode}
                >
                  인증확인
                </CheckButton>
              </CheckWrapper>
            </>
          )}

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
  background: ${({ active }) => (active ? "#fff" : "#f1f1f1")};
  border: none;
  border-bottom: ${({ active }) =>
    active ? "2px solid rgb(105, 111, 148)" : "1px solid #ddd"};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
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

const CheckWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const CheckInput = styled(Input)`
  margin-bottom: 0;
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
  margin-top: 16px;
  width: 100%;
  background: rgb(105, 111, 148);
  color: white;
  padding: 14px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgb(85, 90, 130);
  }
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

const TimerText = styled.p`
  font-size: 12px;
  text-align: right;
  color: #888;
  margin-bottom: 8px;
`;
