import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import axios from '../../api/axios';

function OrderList() {
  const [orders, setOrders] = useState([]);

  //   useEffect(() => {
  //     fetchOrders();
  //   }, []);

  //   const fetchOrders = async () => {
  //     try {
  //       const response = await axios.get('/seller/orders'); // 예시 API
  //       setOrders(response.data);
  //     } catch (error) {
  //       console.error('주문 목록 가져오기 실패:', error);
  //     }
  //   };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // 실제 API 호출 대신 더미 데이터 사용
    const dummyData = [
      {
        orderItemId: 1,
        orderNumber: '20250731-0001',
        buyerName: '홍길동',
        itemName: '게이밍 마우스',
        count: 2,
        totalPrice: 59800,
        status: '결제완료',
      },
      {
        orderItemId: 2,
        orderNumber: '20250731-0002',
        buyerName: '김철수',
        itemName: '기계식 키보드',
        count: 1,
        totalPrice: 79800,
        status: '배송중',
      },
      {
        orderItemId: 3,
        orderNumber: '20250731-0003',
        buyerName: '이영희',
        itemName: '게이밍 체어',
        count: 1,
        totalPrice: 159800,
        status: '배송완료',
      },
    ];
    setOrders(dummyData);
  };

  return (
    <Container>
      <Title>주문 관리</Title>
      <Table>
        <thead>
          <tr>
            <th>주문번호</th>
            <th>구매자</th>
            <th>상품명</th>
            <th>수량</th>
            <th>결제금액</th>
            <th>주문상태</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderItemId}>
              <td>{order.orderNumber}</td>
              <td>{order.buyerName}</td>
              <td>{order.itemName}</td>
              <td>{order.count}</td>
              <td>{order.totalPrice.toLocaleString()}원</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default OrderList;

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
