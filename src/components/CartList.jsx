import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';

const CartList = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/cart`)
      .then((res) => {
        const itemsWithChecked = res.data.cartItems.map((item) => ({
          ...item,
          checked: true, // ✅ 초기값 true or false
        }));
        setCartItems(itemsWithChecked);
      })
      .catch((err) => console.error('장바구니 데이터 로드 실패', err));
  }, []);

  const handleCountIncrease = async (cartItemId) => {
    try {
      // 백엔드 수량 업데이트 요청
      await axios.post(`/api/cart/items/${cartItemId}/increase`, {
        amount: 1,
      });

      // 프론트 UI 업데이트
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, count: item.count + 1 }
            : item
        )
      );
    } catch (error) {
      console.error('수량 변경 실패:', error);
      alert('수량 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCountDecrease = async (cartItemId) => {
    const targetItem = cartItems.find((item) => item.cartItemId === cartItemId);
    if (!targetItem || targetItem.count <= 1) return;

    try {
      // 백엔드 수량 업데이트 요청
      await axios.post(`/api/cart/items/${cartItemId}/decrease`, {
        amount: 1,
      });

      // 프론트 UI 업데이트
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, count: item.count - 1 }
            : item
        )
      );
    } catch (error) {
      console.error('수량 변경 실패:', error);
      alert('수량 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCheck = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems
      .filter((item) => item.checked)
      .reduce((acc, item) => acc + item.itemPrice * item.count, 0);
  };

  const handleDeleteItem = async (cartItemId) => {
    const confirmDelete = window.confirm('정말 삭제할까요?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/cart/items/${cartItemId}`);
      // 삭제 성공 시 화면에서도 제거
      setCartItems((prev) =>
        prev.filter((item) => item.cartItemId !== cartItemId)
      );
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <Title>장바구니</Title>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>상품정보</th>
            <th>수량</th>
            <th>상품금액</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <ItemRow key={item.cartItemId}>
              <td>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheck(item.cartItemId)}
                />
              </td>
              <td>
                <ProductInfo>
                  <img src={item.imageUrl} alt={item.imageUrl} />
                  <span>{item.itemName}</span>
                </ProductInfo>
              </td>
              <td>
                <CountControl>
                  <button onClick={() => handleCountDecrease(item.cartItemId)}>
                    -
                  </button>
                  <span>{item.count}</span>
                  <button onClick={() => handleCountIncrease(item.cartItemId)}>
                    +
                  </button>
                </CountControl>
              </td>
              <td>
                <Price>
                  {(item.itemPrice * item.count).toLocaleString()}원
                </Price>
                <OrderButton>주문하기</OrderButton>
                <DeleteButton onClick={() => handleDeleteItem(item.cartItemId)}>
                  삭제
                </DeleteButton>
              </td>
            </ItemRow>
          ))}
        </tbody>
      </Table>

      <Summary>
        <FinalPrice>
          결제 예정 금액 <span>{getTotalPrice().toLocaleString()}원</span>
        </FinalPrice>
        <GreenButton>주문하기</GreenButton>
      </Summary>
    </Container>
  );
};

export default CartList;

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

const CountControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    width: 30px;
    height: 30px;
    font-size: 18px;
    background: #eee;
    border: none;
    cursor: pointer;
  }
`;

const Price = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const OrderButton = styled.button`
  background-color: rgb(85, 90, 130);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
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

const GreenButton = styled.button`
  margin-top: 20px;
  width: 200px;
  height: 50px;
  background-color: rgb(85, 90, 130);
  color: white;
  border: none;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  margin-left: 10px;
  background-color: #ccc;
  color: #333;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
`;
