import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import MainPage from './pages/MainPage';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import Mypage from './pages/Mypage';
import LoginOkPage from './pages/LoginOkPage';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/home" element={<MainPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/loginOk" element={<LoginOkPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
