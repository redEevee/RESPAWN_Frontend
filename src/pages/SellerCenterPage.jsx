import React from 'react';
import SellerHeader from '../components/Seller/SellerHeader';
import SellerLayout from '../components/Seller/SellerLayout';
import Footer from '../components/common/Footer';

const SellerCenterPage = () => {
  return (
    <div>
      <SellerHeader />
      <SellerLayout /> {/* 사이드바 + 내부 페이지 */}
      <Footer />
    </div>
  );
};

export default SellerCenterPage;
