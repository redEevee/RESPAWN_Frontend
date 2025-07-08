import React from 'react';
import styled from 'styled-components';

const Search = () => {
  return (
    <SearchContainer>
      <SearchInput placeholder="상품을 검색해보세요!" />
    </SearchContainer>
  );
};

export default Search;

const SearchContainer = styled.header`
  width: 100%;
  height: 90px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 600px;
  height: 50px;
  padding: 0 20px;
  border-radius: 30px;
  border: 2.5px solid;
  font-size: 18px;
`;
