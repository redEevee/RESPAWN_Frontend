import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
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

  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  // 인증 관련 state
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // 타이머
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error('회원 정보 조회 실패', error);
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  useEffect(() => {
    // 타이머 카운트다운 관리
    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsCodeSent(false);
            setVerificationCode('');
            alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer]);

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(0);
  };

  const handleAddPhoneNumber = () => {
    setIsAddingPhone(true);
    setIsCodeSent(false);
    setVerificationCode('');
    setIsVerified(false);
    setNewPhoneNumber('');
    resetTimer();
  };

  const handlePhoneNumberChange = (e) => {
    setNewPhoneNumber(e.target.value);
  };

  // 인증번호 발송 요청
  const sendVerificationCode = async () => {
    if (newPhoneNumber.trim() === '') {
      alert('전화번호를 입력하세요.');
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        'http://localhost:8080/verify-phone-number',
        { phoneNumber: newPhoneNumber },
        { withCredentials: true }
      );
      setIsCodeSent(true);
      setTimer(300); // 5분
      alert('인증번호가 발송되었습니다. 메시지를 확인해주세요.');
    } catch (error) {
      console.error('인증번호 발송 실패', error);
      alert('인증번호 발송에 실패했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // 인증번호 확인
  const verifyCode = async () => {
    if (verificationCode.trim() === '') {
      alert('인증번호를 입력하세요.');
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        'http://localhost:8080/phone-number/verification-code',
        { code: verificationCode },
        { withCredentials: true }
      );
      alert('전화번호가 성공적으로 인증되었습니다.');
      setIsVerified(true);
      resetTimer();
    } catch (error) {
      console.error('인증 실패', error);
      alert('인증번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 완료 후 전화번호 저장
  const handleSavePhoneNumber = async () => {
    if (!isVerified) {
      alert('전화번호 인증을 먼저 완료하세요.');
      return;
    }
    try {
      setLoading(true);
      await axios.put(
        'http://localhost:8080/myPage/setPhoneNumber',
        { phoneNumber: newPhoneNumber },
        { withCredentials: true }
      );
      alert('전화번호가 추가되었습니다.');
      const response = await axios.get('http://localhost:8080/user', {
        withCredentials: true,
      });
      setUser(response.data);
      setIsAddingPhone(false);
      setNewPhoneNumber('');
      setVerificationCode('');
      setIsCodeSent(false);
      setIsVerified(false);
      resetTimer();
    } catch (error) {
      console.error('전화번호 추가 실패:', error);
      alert('전화번호 추가 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // const handleCancelAddPhoneNumber = () => {
  //   setIsAddingPhone(false);
  //   setNewPhoneNumber('');
  //   setVerificationCode('');
  //   setIsCodeSent(false);
  //   setIsVerified(false);
  //   resetTimer();
  // };

  // 시간 형식 변환(분:초)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Container>
      <Title>마이페이지</Title>
      <UserDetail>
        <Label>이름:</Label> {user.name || '-'}
      </UserDetail>
      <UserDetail>
        <Label>유저네임:</Label> {user.username || '-'}
      </UserDetail>
      <UserDetail>
        <Label>이메일:</Label> {user.email || '-'}
      </UserDetail>
      <UserDetail>
        <Label>전화번호:</Label>{' '}
        {user.phoneNumber ? user.phoneNumber : '등록된 전화번호가 없습니다.'}
      </UserDetail>

      {!user.phoneNumber && !isAddingPhone && (
        <Button onClick={handleAddPhoneNumber}>전화번호 추가하기</Button>
      )}

      {isAddingPhone && (
        <PhoneInputContainer>
          <Input
            type="text"
            placeholder="전화번호 입력 (예: 01012345678 )"
            value={newPhoneNumber}
            onChange={handlePhoneNumberChange}
            disabled={isCodeSent}
          />
          {!isCodeSent ? (
            <Button onClick={sendVerificationCode} disabled={loading}>
              {loading ? '발송 중...' : '인증번호 보내기'}
            </Button>
          ) : (
            <>
              <Input
                type="text"
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
              />
              <Button onClick={verifyCode} disabled={loading || isVerified}>
                {loading
                  ? '확인 중...'
                  : isVerified
                  ? '인증완료'
                  : '인증번호 확인'}
              </Button>
              {/* 타이머 표시 */}
              <TimerText>남은 시간: {formatTime(timer)}</TimerText>
              {/* <CancelButton onClick={handleCancelAddPhoneNumber}>취소</CancelButton> */}
            </>
          )}
        </PhoneInputContainer>
      )}

      {/* 인증 완료 시에만 전화번호 저장 버튼 노출 */}
      {isVerified && (
        <Button onClick={handleSavePhoneNumber} disabled={loading}>
          저장
        </Button>
      )}

      <UserDetail>
        <Label>권한:</Label>
        {user.role === 'ROLE_SELLER'
          ? '판매자'
          : user.role === 'ROLE_USER'
          ? '구매자'
          : '-'}
      </UserDetail>
    </Container>
  );
}

export default UserInfo;

// --- styled-components ---

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto 80px;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  font-family: 'Noto Sans KR', sans-serif;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  text-align: center;
`;

const UserDetail = styled.p`
  font-size: 1rem;
  color: #444;
  margin: 12px 0;
  display: flex;
  align-items: center;
`;

const Label = styled.span`
  font-weight: 600;
  width: 100px;
  color: #666;
`;

const Button = styled.button`
  background-color: #222;
  color: #fff;
  padding: 8px 18px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.3s;
  min-width: 100px;
  &:hover:enabled {
    background-color: #555;
  }
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

// const CancelButton = styled(Button)`
//   background-color: #ccc;
//   color: #333;
//   margin-left: 8px;
//   &:hover:enabled {
//     background-color: #999;
//   }
// `;

const PhoneInputContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const Input = styled.input`
  flex-grow: 1;
  min-width: 200px;
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #222;
  }
`;

const TimerText = styled.p`
  color: #d22525;
  margin-left: 12px;
  font-size: 1rem;
  font-weight: bold;
`;
