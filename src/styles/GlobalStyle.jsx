import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
`;

export default GlobalStyle;
