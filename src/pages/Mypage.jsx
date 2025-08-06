import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MypageDetail from '../components/Mypage/MypageDetail';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import OrderHistory from '../components/OrderHistory/OrderHistory';
import UserInfo from '../components/Mypage/UserInfo';
import MainInfo from '../components/Mypage/MainInfo';
import MyInquiryList from '../components/Mypage/MyInquiryList';
import MyReviewList from '../components/Mypage/MyReviewList';
import RefundPage from '../components/ReturnExchange/RefundPage';
import ReviewPage from '../components/Review/ReviewPage';
import RefundDetail from '../components/ReturnExchange/RefundDetail';

function Mypage() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/*" element={<MypageDetail />}>
          <Route index element={<MainInfo />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="profile" element={<UserInfo />} />
          <Route path="refund" element={<RefundDetail />} />
          <Route path="review" element={<MyReviewList />} />
          <Route path="inquiry_history" element={<MyInquiryList />} />
          <Route
            path="orders/:orderId/items/:itemId/registerRefund"
            element={<RefundPage />}
          />
          <Route
            path="orders/:orderId/items/:itemId/registerReview"
            element={<ReviewPage />}
          />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default Mypage;
