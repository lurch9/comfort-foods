import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { UserContext } from '../context/UserContext';

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const { user } = useContext(UserContext); // Get the current user info
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/menus/${restaurantId}`);
        const menuData = response.data;
        console.log('Menu data response:', menuData);

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

  const handleRemoveProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/menus/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMenu(menu.filter(item => item._id !== productId));
    } catch (error) {
      console.error(error);
      setError('Failed to remove the product');
    }
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
            {user && user.role === 'manager' && (
              <button onClick={() => handleRemoveProduct(item._id)}>Remove</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantMenu;















