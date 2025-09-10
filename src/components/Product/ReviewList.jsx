import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled from 'styled-components';
import Pagination from '../Pagination';

const ITEMS_PER_PAGE = 10;

const ReviewList = ({ itemId }) => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!itemId) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`api/reviews/items/${itemId}`);
        setReviews(res.data || []);
        setCurrentPage(1);
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
      }
    };

    fetchReviews();
  }, [itemId]);

  const getRatingStats = (reviews) => {
    const stats = [0, 0, 0, 0, 0]; // index 0 → 1점, index 4 → 5점
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        stats[r.rating - 1]++;
      }
    });
    return stats;
  };

  const ratingStats = getRatingStats(reviews);
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(
          1
        )
      : 0;

  // 현재 페이지에 보여줄 리뷰 목록 (10개씩)
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);

  return (
    <Container>
      <Title>
        상품평 <Count>({totalReviews})</Count>
      </Title>
      <StatsContainer>
        <AverageBox>
          <AverageScore>⭐ {averageRating}</AverageScore>
          <TotalReviewText>({totalReviews}개 리뷰)</TotalReviewText>
        </AverageBox>
        {ratingStats
          .slice()
          .reverse()
          .map((count, idx) => {
            const rating = 5 - idx;
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <StatRow key={rating}>
                <RatingLabel>{rating}점</RatingLabel>
                <ProgressBar>
                  <Progress style={{ width: `${percent}%` }} />
                </ProgressBar>
                <CountText>{count}개</CountText>
              </StatRow>
            );
          })}
      </StatsContainer>
      {reviews.length === 0 ? (
        <NoReview>리뷰가 없습니다.</NoReview>
      ) : (
        <>
          {currentReviews.map((review) => (
            <ReviewCard key={review.reviewId}>
              <Header>
                <Reviewer>{review.maskedUsername}</Reviewer>
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
  width: 100%;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const Count = styled.span`
  color: #d32f2f;
  font-size: 24px;
  margin-left: 4px;
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

const StatsContainer = styled.div`
  margin: 24px 0;
  padding: 20px;
  background-color: #fdfdfd;
  border: 1px solid #ddd;
  border-radius: 12px;
`;

const AverageBox = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 16px;
`;

const AverageScore = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #ff9500;
  margin-right: 8px;
`;

const TotalReviewText = styled.span`
  font-size: 14px;
  color: #555;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

const RatingLabel = styled.span`
  width: 40px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-align: right;
`;

const CountText = styled.span`
  width: 40px;
  font-size: 13px;
  color: #666;
  text-align: left;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 10px;
  background-color: #eee;
  border-radius: 20px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #ffb347;
  transition: width 0.3s ease;
`;
