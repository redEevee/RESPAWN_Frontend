import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import axios from '../../api/axios';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  //   useEffect(() => {
  //     fetchReviews();
  //   }, []);

  //   const fetchReviews = async () => {
  //     try {
  //       const res = await axios.get('/api/reviews/my-items'); // ← 리뷰 API 경로
  //       setReviews(res.data);
  //     } catch (err) {
  //       console.error('리뷰 불러오기 실패:', err);
  //     }
  //   };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // 실제 API 호출 부분 (나중에 사용 가능)
      // const res = await axios.get('/api/reviews/my-items');
      // setReviews(res.data);

      // 더미 데이터로 대체
      const dummyData = [
        {
          reviewId: 1,
          buyerName: '홍길동',
          itemName: '테스트 상품 A',
          rating: 4,
          content: '제품이 생각보다 좋네요!',
          createdAt: '2025-07-30T12:00:00Z',
        },
        {
          reviewId: 2,
          buyerName: '김철수',
          itemName: '테스트 상품 B',
          rating: 5,
          content: '최고에요! 강력 추천합니다.',
          createdAt: '2025-07-29T09:30:00Z',
        },
        {
          reviewId: 3,
          buyerName: '이영희',
          itemName: '테스트 상품 C',
          rating: 3,
          content: '보통이에요. 가격 대비 무난합니다.',
          createdAt: '2025-07-28T18:45:00Z',
        },
      ];
      setReviews(dummyData);
    } catch (err) {
      console.error('리뷰 불러오기 실패:', err);
    }
  };

  const renderStars = (rating) => {
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return filled + empty;
  };

  return (
    <Container>
      <Title>상품 리뷰 목록</Title>
      <Table>
        <thead>
          <tr>
            <th>리뷰 ID</th>
            <th>작성자</th>
            <th>상품명</th>
            <th>평점</th>
            <th>리뷰 내용</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                작성된 리뷰가 없습니다.
              </td>
            </tr>
          ) : (
            reviews.map((review) => (
              <tr key={review.reviewId}>
                <td>{review.reviewId}</td>
                <td>{review.buyerName}</td>
                <td>{review.itemName}</td>
                <td>{renderStars(review.rating)}</td>
                <td>{review.content}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ReviewList;

const Container = styled.div`
  max-width: 1600px;
  margin: 60px auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 20px;
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
