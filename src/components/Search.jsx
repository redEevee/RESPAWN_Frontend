import React from 'react';
import styled from 'styled-components';
import searchIcon from '../assets/search_icon.png';

const Search = () => {
  return (
    <SearchContainer>
      <SearchInput placeholder="상품을 검색해보세요!" />
      <SearchIcon src={searchIcon} alt="search" />
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
