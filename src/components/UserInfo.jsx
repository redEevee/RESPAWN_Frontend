import React, { useEffect, useState } from 'react';
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

  const handleAddPhoneNumber = () => {
    setIsAddingPhone(true);
  };

  const handlePhoneNumberChange = (e) => {
    setNewPhoneNumber(e.target.value);
  };

  const handleSavePhoneNumber = async () => {
    if (newPhoneNumber.trim() === '') {
      alert('전화번호를 입력하세요.');
      return;
    }                 

    try {
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
    } catch (error) {
      console.error('전화번호 추가 실패:', error);
      alert('전화번호 추가 중 오류가 발생했습니다.');
    }
  };

  const handleCancelAddPhoneNumber = () => {
    setIsAddingPhone(false);
    setNewPhoneNumber('');
  };

  return (
    <Container>
      <Title>마이페이지</Title>
      <UserDetail><Label>이름:</Label> {user.name || '-'}</UserDetail>
      <UserDetail><Label>유저네임:</Label> {user.username || '-'}</UserDetail>
      <UserDetail><Label>이메일:</Label> {user.email || '-'}</UserDetail>
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
            placeholder="전화번호 입력"
            value={newPhoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <Button onClick={handleSavePhoneNumber}>저장</Button>
          <CancelButton onClick={handleCancelAddPhoneNumber}>취소</CancelButton>
        </PhoneInputContainer>
      )}

      <UserDetail><Label>권한:</Label> {user.role || '-'}</UserDetail>
    </Container>
  );
}

export default UserInfo;

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

  &:hover {
    background-color: #555;
  }
`;

const CancelButton = styled(Button)`
  background-color: #ccc;
  color: #333;
  margin-left: 8px;

  &:hover {
    background-color: #999;
  }
`;

const PhoneInputContainer = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #222;
  }
`;
