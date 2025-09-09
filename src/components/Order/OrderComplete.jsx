import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import StepProgress from '../common/StepProgress';

function OrderComplete() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (v) => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n.toLocaleString() : '0';
  };

  const paymentMethodLabel = (code) => {
    switch (code) {
      case 'card':
        return '신용/체크카드';
      case 'trans':
        return '계좌이체';
      case 'vbank':
        return '가상계좌';
      case 'phone':
        return '휴대폰 결제';
      default:
        return code ?? '-';
    }
  };

  useEffect(() => {
    if (!orderId) return;
    const fetchOrderInfo = async () => {
      try {
        const response = await axios.get(
          `/api/orders/${orderId}/complete-info`
        );
        console.log(response.data);
        setOrderInfo(response.data);
      } catch {
        setError('주문 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderInfo();
  }, [orderId]);

  const handleGoHome = () => navigate('/');
  const handleGoMyPage = () => navigate('/mypage');

  if (loading) return <Root>주문 정보를 불러오는 중입니다...</Root>;
  if (error) return <Root>{error}</Root>;
  if (!orderInfo) return null;

  return (
    <Root>
      <Card>
        <StepProgressWrapper>
          <StepProgress currentStep={3} />
        </StepProgressWrapper>
        <Header>
          <div>
            <MainMsg>주문이 완료되었습니다</MainMsg>
            <Info>
              <span>
                주문일시{' '}
                <b>
                  {orderInfo?.orderDate
                    ? new Date(orderInfo.orderDate).toLocaleString('ko-KR')
                    : '-'}
                </b>
              </span>
              <span>
                주문번호 <OrderNum>{orderInfo.orderId}</OrderNum>
              </span>
            </Info>
          </div>
        </Header>

        <SectionTitle>주문 상품</SectionTitle>
        <Table>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>이미지</th>
              <th style={{ textAlign: 'left' }}>상품명</th>
              <th style={{ textAlign: 'center' }}>수량</th>
              <th style={{ textAlign: 'center' }}>단가</th>
              <th style={{ textAlign: 'center' }}>금액</th>
            </tr>
          </thead>
          <tbody>
            {orderInfo?.orderItems?.map((item) => {
              const unit = item?.orderPrice;
              const qty = item?.count;
              const lineTotal = (Number(unit) || 0) * (Number(qty) || 0);

              return (
                <tr key={item.orderItemId}>
                  <td style={{ textAlign: 'center' }}>
                    <img src={item.imageUrl} alt="" width={64} />
                  </td>
                  <td>{item.itemName ?? '-'}</td>
                  <td style={{ textAlign: 'center' }}>{qty ?? 0}</td>
                  <td style={{ textAlign: 'center' }}>
                    {formatCurrency(unit)}원
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {formatCurrency(lineTotal)}원
                  </td>
                </tr>
              );
            }) ?? null}
          </tbody>
        </Table>

        <RowSection>
          <InfoCard>
            <InfoHeading>배송지 정보</InfoHeading>
            <InfoTable>
              <tbody>
                <tr>
                  <InfoTh>수령인</InfoTh>
                  <td>{orderInfo.deliveryInfo[0].address.recipient}</td>
                </tr>
                <tr>
                  <InfoTh>연락처</InfoTh>
                  <td>{orderInfo.deliveryInfo[0].address.phone}</td>
                </tr>
                <tr>
                  <InfoTh>주소</InfoTh>
                  <td>
                    [{orderInfo.deliveryInfo[0].address.zoneCode}]{' '}
                    {orderInfo.deliveryInfo[0].address.baseAddress}{' '}
                    {orderInfo.deliveryInfo[0].address.detailAddress}
                  </td>
                </tr>
              </tbody>
            </InfoTable>
          </InfoCard>
          <InfoCard>
            <InfoHeading>결제 정보</InfoHeading>
            <InfoTable>
              <tbody>
                <tr>
                  <InfoTh>결제수단</InfoTh>
                  <td>
                    {paymentMethodLabel(orderInfo?.paymentInfo?.paymentMethod)}
                  </td>
                </tr>
                <tr>
                  <InfoTh>PG사</InfoTh>
                  <td>{orderInfo?.paymentInfo?.pgProvider ?? '정보 없음'}</td>
                </tr>
                <tr>
                  <InfoTh>총 결제금액</InfoTh>
                  <td>
                    <TotalAmount>
                      {orderInfo.totalAmount.toLocaleString()}원
                    </TotalAmount>
                  </td>
                </tr>
              </tbody>
            </InfoTable>
          </InfoCard>
        </RowSection>

        <ButtonGroup>
          <ActionBtn onClick={handleGoHome}>홈으로</ActionBtn>
          <ActionBtn onClick={handleGoMyPage}>마이페이지</ActionBtn>
        </ButtonGroup>
      </Card>
    </Root>
  );
}

export default OrderComplete;

const Root = styled.div`
  min-height: 100vh;
  padding: 60px 20px;
  align-items: center;
  font-family: 'Noto Sans KR', sans-serif;
  color: #34495e;
`;

const StepProgressWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px; /* 타이틀과 간격 */
`;

const Card = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 18px;
  padding: 5px 36px;
  @media (max-width: 900px) {
    padding: 30px 6vw;
  }
`;

const Header = styled.div`
  margin-bottom: 38px;
`;

const MainMsg = styled.div`
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #2c3e50;
`;

const Info = styled.div`
  font-size: 15px;
  color: #607d8b;
  margin-top: 6px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
  }

  b {
    margin-left: 4px;
    font-weight: 600;
    color: #34495e;
  }
`;

const OrderNum = styled.span`
  color: #34495e;
  font-size: 16px;
  margin-left: 6px;
  font-weight: 700;
  letter-spacing: 0.05em;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #34495e;
  margin-top: 32px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0 12px;
  font-size: 16px;
  margin-bottom: 24px;

  thead th {
    font-weight: 700;
    color: #2c3e50;
    padding: 16px 12px;
    text-align: left;
    border-bottom: 2px solid #b0bec5;
  }

  tbody tr {
    background: #f9fbfd;
    border-radius: 14px;
    box-shadow: 0 3px 8px rgb(0 0 0 / 0.07);
    transition: background-color 0.25s ease;
  }
  tbody tr:hover {
    background: rgba(105, 111, 148, 0.2);
  }

  tbody td {
    padding: 16px 12px;
    vertical-align: middle;
    color: #34495e;
  }
`;

const RowSection = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 36px;
  margin-bottom: 24px;
  justify-content: center;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const InfoCard = styled.div`
  flex: 1;
  background: #fcfdff;
  border-radius: 18px;
  padding: 32px 28px 28px;
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.06);
  min-width: 360px;
`;

const InfoHeading = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 18px;
  padding: 0 0 12px;
  border-bottom: 2px solid #b0bec5;
`;

const InfoTable = styled.table`
  width: 100%;
  font-size: 15px;

  td {
    padding: 12px 0 12px 18px;
    color: #4a4a4a;
    vertical-align: top;
  }
  tr:not(:last-child) td,
  tr:not(:last-child) th {
    border-bottom: 1.2px solid #cfd8dc;
  }
`;

const InfoTh = styled.th`
  text-align: left;
  width: 90px;
  color: #34495e;
  font-weight: 600;
  padding-left: 0;
`;

const TotalAmount = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #1a2935;
  letter-spacing: 0.05em;
`;

const ButtonGroup = styled.div`
  margin-top: 48px;
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  min-width: 160px;
  background: rgb(105, 111, 148);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 16px 32px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgb(85, 90, 130);
  }

  &:active {
    transform: translateY(2px);
  }
`;
