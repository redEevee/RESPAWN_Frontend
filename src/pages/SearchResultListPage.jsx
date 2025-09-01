import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../api/axios';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import SearchFilter from '../components/Search/SearchFilter';
import SearchResultList from '../components/Search/SearchResultList';

const SearchResultListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1) URL → 상태 초기화
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const initialCategories = queryParams.getAll('categoryIds') || [];
  const initialCompanies = queryParams.getAll('companyIds') || [];
  const initialShipping = queryParams.get('shipping') || '';
  const initialMinPrice = queryParams.get('minPrice');
  const initialMaxPrice = queryParams.get('maxPrice');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // const [availableCategories, setAvailableCategories] = useState([]); // 카테고리
  const [selectedCategories, setSelectedCategories] =
    useState(initialCategories);
  const [selectedCompanies, setSelectedCompanies] = useState(initialCompanies);
  const [selectedShipping, setSelectedShipping] = useState(initialShipping);
  const [minPrice, setMinPrice] = useState(
    initialMinPrice ? Number(initialMinPrice) : null
  );
  const [maxPrice, setMaxPrice] = useState(
    initialMaxPrice ? Number(initialMaxPrice) : null
  );
  // 2) URL 변경 시 로컬 상태 동기화
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    setSelectedCategories(sp.getAll('categoryIds'));
    setSelectedCompanies(sp.getAll('companyIds'));
    setSelectedShipping(sp.get('shipping') || '');
    setMinPrice(sp.get('minPrice') ? Number(sp.get('minPrice')) : null);
    setMaxPrice(sp.get('maxPrice') ? Number(sp.get('maxPrice')) : null);
  }, [location.search]);

  // 3) 데이터 조회
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        selectedCategories.forEach((c) => params.append('categoryIds', c));
        selectedCompanies.forEach((c) => params.append('companyIds', c));
        if (selectedShipping) params.append('shipping', selectedShipping);
        if (minPrice != null) params.append('minPrice', String(minPrice));
        if (maxPrice != null) params.append('maxPrice', String(maxPrice));

        const res = await axios.get(
          `/api/items/search/advanced?${params.toString()}`
        );
        setItems(res.data);
      } catch (err) {
        console.error('고급 검색 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [location.search, query]);

  // 4) URL 업데이트 유틸
  const buildParams = ({
    categories = selectedCategories,
    companies = selectedCompanies,
    shipping = selectedShipping,
    minP = minPrice,
    maxP = maxPrice,
  } = {}) => {
    const sp = new URLSearchParams();
    if (query) sp.append('query', query);
    categories.forEach((c) => sp.append('categoryIds', c));
    companies.forEach((c) => sp.append('companyIds', c));
    if (shipping) sp.append('shipping', shipping);
    if (minP != null) sp.append('minPrice', String(minP));
    if (maxP != null) sp.append('maxPrice', String(maxP));
    return sp;
  };

  const navigateWithParams = (sp) => navigate(`/search?${sp.toString()}`);

  // 5) 이벤트 핸들러 (즉시 반영: 체크/라디오)
  const handleCategoryChange = (categoryId) => {
    const next = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(next);
    navigateWithParams(buildParams({ categories: next }));
  };

  const handleCompanyChange = (companyId) => {
    const next = selectedCompanies.includes(companyId)
      ? selectedCompanies.filter((c) => c !== companyId)
      : [...selectedCompanies, companyId];
    setSelectedCompanies(next);
    navigateWithParams(buildParams({ companies: next }));
  };

  const handleShippingChange = (shippingId) => {
    setSelectedShipping(shippingId);
    navigateWithParams(buildParams({ shipping: shippingId }));
  };

  // 6) 가격/키워드: 디바운스 반영
  const debounceRef = useRef(null);
  const scheduleUrlUpdate = (nextState) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigateWithParams(
        buildParams({
          minP: nextState.minP ?? minPrice,
          maxP: nextState.maxP ?? maxPrice,
        })
      );
    }, 400);
  };

  const handlePriceChange = ({ min, max }) => {
    setMinPrice(min);
    setMaxPrice(max);
    scheduleUrlUpdate({ minP: min, maxP: max });
  };

  // 7) 초기화
  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedCompanies([]);
    setSelectedShipping('');
    setMinPrice(null);
    setMaxPrice(null);
    const sp = new URLSearchParams();
    if (query) sp.append('query', query); // 검색어 페이지 진입 query는 유지
    navigate(`/search?${sp.toString()}`);
  };

  // 더미 데이터 (UI용)
  const SHIPPING_METHODS = [
    { id: 'direct', name: '직접배송' },
    { id: 'fast', name: '빠른배송' },
    { id: 'same_day', name: '당일배송' },
    { id: 'pickup', name: '매장픽업' },
  ];

  const COMPANIES = [
    { id: 'Logitech', name: 'Logitech' },
    { id: 'NOX', name: 'NOX' },
    { id: 'PlayStation', name: 'PlayStation' },
    { id: 'Razer', name: 'Razer' },
    { id: 'Corsair', name: 'CORSAIR' },
  ];

  const availableCategories = [
    { id: '모니터', name: '모니터' },
    { id: '헤드셋', name: '헤드셋' },
    { id: '마우스', name: '마우스' },
    { id: '키보드', name: '키보드' },
  ];

  return (
    <>
      <Header />
      <PageWrapper>
        <SearchFilter
          // 카테고리
          categories={availableCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          // 회사
          companies={COMPANIES}
          selectedCompanies={selectedCompanies}
          onCompanyChange={handleCompanyChange}
          // 배송
          shippingMethods={SHIPPING_METHODS}
          selectedShipping={selectedShipping}
          onShippingChange={handleShippingChange}
          // 가격/키워드
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
          // 초기화
          onReset={handleReset}
        />
        <SearchResultList query={query} items={items} loading={loading} />
      </PageWrapper>
      <Footer />
    </>
  );
};

export default SearchResultListPage;

const PageWrapper = styled.div`
  --filter-h: 112px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
