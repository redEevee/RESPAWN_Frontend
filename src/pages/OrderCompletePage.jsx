import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import OrderComplete from '../components/Order/OrderComplete';

const OrderPage = () => {
  return (
    <>
      <Header />
      <OrderComplete />
      <Footer />
    </>
  );
};

export default OrderPage;
