import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const ReviewDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const review = location.state?.review;

  if (!review) {
    return (
      <Wrapper>
        <Message>
          리뷰 데이터가 없습니다. 리뷰 목록에서 다시 접근해주세요.
        </Message>
        <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>
      </Wrapper>
    );
  }
  const renderStars = (rating) => {
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return filled + empty;
  };

  return (
    <Wrapper>
      <Title>리뷰 상세</Title>
      <Subtitle>해당 리뷰의 상세 내용을 확인할 수 있습니다.</Subtitle>

      <Card>
        <SectionTitle>상품 정보</SectionTitle>
        <InfoRow>
          <strong>주문번호:</strong> {review.orderItemId}
        </InfoRow>
        <InfoRow>
          <strong>주문일시:</strong>{' '}
          {new Date(review.orderDate).toLocaleString()}
        </InfoRow>
        {review.imageUrl && (
          <ProductBox>
            <img src={review.imageUrl} alt={review.itemName} />
            <div>
              <div>
                <strong>{review.itemName}</strong>
              </div>
              <div>가격 {review.price.toLocaleString()}원</div>
            </div>
          </ProductBox>
        )}
      </Card>

      <Card>
        <SectionTitle>리뷰 정보</SectionTitle>
        <InfoRow>
          <strong>작성일:</strong>{' '}
          {new Date(review.createdDate).toLocaleString()}
        </InfoRow>
        <InfoRow>
          <strong>평점:</strong> {renderStars(review.rating)}
        </InfoRow>
        <InfoRow>
          <strong>리뷰 내용:</strong>
        </InfoRow>
        <DetailBox>{review.content || '내용 없음'}</DetailBox>
      </Card>

      <ButtonWrapper>
        <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default ReviewDetail;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 60px auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 24px;
`;

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 24px 30px;
  margin-bottom: 32px;
  background: #fff;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 20px;
  color: #222;
  font-weight: 600;
`;

const InfoRow = styled.p`
  margin: 8px 0;
  line-height: 1.6;
  font-size: 16px;
  color: #444;
`;

const ProductBox = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 16px;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
`;

const DetailBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 12px;
  background: #f9f9f9;
  margin-top: 8px;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
  font-size: 14px;
  color: #333;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background-color: white;
  color: rgb(85, 90, 130);
  border: 1px solid rgb(85, 90, 130);
  border-radius: 8px;
  cursor: pointer;
`;

const Message = styled.p`
  text-align: center;
  font-size: 16px;
  margin-top: 50px;
  color: #777;
`;
