import React from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';

const SORT_OPTIONS = [
  { label: '추천순', sort: 'recommend', order: 'desc' },
  { label: '판매량순', sort: 'sales', order: 'desc' },
  { label: '낮은가격순', sort: 'price', order: 'asc' },
  { label: '높은가격순', sort: 'price', order: 'desc' },
  { label: '최근등록순', sort: 'latest', order: 'desc' },
  { label: '후기많은순', sort: 'review', order: 'desc' },
];

const FilterBar = () => {
  const [params, setParams] = useSearchParams();

  // 2. URL에서 현재 sort와 order 값을 가져옵니다. 기본값을 설정합니다.
  const currentSort = params.get('sort') || 'recommend';
  const currentOrder = params.get('order') || 'desc';

  // 가격 필터 관련 상태
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';

  const setParam = (key, val) => {
    const next = new URLSearchParams(params);
    if (val === '' || val === undefined || val === null) {
      next.delete(key);
    } else {
      next.set(key, String(val));
    }
    next.delete('offset'); // 필터 변경 시 페이지네이션 초기화
    setParams(next, { replace: true });
  };

  // 3. 탭 클릭 시 sort와 order를 한 번에 변경하는 핸들러
  const handleSortClick = (sort, order) => {
    const next = new URLSearchParams(params);
    next.set('sort', sort);
    next.set('order', order);
    next.delete('offset');
    setParams(next, { replace: true });
  };

  // 가격 입력 변경 핸들러
  const onChangeMin = (e) =>
    setParam('minPrice', e.target.value.replace(/\D/g, ''));
  const onChangeMax = (e) =>
    setParam('maxPrice', e.target.value.replace(/\D/g, ''));

  // 초기화 핸들러 (기존과 동일)
  const onReset = () => {
    const keepCategory = params.get('category');
    const next = new URLSearchParams();
    if (keepCategory) next.set('category', keepCategory);
    next.set('limit', '9');
    next.set('sort', 'recommend');
    next.set('order', 'desc');
    setParams(next, { replace: true });
  };

  return (
    <Bar>
      <LeftTabs>
        {/* 4. 새로운 데이터 구조를 사용해 탭 렌더링 */}
        {SORT_OPTIONS.map((option) => (
          <Tab
            key={`${option.sort}-${option.order}`}
            // 현재 URL의 sort, order 값과 일치하는 탭을 활성화
            aria-pressed={
              currentSort === option.sort && currentOrder === option.order
            }
            onClick={() => handleSortClick(option.sort, option.order)}
          >
            {option.label}
          </Tab>
        ))}
      </LeftTabs>

      {/* 5. 가격순일 때만 보이던 드롭다운은 제거하고, 가격 필터는 그대로 유지 */}
      <RightControls>
        <PriceFilter>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="최소가격"
            value={minPrice}
            onChange={onChangeMin}
          />
          <span>~</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="최대가격"
            value={maxPrice}
            onChange={onChangeMax}
          />
          <Apply type="button" onClick={() => setParam('apply', Date.now())}>
            검색
          </Apply>
          <Reset type="button" onClick={onReset}>
            전체해제
          </Reset>
        </PriceFilter>
      </RightControls>
    </Bar>
  );
};

export default FilterBar;

// --- 스타일 ---
// 이미지와 유사한 탭 스타일로 변경합니다.
const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; // 화면이 좁아지면 줄바꿈
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
`;

const LeftTabs = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px; // 탭 사이 간격
`;

const Tab = styled.button`
  position: relative;
  padding: 8px 4px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  background: none;
  border: none;
  cursor: pointer;

  // 활성화되지 않았을 때 호버 효과
  &:hover {
    color: #000;
  }

  // 활성화 상태 스타일
  &[aria-pressed='true'] {
    color: #000;
    font-weight: bold;

    // 밑줄 효과
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -11px; // Bar의 padding-bottom과 맞춤
      height: 2px;
      background-color: #000;
    }
  }
`;

// 기존 스타일 (큰 변경 없음)
const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PriceFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  input {
    width: 96px;
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 13px;
  }
  span {
    color: #999;
  }
`;

const Apply = styled.button`
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
`;

const Reset = styled.button`
  padding: 6px 10px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fff;
  color: #666;
  cursor: pointer;
`;
