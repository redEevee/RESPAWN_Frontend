import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';

const Members = () => {
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState('buyer');
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
  });

  const currentPage1 = pageInfo.page + 1; // 1-based
  const totalPages1 = pageInfo.totalPages; // 이미 1-based 개념
  const handlePageChange = (page1) => {
    // 안전 가드
    if (page1 < 1 || page1 > totalPages1) return;
    setPageInfo((p) => ({ ...p, page: page1 - 1 })); // 0-based로 저장
  };

  // 입력 폼 상태
  const [filters, setFilters] = useState({
    from: '', // yyyy-MM-dd
    to: '', // yyyy-MM-dd
    keyword: '',
    field: 'name',
  });

  const [appliedFilters, setAppliedFilters] = useState({
    from: '',
    to: '',
    keyword: '',
    field: 'name',
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (s) => {
    if (!s) return '-';
    // "2025-08-19T20:11:49.562796" → "2025-08-19"
    return s.slice(0, 10);
  };

  const ymdToCompact = (yyyyMMdd) => {
    if (!yyyyMMdd) return '';
    const v = String(yyyyMMdd).trim();
    // 기대 포맷 길이: 10 (YYYY-MM-DD)
    if (v.length !== 10) return '';
    const compact = v.replaceAll('-', '');
    // 숫자 8자리인지 확인
    if (!/^\d{8}$/.test(compact)) return '';
    return compact;
  };

  const buildDateRange = (from, to) => {
    const f = ymdToCompact(from);
    const t = ymdToCompact(to);
    if (!f && !t) return '';
    return `${f}~${t}`;
  };

  const fetchMembers = async (page = pageInfo.page, size = pageInfo.size) => {
    setLoading(true);
    setError('');
    try {
      const url =
        roleTab === 'buyer' ? '/admin/buyers/paged' : '/admin/sellers/paged';

      const dateRange = buildDateRange(appliedFilters.from, appliedFilters.to);
      const params = {
        page,
        size,
        sort: 'username',
        dir: 'asc',
        keyword: appliedFilters.keyword || undefined,
        field: appliedFilters.field || undefined, // 없으면 서버 기본값(name)
        dateRange: dateRange || undefined,
      };
      const res = await axios.get(url, { params });
      console.log(res.data);

      const content = res.data.content || [];
      const normalized = content.map((u) => ({
        userId: u.id,
        username: u.username ?? '',
        name: u.name ?? '',
        email: u.email ?? '',
        phone: u.phoneNumber ?? '',
        // 서버에는 joinedAt 추가 예정
        joinedAt: u.joinedAt ?? u.createdAt ?? u.lastPasswordChangedAt ?? '',
        userType: u.userType ?? roleTab,
      }));
      setData(normalized);
      setPageInfo({
        page: res.data.number,
        size: res.data.size,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
      });
    } catch (e) {
      console.error(e);
      setError('회원 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // roleTab 변경, page 변경될 때마다 fetch
  useEffect(() => {
    fetchMembers(pageInfo.page, pageInfo.size);
  }, [roleTab, pageInfo.page, pageInfo.size, appliedFilters]);

  const onChangeFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const onSearch = () => {
    setAppliedFilters({ ...filters });
    setPageInfo((p) => ({ ...p, page: 0 }));
  };

  const onResetFilters = () => {
    const init = { from: '', to: '', keyword: '', field: 'name' };
    setFilters(init);
    setAppliedFilters(init);
    setPageInfo((p) => ({ ...p, page: 0 }));
  };

  const onClickManage = (member) => {
    const type = roleTab === 'buyer' ? 'buyer' : 'seller';
    navigate(`/admin/members/${type}/${member.userId}`);
  };

  return (
    <Wrap>
      <Tabs>
        <TabButton
          data-active={roleTab === 'buyer'}
          onClick={() => setRoleTab('buyer')}
        >
          구매자
        </TabButton>
        <TabButton
          data-active={roleTab === 'seller'}
          onClick={() => setRoleTab('seller')}
        >
          판매자
        </TabButton>
      </Tabs>

      <Filters2Rows>
        <Row>
          <Field>
            <label>가입일(시작)</label>
            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={onChangeFilter}
            />
          </Field>
          <Field>
            <label>가입일(종료)</label>
            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={onChangeFilter}
            />
          </Field>
          <Spacer />
        </Row>

        <Row>
          <Field>
            <label>검색 대상</label>
            <select
              name="field"
              value={filters.field}
              onChange={onChangeFilter}
            >
              <option value="name">이름</option>
              <option value="username">아이디</option>
              <option value="email">이메일</option>
              <option value="phoneNumber">전화번호</option>
            </select>
          </Field>
          <Field>
            <label>검색어</label>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={onChangeFilter}
              placeholder="이름/아이디/이메일/전화"
            />
          </Field>
          <ActionsRow>
            <SearchBtn onClick={onSearch}>검색</SearchBtn>
            <ResetBtn onClick={onResetFilters}>초기화</ResetBtn>
          </ActionsRow>
        </Row>
      </Filters2Rows>

      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>아이디</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>가입일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>
                  로딩중...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: 'center', padding: 24, color: 'red' }}
                >
                  {error}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>
                  조건에 맞는 회원이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((m, idx) => (
                <tr key={m.userId}>
                  <td>{idx + 1}</td>
                  <td>{m.name}</td>
                  <td>{m.username}</td>
                  <td>{m.phone}</td>
                  <td>{m.email}</td>
                  <td>{formatDate(m.joinedAt)}</td>
                  <td>
                    <ManageBtn onClick={() => onClickManage(m)}>관리</ManageBtn>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableWrap>

      <PaginationBar>
        <Pagination
          currentPage={currentPage1}
          totalPages={totalPages1}
          onPageChange={handlePageChange}
        />
      </PaginationBar>
    </Wrap>
  );
};

export default Members;

const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;

const Tabs = styled.div`
  display: inline-flex;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
`;

const TabButton = styled.button`
  all: unset;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  color: #374151;
  border: 1px solid transparent;
  &[data-active='true'] {
    background: #ffffff;
    border-color: rgba(15, 23, 42, 0.12);
  }
`;

const Filters2Rows = styled.div`
  display: grid;
  gap: 12px; /* 살짝 넓혀 시각적 그룹 구분 */
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 260px 260px 260px 1fr; /* 3 고정 + 1fr */
  gap: 10px;
  align-items: end;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 6px;

  label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
  }

  select,
  input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    border-radius: 8px;
    outline: none;
    background: #fff;
    color: #111827;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  select:hover,
  input:hover {
    border-color: rgba(15, 23, 42, 0.18);
  }

  select:focus,
  input:focus {
    border-color: #25324d;
    box-shadow: 0 0 0 3px rgba(37, 50, 77, 0.15);
  }

  input::placeholder {
    color: #9ca3af;
  }
`;

const Spacer = styled.div``;

const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: end; /* 인풋과 베이스라인 맞춤 */

  @media (max-width: 1000px) {
    justify-content: flex-start;
    grid-column: 1 / -1;
  }
`;

const ButtonBase = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px; /* 인풋 높이와 맞춤 */
  padding: 0 14px; /* 좌우 패딩 */
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease,
    transform 0.05s ease;

  &:active {
    transform: translateY(1px);
  }
`;

const SearchBtn = styled(ButtonBase)`
  background: #25324d;
  color: #fff;

  &:hover {
    background: #1d2741;
  }
`;

const ResetBtn = styled(ButtonBase)`
  background: #fff;
  color: #374151;
  border: 1px solid rgba(15, 23, 42, 0.12);

  &:hover {
    border-color: rgba(15, 23, 42, 0.24);
    background: #f8fafc;
  }
`;

const TableWrap = styled.div`
  width: 100%;
  max-width: 1300px;
  background: #fff;
  margin-top: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 8px;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 13px;
    line-height: 1.4;
  }

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    color: #111827;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
  }

  /* 컬럼 폭 */
  th:nth-child(1),
  td:nth-child(1) {
    width: 100px;
  } /* 번호 */
  th:nth-child(2),
  td:nth-child(2) {
    width: 160px;
  } /* 이름 */
  th:nth-child(3),
  td:nth-child(3) {
    width: 160px;
  } /* 아이디 */
  th:nth-child(4),
  td:nth-child(4) {
    width: 180px;
  } /* 전화번호 */
  th:nth-child(5),
  td:nth-child(5) {
    width: auto;
  } /* 이메일 */
  th:nth-child(6),
  td:nth-child(6) {
    width: 160px;
  } /* 가입일 */
  th:nth-child(7),
  td:nth-child(7) {
    width: 160px;
  } /* 관리 */

  tbody tr:hover {
    background: #f6f7fb;
  }
`;

const ManageBtn = styled.button`
  all: unset;
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  background: #25324d;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.05s ease;

  &:hover {
    background: #1f2937;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const PaginationBar = styled.div`
  display: flex;
  max-width: 1300px;
  justify-content: center; /* 테이블 폭 기준 중앙 */
  padding: 12px 12px 16px; /* 테이블과의 간격 */
  border-top: 1px solid rgba(15, 23, 42, 0.06);
`;
