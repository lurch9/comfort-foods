import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../Styles/RestaurantMenu.css';
import { getEnv } from '../utils/env'; // Import the CSS file for styling
const API_BASE_URL = getEnv('VITE_API_BASE_URL');

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const { addToCart } = useCart();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/menus/restaurant/${restaurantId}`);
        setMenus(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="menu-container" data-cy="menu-container">
      <h2 className="menu-title" data-cy="menu-title">Menu</h2>
      {menus.length === 0 ? (
        <p data-cy="no-menu-items-message">No menu items found.</p>
      ) : (
        menus.map((menu, menuIndex) => (
          <div className="menu-box" key={menu._id} data-cy={`menu-box-${menuIndex}`}>
            <h3 className="menu-name" data-cy={`menu-name-${menuIndex}`}>{menu.name}</h3>
            <ul className="menu-items" data-cy={`menu-items-${menuIndex}`}>
              {menu.items.length === 0 ? (
                <p data-cy={`no-items-message-${menuIndex}`}>No items in this menu.</p>
              ) : (
                menu.items.map((item, itemIndex) => (
                  <li className="menu-item" key={item._id} data-cy={`menu-item-${itemIndex}`}>
                    <h4 className="item-name" data-cy={`item-name-${itemIndex}`}>{item.name}</h4>
                    <p className="item-description" data-cy={`item-description-${itemIndex}`}>{item.description}</p>
                    <p className="item-price" data-cy={`item-price-${itemIndex}`}>${item.price.toFixed(2)}</p>
                    <button className="add-to-cart-button" onClick={() => handleAddToCart(item)} data-cy={`add-to-cart-button-${itemIndex}`}>Add to Cart</button>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
  
};

export default RestaurantMenu;




















