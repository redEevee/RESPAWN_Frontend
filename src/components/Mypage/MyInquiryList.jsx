import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled from 'styled-components';

const MyInquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedDetail, setExpandedDetail] = useState({});

  // 자신이 작성한 문의 리스트 조회
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get('/api/inquiries/my');
        console.log(res.data);
        setInquiries(res.data);
      } catch (err) {
        console.error('문의 리스트 불러오기 실패:', err);
      }
    };

    fetchInquiries();
  }, []);

  // 상세 조회
  const handleToggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    if (!expandedDetail[id]) {
      try {
        const res = await axios.get(`/api/inquiries/${id}/detail`);
        setExpandedDetail((prev) => ({ ...prev, [id]: res.data }));
      } catch (err) {
        console.error('상세 조회 실패:', err);
        return;
      }
    }

    setExpandedId(id);
  };

  return (
    <Container>
      <Title>내 문의 내역</Title>
      <Table>
        <thead>
          <tr>
            <th>번호</th>
            <th>상품명</th>
            <th>제목</th>
            <th>작성일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((item, index) => (
            <React.Fragment key={item.id}>
              <tr onClick={() => handleToggleExpand(item.id)}>
                <td>{inquiries.length - index}</td>
                <td>{item.itemName}</td>
                <td>{item.question}</td>
                <td>{new Date(item.questionDate).toLocaleDateString()}</td>
                <td>{item.status === 'ANSWERED' ? '답변 완료' : '대기'}</td>
              </tr>

              {expandedId === item.id && expandedDetail[item.id] && (
                <tr>
                  <td colSpan={5} style={{ background: '#f9f9f9' }}>
                    <DetailBox>
                      <p>
                        <strong>문의 내용:</strong>{' '}
                        {expandedDetail[item.id].questionDetail}
                      </p>
                      <p>
                        <strong>판매자 답변:</strong>{' '}
                        {expandedDetail[item.id].answer || '미등록'}
                      </p>
                    </DetailBox>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MyInquiryList;

// 스타일
const Container = styled.div`
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #555a82;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    padding: 12px 15px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #e6e8f4;
    color: #333;
  }

  tr:hover {
    background: #f5f7fa;
  }
`;

const DetailBox = styled.div`
  text-align: left;
  p {
    margin: 6px 0;
  }
`;
