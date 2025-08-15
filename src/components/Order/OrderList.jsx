import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../../api/axios';
import AddressListModal from '../AddressListModal';
import DeliveryModal from '../DeliveryModal';
import { useParams, useNavigate } from 'react-router-dom';
import StepProgress from '../common/StepProgress';

// PaymentComponent를 모달 없이 바로 결제 실행하도록 수정
const PaymentComponent = ({ orderInfo, onPaymentComplete, onClose }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
    script.async = true;
    document.body.appendChild(script);

    const requestPay = () => {
      if (!window.IMP) {
        alert('결제 모듈 로딩 실패');
        onClose();
        return;
      }

      const { IMP } = window;
      IMP.init('imp72461217'); // 가맹점 식별코드

      const merchantUid = `mid_${new Date().getTime()}`;

      // orderInfo에서 필요한 정보 추출
      const {
        orderId,
        totalAmount,
        buyerInfo,
        orders,
        selectedPayment,
        selectedAddressId,
        selectedCartItemIds,
      } = orderInfo;

      // 상품명 생성 (첫 번째 상품명 + 외 n개)
      const productName =
        orders.length > 1
          ? `${orders[0].itemName} 외 ${orders.length - 1}개`
          : orders[0]?.itemName || '상품';

      // 결제 수단에 따른 pg 설정
      let pgProvider = 'html5_inicis';
      let payMethod = 'card';

      switch (selectedPayment) {
        case '신용카드':
          pgProvider = 'html5_inicis';
          payMethod = 'card';
          break;
        case '무통장입금':
          pgProvider = 'html5_inicis';
          payMethod = 'vbank';
          break;
        case '카카오페이':
          pgProvider = 'kakaopay';
          payMethod = 'card';
          break;
        case '토스페이':
          pgProvider = 'tosspay';
          payMethod = 'card';
          break;
        case '네이버페이':
          pgProvider = 'html5_inicis';
          payMethod = 'card';
          break;
        case '페이코':
          pgProvider = 'payco';
          payMethod = 'card';
          break;
        case '삼성페이':
          pgProvider = 'smilepay';
          payMethod = 'card';
          break;
        default:
          pgProvider = 'html5_inicis';
          payMethod = 'card';
      }

      IMP.request_pay(
        {
          pg: pgProvider,
          pay_method: payMethod,
          merchant_uid: merchantUid,
          name: productName,
          amount: totalAmount,
          buyer_name: buyerInfo.name,
          buyer_email: buyerInfo.email,
          buyer_tel: buyerInfo.phone,
        },
        async (response) => {
          if (response.success) {
            try {
              const result = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  impUid: response.imp_uid,
                  merchantUid: response.merchant_uid,
                  orderId,
                  selectedAddressId,
                  selectedCartItemIds,
                }),
              });

              const data = await result.json();

              if (data.success) {
                onPaymentComplete({
                  impUid: response.imp_uid,
                  merchantUid: response.merchant_uid,
                  payMethod: selectedPayment,
                  amount: totalAmount,
                });
              } else {
                alert('서버 결제 검증 실패');
                onClose();
              }
            } catch (error) {
              console.error('결제 검증 오류:', error);
              alert('서버 결제 검증 실패');
              onClose();
            }
          } else {
            alert(`결제 실패: ${response.error_msg}`);
            onClose();
          }
        }
      );
    };

    // 스크립트 로드 후 바로 결제 실행
    script.onload = () => {
      requestPay();
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [orderInfo, onPaymentComplete, onClose]);

  // 모달 UI 없이 빈 컴포넌트 반환 (결제창은 아임포트에서 자동으로 팝업)
  return null;
};

const OrderList = () => {
  const POINT_UNIT = 10;
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedCartItemIds, setSelectedCartItemIds] = useState([]);
  const [addressForm, setAddressForm] = useState({
    zoneCode: '',
    baseAddress: '',
    detailAddress: '',
    recipient: '',
    phone: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [selectedAddressType, setSelectedAddressType] = useState('basic');
  const [defaultAddress, setDefaultAddress] = useState(null);

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isAddressListModalOpen, setIsAddressListModalOpen] = useState(false);
  const [deliveryModalInitialData, setDeliveryModalInitialData] =
    useState(null);
  const [preSelectedAddressId, setPreSelectedAddressId] = useState(null);
  const [prevAddressType, setPrevAddressType] = useState(selectedAddressType);

  const [selectedPayment, setSelectedPayment] = useState('신용카드');

  // PaymentComponent 실행을 위한 상태
  const [showPaymentComponent, setShowPaymentComponent] = useState(false);

  const PAYMENT_OPTIONS = {
    신용카드: '신용카드 결제창이 전환됩니다.',
    무통장입금: '무통장입금 결제창이 전환됩니다.',
    카카오페이: '카카오페이 앱으로 결제창이 전환됩니다.',
    토스페이: '토스 앱으로 결제창이 전환됩니다.',
    네이버페이: '네이버페이 결제창으로 이동합니다.',
    페이코: '페이코 앱으로 결제창이 전환됩니다.',
    삼성페이: '삼성페이 앱으로 결제창이 전환됩니다.',
  };

  // 배송지 타입 변경 시
  const handleAddressTypeChange = (type) => {
    setPrevAddressType(selectedAddressType);

    if (type === 'basic') {
      if (defaultAddress) {
        setAddressForm(defaultAddress);
        setSelectedAddressId(defaultAddress.id || null);
        setSelectedAddressType('basic');
      }
      setIsDeliveryModalOpen(false);
      setIsAddressListModalOpen(false);
    } else if (type === 'select') {
      // 배송지 목록 모달 열기
      setIsAddressListModalOpen(true);
      setIsDeliveryModalOpen(false);
      setSelectedAddressType('select');
    } else if (type === 'new') {
      // 새로운 배송지 입력 모달 열기
      setIsDeliveryModalOpen(true);
      setIsAddressListModalOpen(false);
      setSelectedAddressType('new');
    }
  };

  // 배송지 목록 모달에서 주소 선택 시 처리
  const handleAddressListConfirm = (address) => {
    setSelectedAddressId(address.id);
    setAddressForm({
      zoneCode: address.zoneCode || '',
      baseAddress: address.baseAddress || '',
      detailAddress: address.detailAddress || '',
      recipient: address.recipient || '',
      phone: address.phone || '',
    });
    setSelectedAddressType('select');
    setIsAddressListModalOpen(false);
  };

  // 결제하기 버튼 클릭 시 바로 PaymentComponent 실행 (모달 없이)
  const handlePaymentClick = () => {
    if (!orderData) {
      alert('주문정보를 불러오는 중입니다. 잠시 후 시도해주세요.');
      return;
    }

    if (selectedCartItemIds.length === 0) {
      alert('주소와 상품을 선택해주세요.');
      return;
    }

    if (!selectedAddressId) {
      alert('배송지를 선택해주세요.');
      return;
    }

    // PaymentComponent 실행 (모달 없이 바로 결제창 팝업)
    setShowPaymentComponent(true);
  };

  // PaymentComponent에서 결제 완료 시 호출될 함수
  const handlePaymentComplete = (paymentResult) => {
    setShowPaymentComponent(false);

    // 결제 완료 후 주문 완료 처리
    axios
      .post(`/api/orders/${orderId}/complete`, {
        addressId: selectedAddressId,
        paymentInfo: paymentResult,
      })
      .then((res) => {
        alert(res.data.message || '주문이 완료되었습니다!');
        navigate(`/order/${orderId}/complete`);
      })
      .catch((err) => {
        alert(err.response?.data?.error || '주문 처리 중 오류가 발생했습니다.');
      });
  };

  // PaymentComponent 닫기
  const handlePaymentClose = () => {
    setShowPaymentComponent(false);
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
    const isRefresh = () => {
      const navEntries = performance.getEntriesByType('navigation');
      return navEntries.length > 0 && navEntries[0].type === 'reload';
    };

    const sendDeleteRequest = () => {
      fetch('/api/orders/temporary', {
        method: 'DELETE',
        keepalive: true, // 페이지가 닫혀도 요청을 보냄
      });
    };

    const handleBeforeUnload = (event) => {
      if (!isRefresh()) {
        sendDeleteRequest();
      }
    };

    const handlePopState = () => {
      sendDeleteRequest();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`/api/orders/${orderId}`)
      .then((res) => {
        const data = res.data;
        console.log(data);
        setOrderData(data);
        setOrders(data.orderItems || []);
        setBuyerInfo({
          name: data.name || '',
          phone: data.phoneNumber || '',
          email: data.email || '',
        });
        setSelectedCartItemIds(
          res.data.orderItems.map((item) => item.cartItemId)
        );
        const defaultAddr = {
          id: data.addressId || null,
          zoneCode: data.zoneCode || '',
          baseAddress: data.baseAddress || '',
          detailAddress: data.detailAddress || '',
          recipient: data.recipient || '',
          phone: data.addressPhone || '',
        };
        setDefaultAddress(defaultAddr);

        // 선택된 주소가 없을 때만 기본주소로 설정
        if (!selectedAddressId) {
          setAddressForm(defaultAddr);
          setSelectedAddressId(defaultAddr.id);
          setSelectedAddressType('basic');
        }
      })
      .catch((err) => console.error('주문 내역 불러오기 실패', err));
  }, [orderId]);

  return (
    <Container>
      <Section>
        <StepProgressWrapper>
          <StepProgress currentStep={2} />
        </StepProgressWrapper>
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
                  onChange={() => handleAddressTypeChange('basic')}
                />{' '}
                기본 배송지
              </label>

              <label>
                <input
                  type="radio"
                  name="addressType"
                  checked={selectedAddressType === 'select'}
                  onChange={() => handleAddressTypeChange('select')}
                />{' '}
                선택 배송지
              </label>

              <AddressListButton
                type="button"
                onClick={() => {
                  handleAddressTypeChange('new'); // 모달 열기
                }}
              >
                새로운 배송지 추가
              </AddressListButton>
            </AddressRadioGroup>

            {isDeliveryModalOpen && (
              <DeliveryModal
                onClose={() => {
                  setIsDeliveryModalOpen(false);
                  setSelectedAddressType(prevAddressType);
                }}
                initialData={deliveryModalInitialData}
                onSaveComplete={(savedAddress) => {
                  // 배송지 모달 닫기
                  setIsDeliveryModalOpen(false);
                  // 방금 저장한 주소 ID 저장
                  setPreSelectedAddressId(savedAddress.id);
                  // 목록 모달 켜기
                  setIsAddressListModalOpen(true);
                }}
              />
            )}

            {isAddressListModalOpen && (
              <AddressListModal
                onClose={() => setIsAddressListModalOpen(false)}
                preSelectedId={preSelectedAddressId} // 목록에서 기본 선택
                onConfirm={handleAddressListConfirm}
              />
            )}

            {showAddressForm && (
              <AddressForm>
                <FormGroup>
                  <label>우편번호</label>
                  <Input type="text" value={addressForm.zoneCode} readOnly />
                </FormGroup>

                <FormGroup>
                  <label>기본주소</label>
                  <Input type="text" value={addressForm.baseAddress} readOnly />
                </FormGroup>

                <FormGroup>
                  <label>상세주소</label>
                  <Input
                    type="text"
                    value={addressForm.detailAddress}
                    readOnly
                  />
                </FormGroup>

                <FormGroup>
                  <label>받는 사람</label>
                  <Input type="text" value={addressForm.recipient} readOnly />
                </FormGroup>

                <FormGroup>
                  <label>전화번호</label>
                  <Input type="text" value={addressForm.phone} readOnly />
                </FormGroup>
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
              <span>{orderData?.itemTotalAmount.toLocaleString()}원</span>
            </PriceRow>
            <PriceRow>
              <PointsBox>
                <PointsRow>
                  <span>보유 적립금</span>
                  <PointsStrong>
                    {orderData.availablePoints.toLocaleString()}원
                  </PointsStrong>
                </PointsRow>

                <PointsControl>
                  <input
                    type="text"
                    // value={usedPoint}
                    // onChange={handlePointChange}
                    placeholder="사용할 적립금 입력"
                    inputMode="numeric"
                    disabled={!orderData}
                  />
                  <button
                    type="button"
                    // onClick={handleUseMaxPoint}
                    disabled={!orderData}
                  >
                    최대사용
                  </button>
                  {/* {usedPoint > 0 && (
                    <button type="button" onClick={handleClearPoint}>
                      초기화
                    </button>
                  )} */}
                </PointsControl>

                <PointsHelp>
                  {POINT_UNIT > 1
                    ? `적립금은 ${POINT_UNIT.toLocaleString()}원 단위로 사용 가능합니다.`
                    : '적립금은 1원 단위로 사용 가능합니다.'}
                </PointsHelp>
              </PointsBox>
            </PriceRow>
            <PriceRow>
              <span>쿠폰할인</span>
              <span>-0원</span>
            </PriceRow>
            <PriceRow>
              <span>배송비</span>
              <span>{orderData?.totalDeliveryFee}원</span>
            </PriceRow>
            <PriceRow total>
              <span>최종 결제금액</span>
              <span>{orderData?.totalAmount.toLocaleString()}원</span>
            </PriceRow>
            <PayButton onClick={handlePaymentClick}>
              {orderData?.totalAmount.toLocaleString()}원 결제하기
            </PayButton>
          </Summary>
        </RightPanel>
      </CheckoutLayout>

      {/* PaymentComponent - 모달 없이 바로 결제 실행 */}
      {showPaymentComponent && orderData && (
        <PaymentComponent
          orderInfo={{
            orderId,
            totalAmount: orderData.totalAmount,
            buyerInfo,
            orders,
            selectedPayment,
            selectedAddressId,
            selectedCartItemIds,
          }}
          onPaymentComplete={handlePaymentComplete}
          onClose={handlePaymentClose}
        />
      )}
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

const StepProgressWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px; /* 타이틀과 간격 */
`;

const Title = styled.h2`
  font-size: 34px;
  text-align: center;
  margin: 0 0 40px 0; /* 아래쪽 마진 유지 */
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
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
  }

  input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.95rem;
  }

  button {
    background: #222;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    &:hover {
      background: #444;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: ${({ readOnly }) => (readOnly ? '#f5f5f5' : 'white')};
  cursor: ${({ readOnly }) => (readOnly ? 'default' : 'text')};
  font-size: 16px;

  &:focus {
    border-color: ${({ readOnly }) => (readOnly ? '#ccc' : '#0056ff')};
    outline: none;
  }
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

const PointsBox = styled.div`
  margin: 12px 0;
  padding: 16px;
  background: #fafafa; /* Summary와 톤 통일 */
  border-radius: 8px;
  border: 1px solid #ddd; /* 기존 보더 컬러와 일치 */
`;

const PointsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ gapless }) => (gapless ? '0' : '10px')};
`;

const PointsStrong = styled.strong`
  font-weight: 600; /* 지나치게 튀지 않게 600 */
  color: #222; /* Summary 텍스트 톤과 유사 */
  font-size: 14px;
`;

const PointsControl = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;

  input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    background: #fff;
  }

  button {
    padding: 10px 12px;
    min-width: 90px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: #f5f7ff; /* 기존 버튼 hover와 톤 맞춤 */
      border-color: rgb(85, 90, 130);
      color: rgb(85, 90, 130);
    }

    &:disabled {
      background: #f2f2f2;
      color: #999;
      border-color: #ddd;
      cursor: not-allowed;
    }
  }
`;

const PointsHelp = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #777; /* NoticeBox보다 톤을 낮춰 부드럽게 */
`;
