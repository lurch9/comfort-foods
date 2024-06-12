import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import mockMenu1 from '../mockData/mockMenu1.json';
import mockMenu2 from '../mockData/mockMenu2.json';
import { useCart } from '../context/CartContext';
import './RestaurantMenu.css';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Mock data for simplicity
    if (id === '1') {
      setMenu(mockMenu1);
    } else if (id === '2') {
      setMenu(mockMenu2);
    }
  }, [id]);

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="restaurant-menu">
      <h2>Restaurant Menu</h2>
      {menu.length > 0 ? (
        <ul>
          {menu.map((item) => (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>{item.price}</p>
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No menu items found.</p>
      )}
    </div>
  );
};

export default RestaurantMenu;



