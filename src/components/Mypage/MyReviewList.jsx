import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled from 'styled-components';

const MyReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // 자신이 작성한 리뷰 조회
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/reviews/my');
        setReviews(res.data);
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
      }
    };

    fetchReviews();
  }, []);

  // 상세 보기 토글
  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Container>
      <Title>내 리뷰 내역</Title>
      <Table>
        <thead>
          <tr>
            <th>번호</th>
            <th>상품명</th>
            <th>별점</th>
            <th>제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <React.Fragment key={review.id}>
              <tr onClick={() => handleToggleExpand(review.id)}>
                <td>{reviews.length - index}</td>
                <td>{review.itemName}</td>
                <td>{review.rating} / 5</td>
                <td>{review.title}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              </tr>

              {expandedId === review.id && (
                <tr>
                  <td colSpan={5} style={{ background: '#f9f9f9' }}>
                    <DetailBox>
                      <p>
                        <strong>리뷰 내용:</strong> {review.content}
                      </p>
                      {review.images && review.images.length > 0 && (
                        <ImageList>
                          {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt="리뷰 이미지" />
                          ))}
                        </ImageList>
                      )}
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

export default MyReviewList;

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

const ImageList = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
  }
`;
