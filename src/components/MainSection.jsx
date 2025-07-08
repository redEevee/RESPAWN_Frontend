import React from 'react';
import styled from 'styled-components';

const MainSection = () => {
  return (
    <Section>
      <Title>안녕하세요!</Title>
      <Description>이곳은 게임용품 전문 쇼핑몰입니다.</Description>
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

const Title = styled.h2`
  font-size: 28px;
  color: #444;
`;

const Description = styled.p`
  font-size: 18px;
  color: #777;
`;
