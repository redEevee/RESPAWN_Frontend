import React from 'react';
import OrderList from '../components/Order/OrderList';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const OrderPage = () => {
  return (
    <>
      <Header />
      <OrderList />
      <Footer />
    </>
  );
};

export default OrderPage;
