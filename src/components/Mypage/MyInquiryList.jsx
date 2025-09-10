import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled from 'styled-components';

const MyInquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedDetail, setExpandedDetail] = useState({});
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetailIds, setLoadingDetailIds] = useState(new Set());
  const [errorDetail, setErrorDetail] = useState({});

  // 자신이 작성한 문의 리스트 조회
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get('/api/inquiries/my');
        console.log(res.data);
        setInquiries(res.data);
      } catch (err) {
        console.error('문의 리스트 불러오기 실패:', err);
      } finally {
        setLoadingList(false);
      }
    };

    fetchInquiries();
  }, []);

  // 문의 상세 조회
  const handleToggleExpand = async (id) => {
    // 닫기
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    // 이미 캐시가 있으면 즉시 열기
    if (expandedDetail[id]) {
      setExpandedId(id);
      return;
    }

    // 로딩 표시
    setLoadingDetailIds((prev) => new Set(prev).add(id));
    setErrorDetail((prev) => ({ ...prev, [id]: '' }));

    const currentId = id;

    try {
      const res = await axios.get(`/api/inquiries/${id}/detail`);
      // 최신 클릭 확인(필수는 아님, 캐시만 채워도 됨)
      setExpandedDetail((prev) => ({ ...prev, [id]: res.data }));
      setExpandedId(id);
    } catch (err) {
      console.error('상세 조회 실패:', err);
      setErrorDetail((prev) => ({
        ...prev,
        [id]: '상세를 불러오지 못했습니다.',
      }));
    } finally {
      setLoadingDetailIds((prev) => {
        const s = new Set(prev);
        s.delete(currentId);
        return s;
      });
    }
  };

  return (
    <Container>
      <Title>문의 내역</Title>
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
          {loadingList ? (
            <tr>
              <td colSpan={5}>불러오는 중...</td>
            </tr>
          ) : inquiries.length === 0 ? (
            <tr>
              <td colSpan={5}>문의 내역이 없습니다.</td>
            </tr>
          ) : (
            inquiries.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr onClick={() => handleToggleExpand(item.id)}>
                  <td>{inquiries.length - index}</td>
                  <td>{item.itemName}</td>
                  <td>{item.question}</td>
                  <td>{new Date(item.questionDate).toLocaleDateString()}</td>
                  <td>{item.status === 'ANSWERED' ? '답변 완료' : '대기'}</td>
                </tr>

                {expandedId === item.id && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ background: '#f9f9f9', textAlign: 'left' }}
                    >
                      <DetailBox>
                        {loadingDetailIds.has(item.id) && (
                          <LoadingMsg>불러오는 중...</LoadingMsg>
                        )}
                        {errorDetail[item.id] && (
                          <ErrorMsg>{errorDetail[item.id]}</ErrorMsg>
                        )}

                        {expandedDetail[item.id] && (
                          <>
                            <Row>
                              <Label>문의 내용</Label>
                              <ValueBox>
                                {expandedDetail[item.id].questionDetail}
                              </ValueBox>
                            </Row>
                            <Row>
                              <Label>판매자 답변</Label>
                              <ValueBox>
                                {expandedDetail[item.id].answer || (
                                  <NoAnswer>미등록</NoAnswer>
                                )}
                              </ValueBox>
                            </Row>
                          </>
                        )}
                      </DetailBox>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default MyInquiryList;

const Container = styled.div`
  max-width: 1000px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
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
  font-size: 14px;
  color: #333;
  margin-top: 10px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.div`
  width: 110px;
  font-weight: bold;
  color: #444;
  flex-shrink: 0;
  text-align: center;
`;

const ValueBox = styled.div`
  flex: 1;
  padding: 12px 14px;
  border-radius: 6px;
  line-height: 1.6;
  white-space: pre-line;
  border: 1px solid #eee;
  text-align: left;
`;

const NoAnswer = styled.span`
  color: #999;
  font-style: italic;
`;

const LoadingMsg = styled.p`
  margin: 0;
  color: #666;
`;

const ErrorMsg = styled.p`
  margin: 0;
  color: red;
`;
