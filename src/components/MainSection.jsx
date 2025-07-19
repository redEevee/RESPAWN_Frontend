import React from "react";
import styled from "styled-components";
import ProductContainer from "./ProductContainer";

const MainSection = () => {
  return (
    <Section>
      <ProductContainer />
    </Section>
  );
};

export default MainSection;

const Section = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;
