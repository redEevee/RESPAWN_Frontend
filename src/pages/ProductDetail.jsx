import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

function ProductDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/items/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!item) return <div>불러오는 중...</div>;

  return (
    <div>
      <h2>{item.name}</h2>
      {item.imageUrl && (
        <img
          src={`http://localhost:8080${item.imageUrl}`}
          width={300}
          alt={item.name}
        />
      )}
      <p>{item.description}</p>
      <p>가격: {item.price}원</p>
      <p>재고: {item.stockQuantity}</p>
      <p>
        배송: {item.deliveryType} / {item.deliveryFee}
      </p>
    </div>
  );
}

export default ProductDetail;
