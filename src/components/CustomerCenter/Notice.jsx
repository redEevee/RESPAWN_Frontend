import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

const NOTICE_TYPES = {
  SHIPPING: '배송',
  ORDER: '주문',
  ACCOUNT: '계정',
  OPERATIONS: '운영',
};

const Notice = () => {
  const { noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotice = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(
        `/api/notices/view?noticeId=${noticeId}`
      );
      setNotice(data);
    } catch (e) {
      setError('공지사항을 불러오는 중 오류가 발생했습니다.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [noticeId]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <ErrorBox>{error}</ErrorBox>;
  if (!notice) return <p>공지사항 정보가 없습니다.</p>;

  return (
    <Page>
      <Card>
        <MetaInfo>
          <span>작성자: {notice.adminName}</span>
          <span>작성일: {notice.createdAt?.substring(0, 10)}</span>
          <span>조회수: {notice.viewCount}</span>
        </MetaInfo>

        <Field>
          <Label>제목</Label>
          <ContentView>{notice.title}</ContentView>
        </Field>
        <Field>
          <Label>공지 타입</Label>
          <ContentView>
            {NOTICE_TYPES[notice.noticeType] || notice.noticeType}
          </ContentView>
        </Field>
        <Field>
          <Label>설명</Label>
          <DescriptionView>{notice.description}</DescriptionView>
        </Field>
      </Card>
    </Page>
  );
};

export default Notice;

const Page = styled.div`
  display: grid;
  gap: 16px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 16px;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
`;

const ErrorBox = styled.div`
  color: #ef4444;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
`;

const ContentView = styled.div`
  padding: 12px;
  font-size: 15px;
  color: #111827;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const DescriptionView = styled.div`
  padding: 12px;
  font-size: 15px;
  color: #374151;
  white-space: pre-wrap;
  line-height: 1.6;
  min-height: 200px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
`;
