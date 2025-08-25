import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/search_icon.png';

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim() === '') return;
    const params = new URLSearchParams({ query });
    navigate(`/search?query=${encodeURIComponent(params)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        placeholder="상품을 검색해보세요!"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
