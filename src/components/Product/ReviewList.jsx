import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled from 'styled-components';
import Pagination from '../Pagination';

const ITEMS_PER_PAGE = 10;

const ReviewList = ({ itemId }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (itemId) {
      axios
        .get(`api/reviews/items/${itemId}`)
        .then((response) => {
          setReviews(response.data);
          setCurrentPage(1);
        })
        .catch((error) => {
          console.error('리뷰 불러오기 실패:', error);
        });
    }
  }, [itemId]);

  // 현재 페이지에 보여줄 리뷰 목록 (10개씩)
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);

  return (
    <Container>
      <h3>상품 리뷰</h3>
      {reviews.length === 0 ? (
        <NoReview>리뷰가 없습니다.</NoReview>
      ) : (
        <>
          {currentReviews.map((review) => (
            <ReviewCard key={review.reviewId}>
              <Header>
                <Reviewer>{review.buyerId}</Reviewer>
                <DateText>
                  {new Date(review.createdDate).toLocaleDateString()}
                </DateText>
              </Header>
              <Rating>⭐ {review.rating}점</Rating>
              <Content>{review.content}</Content>
            </ReviewCard>
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
          />
        </>
      )}
    </Container>
  );
};

export default ReviewList;

const Container = styled.div`
  margin-top: 20px;
`;

const NoReview = styled.p`
  color: #999;
  font-size: 14px;
`;

const ReviewCard = styled.div`
  border: 1px solid #e0e0e0;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  background-color: #fafafa;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Reviewer = styled.span`
  font-weight: bold;
`;

const DateText = styled.span`
  font-size: 12px;
  color: #888;
`;

const Rating = styled.div`
  margin-bottom: 8px;
  color: #ff9500;
  font-weight: 500;
`;

const Content = styled.p`
  line-height: 1.6;
`;
