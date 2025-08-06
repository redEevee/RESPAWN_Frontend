import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Pagination from '../Pagination';
import axios from '../../api/axios';
import InquiryModal from './InquiryModal';

const ITEMS_PER_PAGE = 5;

const InquiryList = ({ itemId }) => {
  // 실제 서버 연동시, setInquiries로 갱신
  const [inquiries, setInquiries] = useState([]);
  const [showSecret, setShowSecret] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [activeTab, setActiveTab] = useState('waiting');

  // 클릭한 항목 ID 저장
  const [expandedId, setExpandedId] = useState(null);
  const [expandedDetail, setExpandedDetail] = useState({});

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    // 작성 완료 후 다시 목록을 갱신
    fetchInquiries();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // 탭 변경 시 페이지 초기화
    setExpandedId(null); // 탭 변경 시 확장 해제
  };

  const handleToggleExpand = async (id) => {
    if (expandedId === id) {
      // 이미 열려있으면 닫기
      setExpandedId(null);
      return;
    }

    // 상세 데이터가 없으면 API 호출
    if (!expandedDetail[id]) {
      try {
        const response = await axios.get(`/api/inquiries/${id}/detail`);
        setExpandedDetail((prev) => ({ ...prev, [id]: response.data }));
      } catch (error) {
        console.error('상세조회 실패:', error);
        return;
      }
    }

    setExpandedId(id);
  };

  // 탭 + 비밀글 제외 필터링
  const filtered = inquiries
    .filter((item) =>
      activeTab === 'waiting'
        ? item.status === 'WAITING'
        : item.status === 'ANSWERED'
    )
    .filter((item) => (showSecret ? item.openToPublic : true));

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentInquiries = filtered.slice(indexOfFirst, indexOfLast);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(`/api/inquiries/${itemId}/titles`);
      setInquiries(response.data); // 전체 문의 리스트 (간략 정보만)
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      setInquiries([]);
    }
  };

  useEffect(() => {
    fetchInquiries(); // 컴포넌트 로딩 시 실행
  }, [itemId]);

  // 비밀글 제외 체크 후 페이지 제한
  useEffect(() => {
    // 페이지 선택이 남은 데이터보다 크면 마지막 페이지로 강제 이동
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filtered, currentPage, totalPages]);

  return (
    <Container>
      <TitleBox>
        <Title>
          Q&amp;A <Count>{filtered.length}</Count>
        </Title>
        <Right>
          <label>
            <input
              type="checkbox"
              checked={showSecret}
              onChange={() => setShowSecret((prev) => !prev)}
            />{' '}
            비밀글 제외
          </label>
          <Button onClick={handleOpenModal}>상품 Q&amp;A 작성하기</Button>
          {showModal && (
            <InquiryModal itemId={itemId} onClose={handleCloseModal} />
          )}
        </Right>
      </TitleBox>

      {/* 탭 메뉴 추가 */}
      <TabMenu>
        <TabButton
          active={activeTab === 'waiting'}
          onClick={() => handleTabChange('waiting')}
        >
          답변대기
        </TabButton>
        <TabButton
          active={activeTab === 'answered'}
          onClick={() => handleTabChange('answered')}
        >
          답변완료
        </TabButton>
      </TabMenu>

      <Table>
        <thead>
          <Tr>
            <Th>문의유형</Th>
            <Th>답변상태</Th>
            <Th>제목</Th>
            <Th>작성자</Th>
            <Th>작성일</Th>
          </Tr>
        </thead>
        <tbody>
          {currentInquiries.length === 0 ? (
            <Tr>
              <Td colSpan={5} style={{ textAlign: 'center', color: '#bbb' }}>
                문의 내역이 없습니다.
              </Td>
            </Tr>
          ) : (
            currentInquiries.map((item) => (
              <React.Fragment key={item.id}>
                <Tr onClick={() => handleToggleExpand(item.id)}>
                  <Td>상품문의</Td>
                  <Td finish={item.status === 'ANSWERED'}>
                    {item.status === 'ANSWERED' ? '답변완료' : '답변대기'}
                  </Td>
                  <TdTitle>
                    {!item.openToPublic ? (
                      <Lock>
                        🔒 <SecretText>비밀글 입니다.</SecretText>
                      </Lock>
                    ) : (
                      item.question
                    )}
                  </TdTitle>
                  <Td>{item.buyerUsername}</Td>
                  <Td>{new Date(item.questionDate).toLocaleDateString()}</Td>
                </Tr>
                {/* 클릭 시 확장 영역 */}
                {expandedId === item.id && expandedDetail[item.id] && (
                  <Tr>
                    <Td colSpan={5} style={{ background: '#f9f9f9' }}>
                      <ContentBox>
                        <p>
                          <strong>문의내용:</strong>{' '}
                          {expandedDetail[item.id].questionDetail}
                        </p>
                        {item.status === 'ANSWERED' && (
                          <p>
                            <strong>답변:</strong>{' '}
                            {expandedDetail[item.id].answer}{' '}
                            <span>
                              (
                              {new Date(
                                expandedDetail[item.id].answerDate
                              ).toLocaleDateString()}
                              )
                            </span>
                          </p>
                        )}
                      </ContentBox>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
          }
        }}
      />
    </Container>
  );
};

export default InquiryList;

// styled-components
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;

const Count = styled.span`
  color: #d32f2f;
  font-size: 20px;
  margin-left: 4px;
`;

const Right = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Button = styled.button`
  padding: 8px 18px;
  background: #222;
  color: #fff;
  border-radius: 3px;
  border: none;
  font-weight: 500;
  cursor: pointer;
`;

const TabMenu = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const TabButton = styled.button`
  background: ${({ active }) => (active ? '#555a82' : '#e6e8f4')};
  color: ${({ active }) => (active ? 'white' : '#555a82')};
  border: none;
  padding: 8px 16px;
  font-weight: 700;
  cursor: pointer;
  margin-right: 8px;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #4a4e70;
    color: white;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  margin-bottom: 18px;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #eee;
`;

const Th = styled.th`
  background: #fafbfc;
  font-size: 15px;
  font-weight: 500;
  padding: 12px 4px;
  border-bottom: 2px solid #eee;
`;

const TdTitle = styled.td`
  padding: 10px 4px;
  font-size: 15px;
  vertical-align: middle;
  color: #444;
  cursor: pointer;
  }
`;

const Td = styled.td`
  padding: 10px 4px;
  font-size: 15px;
  vertical-align: middle;
  color: #444;
  ${(props) => props.finish && `color: #2e7d32;`}
`;

const Lock = styled.span`
  color: #888;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SecretText = styled.span`
  font-size: 15px;
`;

const ContentBox = styled.div`
  padding: 10px 15px;
  border-left: 4px solid #555a82;
  background: #f4f5f8;
  font-size: 14px;
  color: #333;

  p {
    margin: 6px 0;
  }

  strong {
    color: #555a82;
    margin-right: 6px;
  }

  span {
    color: #888;
    font-size: 12px;
  }
`;
