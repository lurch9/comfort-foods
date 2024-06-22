import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../Styles/RestaurantMenu.css'; // Import the CSS file for styling
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    <div className="menu-container">
      <h2 className="menu-title">Menu</h2>
      {menus.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        menus.map((menu) => (
          <div className="menu-box" key={menu._id}>
            <h3 className="menu-name">{menu.name}</h3>
            <ul className="menu-items">
              {menu.items.length === 0 ? (
                <p>No items in this menu.</p>
              ) : (
                menu.items.map((item) => (
                  <li className="menu-item" key={item._id}>
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-description">{item.description}</p>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    <button className="add-to-cart-button" onClick={() => handleAddToCart(item)}>Add to Cart</button>
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




















