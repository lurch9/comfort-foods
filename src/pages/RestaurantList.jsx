// src/pages/RestaurantList.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './RestaurantList.css';
import { useAuth } from '../context/AuthContext';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [zip, setZip] = useState('');
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const zipCode = query.get('zip') || user?.zip;  // Use logged-in user's zip if available
    if (zipCode) {
      setZip(zipCode);
      fetchRestaurants(zipCode);
    }
  }, [location, user]);

  const fetchRestaurants = async (zip) => {
    try {
      const response = await axios.get(`http://your-api-endpoint/restaurants?zip=${zip}`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  return (
    <div className="restaurant-list">
      <h2>Restaurants in {zip}</h2>
      {restaurants.length > 0 ? (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No restaurants found.</p>
      )}
    </div>
  );
};

export default RestaurantList;


