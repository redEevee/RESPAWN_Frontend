import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import AddressListModal from '../AddressListModal';

function ProfilePage() {
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

  // 주소지입력
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

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

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  return (
    <Wrapper>
      <Section>
        <SectionTitle>내 정보 관리</SectionTitle>
        <UserDetail>
          <Label>이름</Label> <Value>{user.name || '-'}</Value>
        </UserDetail>
        <UserDetail>
          <Label>유저네임</Label> <Value>{user.username || '-'}</Value>
        </UserDetail>
        <UserDetail>
          <Label>이메일</Label> <Value>{user.email || '-'}</Value>
        </UserDetail>
        <UserDetail>
          <Label>전화번호</Label>{' '}
          <Value>
            {user.phoneNumber
              ? user.phoneNumber
              : '등록된 전화번호가 없습니다.'}
          </Value>
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
          <Label>권한</Label>
          <Value>
            {user.role === 'ROLE_SELLER'
              ? '판매자'
              : user.role === 'ROLE_USER'
              ? '구매자'
              : '-'}
          </Value>
        </UserDetail>

        <UserDetail>
          <Label>주소지</Label>
          <Button onClick={handleOpenAddressModal}>설정</Button>
        </UserDetail>
      </Section>
      {isAddressModalOpen && (
        <AddressListModal onClose={handleCloseAddressModal} />
      )}
    </Wrapper>
  );
}

export default ProfilePage;

// --- styled-components ---

const Wrapper = styled.div`
  max-width: 860px;
  font-family: 'Noto Sans KR', sans-serif;
  color: #222;
`;

const Section = styled.section`
  background: #fff;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 24px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 12px;
  color: #222;
`;

const UserDetail = styled.p`
  font-size: 1rem;
  color: #444;
  margin: 12px 0 5px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
`;

const Label = styled.div`
  flex: 0 0 150px; // 고정 너비
  background-color: #f7f7f7; // 연한 회색 배경
  padding: 10px 16px;
  font-weight: 600;
  color: #666;
  border-right: 1px solid #ddd; // 오른쪽 세로 경계선
  box-sizing: border-box;
  text-align: left;
`;

const Value = styled.div`
  flex: 1;
  padding: 10px 16px;
  color: #444;
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
