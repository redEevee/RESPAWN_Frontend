import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import searchIcon from '../../assets/search_icon.png';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState('');

  // URL이 변하면 입력값도 동기화
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const handleSearch = () => {
    const next = query.trim();
    if (!next) return;
    // 검색 결과 페이지로 이동하면서 query 반영
    setSearchParams(
      (prev) => {
        // 다른 파라미터를 보존하고 query만 갱신
        prev.set('query', next);
        return prev;
      },
      { replace: true }
    );
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        autoComplete="off"
        placeholder="상품을 검색해보세요!"
        type="text"
        name="q"
        inputMode="search"
        value={query}
        onChange={(e) => {
          const next = e.target.value;
          setQuery(next);
          // 필요 시 즉시 URL에 반영하여 새로고침/공유 대비
          setSearchParams(
            (params) => {
              if (next.trim()) params.set('query', next);
              else params.delete('query');
              return params;
            },
            { replace: true }
          ); // 히스토리 누적 방지
        }}
        onKeyDown={handleKeyPress}
      />
      <SearchIcon src={searchIcon} alt="search" onClick={handleSearch} />
    </SearchContainer>
  );
};

export default Search;

const SearchContainer = styled.header`
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 20px;
  border-radius: 30px;
  border: 2.5px solid;
  font-size: 18px;
`;

const SearchIcon = styled.img`
  position: absolute;
  width: 30px;
  height: 30px;
  right: 20px;
  object-fit: cover;
  cursor: pointer;
`;
