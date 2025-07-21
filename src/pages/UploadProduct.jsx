import React, { useState } from 'react';
import axios from '../api/axios';
import styled from 'styled-components';
import SellerHeader from '../components/SellerHeader';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function UploadProduct() {
  const navigate = useNavigate();
  const [item, setItem] = useState({
    name: '',
    description: '',
    deliveryType: '',
    deliveryFee: '',
    price: '',
    stockQuantity: '',
    sellerId: '',
    categoryIds: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 입력 변경 처리
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // 이미지 파일 선택 시
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // React 객체를 JSON 문자열로 만든 후 Blob 형태로 FormData에 담는다
    formData.append(
      'itemDto',
      new Blob(
        [
          JSON.stringify({
            ...item,
            categoryIds: item.categoryIds.split(',').map((id) => id.trim()), // 쉼표 구분
          }),
        ],
        { type: 'application/json' }
      )
    );
    if (image) formData.append('image', image);

    try {
      await axios.post('/api/items/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('등록 성공!');
      navigate('/');
    } catch (err) {
      alert('등록 실패: ' + err.response?.data?.message || err.message);
    }
  };

  return (
    <Container>
      <SellerHeader />
      <PageLayout>
        <NoticeBox>
          <NoticeTitle>상품 등록 주의사항</NoticeTitle>
          <NoticeList>
            <li>너무 귀여운 사진은 심장이 아플 수 있습니다.</li>
            <li>유사상품과 차별화되는 포인트를 강조하세요.</li>
            <li>가격, 배송 방법, 재고 수량은 정확히 입력하세요.</li>
            <li>허위 정보를 기재할 경우 등록이 취소될 수 있습니다.</li>
          </NoticeList>
        </NoticeBox>

        <ContentWrapper>
          <Title>상품 등록</Title>

          <FormContainer onSubmit={handleSubmit} encType="multipart/form-data">
            <FormTopRow>
              <ImageUpload>
                <ImageBox>
                  {preview ? (
                    <PreviewImage src={preview} alt="미리보기" />
                  ) : (
                    <ImagePlaceholder>이미지</ImagePlaceholder>
                  )}
                </ImageBox>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </ImageUpload>
              <Inputs>
                <Input
                  name="name"
                  placeholder="상품명"
                  value={item.name}
                  onChange={handleChange}
                  required
                />
                <Row>
                  <Input
                    name="price"
                    type="number"
                    placeholder="판매가"
                    value={item.price}
                    onChange={handleChange}
                  />
                  <Unit>원</Unit>
                </Row>

                <Row>
                  <Input
                    name="deliveryFee"
                    type="number"
                    placeholder="기본 배송비"
                    value={item.deliveryFee}
                    onChange={handleChange}
                  />
                  <Unit>원</Unit>
                </Row>

                <Row>
                  <Input
                    name="stockQuantity"
                    placeholder="재고"
                    type="number"
                    value={item.stockQuantity}
                    onChange={handleChange}
                  />
                  <Unit>개</Unit>
                </Row>

                <Input
                  name="deliveryType"
                  placeholder="배송방식"
                  value={item.deliveryType}
                  onChange={handleChange}
                />
                <Input
                  name="sellerId"
                  placeholder="판매자ID"
                  value={item.sellerId}
                  onChange={handleChange}
                />
                <Input
                  name="categoryIds"
                  placeholder="카테고리ID(쉼표로 구분)"
                  value={item.categoryIds}
                  onChange={handleChange}
                />
              </Inputs>
            </FormTopRow>

            <EditorBox>
              <EditorTitle>상품 상세 정보</EditorTitle>
              <EditorArea
                name="description"
                placeholder="상품에 대한 자세한 설명을 입력해주세요."
                value={item.description}
                onChange={handleChange}
              />
            </EditorBox>

            <BottomActions>
              <CancelButton type="button">취소</CancelButton>
              <SubmitButton type="submit">저장하기</SubmitButton>
            </BottomActions>
          </FormContainer>
        </ContentWrapper>
      </PageLayout>
      <Footer />
    </Container>
  );
}

export default UploadProduct;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageLayout = styled.div`
  display: flex;
  gap: 80px;
  justify-content: center;
  margin-left: -170px;
`;

// 왼쪽 주의사항 박스
const NoticeBox = styled.div`
  width: 240px;
  background-color: #fff8f0;
  border: 1px solid #ffd8b2;
  padding: 20px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #444;
`;

const NoticeTitle = styled.h4`
  font-weight: bold;
  color: #c0392b;
  margin-bottom: 10px;
`;

const NoticeList = styled.ul`
  padding-left: 20px;
  list-style: disc;
`;

const ContentWrapper = styled.div`
  padding: 40px;
`;

const Title = styled.h2`
  margin-bottom: 30px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const FormTopRow = styled.div`
  display: flex;
  gap: 60px;
`;

const ImageUpload = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ImageBox = styled.div`
  width: 250px;
  height: 250px;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImagePlaceholder = styled.div`
  color: #aaa;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  width: 300px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Unit = styled.span`
  color: #555;
`;

const EditorBox = styled.div`
  margin-top: 10px;
`;

const EditorTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
`;

const EditorArea = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 15px;
  font-size: 16px;
  line-height: 1.6;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  box-sizing: border-box;
`;

const BottomActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled.button`
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px 20px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background: rgb(105, 111, 148);
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
`;
