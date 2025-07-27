import React from 'react';
import CartList from '../components/Cart/CartList';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const CartPage = () => {
  return (
    <>
      <Header />
      <CartList />
      <Footer />
    </>
  );
};

export default CartPage;
