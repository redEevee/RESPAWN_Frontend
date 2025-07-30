import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

const RefundPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const handleGoBack = () => {
    navigate(-1); // 브라우저 history에서 한 단계 뒤로
  };

  // 주문 정보 상태
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    // 주문 단건 조회 API 호출
    fetch(`/api/orders/history/${orderId}`)
      .then((res) => res.json())
      .then(setOrder)
      .catch(console.error);
  }, [orderId]);

  // 폼 상태 (사유/상세내용만)
  const [reason, setReason] = useState('');
  const [detail, setDetail] = useState('');

  // 유효성: 사유만 필수 (orderId도 있어야 함)
  const isValid = useMemo(() => {
    return Boolean(orderId && reason);
  }, [orderId, reason]);

  // 제출 (orderId, reason, detail만 전송)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      orderId: Number(orderId),
      reason,
      detail,
    };

    console.log('전송할 데이터:', payload);

    // 서버에서 전체 환불 요청 저장 엔드포인트 예시:
    // POST /api/orders/refund
    // Content-Type: application/json
    //
    // 요청 바디(JSON):
    // {
    //   "orderId": 123,
    //   "reason": "defect",
    //   "detail": "옷에 봉제 불량이 있습니다."
    // }

    // 서버 응답: 200 OK (또는 201 Created)

    try {
      const res = await fetch(`/api/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('환불 요청 실패');
      alert('환불 요청이 접수되었습니다.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('환불 요청 중 오류가 발생했습니다.');
    }
  };

  // 로딩/에러/빈 orderId 처리
  if (!orderId) {
    return (
      <PageWrap>
        <Header>
          <Title>환불 신청</Title>
          <Desc>orderId가 없습니다. 주문 내역에서 다시 시도해 주세요.</Desc>
        </Header>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <Header>
        <Title>환불 신청</Title>
        <Desc>
          해당 주문 전체 환불을 요청합니다. 사유와 상세 내용을 입력해 주세요.
        </Desc>
      </Header>

      {/* 주문 요약 (읽기 전용) */}
      <Section>
        <SectionTitle>주문 정보</SectionTitle>
        {order && (
          <>
            <OrderMeta>
              <div>주문번호: {order.orderId}</div>
              {order.orderDate && (
                <div>
                  주문일시: {new Date(order.orderDate).toLocaleString()}
                </div>
              )}
              <div>총 결제금액: {order.totalAmount?.toLocaleString()}원</div>
            </OrderMeta>

            {Array.isArray(order.items) && order.items.length > 0 && (
              <ItemList>
                {order.items.map((item) => (
                  <ItemRow key={item.itemId}>
                    <Thumb
                      onClick={() =>
                        window.open(`/ProductDetail/${item.itemId}`, '_blank')
                      }
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.itemName} />
                      ) : (
                        <NoImage>NO IMAGE</NoImage>
                      )}
                    </Thumb>
                    <ItemInfo>
                      <div className="name">{item.itemName}</div>
                      <div className="meta">
                        수량 {item.count}개 · {item.price?.toLocaleString()}원
                      </div>
                    </ItemInfo>
                  </ItemRow>
                ))}
              </ItemList>
            )}
          </>
        )}
      </Section>

      {/* 환불 사유/내용만 입력 */}
      <Section as="form" onSubmit={handleSubmit}>
        <SectionTitle>환불 정보</SectionTitle>

        <FormGrid>
          <FormRow>
            <Label htmlFor="reason">사유</Label>
            <Select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="불량/하자">불량/하자</option>
              <option value="단순 변심">단순 변심</option>
              <option value="오배송">오배송</option>
              <option value="기타">기타</option>
            </Select>
          </FormRow>

          <FormRow>
            <Label htmlFor="detail">상세 내용</Label>
            <Textarea
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="상세 사유를 작성해 주세요 (선택)"
              maxLength={499}
            />
            <Hint>{detail.length}/500</Hint>
          </FormRow>
        </FormGrid>

        <Divider />

        <ActionBar>
          <Note>※ 환불은 판매자 정책 및 기간에 따라 제한될 수 있습니다.</Note>
          <ButtonGroup>
            <BackButton onClick={handleGoBack}>뒤로가기</BackButton>
            <SubmitButton type="submit" disabled={!isValid}>
              환불 신청하기
            </SubmitButton>
          </ButtonGroup>
        </ActionBar>
      </Section>
    </PageWrap>
  );
};

export default RefundPage;

/* -------------------- styled -------------------- */
const PageWrap = styled.div`
  max-width: 920px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const Header = styled.header`
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 6px;
  color: #111827;
`;

const Desc = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
`;

const Section = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 1.05rem;
  margin: 0 0 12px;
  color: #111827;
`;

const OrderMeta = styled.div`
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
  color: #374151;
`;

const ItemList = styled.div`
  display: grid;
  gap: 12px;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
`;

const Thumb = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
`;

const ItemInfo = styled.div`
  .name {
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }
  .meta {
    color: #6b7280;
    font-size: 0.9rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 14px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #111827;
`;

const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  background: #fff;
  &:focus {
    border-color: #111827;
  }
`;

const Textarea = styled.textarea`
  min-height: 96px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  resize: vertical;
  &:focus {
    border-color: #111827;
  }
`;

const Hint = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0 8px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const Note = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px; /* 버튼 사이 간격 */
  align-items: center;
`;

const BackButton = styled.button`
  padding: 10px 16px;
  font-weight: 700;
  border-radius: 10px;
  background: #333; /* 제출버튼보다 연한 어두운 배경 */
  color: #fff;
  border: none;
  cursor: pointer;
  opacity: 1;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000; /* 제출버튼 배경색으로 호버 */
  }
`;

const SubmitButton = styled.button`
  padding: 10px 16px;
  font-weight: 700;
  border-radius: 10px;
  background: #333;
  color: #fff;
  border: none;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000; /* 호버 시 더 진한 검정 */
  }
`;
