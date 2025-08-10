import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 별점 표시를 위한 간단한 컴포넌트
const StarRating = ({ rating }) => {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  return <Stars>{stars}</Stars>;
};

const MyReviewList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('writable');
  const [writableItems, setWritableItems] = useState([]);
  const [writtenReviews, setWrittenReviews] = useState([]);

  // 리뷰 작성 버튼 클릭 시
  const handleWriteReview = async (orderId, orderItemId) => {
    try {
      const res = await axios.get(`/api/reviews/order-items/${orderItemId}`);
      if (res.data.reviewExists) {
        alert('이미 리뷰를 작성하셨습니다.');
      } else {
        navigate(
          `/mypage/orders/${orderId}/items/${orderItemId}/registerReview`
        );
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else {
        console.error(err);
        alert('리뷰 작성 여부 확인 실패');
      }
    }
  };

  // 서버에서 내 리뷰 목록 불러오기
  const fetchMyReviews = async () => {
    try {
      const res = await axios.get('/api/reviews/my');
      console.log(res.data);
      setWritableItems(res.data.writableItems || []);
      setWrittenReviews(res.data.writtenReviews || []);
    } catch (error) {
      console.error(error);
      alert('리뷰 목록을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  return (
    <Container>
      <TabContainer>
        <TabButton
          active={activeTab === 'writable'}
          onClick={() => setActiveTab('writable')}
        >
          리뷰 작성 <Count>{writableItems.length}</Count>
        </TabButton>
        <TabButton
          active={activeTab === 'written'}
          onClick={() => setActiveTab('written')}
        >
          작성한 리뷰 <Count>{writtenReviews.length}</Count>
        </TabButton>
      </TabContainer>

      <Content>
        {activeTab === 'writable' && (
          <ReviewList>
            {writableItems.map((item) => (
              <WritableItem key={item.orderItemId}>
                <ItemImage src={item.itemImage} alt={item.itemName} />
                <ItemInfo>
                  <ItemName>{item.itemName}</ItemName>
                </ItemInfo>
                <Actions>
                  <ActionButton
                    onClick={() =>
                      handleWriteReview(item.orderId, item.orderItemId)
                    }
                  >
                    리뷰 작성하기
                  </ActionButton>
                </Actions>
              </WritableItem>
            ))}
          </ReviewList>
        )}

        {activeTab === 'written' && (
          <ReviewList>
            {writtenReviews.map((review) => (
              <WrittenItem key={review.reviewId}>
                <ItemHeader>
                  <ReviewImage src={review.imageUrl} alt={review.itemName} />
                  <ItemName>{review.itemName}</ItemName>
                  {/* <ActionLinks>
                    <LinkButton>수정</LinkButton>|<LinkButton>삭제</LinkButton>
                  </ActionLinks> */}
                </ItemHeader>
                <ReviewContent>
                  <StarRating rating={review.rating} />
                  <ReviewDate>
                    {new Date(review.createdDate).toLocaleDateString()}
                  </ReviewDate>
                  {review.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </ReviewContent>
              </WrittenItem>
            ))}
          </ReviewList>
        )}
      </Content>
    </Container>
  );
};

export default MyReviewList;

const Container = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 40px auto;
  padding: 0 20px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 15px 0;
  font-size: 16px;
  font-weight: 700;
  color: #888;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-bottom: none;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  ${({ active }) =>
    active &&
    css`
      color: #333;
      background-color: #fff;
      border-bottom: 1px solid #fff;
      position: relative;
      top: 1px;
    `}
`;

const Count = styled.span`
  margin-left: 4px;
`;

const Content = styled.div`
  padding-top: 20px;
`;

const ReviewList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItemBase = styled.li`
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const WritableItem = styled(ListItemBase)`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ItemImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.h3`
  flex: 1;
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #333;
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(105, 111, 148);
  background-color: #fff;
  border: 1px solid rgb(105, 111, 148);
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgba(105, 111, 148, 0.1);
  }
`;

const WrittenItem = styled(ListItemBase)``;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
`;

const ReviewImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 12px;
  border: 1px solid #eee;
`;

const ReviewContent = styled.div`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  p {
    margin: 8px 0;
  }
`;

const Stars = styled.div`
  color: #ffc107;
  font-size: 18px;
  margin-bottom: 10px;
`;

const ReviewDate = styled.p`
  font-size: 13px;
  color: #999;
  margin: 0 0 10px 0 !important;
`;
