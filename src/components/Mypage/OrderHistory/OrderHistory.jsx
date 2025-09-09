import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import OrderCard from './OrderCard';
import axios from '../../../api/axios';
import Pagination from '../../Pagination';
import { useLocation } from 'react-router-dom';

const ORDERS_PER_PAGE = 5;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('/api/orders/history');
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('주문 내역 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchOrderHistory();
      // 상태 초기화: 뒤로가거나 새로고침 시 같은 효과 방지 location.state가 변경될때만
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 검색 필터
  const filteredOrders = orders.filter((order) =>
    order.items.some((item) =>
      item.itemName.toLowerCase().includes(appliedSearchTerm.toLowerCase())
    )
  );

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const startIdx = (currentPage - 1) * ORDERS_PER_PAGE;
  const currentOrders = filteredOrders.slice(
    startIdx,
    startIdx + ORDERS_PER_PAGE
  );

  // 검색 버튼 눌렀을 때 상태 업데이트 함수
  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Container>
      <Title>주문 내역</Title>
      <SearchBarWrapper>
        <SearchBar
          type="text"
          placeholder="주문한 상품을 검색할 수 있어요!"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={onSearchKeyDown}
        />
        <SearchButton onClick={handleSearch}>조회</SearchButton>
      </SearchBarWrapper>
      {currentOrders.length === 0 ? (
        <EmptyMessage>주문 내역이 없습니다.</EmptyMessage>
      ) : (
        currentOrders.map((order) => (
          <OrderCard key={order.orderId} order={order} />
        ))
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Container>
  );
};

export default OrderHistory;

const Container = styled.div`
  max-width: 1000px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchBar = styled.input`
  flex: 1;
  padding: 12px 18px;
  font-size: 18px;
  border: 2px solid #ddd;
  border-radius: 10px;
  transition: border-color 0.3s ease;
  outline: none;
  box-shadow: inset 0 2px 5px rgb(0 0 0 / 0.05);

  &:focus {
    border-color: #555a82;
    box-shadow: 0 0 8px rgba(85, 90, 130, 0.5);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const SearchButton = styled.button`
  padding: 12px 28px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  background: linear-gradient(135deg, #5560a6, #7b81c9);
  color: white;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(85, 90, 130, 0.3);
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #7b81c9, #5560a6);
    box-shadow: 0 8px 15px rgba(85, 90, 130, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmptyMessage = styled.div`
  font-size: 18px;
  color: #6b7280;
  text-align: center;
  padding: 40px 0;
`;
