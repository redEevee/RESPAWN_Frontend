import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import MainPage from './pages/MainPage';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import Mypage from './pages/Mypage';
import LoginOkPage from './pages/LoginOkPage';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/login"element={<PublicRoute>
              <LogInPage />
            </PublicRoute>}/>
        <Route path="/mypage"element={<PrivateRoute>
            <Mypage />
          </PrivateRoute>} />
        <Route path="/loginOk" element={<LoginOkPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
