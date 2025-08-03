import React, { useState } from 'react';
import NoticeBox from './NoticeBox';
import axios from '../../../api/axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TiptapEditor from './TiptapEditor';

function UploadProduct() {
  const navigate = useNavigate();

  const [item, setItem] = useState({
    name: '',
    deliveryType: '',
    deliveryFee: '',
    price: '',
    stockQuantity: '',
    company: '',
    companyNumber: '',
    categoryIds: '',
    description: '상품 상세 정보를 입력해주세요.',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleDescriptionChange = (html) => {
    setItem((prev) => ({
      ...prev,
      description: html,
    }));
  };

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

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
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
      navigate('/sellerCenter');
    } catch (err) {
      alert('등록 실패: ' + err.response?.data?.message || err.message);
    }
  };

  return (
    <Container>
      <PageLayout>
        <NoticeBox />
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
                  name="company"
                  placeholder="판매사"
                  value={item.company}
                  onChange={handleChange}
                />
                <Input
                  name="companyNumber"
                  placeholder="사업자등록번호"
                  value={item.companyNumber}
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
              <TiptapEditor
                value={item.description}
                onChange={handleDescriptionChange}
              />
            </EditorBox>

            <BottomActions>
              <CancelButton type="button" onClick={handleCancel}>
                취소
              </CancelButton>
              <SubmitButton type="submit">등록하기</SubmitButton>
            </BottomActions>
          </FormContainer>
        </ContentWrapper>
      </PageLayout>
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
  width: 300px;
  height: 320px;
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

export const EditorBox = styled.div`
  max-width: 800px;
  background: #fff;
  border-radius: 12px;
  font-family: 'Pretendard', sans-serif;
`;

export const EditorTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
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
