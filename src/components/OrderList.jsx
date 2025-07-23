import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../api/axios';
import AddressListModal from '../components/AddressListModal';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedCartItemIds, setSelectedCartItemIds] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState('recent');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('신용카드');

  const PAYMENT_OPTIONS = {
    신용카드: ['삼성카드', '국민카드', '신한카드', '현대카드', '롯데카드'],
    무통장입금: [
      '국민은행',
      '기업은행',
      '신한은행',
      '우리은행',
      '하나은행',
      '농협',
    ],
    카카오페이: '카카오페이 앱으로 결제창이 전환됩니다.',
    토스페이: '토스 앱으로 결제창이 전환됩니다.',
    네이버페이: '네이버페이 결제창으로 이동합니다.',
    페이코: '페이코 앱으로 결제창이 전환됩니다.',
    삼성페이: '삼성페이 앱으로 결제창이 전환됩니다.',
  };

  const handleAddressConfirm = (addressId) => {
    setSelectedAddressId(addressId);
    setIsAddressModalOpen(false);
  };

  const handleOrderComplete = () => {
    if (selectedCartItemIds.length === 0) {
      alert('주소와 상품을 선택해주세요.');
      return;
    }
    axios
      .post(`/api/orders/${orderId}/complete`, {
        addressId: selectedAddressId,
        cartItemIds: selectedCartItemIds,
      })
      .then((res) => {
        alert(res.data.message || '주문이 완료되었습니다!');
        navigate('/mypage');
      })
      .catch((err) => {
        alert(err.response?.data?.error || '주문 처리 중 오류가 발생했습니다.');
      });
  };

  const renderPaymentDetail = () => {
    const option = PAYMENT_OPTIONS[selectedPayment];

    if (Array.isArray(option)) {
      return (
        <BankList>
          {option.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </BankList>
      );
    }

    if (typeof option === 'string') {
      return <NoticeBox>{option}</NoticeBox>;
    }

    return null;
  };

  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`/api/orders/${orderId}`)
      .then((res) => {
        const data = res.data;
        setOrders(res.data.orderItems || []);
        setBuyerInfo({
          name: data.buyerName || '',
          phone: data.buyerPhone || '',
          email: data.buyerEmail || '',
        });
        setSelectedAddressId(1);
        setSelectedCartItemIds(
          res.data.orderItems.map((item) => item.cartItemId)
        );
        setTotalAmount(data.totalAmount || 0);
      })
      .catch((err) => console.error('주문 내역 불러오기 실패', err));
  }, [orderId]);

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  return (
    <Container>
      <Section>
        <Title>주문결제</Title>
        <ProductTable>
          <thead>
            <tr>
              <th>상품정보</th>
              <th>상품가격</th>
              <th>수량</th>
              <th>주문금액</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => (
              <tr key={item.orderItemId}>
                <td>
                  <ProductInfo>
                    <img src={item.imageUrl} alt={item.itemName} />
                    <div>{item.itemName}</div>
                  </ProductInfo>
                </td>
                <td>{item.itemPrice.toLocaleString()}원</td>
                <td>{item.count}</td>
                <td>{(item.itemPrice * item.count).toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </ProductTable>
      </Section>

      <CheckoutLayout>
        <LeftPanel>
          <AddressSection>
            <AddressHeader onClick={() => setShowAddressForm(!showAddressForm)}>
              배송정보
              <span>{showAddressForm ? '▲' : '▼'}</span>
            </AddressHeader>
            <AddressRadioGroup>
              <label>
                <input
                  type="radio"
                  name="addressType"
                  checked={selectedAddressType === 'basic'}
                  onChange={() => setSelectedAddressType('basic')}
                />{' '}
                기본 배송지
              </label>

              <label>
                <input
                  type="radio"
                  name="addressType"
                  checked={selectedAddressType === 'new'}
                  onChange={() => setSelectedAddressType('new')}
                />{' '}
                새로운 주소
              </label>
              <AddressListButton onClick={handleOpenAddressModal}>
                배송지 목록
              </AddressListButton>
            </AddressRadioGroup>

            {isAddressModalOpen && (
              <AddressListModal
                onClose={handleCloseAddressModal}
                onConfirm={handleAddressConfirm}
              />
            )}

            {showAddressForm && (
              <AddressForm>
                <div>
                  <input type="text" placeholder="우편번호" />{' '}
                  <button>주소 찾기</button>
                </div>
                <input type="text" placeholder="기본주소" />
                <input type="text" placeholder="상세주소" />
                <input type="text" placeholder="받는사람 이름" />
                <PhoneGroup>
                  <select>
                    <option value="010">010</option>
                  </select>
                  -
                  <input type="text" maxLength={4} /> -{' '}
                  <input type="text" maxLength={4} />
                </PhoneGroup>
              </AddressForm>
            )}

            <SelectedAddressDisplay>
              {selectedAddressId
                ? `선택된 배송지 ID: ${selectedAddressId}`
                : '배송지를 선택해주세요.'}
            </SelectedAddressDisplay>
          </AddressSection>

          <PaymentSection>
            <h3>결제방법</h3>
            <PaymentMethodList>
              {Object.keys(PAYMENT_OPTIONS).map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  className={selectedPayment === method ? 'selected' : ''}
                >
                  {method}
                </button>
              ))}
            </PaymentMethodList>

            {renderPaymentDetail()}
          </PaymentSection>
        </LeftPanel>

        <RightPanel>
          <Summary>
            <h3>주문자 정보</h3>
            <PriceRow>
              <span>이름</span>
              <span>{buyerInfo.name}</span>
            </PriceRow>
            <PriceRow>
              <span>전화번호</span>
              <span>{buyerInfo.phone}</span>
            </PriceRow>
            <PriceRow>
              <span>이메일</span>
              <span>{buyerInfo.email}</span>
            </PriceRow>
          </Summary>

          <Summary>
            <h3>최종 결제 정보</h3>
            <PriceRow>
              <span>주문금액</span>
              <span>{}원</span>
            </PriceRow>
            <PriceRow>
              <span>즉시 적립금 할인</span>
              <span>-0원</span>
            </PriceRow>
            <PriceRow>
              <span>적립금 사용</span>
              <span>-0원</span>
            </PriceRow>
            <PriceRow>
              <span>쿠폰할인</span>
              <span>-0원</span>
            </PriceRow>
            <PriceRow>
              <span>배송비</span>
              <span>0원</span>
            </PriceRow>
            <PriceRow total>
              <span>최종 결제금액</span>
              <span>{totalAmount.toLocaleString()}원</span>
            </PriceRow>
            <PayButton onClick={handleOrderComplete}>
              {totalAmount.toLocaleString()}원 결제하기
            </PayButton>
          </Summary>
        </RightPanel>
      </CheckoutLayout>
    </Container>
  );
};

export default OrderList;

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 16px;
    border-bottom: 1px solid #eee;
    text-align: center;
  }

  th {
    background-color: #f9f9f9;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 70px;
    height: 70px;
    border-radius: 4px;
    object-fit: cover;
  }
`;

const CheckoutLayout = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
  align-items: flex-start;
`;

const LeftPanel = styled.div`
  flex: 2;
`;

const RightPanel = styled.div`
  flex: 1;
`;

const AddressSection = styled.div`
  margin: 40px 0;
`;

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
`;

const AddressRadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;

  label {
    font-size: 14px;
  }
`;

const AddressForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input,
  select,
  button {
    padding: 8px;
    font-size: 14px;
  }

  button {
    margin-left: 10px;
  }
`;

const PhoneGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PaymentSection = styled.div`
  margin-top: 40px;

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const PaymentMethodList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;

  button {
    padding: 12px 20px;
    min-width: 120px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f8ff;
      border-color: rgb(85, 90, 130);
      color: rgb(85, 90, 130);
    }

    &.selected {
      background-color: #e6f0ff;
      border-color: rgb(85, 90, 130);
      color: rgb(85, 90, 130);
      font-weight: 600;
    }

    &:disabled {
      background: #f2f2f2;
      color: #999;
      border-color: #ddd;
      cursor: not-allowed;
    }
  }
`;

const BankList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;

  div {
    background: #f5f5f5;
    padding: 10px;
    text-align: center;
    border-radius: 6px;
    font-size: 14px;
  }
`;

const NoticeBox = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 6px;
  font-size: 14px;
  color: #856404;
`;

const Summary = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  max-width: 400px;
  margin: 10px;

  h3 {
    margin-bottom: 20px;
    font-size: 20px;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: ${(props) => (props.total ? '18px' : '16px')};
  font-weight: ${(props) => (props.total ? 'bold' : 'normal')};
  color: ${(props) => (props.total ? '#e60023' : '#000')};
`;

const PayButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #000;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border: none;
  margin-top: 20px;
  cursor: pointer;
`;

const AddressListButton = styled.button`
  padding: 8px 14px;
  font-size: 14px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const SelectedAddressDisplay = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #555;
`;
