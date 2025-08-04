import React, { useState } from 'react';
import NoticeBox from './NoticeBox';
import axios from '../../../api/axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TiptapEditor from './TiptapEditor';
import Select from 'react-select';

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
    categoryIds: [],
    description: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const categoryOptions = [
    { value: '헤드셋', label: '헤드셋' },
    { value: '마우스', label: '마우스' },
    { value: '키보드', label: '키보드' },
    { value: '모니터', label: '모니터' },
  ];

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

  const handleCategoryChange = (selected) => {
    setItem((prev) => ({
      ...prev,
      categoryIds: selected.map((s) => s.value),
    }));
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
      new Blob([JSON.stringify({ ...item })], { type: 'application/json' })
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
                <InputGroup>
                  <Label>상품명</Label>
                  <Input
                    name="name"
                    value={item.name}
                    onChange={handleChange}
                  />
                </InputGroup>

                <Row>
                  <InputGroup style={{ flex: 1 }}>
                    <Label>판매가</Label>
                    <FlexRow>
                      <Input
                        name="price"
                        type="number"
                        value={item.price}
                        onChange={handleChange}
                      />
                      <Unit>원</Unit>
                    </FlexRow>
                  </InputGroup>
                </Row>

                <Row>
                  <InputGroup style={{ flex: 1 }}>
                    <Label>재고</Label>
                    <FlexRow>
                      <Input
                        name="stockQuantity"
                        type="number"
                        value={item.stockQuantity}
                        onChange={handleChange}
                      />
                      <Unit>개</Unit>
                    </FlexRow>
                  </InputGroup>
                </Row>

                <Row>
                  <InputGroup style={{ flex: 1 }}>
                    <Label>배송비</Label>
                    <FlexRow>
                      <Input
                        name="deliveryFee"
                        type="number"
                        value={item.deliveryFee}
                        onChange={handleChange}
                      />
                      <Unit>원</Unit>
                    </FlexRow>
                  </InputGroup>
                </Row>

                <InputGroup>
                  <Label>배송방식</Label>
                  <SelectStyled
                    name="deliveryType"
                    value={
                      item.deliveryType
                        ? { label: item.deliveryType, value: item.deliveryType }
                        : null
                    }
                    options={[
                      { value: '택배', label: '택배' },
                      { value: '퀵', label: '퀵배송' },
                      { value: '직접배송', label: '직접배송' },
                    ]}
                    onChange={(selected) =>
                      handleChange({
                        target: {
                          name: 'deliveryType',
                          value: selected?.value || '',
                        },
                      })
                    }
                  />
                </InputGroup>

                <InputGroup>
                  <Label>카테고리</Label>
                  <SelectStyled
                    isMulti
                    name="categoryIds"
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    value={categoryOptions.filter((opt) =>
                      item.categoryIds.includes(opt.value)
                    )}
                  />
                </InputGroup>
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

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
`;

const SelectStyled = styled(Select)`
  width: 300px;
  font-size: 14px;
`;
