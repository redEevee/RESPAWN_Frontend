import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #f9f9f9;
  }
  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
