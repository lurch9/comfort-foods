// src/pages/RestaurantMenu.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mockMenu1 from '../mockData/mockMenu1.json';
import mockMenu2 from '../mockData/mockMenu2.json';
import './RestaurantMenu.css';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = () => {
      const menuData = id === "1" ? mockMenu1 : mockMenu2;
      setMenuItems(menuData);
    };

    fetchMenuItems();
  }, [id]);

  return (
    <div className="restaurant-menu">
      <h2>Menu</h2>
      {menuItems.length > 0 ? (
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No menu items available.</p>
      )}
    </div>
  );
};

export default RestaurantMenu;

