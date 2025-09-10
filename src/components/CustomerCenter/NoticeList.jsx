import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Pagination from '../Pagination';

const NOTICE_TYPE_MAP = {
  ACCOUNT: { label: '계정' },
  SHIPPING: { label: '배송' },
  ORDER: { label: '주문' },
  OPERATIONS: { label: '운영' },
};

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    isFirst: true,
    isLast: true,
  });

  const currentPage = pageInfo.page + 1;
  const totalPages = pageInfo.totalPages;

  const handlePageChange = (page1) => {
    if (page1 < 1 || (totalPages > 0 && page1 > totalPages)) return;
    setPageInfo((p) => ({ ...p, page: page1 - 1 }));
  };

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const { page, size } = pageInfo;
        const { data } = await axios.get('/api/notices/summaries', {
          params: { page, size },
        });
        const content = data.content || [];
        const meta = data.page || data || {};
        setNotices(content);
        setPageInfo((prev) => ({
          ...prev,
          page: typeof meta.number === 'number' ? meta.number : prev.page,
          size: typeof meta.size === 'number' ? meta.size : prev.size,
          totalPages:
            typeof meta.totalPages === 'number'
              ? meta.totalPages
              : prev.totalPages,
          totalElements:
            typeof meta.totalElements === 'number'
              ? meta.totalElements
              : content.length,
          isFirst:
            typeof meta.first === 'boolean'
              ? meta.first
              : (meta.number ?? 0) === 0,
          isLast:
            typeof meta.last === 'boolean'
              ? meta.last
              : (meta.number ?? 0) + 1 >= (meta.totalPages ?? 1),
        }));
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [pageInfo.page, pageInfo.size]);

  const formatDate = (dateString) => String(dateString).substring(0, 10);

  return (
    <Wrap>
      <TableWrap>
        <StyledTable role="table" aria-label="공지사항 목록">
          <thead>
            <Tr as="tr">
              <Th as="th" style={{ width: 80 }}>
                번호
              </Th>
              <Th as="th" style={{ width: 100 }}>
                유형
              </Th>
              <Th as="th">제목</Th>
              <Th as="th" style={{ width: 140 }}>
                작성일
              </Th>
            </Tr>
          </thead>
          <tbody>
            {loading ? (
              <Tr as="tr">
                <Td as="td" colSpan={4} style={{ textAlign: 'center' }}>
                  목록을 불러오는 중입니다...
                </Td>
              </Tr>
            ) : notices.length > 0 ? (
              notices.map((notice, idx) => {
                // 번호: 전체 개수에서 현재 페이지 기준 역순 번호 예시
                const rowNumber =
                  pageInfo.totalElements -
                  (pageInfo.page * pageInfo.size + idx);
                return (
                  <Tr
                    as="tr"
                    key={notice.id}
                    tabIndex={0}
                    role="row"
                    onClick={() =>
                      navigate(`/customerCenter/notices/${notice.id}`)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/customerCenter/notices/${notice.id}`);
                      }
                    }}
                  >
                    <Td as="td">{rowNumber}</Td>
                    <Td as="td">
                      <TypeBadge title={notice.noticeType}>
                        {NOTICE_TYPE_MAP[notice.noticeType]?.label ||
                          notice.noticeType}
                      </TypeBadge>
                    </Td>
                    <Td as="td">
                      <Ellipsis title={notice.title}>{notice.title}</Ellipsis>
                    </Td>
                    <Td as="td">
                      <Mono>{formatDate(notice.createdAt)}</Mono>
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr as="tr">
                <Td as="td" colSpan={4} style={{ textAlign: 'center' }}>
                  등록된 공지사항이 없습니다.
                </Td>
              </Tr>
            )}
          </tbody>
        </StyledTable>
      </TableWrap>

      {!loading && notices.length > 0 && pageInfo.totalPages > 1 && (
        <PaginationBar>
          <Pagination
            currentPage={currentPage}
            totalPages={pageInfo.totalPages}
            onPageChange={handlePageChange}
            isFirst={pageInfo.isFirst}
            isLast={pageInfo.isLast}
          />
        </PaginationBar>
      )}
    </Wrap>
  );
}

export default Notices;

// styles
const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;

const TableWrap = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Tr = styled.tr`
  &:focus-within td {
    outline: 2px solid #94a3b8;
    outline-offset: -2px;
  }
  cursor: pointer;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;

  &:first-child {
    border-top-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
  }
`;

const Td = styled.td`
  padding: 12px 14px;
  color: #111827;
  font-size: 14px;
  border-bottom: 1px solid #eef2f7;
`;

const Mono = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: #374151;
`;

const Ellipsis = styled.span`
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 800;
  border-radius: 6px;
  color: #fff;
`;

const PaginationBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 8px;
`;
