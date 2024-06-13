import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/menus/${restaurantId}`);
        const menuData = response.data;
        console.log('Menu data response:', menuData);

        // Since the response is already an array, set it directly to the menu state
        if (Array.isArray(menuData) && menuData.every(item => item.name && item.description && item.price)) {
          setMenu(menuData);
        } else {
          throw new Error('Invalid menu format');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  const handleAddToCart = (item) => {
    addToCart({
      product: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      restaurant: restaurantId,
    });
  };

  if (error) {
    return <p>Error fetching menu items: {error}</p>;
  }

  if (!menu.length) {
    return <p>Loading menu...</p>;
  }

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menu.map(item => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantMenu;













