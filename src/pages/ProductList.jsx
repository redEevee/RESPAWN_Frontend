import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

function ProductList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get('/api/items')
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>상품 목록</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/ProductDetail/${item.id}`}>
              <h3>{item.name}</h3>
              {item.imageUrl && (
                <img
                  src={`http://localhost:8080${item.imageUrl}`}
                  width={100}
                  alt={item.name}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
