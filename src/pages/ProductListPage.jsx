import React from 'react';
import ProductContainer from '../components/Product/ProductContainer';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ProductListPage = () => {
  return (
    <>
      <Header />
      <ProductContainer />
      <Footer />
    </>
  );
};

export default ProductListPage;
