import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [count, setCount] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/items/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleBuyNow = () => {
    axios
      .post('/api/orders/prepare', {
        itemId: item.id,
        count: count,
      })
      .then((res) => {
        const orderId = res.data.orderId;
        navigate(`/order/${orderId}`);
      })
      .catch((err) => {
        console.error(err);
        alert('주문 생성에 실패했습니다.');
      });
  };

  const handleAddToCart = () => {
    axios
      .post(
        '/api/cart/add',
        {
          itemId: item.id,
          count: count,
        } // 인증 정보가 필요하다면
      )
      .then((res) => {
        alert('장바구니에 담겼습니다.');
      })
      .catch((err) => {
        console.error(err);
        alert('장바구니 추가 실패');
      });
  };

  const handleDecrease = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleIncrease = () => {
    if (count < item.stockQuantity) setCount(count + 1);
  };

  const totalPrice = item ? item.price * count : 0;

  if (!item) return <div>불러오는 중...</div>;

  return (
    <Container>
      <PageLayout>
        <TopSection>
          {item.imageUrl && (
            <ImageBox>
              <ProductImage
                src={`http://localhost:8080${item.imageUrl}`}
                width={300}
                alt={item.name}
              />
            </ImageBox>
          )}
          <DetailBox>
            <Title>{item.name}</Title>
            <Price>{item.price.toLocaleString()} 원</Price>

            <InfoRow>
              <Value>
                {item.deliveryType} / {item.deliveryFee.toLocaleString()} 원
              </Value>
            </InfoRow>

            <CountRow>
              <span>수량</span>
              <CountControls>
                <QtyButton onClick={handleDecrease}>-</QtyButton>
                <QtyDisplay>{count}</QtyDisplay>
                <QtyButton onClick={handleIncrease}>+</QtyButton>
              </CountControls>
            </CountRow>

            <TotalRow>
              <span>총 상품 금액</span>
              <TotalPrice>
                총 수량 {count}개 | {totalPrice.toLocaleString()} 원
              </TotalPrice>
            </TotalRow>

            <ButtonRow>
              <BuyButton onClick={handleBuyNow}>바로 구매</BuyButton>
              <CartButton onClick={handleAddToCart}>장바구니</CartButton>
            </ButtonRow>
          </DetailBox>
        </TopSection>

        <TabMenu>
          <TabItem
            active={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
          >
            설명
          </TabItem>
          <TabItem
            active={activeTab === 'additional'}
            onClick={() => setActiveTab('additional')}
          >
            추가 정보
          </TabItem>
          <TabItem
            active={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          >
            상품평 (0)
          </TabItem>
        </TabMenu>

        {activeTab === 'description' && (
          <DescriptionBox>
            <h3>상품 상세 설명</h3>
            <div dangerouslySetInnerHTML={{ __html: item.description }} />
          </DescriptionBox>
        )}

        {activeTab === 'additional' && (
          <DescriptionBox>
            <h3>추가 정보</h3>
          </DescriptionBox>
        )}

        {activeTab === 'reviews' && (
          <DescriptionBox>
            <h3>상품평</h3>
            <p>아직 상품평이 없습니다.</p>
          </DescriptionBox>
        )}
      </PageLayout>
    </Container>
  );
}

export default ProductDetail;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: 60px 24px;
  max-width: 1200px;
  width: 100%;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 60px;
  width: 100%;
`;

const ImageBox = styled.div`
  flex: 1;
  max-width: 450px;
  height: 450px;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const DetailBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 40px;
  font-weight: 700;
`;

const Price = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #222;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 16px;
  font-size: 16px;
  margin-top: 80px;
`;

const Value = styled.div`
  color: #333;
`;

const CountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CountControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
`;

const QtyButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;

const QtyDisplay = styled.div`
  width: 40px;
  text-align: center;
  font-size: 16px;
  line-height: 36px;
`;

const TotalRow = styled.div`
  margin-top: 20px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`;

const TotalPrice = styled.div`
  color: rgb(85, 90, 130);
  font-size: 18px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
`;

const BuyButton = styled.button`
  flex: 1;
  background-color: rgb(85, 90, 130);
  color: white;
  border: none;
  padding: 14px 0;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: rgb(85, 90, 130);
  }
`;

const CartButton = styled.button`
  flex: 1;
  background-color: #eee;
  color: #333;
  border: none;
  padding: 14px 0;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const DescriptionBox = styled.div`
  width: 100%;
  background: #f9f9f9;
  padding: 30px;
  border-radius: 10px;

  h3 {
    margin-bottom: 10px;
    font-size: 20px;
    color: #444;
  }

  p {
    white-space: pre-wrap;
    line-height: 1.6;
    font-size: 16px;
    color: #555;
  }
`;

const TabMenu = styled.div`
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #ddd;
`;

const TabItem = styled.button`
  background: none;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  color: ${({ active }) => (active ? '#000' : '#888')};
  border-bottom: ${({ active }) =>
    active ? '2px solid #000' : '2px solid transparent'};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};

  &:hover {
    color: #000;
  }
`;
