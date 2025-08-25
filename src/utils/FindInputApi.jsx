import axios from '../api/axios';

// 아이디 찾기
export async function findIdApi(requestData) {
  const res = await axios.post('/find-id', requestData);
  return res?.data;
}

// 비밀번호 찾기
export async function findPasswordApi(requestData) {
  const res = await axios.post('/find-password', requestData);
  return res?.data;
}
