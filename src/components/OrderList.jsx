import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/cart`) // ✅ 주문 내역 API로 수정
      .then((res) => {
        setOrders(res.data.orders); // API 응답에 따라 조정 필요
      })
      .catch((err) => console.error('주문 내역 불러오기 실패', err));
  }, []);

  const getTotalPrice = () => {
    return orders.reduce((acc, item) => acc + item.itemPrice * item.count, 0);
  };

  return (
    <Container>
      <Title>주문 내역</Title>
      <Table>
        <thead>
          <tr>
            <th>상품정보</th>
            <th>배송상태</th>
            <th>주문금액</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item) => (
            <ItemRow key={item.orderItemId}>
              <td>
                <ProductInfo>
                  <img src={item.imageUrl} alt={item.itemName} />
                  <div>
                    <span>{item.itemName}</span>
                    <br />
                    <span>수량: {item.count}</span>
                    <br />
                    <span>주문일: {item.orderedAt}</span> {/* 주문일 표시 */}
                  </div>
                </ProductInfo>
              </td>
              <td>배송완료</td> {/* 실제 배송 상태가 있으면 그 값으로 */}
              <td>
                <Price>
                  {(item.itemPrice * item.count).toLocaleString()}원
                </Price>
              </td>
            </ItemRow>
          ))}
        </tbody>
      </Table>

      <Summary>
        <FinalPrice>
          총 주문금액 <span>{getTotalPrice().toLocaleString()}원</span>
        </FinalPrice>
      </Summary>
    </Container>
  );
};

export default OrderList;

const Container = styled.div`
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 34px;
  margin-bottom: 40px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th,
  td {
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f5f5f5;
  }
`;

const ItemRow = styled.tr`
  td {
    vertical-align: middle;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
  }

  span {
    font-size: 16px;
  }
`;

const Price = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const Summary = styled.div`
  margin-top: 50px;
  padding: 20px;
  border-top: 2px solid #222;
  font-size: 16px;

  p {
    margin: 10px 0;
  }
`;

const FinalPrice = styled.p`
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #e60023;

  span {
    margin-left: 20px;
    font-size: 24px;
  }
`;
