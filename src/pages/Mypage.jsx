import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MypageDetail from '../components/Mypage/MypageDetail';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import OrderHistory from '../components/OrderHistory/OrderHistory';
import UserInfo from '../components/Mypage/UserInfo';
import MainInfo from '../components/Mypage/MainInfo';
import RefundPage from '../components/ReturnExchange/RefundPage';

function Mypage() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/*" element={<MypageDetail />}>
          <Route index element={<MainInfo />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="profile" element={<UserInfo />} />
          <Route
            path="orders/:orderId/items/:itemId/refund"
            element={<RefundPage />}
          />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default Mypage;
