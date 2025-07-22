import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';

const SmallBanner = () => {
  return (
    <BannerWrapper>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        autoplay={{ delay: 10000 }}
        loop={true}
      >
        <SwiperSlide>
          <ImgSmallBanner src={banner1} alt="banner1" />
        </SwiperSlide>
        <SwiperSlide>
          <ImgSmallBanner src={banner2} alt="banner2" />
        </SwiperSlide>
      </Swiper>
    </BannerWrapper>
  );
};

export default SmallBanner;

const BannerWrapper = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
`;

const ImgSmallBanner = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
