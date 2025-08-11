import React from 'react';
import styled from 'styled-components';

const ItemSelector = ({ value, onChange, productList }) => {
  return (
    <StyledSelect value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">전체 상품</option>
      {productList.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </StyledSelect>
  );
};

export default ItemSelector;

const StyledSelect = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  padding: 8px 12px;
  border: 1.5px solid rgb(85, 90, 130);
  border-radius: 8px;
  background-color: white;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  min-width: 180px;

  background-image: url("data:image/svg+xml;charset=US-ASCII,%3csvg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7 7L13 1' stroke='%23555a82' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px 10px;

  &:hover {
    border-color: rgb(85, 90, 130);
  }

  &:focus {
    outline: none;
    border-color: rgb(85, 90, 130);
    box-shadow: 0 0 5px rgb(85, 90, 130);
  }
`;
