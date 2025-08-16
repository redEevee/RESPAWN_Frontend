import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import MainPage from './pages/MainPage';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import Mypage from './pages/Mypage';
import LoginOkPage from './pages/LoginOkPage';
import UploadProduct from './components/Seller/Upload/UploadProduct';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListPage from './pages/ProductListPage';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import SellerCenterPage from './pages/SellerCenterPage';
import ProductList from './components/Seller/List/ProductList';
import RefundList from './components/Seller/List/RefundList';
import RefundDetail from './components/Seller/Detail/RefundDetail';
import OrderList from './components/Seller/List/OrderList';
import ReviewList from './components/Seller/List/ReviewList';
import ReviewDetail from './components/Seller/Detail/ReviewDetail';
import EditProduct from './components/Seller/Detail/EditProduct';
import OrderDetail from './components/Seller/Detail/OrderDetail';
import OrderCompletePage from './pages/OrderCompletePage';
import InquiryList from './components/Seller/List/InquiryList';
import FindIdPage from './pages/FindIdPage';
import FindPwPage from './pages/FindPwPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserInfo from './components/Seller/Detail/UserInfo';
import CustomerCenterPage from './pages/CustomerCenterPage';
import PasswordUpdateRequiredPage from './pages/PasswordUpdateRequiredPage';
import Dashboard from './components/Admin/Dashboard';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/uploadproduct" element={<UploadProduct />} />
        <Route path="/productdetail/:id" element={<ProductDetailPage />} />
        <Route path="/productlist" element={<ProductListPage />} />
        <Route path="/customerCenter" element={<CustomerCenterPage />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/order"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LogInPage />
            </PublicRoute>
          }
        />
        <Route
          path="/mypage/*"
          element={
            <PrivateRoute>
              <Mypage />
            </PrivateRoute>
          }
        />
        <Route path="/loginOk" element={<LoginOkPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/findid" element={<FindIdPage />} />
        <Route path="/findPw" element={<FindPwPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/update-password"
          element={<PasswordUpdateRequiredPage />}
        />
        <Route path="/order/:orderId" element={<OrderPage />} />
        <Route
          path="/order/:orderId/complete"
          element={<OrderCompletePage />}
        />
        <Route path="/sellerCenter" element={<SellerCenterPage />}>
          <Route index element={<Navigate to="productList" replace />} />
          <Route path="productList" element={<ProductList />} />
          <Route path="uploadProduct" element={<UploadProduct />} />
          <Route path="refundList" element={<RefundList />} />
          <Route path="orderList" element={<OrderList />} />
          <Route path="reviewList" element={<ReviewList />} />
          <Route path="inquiryList" element={<InquiryList />} />
          <Route path="refundList/:orderItemId" element={<RefundDetail />} />
          <Route path="reviewList/:reviewId" element={<ReviewDetail />} />
          <Route path="productList/:id" element={<EditProduct />} />
          <Route path="orderList/:orderItemId" element={<OrderDetail />} />
          <Route path="profile" element={<UserInfo />} />
        </Route>
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
